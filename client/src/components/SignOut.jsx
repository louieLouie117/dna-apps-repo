import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase  from '../config/SupaBaseClient';

const SignOut = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handleSignOut = async () => {
        setLoading(true);
        await supabase.auth.signOut();
        navigate('/sign-in', { replace: true });
    };

    return (
        <button className='main-btn' onClick={handleSignOut} disabled={loading}>
            {loading ? 'Signing out...' : 'Sign Out'}
        </button>
    );
};

export default SignOut;