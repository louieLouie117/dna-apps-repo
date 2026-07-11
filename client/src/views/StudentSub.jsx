import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import StripePaymentCard from '../assets/img/StripePaymentCard.png';
import './StudentSub.css';

const StudentSub = () => {
    const { state } = useLocation();
    const school = state?.school;

    const [selectedApp, setSelectedApp] = useState('');
    const [plan, setPlan] = useState('all'); // 'all' = Student Discount, 'single' = Single App

    const appSubscriptionUrls = {
        'MyBudgetMonthly':   'https://buy.stripe.com/9B6dR862oh0W3Hj4BSeIw07',
        'MyLockedPasswords': 'https://buy.stripe.com/aFa6oG76sdOKgu57O4eIw09',
        'MyFlashcards':      'https://buy.stripe.com/aFa8wOfCY9yub9L8S8eIw0a',
        'MyTodoList':        'https://buy.stripe.com/4gMdR80I4262a5H9WceIw0b',
    };

    return (
        <div className="ss-root">
            <header><PageHeader /></header>

            <main className="ss-main">

                {/* Hero */}
                <div className="ss-hero">
                    <span className="ss-hero-icon">🎓</span>
                    <h1 className="ss-title">Student Access</h1>
                    <p className="ss-subtitle">
                        Special pricing for students — all the tools you need to stay organised and productive.
                    </p>
                    {school && (
                        <span className="ss-school-badge">
                            🏫 {school.school_name}
                            {school.city_location ? `, ${school.city_location}` : ''}
                            {school.state_location ? `, ${school.state_location}` : ''}
                        </span>
                    )}
                </div>

                {/* Plan toggle */}
                <div className="ss-switch">
                    <div className="ss-switch-inner">
                        <button
                            className={`ss-switch-btn${plan === 'all' ? ' active' : ''}`}
                            onClick={() => setPlan('all')}
                        >
                            🎓 Student Discount
                        </button>
                        <button
                            className={`ss-switch-btn${plan === 'single' ? ' active' : ''}`}
                            onClick={() => { setPlan('single'); setSelectedApp(''); }}
                        >
                            📱 Single App
                        </button>
                    </div>
                </div>

                {/* Plans */}
                <div className="ss-plans">

                    {/* ── Single App ── */}
                    {plan === 'single' && (
                    <div className="ss-card">
                        <h2 className="ss-card-title">Single App</h2>

                        <div className="ss-price-block">
                            <div className="ss-price-row">
                                <span className="ss-price">$3.99</span>
                                <span className="ss-period">/month</span>
                            </div>
                            {/* <p className="ss-original-price">Standard $3.99/mo</p> */}
                        </div>

                        <div className="ss-app-selector">
                            <label htmlFor="app-select">Choose your app</label>
                            <select
                                id="app-select"
                                className="ss-dropdown"
                                value={selectedApp}
                                onChange={(e) => setSelectedApp(e.target.value)}
                            >
                                <option value="">Select an app…</option>
                                <option value="MyBudgetMonthly">My Budget Monthly</option>
                                <option value="MyLockedPasswords">My Locked Passwords</option>
                                <option value="MyFlashcards">My Flashcards</option>
                                <option value="MyTodoList">My Todo List</option>
                            </select>
                        </div>

                        <ul className="ss-features">
                            <li className="ss-feature"><span className="ss-feature-icon">✅</span>Full access to one app</li>
                            <li className="ss-feature"><span className="ss-feature-icon">🔄</span>All updates included</li>
                            <li className="ss-feature"><span className="ss-feature-icon">💳</span>Cancel anytime</li>
                        </ul>

                        <a
                            href={selectedApp ? appSubscriptionUrls[selectedApp] : '#'}
                            onClick={(e) => { if (!selectedApp) e.preventDefault(); }}
                        >
                            <button
                                className="ss-btn ss-btn-primary"
                                disabled={!selectedApp}
                            >
                                {selectedApp ? 'Subscribe Now →' : 'Select an App First'}
                            </button>
                        </a>
                        <p className="ss-cancel-note">No commitment · Cancel anytime</p>
                        <div className="ss-stripe">
                            <a href="https://stripe.com/" target="_blank" rel="noopener noreferrer">
                                <img src={StripePaymentCard} alt="Secure payment with Stripe" />
                            </a>
                        </div>
                    </div>
                    )}

                    {/* ── All Apps (Student) ── */}
                    {plan === 'all' && (
                    <div className="ss-card ss-card-popular">
                        <div className="ss-popular-banner">⭐ BEST VALUE FOR STUDENTS</div>

                        <h2 className="ss-card-title">All App Access</h2>

                        <div className="ss-price-block">
                            <div className="ss-price-row">
                                <span className="ss-price">$4.99</span>
                                <span className="ss-period">/month</span>
                            </div>
                            <p className="ss-original-price">Standard $7.99/mo</p>
                            <span className="ss-discount-badge">🎓 STUDENT DISCOUNT — SAVE 37%</span>
                        </div>

                        <ul className="ss-features">
                            <li className="ss-feature"><span className="ss-feature-icon">✅</span>My Budget Monthly</li>
                            <li className="ss-feature"><span className="ss-feature-icon">✅</span>My Locked Passwords</li>
                            <li className="ss-feature"><span className="ss-feature-icon">✅</span>My Flashcards</li>
                            <li className="ss-feature"><span className="ss-feature-icon">✅</span>My Todo List</li>
                            <li className="ss-feature ss-feature-special">
                                <span className="ss-feature-icon">🚀</span>
                                Every future app — automatically included
                            </li>
                        </ul>

                        <a href="https://buy.stripe.com/dRm7sK4YkdOK91Db0geIw06?prefilled_promo_code=Student24MonthsOff">
                            <button className="ss-btn ss-btn-highlight">
                                Get Student Access →
                            </button>
                        </a>
                        <p className="ss-cancel-note">No commitment · Cancel anytime</p>
                        <div className="ss-stripe">
                            <a href="https://stripe.com/" target="_blank" rel="noopener noreferrer">
                                <img src={StripePaymentCard} alt="Secure payment with Stripe" />
                            </a>
                        </div>
                    </div>
                    )}

                </div>

                {/* Reassurance */}
                <div className="ss-reassurance">
                    <span className="ss-reassurance-item">🔒 Secure &amp; private</span>
                    <span className="ss-reassurance-item">💳 Cancel anytime</span>
                    <span className="ss-reassurance-item">⚡ Instant access</span>
                    <span className="ss-reassurance-item">🔄 Always up to date</span>
                </div>

            </main>
        </div>
    );
};

export default StudentSub;

