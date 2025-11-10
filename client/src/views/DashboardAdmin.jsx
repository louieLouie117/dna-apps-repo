import {React, useState} from 'react';
import CreateUser from '../components/CreateUser';
import GetSupabaseData from '../components/GetSupabaseData';
import GetCustomerContacts from '../components/GetCustomerContacts';

const DashboardAdmin = () => {
    const [userContainer, setUserContainer] = useState(false);
    const [userContactContainer, setUserContactContainer] = useState(true);

    return (
        <div>
            <h1>Hello from Dashboard Admin!</h1>
            <div style={{display: userContainer ? 'block' : 'none'}}>
                <CreateUser />
            </div>
            {/* div for user contacts */}
            <div style={{display: userContactContainer ? 'block' : 'none'}}>
                <GetCustomerContacts />
            </div>
            
            {/* <GetSupabaseData /> */}
        </div>
    );
};

export default DashboardAdmin;