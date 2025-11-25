import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from '../config/SupaBaseClient';
import PageHeader from './PageHeader';

const SignIn = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // Check current session on component mount
    React.useEffect(() => {
        const checkSession = async () => {
            try {
                const { data: { session }, error } = await supabase.auth.getSession();
                if (error) {
                    console.error('Session check error:', error);
                } else {
                    console.log('Current Supabase session:', session ? 'Active' : 'None');
                    if (session) {
                        console.log('Session user:', session.user?.email);
                    }
                }
            } catch (err) {
                console.error('Session check catch error:', err);
            }
        };
        
        checkSession();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        try {
            const { data, error } = await supabase.auth.signInWithPassword({ 
                email, 
                password 
            });
            
            if (error) {
                setError(error.message);
                console.error('Supabase sign in error:', error);
            } else if (data?.user) {
                console.log('Supabase sign in successful:', data);
                // Add a small delay to ensure session is properly set
                setTimeout(() => {
                    navigate('/user-dashboard');
                }, 500);
            } else {
                setError('Authentication failed. Please try again.');
            }
        } catch (err) {
            console.error('Sign in catch error:', err);
            setError('An error occurred during sign in. Please try again.');
        }
    };

    return (
        <div >
            <header>
                <PageHeader />
            </header>
            <div className='new-user-form'>

            <form   className='reg-form' onSubmit={handleSubmit}>
            <h2>Sign In</h2>

                <div>
                    <label>Email:</label><br />
                    <input
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
                        autoComplete="email"
                    />
                </div>
                <div style={{ marginTop: 10 }}>
                    <label>Password:</label><br />
                    <input
                        type="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required
                        autoComplete="current-password"
                    />
                </div>
                {error && <div style={{ color: 'red', marginTop: 10 }}>{error}</div>}
                <button type="submit" style={{ marginTop: 15 }}>Sign In</button>
            </form>
            </div>

        </div>
    );
};

export default SignIn;