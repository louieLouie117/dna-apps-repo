import React, { useState, useEffect } from 'react';
import './ComingSoon.css';
import AppLogoBudget from '../assets/AppLogos/app-logo-budget.png'; // Placeholder image path
import QrMybudget from '../assets/QrCodes/qrcode_mybudget.png'; // Placeholder image path

import AppLogoLockedPassword from '../assets/AppLogos/app-logo-lockedpasswords.png'; // Placeholder image path
import QrLockedPassword from '../assets/QrCodes/qrcode_mylockedpasswords.png'; // Placeholder image path

import AppLogoFlashcards from '../assets/AppLogos/app-logo-flashcards.png'; // Placeholder image path
import QrFlashcards from '../assets/QrCodes/qrcode_myflashcards.png'; // Placeholder image path

import AppLogoTodoList from '../assets/AppLogos/app-logo-todolist.png'; // Placeholder image path
import QrTodoList from '../assets/QrCodes/qrcode_mytodolist.png'; // Placeholder image path

const ComingSoon = () => {
    const [currentApp, setCurrentApp] = useState(0);
    
    const apps = [
        {
            id: 0,
            name: "My Budget Monthly",
            logo: AppLogoBudget,
            qrCode: QrMybudget,
            className: "app-budget"
        },
        {
            id: 1,
            name: "My Flashcards",
            logo: AppLogoFlashcards,
            qrCode: QrFlashcards,
            className: "app-flashcards"
        },
        {
            id: 2,
            name: "My Todo List",
            logo: AppLogoTodoList,
            qrCode: QrTodoList,
            className: "app-todo-list"
        },
        {
            id: 3,
            name: "My Locked Passwords",
            logo: AppLogoLockedPassword,
            qrCode: QrLockedPassword,
            className: "app-lockedPasswords"
        }
    ];

    // No additional functions needed - just click handling

    return (
        <div className="coming-soon-container">
            <div className="coming-soon-content">
                <h1 className="coming-soon-title">Mobile Apps Coming Soon!</h1>
                <p className="coming-soon-message">
                    Our mobile applications are currently in development and will be available soon.
                </p>
                <p className="coming-soon-subtitle">
                    Stay tuned! You'll be able to access our apps by scanning the QR code for each application.
                </p>

                <div className="apps-container">
                    {/* App Logos Grid */}
                    <div className="app-logos-grid">
                        {apps.map((app, index) => (
                            <div 
                                key={app.id} 
                                className={`app-logo-item ${app.className} ${index === currentApp ? 'active' : ''}`}
                                onClick={() => setCurrentApp(index)}
                            >
                                <img src={app.logo} alt={`${app.name} App Logo`} />
                                <h3>{app.name}</h3>
                                {/* render qr code img */}
                                <img src={app.qrCode} alt="" />
                            </div>
                        ))}
                    </div>

                   
                </div>
                
               
            </div>
        </div>
    );
};

export default ComingSoon;