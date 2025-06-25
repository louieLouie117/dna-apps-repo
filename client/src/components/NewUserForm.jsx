import React, { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import PageHeader from './PageHeader';
// import AppLogosFooter from './AppLogosFooter';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const NewUserForm = () => {
    const [form, setForm] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    // Check for Stripe redirect
    React.useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const stripeStatus = params.get('stripe');
        if (stripeStatus === 'success') {
            setMessage('Payment successful! You have been redirected from Stripe.');
        } else if (stripeStatus === 'cancel') {
            setMessage('Payment was cancelled. You have been redirected from Stripe.');
        }
    }, []);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        const { email, password } = form;

        // 1. Sign up user with Supabase Auth
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email,
            password
        });

        if (authError) {
            if (
                authError.message &&
                (authError.message.toLowerCase().includes('user already registered') ||
                 authError.message.toLowerCase().includes('user already exists') ||
                 authError.message.toLowerCase().includes('account') && authError.message.toLowerCase().includes('exists'))
            ) {
                setMessage('Account already has been created. Please log in or contact support if you need assistance.');
            } else {
                setMessage(`Auth Error: ${authError.message} (${JSON.stringify(authError)})`);
            }
            setLoading(false);
            return;
        }

        // 2. Insert into Users table
        const { error: tableError } = await supabase
            .from('Users')
            .insert([{ email, password }]);

        if (tableError) {
            setMessage(`Table Error: ${tableError.message}`);
        } else {
            setMessage('User added successfully!');
            setForm({ email: '', password: '' });
        }
        setLoading(false);
    };

    return (
        <div >
            <header>
                <PageHeader />
            </header>
            <div className="new-user-form">


            <form className='reg-form' onSubmit={handleSubmit}>
            <h2>Regisger for App Access</h2>
            <div>
                <label className='hidden'>Email:</label>
                <input
                    name="email"
                    type="email"
                    value={form.email}
                    placeholder='email:'
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label className='hidden'>Password:</label>
                <input
                    name="password"
                    type="password"
                    value={form.password}
                    placeholder='password:'
                    onChange={handleChange}
                    required
                />
            </div>
            <button type="submit" disabled={loading}>
                {loading ? 'Submitting...' : 'Submit'}
            </button>
            {message && <p>{message}</p>}
        </form>
            </div>

        {/* <footer>
            <AppLogosFooter />
        </footer> */}
        </div>
    );
};

export default NewUserForm;