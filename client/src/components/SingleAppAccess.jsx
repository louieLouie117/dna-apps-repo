import React from 'react';
import './ComingSoon.css';
import './SingleAppAccess.css';
import AppLogoBudget from '../assets/AppLogos/app-logo-budget.png';
import QrMybudget from '../assets/QrCodes/qrcode_mybudget.png';

import AppLogoLockedPassword from '../assets/AppLogos/app-logo-lockedpasswords.png';
import QrLockedPassword from '../assets/QrCodes/qrcode_mylockedpasswords.png';

import AppLogoFlashcards from '../assets/AppLogos/app-logo-flashcards.png';
import QrFlashcards from '../assets/QrCodes/qrcode_myflashcards.png';

import AppLogoTodoList from '../assets/AppLogos/app-logo-todolist.png';
import QrTodoList from '../assets/QrCodes/qrcode_mytodolist.png';

const apps = [
    {
        id: 0,
        name: 'My Budget Monthly',
        logo: AppLogoBudget,
        qrCode: QrMybudget,
        className: 'app-budget',
        stripeUrl: 'https://buy.stripe.com/9B6dR862oh0W3Hj4BSeIw07',
        storeUrl: 'https://apps.microsoft.com/detail/9pmzc1nvwk02?hl=en-US&gl=US',
    },
    {
        id: 1,
        name: 'My Todo List',
        logo: AppLogoTodoList,
        qrCode: QrTodoList,
        className: 'app-todo-list',
        stripeUrl: 'https://buy.stripe.com/4gMdR80I4262a5H9WceIw0b',
        storeUrl: 'https://apps.microsoft.com/detail/9nblggh318dq?hl=en-US&gl=US',
    },
    {
        id: 2,
        name: 'My Flashcards',
        logo: AppLogoFlashcards,
        qrCode: QrFlashcards,
        className: 'app-flashcards',
        stripeUrl: 'https://buy.stripe.com/aFa8wOfCY9yub9L8S8eIw0a',
        storeUrl: 'https://apps.microsoft.com/detail/9wzdncrdsnzk?hl=en-US&gl=US',
    },
    {
        id: 3,
        name: 'My Locked Passwords',
        logo: AppLogoLockedPassword,
        qrCode: QrLockedPassword,
        className: 'app-lockedPasswords',
        stripeUrl: 'https://buy.stripe.com/aFa6oG76sdOKgu57O4eIw09',
        storeUrl: 'https://apps.microsoft.com/detail/9nblggh3tktw?hl=en-US&gl=US',
    },
];

const SingleAppAccess = () => {
    return (
        <div className="coming-soon-container">
            <div className="abstract-shape-2"></div>
            <div className="abstract-shape-3"></div>

            <div className="coming-soon-content">
                <h1 className="coming-soon-title">Single App Access</h1>

                <div className="apps-container">
                    <h2>Pick the App You Need</h2>
                    <div className="apps-grid">
                        {apps.map((app) => (
                            <div key={app.id} className={`app-card ${app.className}`}>
                                <div className="app-header">
                                    <h3 className="app-name">{app.name}</h3>
                                    <div className="app-logo">
                                        <img src={app.logo} alt={`${app.name} logo`} />
                                    </div>
                                    <a
                                        href={app.stripeUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="saa-get-btn-link"
                                    >
                                        <button className="saa-get-btn">Get This App</button>
                                    </a>
                                    <a
                                        href={app.storeUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="saa-details-btn-link"
                                        onClick={() => window.gtag?.('event', 'button_click', { button_name: `View App Details - ${app.name}` })}
                                    >
                                        <button className="saa-details-btn">View App Details</button>
                                    </a>
                                </div>

                                <div className="qr-section">
                                    <div className="qr-code">
                                        <img src={app.qrCode} alt={`${app.name} QR code`} />
                                    </div>
                                    <p className="qr-instruction">Scan QR code to use on your phone.</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SingleAppAccess;
