import React, { useState, useEffect } from 'react';
import supabase from '../config/SupaBaseClient';

const GetSupabaseData = () => {
    const [accounts, setAccounts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchAccounts();
    }, []);

    const fetchAccounts = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('Users')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(50);

            if (error) throw error;

            setAccounts(data || []);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

   

    if (loading) return <div>Loading accounts...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            {accounts.length === 0 ? (
                <p>No accounts found.</p>
            ) : (
                <ul>
                    {accounts.map((account) => (
                        <li key={account.id}>
                            {account.email} - {account.status}
                        </li>
                    ))}
                </ul>
            )}
            
        </div>
    );
};

export default GetSupabaseData;