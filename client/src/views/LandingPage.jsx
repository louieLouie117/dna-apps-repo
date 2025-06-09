import logo from '../assets/img/logo.png';
import heroBackground from '../assets/img/heroBackground.png';
import laptop from '../assets/img/laptop.png';

const LandingPage = () => {
    return (
        <div className="landing-page" >
            <header>
                <div className="logo">
                    <h1 className='hidden'>Project DNA Apps</h1>
                    <img src={logo} alt="" />
                </div>
                <div className="heroBanner">
                    <img src={heroBackground} alt="" />
                    <main>
                    <aside className='laptop'>
                        <img src={laptop} alt="" />
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
                        <button className='main-btn'>Student</button>
                        <button className='main-btn'>Free Month</button>
                        <p>Membership</p>
                        <p>Membership</p>

                    </div>

                </div>
                </main>     

                </div>
          

            </header>
            
        </div>
    );
};

export default LandingPage;