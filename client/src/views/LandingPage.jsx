import React, { Suspense, lazy, useState } from 'react'; // Import Suspense and lazy
import heroBackground from '../assets/img/heroBackground.png';
import Laptop from '../assets/img/Laptop.png';
import videoScreenshot from '../assets/img/videoScreenshot.png';
// import AppSection from '../components/AppSection'; // Comment out or remove direct import
import PageHeader from '../components/PageHeader';

const AppSection = lazy(() => import('../components/AppSection')); // Lazy load AppSection

const LandingPage = () => {
    const [videoError, setVideoError] = useState(false);

    const handleVideoError = () => {
        setVideoError(true);
    };
    return (
        <div className="landing-page" >
            <header>
                <nav>
                <PageHeader />

                    <a href="/sign-in">
                    <button>Sign In</button>
                </a>

                </nav>
                
                <div className="heroBanner">
                    <img src={heroBackground} alt="" /> {/* Consider adding a descriptive alt text */}
                    <main>
                    <aside className='laptop'>
                        <img src={Laptop} alt="Laptop showing application interface" />
                        {!videoError ? (
                            <iframe
                                width="570"
                                height="370"
                                src="https://www.youtube.com/embed/5F1kflY5V4s?rel=0&modestbranding=1&showinfo=0"
                                title="DNA App Demo Video"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                allowFullScreen
                                referrerPolicy="strict-origin-when-cross-origin"
                                onError={handleVideoError}
                            ></iframe>
                        ) : (
                            <a 
                                href="https://www.youtube.com/watch?v=5F1kflY5V4s" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                style={{
                                    display: 'block',
                                    position: 'relative',
                                    width: '570px',
                                    height: '370px'
                                }}
                            >
                                <img 
                                    src={videoScreenshot} 
                                    alt="Video thumbnail - Click to watch on YouTube"
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover',
                                        borderRadius: '8px',
                                        cursor: 'pointer'
                                    }}
                                />
                                <div style={{
                                    position: 'absolute',
                                    top: '50%',
                                    left: '50%',
                                    transform: 'translate(-50%, -50%)',
                                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                                    borderRadius: '50%',
                                    width: '60px',
                                    height: '60px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'white',
                                    fontSize: '24px'
                                }}>
                                    ▶
                                </div>
                            </a>
                        )}
                    </aside>
                <div className="sub-actions">
                    <h2>All App Access</h2>
                    <div>
                        <a href="/student-access-subscription">
                        <button className='main-btn'>Student</button>
                        </a>
                        <a href="/all-app-access-subscription">
                        <button className='main-btn'>Free Month</button>
                        </a>
                        <p>Membership</p>
                        <p>Membership</p>

                    </div>

                </div>
                </main>     

                </div>
          

            </header>
            
            <section>
                <Suspense fallback={<div>Loading applications...</div>}> {/* Suspense wrapper */}
                    <AppSection />
                </Suspense>
            </section>

        </div>
    );
};

export default LandingPage;