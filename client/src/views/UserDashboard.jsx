import React, { useEffect, useState } from 'react';
import supabase from '../config/SupaBaseClient';
import SignOut from '../components/SignOut';


const UserDashboard = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const getUser = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setUser(session?.user || null);
        };
        getUser();
    }, []);

    if (!user) {
        return <div>Please log in to access the dashboard.</div>;
    }

    return (
        <div>
            <nav>
                <SignOut />
            </nav>
            <h1>Hello, welcome to dashboard</h1>
        </div>
    );
};

export default UserDashboard;