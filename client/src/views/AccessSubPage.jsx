import React from 'react';
import Backgound from '../assets/img/AllAppAccess.png'; // Assuming this is the correct path to your image
import PageHeader from '../components/PageHeader';

const AccessSubPage = () => {
    return (
        <div>
            <PageHeader />
            <h1>Membership/Subscription</h1>
            <main>
                <img src={Backgound} alt="Description of image" />
                <h2>All App Access</h2>
                <p>Enjoy full access instantly to all apps with all the benefits of new updates, app privacy, no in-app purchases, and no advertisements.</p>

            </main>
        </div>
    );
};

export default AccessSubPage;