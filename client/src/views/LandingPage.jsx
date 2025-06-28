import React, { Suspense, lazy } from 'react'; // Import Suspense and lazy
import heroBackground from '../assets/img/heroBackground.png';
import Laptop from '../assets/img/Laptop.png';
// import AppSection from '../components/AppSection'; // Comment out or remove direct import
import PageHeader from '../components/PageHeader';

const AppSection = lazy(() => import('../components/AppSection')); // Lazy load AppSection

const LandingPage = () => {
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
                        <img src={Laptop} alt="" /> {/* Consider adding a descriptive alt text */}
                        <iframe
                            width="570"
                            height="370"
                            src="https://www.youtube.com/embed/5F1kflY5V4s"
                            title="YouTube video player"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        ></iframe>
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