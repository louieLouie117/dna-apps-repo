import { useState } from 'react';
import Backgound from '../assets/img/AllAppAccess.png';
import PageHeader from '../components/PageHeader';
import StripePaymentCard from '../assets/img/StripePaymentCard.png';
import './SubPage.css';

const SubPage = () => {
    const [selectedApp, setSelectedApp] = useState('');
    const [subscriptionType, setSubscriptionType] = useState('all'); // 'single' or 'all'

    // Mapping of apps to their Stripe subscription URLs
    const appSubscriptionUrls = {
        'MyBudgetMonthly': 'https://buy.stripe.com/9B6dR862oh0W3Hj4BSeIw07',
        'MyLockedPasswords': 'https://buy.stripe.com/aFa6oG76sdOKgu57O4eIw09',
        'MyFlashcards': 'https://buy.stripe.com/aFa8wOfCY9yub9L8S8eIw0a',
        'MyTodoList': 'https://buy.stripe.com/4gMdR80I4262a5H9WceIw0b'
    };

    const appDescriptions = {
        'MyBudgetMonthly': 'Take control of your spending and finally feel confident about your finances.',
        'MyLockedPasswords': 'Keep all your passwords safe, organized, and always at your fingertips.',
        'MyFlashcards': 'Learn faster and retain more with smart, simple flashcard study sessions.',
        'MyTodoList': 'Stay on top of everything — tasks, habits, and deadlines, all in one place.'
    };

    const handleAppSelection = (event) => {
        setSelectedApp(event.target.value);
    };

    const handleSubscriptionTypeChange = (type) => {
        setSubscriptionType(type);
        setSelectedApp('');
    };

    return (
        <div className='sub-page'>
            <header>
                <PageHeader />
            </header>

            <main className='sub-page-main'>

                {/* Hero */}
                <div className='hero-section'>
                    <img src={Backgound} alt="All App Access" className='hero-image' />
                    <div className='hero-content'>
                        <h2>All Apps Access</h2>
                        {/* <p>Budget · Passwords · Flashcards · Todo — all for less than a coffee a week</p> */}
                    </div>
                </div>

                

                {/* Plan toggle */}
                <div className='subscription-switch'>
                    <div className='switch-container'>
                        <button
                            className={`switch-btn ${subscriptionType === 'all' ? 'active' : ''}`}
                            onClick={() => handleSubscriptionTypeChange('all')}
                        >
                            <span className='switch-icon'>🚀</span>
                            All App Access <span className='recommended-tag'>Best Value</span>
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

                {/* Cards */}
                <div className='subscription-content'>
                    {subscriptionType === 'all' ? (
                        <div className='subscription-card all-access'>
                            <div className='popular-banner'>⭐ Most Popular Plan</div>

                            <div className='card-header'>
                                <h3>All App Access</h3>
                                <div className='price-block'>
                                    <div className='price-badge'>
                                        <span className='price'>$7.99</span>
                                        <span className='period'>/month</span>
                                    </div>
                                    <div className='price-compare'>instead of $15.96/mo separately</div>
                                </div>
                                <div className='savings-badge'>🎉 First Month FREE — Try it Risk-Free</div>
                            </div>

                            <div className='card-content'>
                                <p className='card-pitch'>Get instant access to every app we make — now and in the future. One price, zero hassle.</p>
                                <div className='features-list'>
                                    <div className='feature-item'>
                                        <span className='check-icon'>✅</span>
                                        <div>
                                            <strong>My Budget Monthly</strong>
                                            <p className='feature-desc'>Track income, expenses &amp; savings goals</p>
                                        </div>
                                    </div>
                                    <div className='feature-item'>
                                        <span className='check-icon'>✅</span>
                                        <div>
                                            <strong>My Locked Passwords</strong>
                                            <p className='feature-desc'>Encrypted local password manager</p>
                                        </div>
                                    </div>
                                    <div className='feature-item'>
                                        <span className='check-icon'>✅</span>
                                        <div>
                                            <strong>My Flashcards</strong>
                                            <p className='feature-desc'>Study smarter with spaced-repetition cards</p>
                                        </div>
                                    </div>
                                    <div className='feature-item'>
                                        <span className='check-icon'>✅</span>
                                        <div>
                                            <strong>My Todo List</strong>
                                            <p className='feature-desc'>Tasks, habits &amp; due-date calendar</p>
                                        </div>
                                    </div>
                                    <div className='feature-item special'>
                                        <span className='check-icon'>🚀</span>
                                        <div>
                                            <strong>Every future app — automatically included</strong>
                                            <p className='feature-desc'>No extra charges as we grow</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            

                            <div className='card-footer'>
                                <a href="https://buy.stripe.com/dRm7sK4YkdOK91Db0geIw06" className='subscribe-link'>
                                    <button className='subscribe-btn primary'>
                                        Start My Free Month
                                        <span className='btn-icon'>→</span>
                                    </button>
                                </a>
                                <p className='cancel-note'>No commitment. Cancel anytime in your account settings.</p>
                                <div className='payment-info'>
                                    <a href="https://stripe.com/" target='_blank' rel="noopener noreferrer">
                                        <img src={StripePaymentCard} alt="Secure payment with Stripe" className='stripe-logo' />
                                    </a>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className='subscription-card single-access'>
                            <div className='card-header'>
                                <h3>Single App Access</h3>
                                <div className='price-block'>
                                    <div className='price-badge'>
                                        <span className='price'>$3.99</span>
                                        <span className='period'>/month</span>
                                    </div>
                                </div>
                                <p className='upsell-nudge'>💡 All 4 apps for just $4 more — <button className='inline-switch-btn' onClick={() => handleSubscriptionTypeChange('all')}>see All App Access</button></p>
                            </div>

                            <div className='card-content'>
                                <div className='app-selector'>
                                    <label htmlFor="app-select">Which app would you like?</label>
                                    <select
                                        id="app-select"
                                        value={selectedApp}
                                        onChange={handleAppSelection}
                                        className='app-dropdown'
                                    >
                                        <option value="">Select an app…</option>
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
                                                <h4>{selectedApp.replace('My', 'My ').replace(/([A-Z])/g, ' $1').replace('My  ', 'My ').trim()}</h4>
                                                <p>{appDescriptions[selectedApp]}</p>
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
                                <p className='cancel-note'>No commitment. Cancel anytime in your account settings.</p>
                                <div className='payment-info'>
                                    <a href="https://stripe.com/" target='_blank' rel="noopener noreferrer">
                                        <img src={StripePaymentCard} alt="Secure payment with Stripe" className='stripe-logo' />
                                    </a>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                

                {/* Bottom reassurance */}
                <div className='reassurance-section'>
                    <h3>Why people love DNA Apps</h3>
                    <div className='reassurance-grid'>
                        <div className='reassurance-item'>
                            <span className='reassurance-icon'>🏠</span>
                            <h4>Runs on your Mobile and PC</h4>
                            <p>Access your apps seamlessly on both mobile and PC.</p>
                        </div>
                        <div className='reassurance-item'>
                            <span className='reassurance-icon'>⚡</span>
                            <h4>Simple by design</h4>
                            <p>No bloat, no learning curve. Open it, use it, get things done.</p>
                        </div>
                        <div className='reassurance-item'>
                            <span className='reassurance-icon'>🔄</span>
                            <h4>Always improving</h4>
                            <p>Regular updates and new apps roll out to subscribers automatically.</p>
                        </div>
                        <div className='reassurance-item'>
                            <span className='reassurance-icon'>💬</span>
                            <h4>Real support</h4>
                            <p>Questions? You're talking to the developer — fast, friendly responses.</p>
                        </div>
                    </div>
                </div>

                {/* Value pitch */}
                <div className='value-pitch'>
                    <p className='pitch-lead'>
                        Stop juggling separate apps and separate subscriptions. DNA Apps gives you everything you need to stay organized, secure, and productive — built for Windows 10/11 and mobile. One subscription, one price, zero hassle.
                    </p>
                    <div className='trust-row'>
                        <span className='trust-item'>🔒 Secure &amp; private</span>
                        <span className='trust-item'>💳 Cancel anytime</span>
                        <span className='trust-item'>🎁 First month FREE</span>
                        <span className='trust-item'>🚀 Every future app included</span>
                    </div>
                </div>

            </main>
        </div>
    );
};

export default SubPage;