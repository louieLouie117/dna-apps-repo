import React from 'react';
import CreateUser from '../components/CreateUser';
import GetSupabaseData from '../components/GetSupabaseData';

const DashboardAdmin = () => {
    return (
        <div>
            <h1>Hello from Dashboard Admin!</h1>
            <CreateUser />
            <GetSupabaseData />
        </div>
    );
};

export default DashboardAdmin;