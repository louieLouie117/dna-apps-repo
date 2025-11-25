import React, { useState } from 'react';
import supabase from '../config/SupaBaseClient';
import PageHeader from './PageHeader';
// import AppLogosFooter from './AppLogosFooter';
import emailjs from '@emailjs/browser';

const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;



const NewUserForm = () => {
    const [form, setForm] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [tempName, setTempName] = useState('temp_login');
    const [tempPass, setTempPass] = useState('temp_pass');

    const currentUrl = window.location.href;
    const [paymentMethod, setPaymentMethod] = useState(''); // Track payment method

    React.useEffect(() => {
        if (currentUrl.includes('/stripe-all-app-access-account')) {
            setPaymentMethod('stripe');
        } else if (currentUrl.includes('/paypal-all-app-access-account')) {
            setPaymentMethod('paypal');
        }
        // console.log('Current URL:', currentUrl);
    }, [currentUrl]);
    // console.log('Payment Method:', paymentMethod);


    // Check for Stripe redirect
    React.useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const stripeStatus = params.get('stripe');
        if (stripeStatus === 'success') {
            setMessage('Payment successful! You have been redirected from Stripe.');
        } else if (stripeStatus === 'cancel') {
            setMessage('Payment was cancelled. You have been redirected from Stripe.');
        }
        // Fetch temp_login table from Supabase
        const fetchTempLogin = async () => {
            const { data, error } = await supabase
                .from('TempLogin')
                .select('*');
            if (error) {
                console.error('Error fetching temp_login:', error);
            } else {
                setTempName(data[0]?.temp_name || 'temp_name_error');
                setTempPass(data[0]?.temp_pass || 'temp_pass_error');
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
                 (authError.message.toLowerCase().includes('account') && authError.message.toLowerCase().includes('exists')))
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
                temp_login: { temp_name: tempName, temp_pass: tempPass },
                payment_method: paymentMethod,
             }]);

        if (tableError) {
            setMessage(`Table Error: ${tableError.message}`);
            setLoading(false);
            return;
        } else {
            setMessage('Redirecting to the dashboard.');
            setForm({ email: '', password: '' });
        }

    // 3. Send notification email to support
        try {
            await emailjs.send(
                serviceId,
                templateId,
                {
                    to_email: 'customersupport@projectdnaapps.com',
                    subject: 'A new subscriber just subscribed',
                    message: `A new user has subscribed with the email: ${email}\nPayment Method: ${paymentMethod}`,
                },
                publicKey
            );
        } catch (emailError) {
            console.error('Failed to send notification email:', emailError);
            alert('Failed to send notification email. Please contact support if you need assistance.');
        }



        setLoading(false);

        // 4. Redirect to user dashboard and set user to supabase session
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
            window.location.href = '/user-dashboard';
        }
    };

    return (
        <div>
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