import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import './SchoolLookUp.css';

const NCES_API = 'https://educationdata.urban.org/api/v1/schools/ccd/directory/2024/';

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
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [searched, setSearched] = useState(false);
    const [selected, setSelected] = useState(null);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!query.trim()) return;
        setLoading(true);
        setError('');
        setResults([]);
        setSelected(null);
        setSearched(true);

        try {
            const params = new URLSearchParams({
                school_name: query.trim(),
                per_page: 25,
            });
            if (stateFilter) params.set('state_location', stateFilter);

            const res = await fetch(`${NCES_API}?${params.toString()}`);
            if (!res.ok) throw new Error(`Search failed (${res.status}). Please try again.`);
            const json = await res.json();
            setResults(json.results || []);
        } catch (err) {
            setError(err.message || 'Could not reach the school database. Please try again.');
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
                    <h1 className="slu-title">Verify Your School</h1>
                    <p className="slu-subtitle">
                        Find your school below to unlock the student discount.
                        Search by school name and optionally filter by state.
                    </p>
                </div>

                {/* Search form */}
                <form className="slu-form" onSubmit={handleSearch}>
                    <div className="slu-inputs">
                        <input
                            className="slu-input"
                            type="text"
                            placeholder="School name (e.g. Lincoln High School)"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            required
                        />
                        <select
                            className="slu-select"
                            value={stateFilter}
                            onChange={(e) => setStateFilter(e.target.value)}
                        >
                            <option value="">All states</option>
                            {US_STATES.map(([code, name]) => (
                                <option key={code} value={code}>{name}</option>
                            ))}
                        </select>
                    </div>
                    <button className="slu-search-btn" type="submit" disabled={loading}>
                        {loading ? 'Searching…' : 'Search Schools'}
                    </button>
                </form>

                {/* Error */}
                {error && <p className="slu-error">⚠️ {error}</p>}

                {/* Results */}
                {searched && !loading && (
                    <div className="slu-results-section">
                        {results.length === 0 ? (
                            <p className="slu-no-results">
                                No schools found for <strong>"{query}"</strong>
                                {stateFilter ? ` in ${stateFilter}` : ''}.
                                Try a shorter name or remove the state filter.
                            </p>
                        ) : (
                            <>
                                <p className="slu-results-count">
                                    {results.length} school{results.length !== 1 ? 's' : ''} found
                                    {stateFilter ? ` in ${stateFilter}` : ''} — click yours to select it.
                                </p>
                                <ul className="slu-results-list">
                                    {results.map((school, i) => {
                                        const id = `${school.school_name}-${school.city_location}-${i}`;
                                        const isSelected = selected && selected._id === id;
                                        return (
                                            <li
                                                key={id}
                                                className={`slu-result-item${isSelected ? ' selected' : ''}`}
                                                onClick={() => setSelected({ ...school, _id: id })}
                                            >
                                                <div className="slu-result-name">{school.school_name}</div>
                                                <div className="slu-result-meta">
                                                    {school.lea_name && <span>{school.lea_name}</span>}
                                                    {school.city_location && (
                                                        <span>
                                                            {school.city_location}
                                                            {school.state_location ? `, ${school.state_location}` : ''}
                                                            {school.zip_mailing ? ` ${school.zip_mailing}` : ''}
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

                {/* Confirm & continue */}
                {selected && (
                    <div className="slu-confirm">
                        <div className="slu-confirm-school">
                            <span className="slu-confirm-icon">🏫</span>
                            <div>
                                <div className="slu-confirm-name">{selected.school_name}</div>
                                <div className="slu-confirm-location">
                                    {selected.city_location}
                                    {selected.state_location ? `, ${selected.state_location}` : ''}
                                </div>
                            </div>
                        </div>
                        <button className="slu-continue-btn" onClick={handleContinue}>
                            Continue to Student Subscription →
                        </button>
                        <p className="slu-confirm-note">
                            Not your school? Click a different result above.
                        </p>
                    </div>
                )}

            </main>
        </div>
    );
}
