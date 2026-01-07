import { useState } from 'react';
import Backgound from '../assets/img/AllAppAccess.png';
import PageHeader from '../components/PageHeader';
import StripePaymentCard from '../assets/img/StripePaymentCard.png';
import './SubPage.css';

const SubPage = () => {
    const [selectedApp, setSelectedApp] = useState('');
    const [subscriptionType, setSubscriptionType] = useState('single'); // 'single' or 'all'

    // Mapping of apps to their Stripe subscription URLs
    const appSubscriptionUrls = {
        'MyBudgetMonthly': 'https://buy.stripe.com/9B6dR862oh0W3Hj4BSeIw07',
        'MyLockedPasswords': 'https://buy.stripe.com/aFa6oG76sdOKgu57O4eIw09',
        'MyFlashcards': 'https://buy.stripe.com/aFa8wOfCY9yub9L8S8eIw0a',
        'MyTodoList': 'https://buy.stripe.com/4gMdR80I4262a5H9WceIw0b'
    };

    const handleAppSelection = (event) => {
        setSelectedApp(event.target.value);
        console.log('Selected app:', event.target.value);
    };

    const handleSubscriptionTypeChange = (type) => {
        setSubscriptionType(type);
        setSelectedApp(''); // Reset selected app when switching types
    };

    return (
        <div className='sub-page'>
            <header>
                <PageHeader />
            </header>
            
            <main className='sub-page-main'>
                <div className='hero-section'>
                    <img src={Backgound} alt="All App Access" className='hero-image' />
                    <div className='hero-content'>
                        <h2>Choose Your App Access</h2>
                        <p>Select the perfect plan for your needs</p>
                    </div>
                </div>

                {/* Subscription Type Switch */}
                <div className='subscription-switch'>
                    <div className='switch-container'>
                        <button
                            className={`switch-btn ${subscriptionType === 'all' ? 'active' : ''}`}
                            onClick={() => handleSubscriptionTypeChange('all')}
                        >
                            <span className='switch-icon'>🚀</span>
                            All App Access
                        </button>
                        <button
                            className={`switch-btn ${subscriptionType === 'single' ? 'active' : ''}`}
                            onClick={() => handleSubscriptionTypeChange('single')}
                        >
                            <span className='switch-icon'>📱</span>
                            Single App
                        </button>
                    </div>
                </div>

                {/* Subscription Cards */}
                <div className='subscription-content'>
                    {subscriptionType === 'all' ? (
                        /* All App Access Card */
                        <div className='subscription-card all-access'>
                            <div className='card-header'>
                                <h3>All App Access</h3>
                                <div className='price-badge'>
                                    <span className='price'>$7.99</span>
                                    <span className='period'>/month</span>
                                </div>
                                <div className='savings-badge'>
                                    💰 Save $8.97/month
                                </div>
                            </div>
                            
                            <div className='card-content'>
                                <div className='features-list'>
                                    <div className='feature-item'>
                                        <span className='check-icon'>✅</span>
                                        <span>My Budget Monthly</span>
                                    </div>
                                    <div className='feature-item'>
                                        <span className='check-icon'>✅</span>
                                        <span>My Locked Passwords</span>
                                    </div>
                                    <div className='feature-item'>
                                        <span className='check-icon'>✅</span>
                                        <span>My Flashcards</span>
                                    </div>
                                    <div className='feature-item'>
                                        <span className='check-icon'>✅</span>
                                        <span>My Todo List</span>
                                    </div>
                                    <div className='feature-item special'>
                                        <span className='check-icon'>🎯</span>
                                        <span>All future apps included</span>
                                    </div>
                                </div>
                            </div>

                            <div className='card-footer'>
                                <a href="https://buy.stripe.com/dRm7sK4YkdOK91Db0geIw06" className='subscribe-link'>
                                    <button className='subscribe-btn primary'>
                                        Subscribe to All Apps
                                        <span className='btn-icon'>→</span>
                                    </button>
                                </a>
                                
                                <div className='payment-info'>
                                    <a href="https://stripe.com/" target='_blank' rel="noopener noreferrer">
                                        <img src={StripePaymentCard} alt="Secure payment with Stripe" className='stripe-logo' />
                                    </a>
                                </div>
                            </div>
                        </div>
                    ) : (
                        /* Single App Access Card */
                        <div className='subscription-card single-access'>
                            <div className='card-header'>
                                <h3>Single App Access</h3>
                                <div className='price-badge'>
                                    <span className='price'>$3.99</span>
                                    <span className='period'>/month</span>
                                </div>
                            </div>
                            
                            <div className='card-content'>
                                <div className='app-selector'>
                                    <label htmlFor="app-select">Choose your app:</label>
                                    <select 
                                        id="app-select"
                                        value={selectedApp}
                                        onChange={handleAppSelection}
                                        className='app-dropdown'
                                    >
                                        <option value="">Select an app</option>
                                        <option value="MyBudgetMonthly">My Budget Monthly</option>
                                        <option value="MyLockedPasswords">My Locked Passwords</option>
                                        <option value="MyFlashcards">My Flashcards</option>
                                        <option value="MyTodoList">My Todo List</option>
                                    </select>
                                </div>

                                {selectedApp && (
                                    <div className='selected-app-info'>
                                        <div className='app-preview'>
                                            <span className='app-icon'>📱</span>
                                            <div className='app-details'>
                                                <h4>{selectedApp.replace('My', '').replace(/([A-Z])/g, ' $1').trim()}</h4>
                                                <p>Full access to this app</p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className='card-footer'>
                                <a 
                                    href={selectedApp ? appSubscriptionUrls[selectedApp] : '#'} 
                                    className={`subscribe-link ${!selectedApp ? 'disabled' : ''}`}
                                    onClick={(e) => {
                                        if (!selectedApp) {
                                            e.preventDefault();
                                            alert('Please select an app first');
                                        }
                                    }}
                                >
                                    <button 
                                        className={`subscribe-btn ${selectedApp ? 'primary' : 'disabled'}`}
                                        disabled={!selectedApp}
                                    >
                                        {selectedApp ? 'Subscribe Now' : 'Select an App First'}
                                        {selectedApp && <span className='btn-icon'>→</span>}
                                    </button>
                                </a>
                                
                                <div className='payment-info'>
                                    <a href="https://stripe.com/" target='_blank' rel="noopener noreferrer">
                                        <img src={StripePaymentCard} alt="Secure payment with Stripe" className='stripe-logo' />
                                    </a>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default SubPage;