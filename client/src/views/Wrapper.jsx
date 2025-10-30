import React, { useEffect, useState } from 'react';
import supabase from '../config/SupaBaseClient';
import { Navigate, useNavigate } from 'react-router-dom';

function Wrapper({ children }) {
    const [authenticated, setAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const getSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setAuthenticated(!!session);
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

    return authenticated ? <>{children}</> : <Navigate to="/sign-in" />;
}

export default Wrapper;