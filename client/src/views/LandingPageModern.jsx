import { useState } from 'react';
import heroBackground from '../assets/img/heroBackground.png';
import Laptop from '../assets/img/Laptop.png';
import videoScreenshot from '../assets/img/videoScreenshot.png';
import PageHeader from '../components/PageHeader';
import ComingSoon from '../components/ComingSoon';
import './LandingPageModern.css';

export default function LandingPageModern() {
    const [videoError, setVideoError] = useState(false);

    return (
        <div className="lpm-root">

            {/* ── Navbar ──────────────────────────────────────────────────── */}
            <nav className="lpm-nav">
                <div className="lpm-nav-brand">
                    <PageHeader />
                </div>
                <a href="/sign-in" className="lpm-signin-link">
                    <button className="lpm-signin-btn">Sign In</button>
                </a>
            </nav>

            {/* ── Hero ────────────────────────────────────────────────────── */}
            <header className="lpm-hero" style={{ backgroundImage: `url(${heroBackground})` }}>
                <div className="lpm-hero-overlay" />

                <div className="lpm-hero-content">
                    {/* Left: headline + access cards */}
                    <div className="lpm-hero-left">
                        <p className="lpm-eyebrow">Productivity Suite</p>
                        <h1 className="lpm-headline">
                            Your Apps.<br />
                            <span className="lpm-accent">Your Way.</span>
                        </h1>
                        <p className="lpm-subheadline">
                            Pick just the app you need, or unlock everything at once —
                            budget tracking, flashcards, secure passwords, and more.
                        </p>

                        {/* Mobile-only video (laptop hidden on small screens) */}
                        <div className="lpm-mobile-video">
                            {!videoError ? (
                                <iframe
                                    src="https://www.youtube.com/embed/5F1kflY5V4s?rel=0&modestbranding=1&showinfo=0"
                                    title="DNA App Demo Video"
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                    allowFullScreen
                                    referrerPolicy="strict-origin-when-cross-origin"
                                    onError={() => setVideoError(true)}
                                    className="lpm-mobile-iframe"
                                />
                            ) : (
                                <a
                                    href="https://www.youtube.com/watch?v=5F1kflY5V4s"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="lpm-video-fallback"
                                >
                                    <img src={videoScreenshot} alt="Click to watch demo on YouTube" className="lpm-thumb" />
                                    <div className="lpm-play-btn">▶</div>
                                </a>
                            )}
                        </div>

                        {/* ── App Access Container ────────────────────────── */}
                        <div className="lpm-access-container">
                            <h2 className="lpm-access-title">Get Access</h2>
                            <div className="lpm-plans">

                               

                                {/* Student */}
                                <div className="lpm-plan lpm-plan-student">
                                    <div className="lpm-plan-icon">🎓</div>
                                    <div className="lpm-plan-body">
                                        <h3 className="lpm-plan-name">Student</h3>
                                        <p className="lpm-plan-desc">Special rate for students</p>
                                    </div>
                                    <a href="/student-access-subscription" className="lpm-plan-link">
                                        <button className="lpm-plan-btn lpm-btn-student">
                                            Get Access
                                        </button>
                                    </a>
                                </div>

                                {/* All Apps */}
                                <div className="lpm-plan lpm-plan-premium">
                                    <span className="lpm-badge">🔥 Best Value</span>
                                    <div className="lpm-plan-icon">🚀</div>
                                    <div className="lpm-plan-body">
                                        <h3 className="lpm-plan-name">All Apps</h3>
                                        <p className="lpm-plan-desc">Every app, every update</p>
                                        <p className="lpm-plan-note">First month FREE</p>
                                    </div>
                                    <a href="/all-app-access-subscription" className="lpm-plan-link">
                                        <button className="lpm-plan-btn lpm-btn-premium">
                                            Start Free Trial
                                        </button>
                                    </a>
                                </div>

                                 {/* Single App */}
                                <div className="lpm-plan lpm-plan-single">
                                    <div className="lpm-plan-icon">📱</div>
                                    <div className="lpm-plan-body">
                                        <h3 className="lpm-plan-name">Single App</h3>
                                        <p className="lpm-plan-desc">Subscribe to just one app</p>
                                    </div>
                                    <a href="/sign-in" className="lpm-plan-link">
                                        <button className="lpm-plan-btn lpm-btn-single">
                                            Browse Apps
                                        </button>
                                    </a>
                                </div>

                            </div>

                            {/* Trust row */}
                            <div className="lpm-trust">
                                <span>🔒 Secure Payment</span>
                                <span>⚡ Instant Access</span>
                                <span>❌ Cancel Anytime</span>
                            </div>
                        </div>
                    </div>

                    {/* Right: demo video */}
                    <div className="lpm-hero-right">
                        <div className="lpm-laptop-wrap">
                            <img src={Laptop} alt="App interface on laptop" className="lpm-laptop-img" />
                            <div className="lpm-video-screen">
                                {!videoError ? (
                                    <iframe
                                        src="https://www.youtube.com/embed/5F1kflY5V4s?rel=0&modestbranding=1&showinfo=0"
                                        title="DNA App Demo Video"
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                        allowFullScreen
                                        referrerPolicy="strict-origin-when-cross-origin"
                                        onError={() => setVideoError(true)}
                                        className="lpm-iframe"
                                    />
                                ) : (
                                    <a
                                        href="https://www.youtube.com/watch?v=5F1kflY5V4s"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="lpm-video-fallback"
                                    >
                                        <img
                                            src={videoScreenshot}
                                            alt="Click to watch demo on YouTube"
                                            className="lpm-thumb"
                                        />
                                        <div className="lpm-play-btn">▶</div>
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* ── Apps Available Section ───────────────────────────────────── */}
            <section className="lpm-apps-section">
                <ComingSoon />
            </section>

        </div>
    );
}
