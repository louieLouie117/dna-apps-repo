import React from 'react';
import Backgound from '../assets/img/AllAppAccess.png'; // Assuming this is the correct path to your image
import PageHeader from '../components/PageHeader';
import StripePaymentCard from '../assets/img/StripePaymentCard.png'; // Adjust the path as needed

const AccessSubPage = () => {
    return (
        <div className='access-sub-page'>
            <PageHeader />
            <h1>Membership/Subscription</h1>
            <main>
                <img src={Backgound} alt="Description of image" />
                <div>
                     <h2>All App Access</h2>
                <p>Enjoy full access instantly to all apps with all the benefits of new updates, app privacy, no in-app purchases, and no advertisements.</p>

                </div>
               

            </main>
            <aside>
                <h3>Start Your Free Month</h3>
                <div>
                      <a href="https://buy.stripe.com/test_dRmdRb7LE9D1eWEdNY1sQ00">
                <button className='main-btn'>Subscribe</button>
                </a>
                <p>All Apps Access $5.99/month.</p>
                <img src={StripePaymentCard} alt="" />


                </div>
              

            </aside>
        </div>
    );
};

export default AccessSubPage;