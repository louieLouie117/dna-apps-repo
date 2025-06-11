import React from 'react';
import Backgound from '../assets/img/AllAppAccess.png'; // Assuming this is the correct path to your image
import PageHeader from '../components/PageHeader';
import StripePaymentCard from '../assets/img/StripePaymentCard.png'; // Adjust the path as needed
import AppLogo1 from '../assets/AppLogos/App1.png'; // Example app logo, adjust as needed
import AppLogo2 from '../assets/AppLogos/App2.png'; // Example app logo, adjust as needed
import AppLogo3 from '../assets/AppLogos/App3.png'; // Example app logo, adjust as needed
import AppLogo4 from '../assets/AppLogos/App4.png'; // Example app logo, adjust as needed
import AppLogo5 from '../assets/AppLogos/App5.png'; // Example app logo, adjust as needed   
import AppLogo6 from '../assets/AppLogos/App6.png'; // Example app logo, adjust as needed
import AppLogo7 from '../assets/AppLogos/App7.png'; // Example app logo, adjust as needed

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

                <img src={StripePaymentCard} alt="" />
                <p>All Apps Access $5.99/month.</p>


                </div>
              

            </aside>
            <footer>
                <a href="https://apps.microsoft.com/detail/9wzdncrdsnzk?hl=en-US&gl=US" target="_blank" rel="noopener noreferrer"><img src={AppLogo1} alt="App Logo 1" /></a>
                <a href="https://apps.microsoft.com/detail/9nblggh318dq?hl=en-US&gl=US" target="_blank" rel="noopener noreferrer"><img src={AppLogo2} alt="App Logo 2" /></a>
                <a href="https://apps.microsoft.com/detail/9nblggh3tktw?hl=en-US&gl=US" target="_blank" rel="noopener noreferrer"><img src={AppLogo3} alt="App Logo 3" /></a>
                <a href="#" target="_blank" rel="noopener noreferrer"><img src={AppLogo4} alt="App Logo 4" /></a>
                <a href="https://apps.microsoft.com/detail/9pmzc1nvwk02?hl=en-US&gl=US" target="_blank" rel="noopener noreferrer"><img src={AppLogo5} alt="App Logo 5" /></a>
                <a href="#" target="_blank" rel="noopener noreferrer"><img src={AppLogo6} alt="App Logo 6" /></a>
                <a href="https://apps.microsoft.com/detail/9nblggh2kbbk?hl=en-US&gl=US" target="_blank" rel="noopener noreferrer"><img src={AppLogo7} alt="App Logo 7" /></a>
            </footer>
        </div>
    );
};

export default AccessSubPage;