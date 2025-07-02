const Footer = () => (
    <footer style={{ padding: '1rem', background: '#f5f5f5', textAlign: 'center' }}>
        <nav>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'inline-flex', gap: '1.5rem' }}>
                {/* home page */}
                <li>
                    <a href="/" rel="noopener noreferrer">Home</a>
                </li>
                <li>
                    <a href="/contact-us-1.html"  rel="noopener noreferrer">Contact Us</a>
                </li>
                <li>
                    <a href="/privacy-policy.html"  rel="noopener noreferrer">Privacy Policy</a>
                </li>
                <li>
                    <a href="/terms-of-service.html"  rel="noopener noreferrer">Terms of Service</a>
                </li>
                
                <li>
                    <a href="/unsubscribe"  rel="noopener noreferrer">Unsubscribe</a>
                </li>
            </ul>
        </nav>
        <div style={{ marginTop: '0.5rem', fontSize: '0.9rem', color: '#888' }}>
            &copy; {new Date().getFullYear()} Project DNA Apps
        </div>
    </footer>
);

export default Footer;
