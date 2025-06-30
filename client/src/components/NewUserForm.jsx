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
    const [tempName, setTempName] = useState('temp_login');
    const [tempPass, setTempPass] = useState('temp_pass');
    

    // Check for Stripe redirect
    React.useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const stripeStatus = params.get('stripe');
        if (stripeStatus === 'success') {
            setMessage('Payment successful! You have been redirected from Stripe.');
        } else if (stripeStatus === 'cancel') {
            setMessage('Payment was cancelled. You have been redirected from Stripe.');
        }
        // get table form subpabase name temp_login
        // Fetch temp_login table from Supabase
        const fetchTempLogin = async () => {
            const { data, error } = await supabase
            .from('TempLogin')
            .select('*');
            if (error) {
            console.error('Error fetching temp_login:', error);
            } else {
            console.log('Temp login table:', data);
            setTempName(data[0]?.temp_name || 'temp_name_error');
            setTempPass(data[0]?.temp_pass || 'temp_pass_error');

            // You can set this data to state if needed
            }
        };
        fetchTempLogin();

        // Render any errors from URL params
        const error = params.get('error');
        if (error) {
            setMessage(`Error: ${decodeURIComponent(error)}`);
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
            password,
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
        const userId = authData?.user?.id;
        const { error: tableError } = await supabase
            .from('Users')
            .insert([{ 
                email, 
                password, 
                status: 'Pending Verification', 
                auth_uid: userId,
                temp_login: { temp_user: tempName, temp_pass: tempPass }
             }]);

        if (tableError) {
            setMessage(`Table Error: ${tableError.message}`);
        } else {
            setMessage('User added successfully!');
            setForm({ email: '', password: '' });
        }
        setLoading(false);
        // 3. Redirect to user dashboard and set user to supabase session
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
            // User is logged in, redirect to dashboard
            window.location.href = '/user-dashboard';
        }
    };

    return (
        <div >
            <header>
                <PageHeader />
            </header>

            <div className="new-user-form">
                <header>
  <h2>Thank you for your payment! </h2>
                <p>Final step: Create your account to access the apps.</p>
                </header>
               


            <form className='reg-form' onSubmit={handleSubmit}>
            <h2>Create an Account</h2>

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
            
             <div style={{ background: '#fff3cd', color: '#856404', padding: '10px', marginBottom: '16px', borderRadius: '4px', border: '1px solid #ffeeba' }}>
    <strong>Important:</strong> You must must use the <span style={{ color: '#1976d2' }}>same email</span> you used during your subscription process.
  </div>
        </form>
            </div>
            

        {/* <footer>
            <AppLogosFooter />
        </footer> */}
        </div>
    );
};

export default NewUserForm;