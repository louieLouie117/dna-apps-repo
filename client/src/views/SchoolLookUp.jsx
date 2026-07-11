import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import './SchoolLookUp.css';

const NCES_API = 'https://educationdata.urban.org/api/v1/college-university/ipeds/directory/2023/';

// FIPS codes are the only documented state filter the IPEDS API accepts
const STATE_FIPS = {
    AL:1, AK:2, AZ:4, AR:5, CA:6, CO:8, CT:9, DE:10, DC:11,
    FL:12, GA:13, HI:15, ID:16, IL:17, IN:18, IA:19, KS:20,
    KY:21, LA:22, ME:23, MD:24, MA:25, MI:26, MN:27, MS:28,
    MO:29, MT:30, NE:31, NV:32, NH:33, NJ:34, NM:35, NY:36,
    NC:37, ND:38, OH:39, OK:40, OR:41, PA:42, RI:44, SC:45,
    SD:46, TN:47, TX:48, UT:49, VT:50, VA:51, WA:53, WV:54,
    WI:55, WY:56,
};

const US_STATES = [
    ['AL','Alabama'],['AK','Alaska'],['AZ','Arizona'],['AR','Arkansas'],
    ['CA','California'],['CO','Colorado'],['CT','Connecticut'],['DE','Delaware'],
    ['FL','Florida'],['GA','Georgia'],['HI','Hawaii'],['ID','Idaho'],
    ['IL','Illinois'],['IN','Indiana'],['IA','Iowa'],['KS','Kansas'],
    ['KY','Kentucky'],['LA','Louisiana'],['ME','Maine'],['MD','Maryland'],
    ['MA','Massachusetts'],['MI','Michigan'],['MN','Minnesota'],['MS','Mississippi'],
    ['MO','Missouri'],['MT','Montana'],['NE','Nebraska'],['NV','Nevada'],
    ['NH','New Hampshire'],['NJ','New Jersey'],['NM','New Mexico'],['NY','New York'],
    ['NC','North Carolina'],['ND','North Dakota'],['OH','Ohio'],['OK','Oklahoma'],
    ['OR','Oregon'],['PA','Pennsylvania'],['RI','Rhode Island'],['SC','South Carolina'],
    ['SD','South Dakota'],['TN','Tennessee'],['TX','Texas'],['UT','Utah'],
    ['VT','Vermont'],['VA','Virginia'],['WA','Washington'],['WV','West Virginia'],
    ['WI','Wisconsin'],['WY','Wyoming'],['DC','District of Columbia'],
];

