// import React from 'react';
import React, { useState } from 'react';

import Backgound from '../assets/img/AllAppAccess.png'; // Assuming this is the correct path to your image
import PageHeader from '../components/PageHeader';
import StripePaymentCard from '../assets/img/StripePaymentCard.png'; // Adjust the path as needed
import AppLogosFooter from '../components/AppLogosFooter'; // Import the new component

const AccessSubPage = () => {
    const [isOn, setIsOn] = useState(false);
    const [paymentSelected, setPaymentSelected] = useState("Use PayPal Payment ");

    const handleToggle = () => {
        setIsOn(prev => {
            const newState = !prev;
            console.log(`button was changed to ${newState ? 'on' : 'off'}`);
            setPaymentSelected(newState ? "Use to Stripe Payment " : "Use to PayPal Payment ");
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
            {/* modern button that console logs button was changed to off or on with no text just a modern button that looks simple and allows user to switch from on to off */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '-50px', columnGap: '10px', marginBottom: '20px' }}>
                <p>{paymentSelected}</p>
            <button
                onClick={handleToggle}
                style={{
                    width: '40px',
                    height: '24px',
                    borderRadius: '12px',
                    background: isOn ? '#0074D4' : '#FFC439',
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
            <AppLogosFooter /> {/* Use the new component here */}
        </div>
    );
};

export default AccessSubPage;