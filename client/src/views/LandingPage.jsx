import heroBackground from '../assets/img/heroBackground.png';
import Laptop from '../assets/img/Laptop.png';
import AppSection from '../components/AppSection';
import PageHeader from '../components/PageHeader';

const LandingPage = () => {
    return (
        <div className="landing-page" >
            <header>
                <PageHeader />

                <div className="heroBanner">
                    <img src={heroBackground} alt="" />
                    <main>
                    <aside className='laptop'>
                        <img src={Laptop} alt="" />
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
                <AppSection />
            </section>

        </div>
    );
};

export default LandingPage;