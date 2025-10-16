import React, { useEffect, useState } from 'react';
import supabase from '../config/SupaBaseClient';
import { Navigate, useNavigate } from 'react-router-dom';

function AdminWrapper({ children }) {
    const [authenticated, setAuthenticated] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const getSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            
            if (session) {
                setAuthenticated(true);
                const userId = session.user.id;
                
                // Check if user is admin
                const { data: userData, error } = await supabase
                    .from('Users')
                    .select('account_type')
                    .eq('auth_uid', userId)
                    .single();

                if (error) {
                    console.error('Error fetching user data:', error);
                    alert('Access Denied: Admins Only Error fetching user data');
                    setIsAdmin(false);
                } else if (userData && userData.account_type === 'Admin') {
                    setIsAdmin(true);
                } else {
                    alert('Access Denied: Admins Only - You do not have the required permissions.');
                    setIsAdmin(false);
                    // Redirect to home if not admin
                    navigate('/');
                    return;
                }
            } else {
                alert('Access Denied: Admins Only - No active session found.');
                setAuthenticated(false);
                setIsAdmin(false);
            }
            
            setLoading(false);
        };

        getSession();

        // Inactivity logout logic
        let timer;
        const logout = async () => {
            await supabase.auth.signOut();
            setAuthenticated(false);
            navigate('/'); // or '/signin'
        };

        const resetTimer = () => {
            if (timer) clearTimeout(timer);
            timer = setTimeout(logout, 10 * 60 * 1000); // 10 minutes
        };

        const events = ['mousemove', 'keydown', 'mousedown', 'touchstart'];
        events.forEach(event =>
            window.addEventListener(event, resetTimer)
        );

        resetTimer();

        return () => {
            if (timer) clearTimeout(timer);
            events.forEach(event =>
                window.removeEventListener(event, resetTimer)
            );
        };
    }, [navigate]);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (authenticated && isAdmin) ? <>{children}</> : <Navigate to="/" />;
}

export default AdminWrapper;