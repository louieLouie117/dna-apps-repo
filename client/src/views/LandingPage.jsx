import logo from '../assets/img/logo.png';

const LandingPage = () => {
    return (
        <div className="landing-page" style={{ textAlign: 'center', padding: '4rem' }}>
            <img src={logo} alt="" />
            <button style={{ padding: '1rem 2rem', fontSize: '1rem', marginTop: '2rem' }}>
                Get Started
            </button>
        </div>
    );
};

export default LandingPage;