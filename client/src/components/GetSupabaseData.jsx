import React, { useState, useEffect } from 'react';
import supabase from '../config/SupaBaseClient';

const GetSupabaseData = () => {
    const [accounts, setAccounts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchAccounts();
        fetchCustomerContacts();
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
    const [customerContacts, setCustomerContacts] = useState([]);

    // fetch CustomerContact
    const fetchCustomerContacts = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase  
                .from('CustomerContact')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(50);

            if (error) throw error;

            setCustomerContacts(data || []);
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
            <h2>All Accounts</h2>
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
            <h2>All Customer Contacts</h2>
            {customerContacts.length === 0 ? (
                <p>No customer contacts found.</p>
            ) : (
                <ul>
                    {customerContacts.map((contact) => (
                        <li key={contact.id} style={{ marginBottom: '20px', width: '400px' }}>
                            <h3>{contact.name} - {contact.email}</h3>
                            <h4>{contact.status} - {contact.payment_method}</h4>
                            <p>Subject: {contact.subject}</p>
                            <p>Message: {contact.message}</p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default GetSupabaseData;