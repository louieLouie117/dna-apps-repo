import React from 'react';
import Backgound from '../assets/img/AllAppAccess.png'; // Assuming this is the correct path to your image
import PageHeader from '../components/PageHeader';
import StripePaymentCard from '../assets/img/StripePaymentCard.png'; // Adjust the path as needed
import AppLogosFooter from '../components/AppLogosFooter'; // Import the new component

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
                    <a href="https://buy.stripe.com/6oU6oG0I44ea6Tv4BSeIw00">
                        <button className='main-btn'>Subscribe</button>
                    </a>
                {/* Sandbox link btn https://buy.stripe.com/test_dRmdRb7LE9D1eWEdNY1sQ00*/}
                {/* <a href="https://buy.stripe.com/test_dRmdRb7LE9D1eWEdNY1sQ00">
                    <button className='main-btn'>Subscribe (Sandbox)</button>
                </a> */}
                <a href="https://stripe.com/" target='_blank' rel="noopener noreferrer">
                <img src={StripePaymentCard} alt="" />

                </a>
                <p>All Apps Access $5.99/month.</p>


                </div>
              

            </aside>
            <AppLogosFooter /> {/* Use the new component here */}
        </div>
    );
};

export default AccessSubPage;