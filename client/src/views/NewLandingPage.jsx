import React, { Suspense, lazy, useState } from 'react';
import heroBackground from '../assets/img/heroBackground.png';
import Laptop from '../assets/img/Laptop.png';
import videoScreenshot from '../assets/img/videoScreenshot.png';
import PageHeader from '../components/PageHeader';
import './NewLandingPage.css';

const AppSection = lazy(() => import('../components/AppSection'));

const NewLandingPage = () => {
    const [videoError, setVideoError] = useState(false);

    const handleVideoError = () => {
        setVideoError(true);
    };

    return (
        <div className="new-landing-page">
            {/* Header Section */}
            <header className="landing-header">
                <nav className="navbar">
                    <div className="nav-brand">
                        <PageHeader />
                    </div>
                    <div className="nav-actions">
                        <a href="/sign-in" className="signin-link">
                            <button className="signin-btn">Sign In</button>
                        </a>
                    </div>
                </nav>

                {/* Hero Section */}
                <section className="hero-section">
                    <div className="hero-container">
                        {/* Hero Text */}
                        <div className="hero-text">
                            <h1 className="hero-title">
                                Powerful Apps for
                                <span className="highlight"> Modern Life</span>
                            </h1>
                            <p className="hero-description">
                                Streamline your workflow with our suite of productivity apps designed for students and professionals
                            </p>
                        </div>

                        {/* Demo Video Section */}
                        <div className="demo-container">
                            <div className="laptop-wrapper">
                                <img src={Laptop} alt="Laptop device" className="laptop-img" />
                                <div className="video-screen">
                                    {!videoError ? (
                                        <iframe
                                            src="https://www.youtube.com/embed/5F1kflY5V4s?rel=0&modestbranding=1&showinfo=0"
                                            title="DNA App Demo Video"
                                            frameBorder="0"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                            allowFullScreen
                                            referrerPolicy="strict-origin-when-cross-origin"
                                            onError={handleVideoError}
                                            className="demo-iframe"
                                        ></iframe>
                                    ) : (
                                        <a 
                                            href="https://www.youtube.com/watch?v=5F1kflY5V4s" 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="video-fallback"
                                        >
                                            <img 
                                                src={videoScreenshot} 
                                                alt="Video thumbnail - Click to watch on YouTube"
                                                className="video-thumbnail"
                                            />
                                            <div className="play-overlay">
                                                <div className="play-btn">
                                                    <span className="play-icon">▶</span>
                                                </div>
                                            </div>
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Access Plans - Simplified and Conversion Focused */}
                        <div className="access-plans">
                            <h2 className="plans-title">Choose Your Access</h2>
                            <p className="plans-subtitle">Start your productivity journey today</p>
                            
                            <div className="plans-grid">
                                {/* Student Plan */}
                                <div className="plan-card student-plan">
                                    <div className="plan-header">
                                        <div className="plan-icon">🎓</div>
                                        <h3 className="plan-name">Student Access</h3>
                                        <p className="plan-desc">Special pricing for students</p>
                                        <div className="plan-price">
                                            <span className="price-main">$4.99</span>
                                            <span className="price-period">/month</span>
                                        </div>
                                    </div>
                                    <div className="plan-features">
                                        <div className="feature">Access to all apps</div>
                                        <div className="feature">Student verification required</div>
                                        <div className="feature">Email support</div>
                                    </div>
                                    <div className="plan-footer">
                                        <a href="/student-access-subscription" className="plan-link">
                                            <button className="plan-btn student-btn">
                                                Get Student Access
                                            </button>
                                        </a>
                                    </div>
                                </div>

                                {/* Premium Plan */}
                                <div className="plan-card premium-plan featured">
                                    <div className="popular-badge">🔥 Most Popular</div>
                                    <div className="plan-header">
                                        <div className="plan-icon">🚀</div>
                                        <h3 className="plan-name">All App Access</h3>
                                        <p className="plan-desc">Complete access to everything</p>
                                        <div className="plan-price">
                                            <span className="price-main">$7.99</span>
                                            <span className="price-period">/month</span>
                                        </div>
                                        <div className="price-note">First month FREE</div>
                                    </div>
                                    <div className="plan-features">
                                        <div className="feature">All current apps</div>
                                        <div className="feature">Future apps included</div>
                                        <div className="feature">Priority support</div>
                                        <div className="feature highlight">30-day free trial</div>
                                    </div>
                                    <div className="plan-footer">
                                        <a href="/all-app-access-subscription" className="plan-link">
                                            <button className="plan-btn premium-btn">
                                                Start Free Trial
                                            </button>
                                        </a>
                                    </div>
                                </div>
                            </div>

                            {/* Trust Indicators */}
                            <div className="trust-indicators">
                                <div className="trust-item">
                                    <span className="trust-icon">🔒</span>
                                    <span className="trust-text">Secure Payment</span>
                                </div>
                                <div className="trust-item">
                                    <span className="trust-icon">⚡</span>
                                    <span className="trust-text">Instant Access</span>
                                </div>
                                <div className="trust-item">
                                    <span className="trust-icon">❌</span>
                                    <span className="trust-text">Cancel Anytime</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </header>

            {/* Apps Section */}
            <section className="apps-section">
                <Suspense fallback={
                    <div className="loading-wrapper">
                        <div className="loading-spinner"></div>
                        <p>Loading applications...</p>
                    </div>
                }>
                    <AppSection />
                </Suspense>
            </section>
        </div>
    );
};

export default NewLandingPage;