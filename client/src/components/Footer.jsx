const Footer = () => (
    <footer style={{ padding: '1rem', background: '#f5f5f5', textAlign: 'center' }}>
        <nav>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'inline-flex', gap: '1.5rem' }}>
                <li>
                    <a href="/privacy-policy">Privacy Policy</a>
                </li>
                <li>
                    <a href="/terms-of-service">Terms of Service</a>
                </li>
                <li>
                    <a href="/contact-us">Contact Us</a>
                </li>
                <li>
                    <a href="/unsubscribe">Unsubscribe</a>
                </li>
            </ul>
        </nav>
        <div style={{ marginTop: '0.5rem', fontSize: '0.9rem', color: '#888' }}>
            &copy; {new Date().getFullYear()} Your Company Name
        </div>
    </footer>
);

export default Footer;