export default function SchoolLookUp() {
    const navigate = useNavigate();
    const [query, setQuery] = useState('');
    const [stateFilter, setStateFilter] = useState('');
    const [cityFilter, setCityFilter] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [searched, setSearched] = useState(false);
    const [selected, setSelected] = useState(null);
    const [fallbackEmail, setFallbackEmail] = useState('');
    const [fallbackSubmitted, setFallbackSubmitted] = useState(false);

    const handleFallbackSubmit = (e) => {
        e.preventDefault();
        if (!fallbackEmail.trim()) return;
        navigate('/student-access-subscription', {
            state: { school: { inst_name: fallbackEmail, fromEmail: true } },
        });
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!stateFilter) return;
        setLoading(true);
        setError('');
        setResults([]);
        setSelected(null);
        setSearched(true);

        try {
            const fips = STATE_FIPS[stateFilter];
            const params = new URLSearchParams({
                fips,
                per_page: 500, // fetch all institutions in the state
            });

            const res = await fetch(`${NCES_API}?${params.toString()}`);
            if (!res.ok) throw new Error(`Search failed (${res.status}). Please try again.`);
            const json = await res.json();

            // Filter by city client-side (API doesn't support city filter)
            let institutions = json.results || [];
            if (cityFilter.trim()) {
                const city = cityFilter.trim().toLowerCase();
                institutions = institutions.filter(s =>
                    (s.city || '').toLowerCase().includes(city)
                );
            }

            // Sort A–Z
            institutions.sort((a, b) =>
                (a.inst_name || '').localeCompare(b.inst_name || '')
            );
            setResults(institutions);
        } catch (err) {
            setError(err.message || 'Could not reach the college database. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleContinue = () => {
        navigate('/student-access-subscription', { state: { school: selected } });
    };

    return (
        <div className="slu-root">
            <header>
                <PageHeader />
            </header>

            <main className="slu-main">

                {/* Intro */}
                <div className="slu-hero">
                    <span className="slu-hero-icon">🎓</span>
                    <h1 className="slu-title">Find Your College or University</h1>
                    <p className="slu-subtitle">
                        Select your state and optionally enter your city to find your
                        college or university and unlock the student discount.
                    </p>
                </div>

                {/* Search form */}
                <form className="slu-form" onSubmit={handleSearch}>
                    <div className="slu-inputs">
                        <select
                            className="slu-select slu-select-state"
                            value={stateFilter}
                            onChange={(e) => setStateFilter(e.target.value)}
                            required
                        >
                            <option value="">Select a state…</option>
                            {US_STATES.map(([code]) => (
                                <option key={code} value={code}>{code}</option>
                            ))}
                        </select>
                        <input
                            className="slu-input"
                            type="text"
                            placeholder="Type city to narrow search (optional)"
                            value={cityFilter}
                            onChange={(e) => setCityFilter(e.target.value)}
                        />
                    </div>
                    <button className="slu-search-btn" type="submit" disabled={loading || !stateFilter}>
                        {loading ? 'Searching…' : 'Find Colleges & Universities'}
                    </button>
                </form>

                {/* Error */}
                {error && <p className="slu-error">⚠️ {error}</p>}

                {/* Results */}
                {searched && !loading && (
                    <div className="slu-results-section">
                        {results.length === 0 ? (
                            <div className="slu-no-results">
                                <p className="slu-no-results-msg">
                                    No colleges found in <strong>{stateFilter}</strong>
                                    {cityFilter ? ` near "${cityFilter}"` : ''}.
                                </p>
                                <p className="slu-no-results-hint">
                                    Don't see your school? Enter your school email below and we'll still get you access.
                                </p>
                                <form className="slu-fallback-form" onSubmit={handleFallbackSubmit}>
                                    <input
                                        className="slu-input slu-fallback-input"
                                        type="email"
                                        placeholder="yourname@university.edu"
                                        value={fallbackEmail}
                                        onChange={(e) => setFallbackEmail(e.target.value)}
                                        required
                                    />
                                    <button className="slu-continue-btn" type="submit" disabled={!fallbackEmail.trim()}>
                                        Continue with School Email →
                                    </button>
                                </form>
                            </div>
                        ) : (
                            <>
                                <p className="slu-results-count">
                                    {results.length} institution{results.length !== 1 ? 's' : ''} in <strong>{stateFilter}</strong>
                                    {cityFilter ? ` — ${cityFilter}` : ''} — click yours to select it.
                                </p>
                                <ul className="slu-results-list">
                                    {results.map((school, i) => {
                                        const id = `${school.inst_name}-${school.city}-${i}`;
                                        const isSelected = selected && selected._id === id;
                                        return (
                                            <li
                                                key={id}
                                                className={`slu-result-item${isSelected ? ' selected' : ''}`}
                                                onClick={() => setSelected({ ...school, _id: id })}
                                            >
                                                <div className="slu-result-name">{school.inst_name}</div>
                                                <div className="slu-result-meta">
                                                    {school.city && (
                                                        <span>
                                                            {school.city}
                                                            {school.state_abbr ? `, ${school.state_abbr}` : ''}
                                                            {school.zip ? ` ${school.zip}` : ''}
                                                        </span>
                                                    )}
                                                </div>
                                                {isSelected && <span className="slu-selected-check">✅ Selected</span>}
                                            </li>
                                        );
                                    })}
                                </ul>
                            </>
                        )}
                    </div>
                )}

                {/* Confirm modal */}
                {selected && (
                    <div className="slu-modal-overlay" onClick={() => setSelected(null)}>
                        <div className="slu-modal" onClick={(e) => e.stopPropagation()}>
                            <button className="slu-modal-close" onClick={() => setSelected(null)} aria-label="Close">✕</button>
                            <div className="slu-confirm-icon">🏫</div>
                            <h2 className="slu-confirm-heading">Is this your school?</h2>
                            <div className="slu-confirm-school">
                                <div className="slu-confirm-name">{selected.inst_name}</div>
                                <div className="slu-confirm-location">
                                    {selected.city}{selected.state_abbr ? `, ${selected.state_abbr}` : ''}
                                </div>
                            </div>
                            <button className="slu-continue-btn" onClick={handleContinue}>
                                Yes, Continue to Student Subscription →
                            </button>
                            <p className="slu-confirm-note">
                                Not your institution?{' '}
                                <button className="slu-modal-back" onClick={() => setSelected(null)}>Pick a different one</button>
                            </p>
                        </div>
                    </div>
                )}

            </main>
        </div>
    );
}
