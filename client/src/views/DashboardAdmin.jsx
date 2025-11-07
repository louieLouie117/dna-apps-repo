import React from 'react';
import CreateUser from '../components/CreateUser';
import GetAllAccount from '../components/GetAllAccount';

const DashboardAdmin = () => {
    return (
        <div>
            <h1>Hello from Dashboard Admin!</h1>
            <CreateUser />
            <GetAllAccount />
        </div>
    );
};

export default DashboardAdmin;