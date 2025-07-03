import React, { useState } from 'react';

import Backgound from '../assets/img/AllAppAccess.png';
import PageHeader from '../components/PageHeader';
import StripePaymentCard from '../assets/img/StripePaymentCard.png';
import PayPalLog from '../assets/img/sPayPal.png'; // Assuming you have a PayPal logo image
import AppLogosFooter from '../components/AppLogosFooter';

const AccessSubPage = () => {
    const [isOn, setIsOn] = useState(true);

    const handleToggle = () => {
        setIsOn(prev => {
            const newState = !prev;
            console.log(`button was changed to ${newState ? 'on' : 'off'}`);
            return newState;
        });
    };

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
                    {isOn ? (
                        <>
                            <a href="https://buy.stripe.com/6oU6oG0I44ea6Tv4BSeIw00">
                                <button className='main-btn'>Subscribe</button>
                            </a>
                            <a href="https://stripe.com/" target='_blank' rel="noopener noreferrer">
                                <img src={StripePaymentCard} alt="Stripe" />
                            </a>
                        </>
                    ) : (
                        <>
                        <form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_top" style={{ display: 'inline-block' }}>
                            <input type="hidden" name="cmd" value="_s-xclick" />
                            <input type="hidden" name="hosted_button_id" value="DV58328B2WDFS" />
                            <input type="image" src="https://www.paypalobjects.com/en_US/i/btn/btn_subscribeCC_LG.gif" border="0" name="submit" alt="PayPal - The safer, easier way to pay online!" />
                            <img alt="" border="0" src="https://www.paypalobjects.com/en_US/i/scr/pixel.gif" width="1" height="1" />
                        </form>
                         <a href="https://paypal.com/" target='_blank' rel="noopener noreferrer">
                                <img src={PayPalLog} alt="PayPal" />
                            </a>
                        </>                      

                        
                    )}
                    <p>All Apps Access $5.99/month.</p>
                </div>
            </aside>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '-100px', columnGap: '10px', marginBottom: '20px' }}>
      <p>
  {isOn
    ? "Current payment method: Stripe — switch to PayPal"
    : "Current payment method: PayPal — switch to Stripe"}
</p>


                <button
                    onClick={handleToggle}
                    style={{
                        width: '40px',
                        height: '24px',
                        borderRadius: '12px',
                        background: isOn ? '#FFC439' : '#0074D4',
                        border: 'none',
                        position: 'relative',
                        cursor: 'pointer',
                        outline: 'none',
                        display: 'inline-block',
                        verticalAlign: 'middle',
                        transition: 'background 0.2s'
                    }}
                    aria-label="Toggle switch"
                >
                    <span
                        style={{
                            display: 'block',
                            width: '18px',
                            height: '18px',
                            borderRadius: '50%',
                            background: '#fff',
                            position: 'absolute',
                            top: '3px',
                            left: isOn ? '19px' : '3px',
                            transition: 'left 0.2s'
                        }}
                    />
                </button>
            </div>
            <AppLogosFooter />
        </div>
    );
};

export default AccessSubPage;