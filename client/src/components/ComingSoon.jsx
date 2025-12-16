import React from 'react';
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
                    <ul>
                        <li className="app-item app-budget">
                            <h2>My Budget Monthly</h2>
                            <div className="app-logo">
                                <img src={AppLogoBudget} alt="My Budget Monthly App Logo" />
                            </div>
                            <div className="qr-code-container">
                                <img src={QrMybudget} alt="My Budget Monthly QR Code" />
                            </div>
                            <p>Scan to use app on your phone.</p>
                        </li>
                        <li className="app-item app-flashcards">
                            <h2>My Flashcards</h2>
                             <div className="app-logo">
                                <img src={AppLogoFlashcards} alt="My Flashcards App Logo" />
                            </div>
                            <div className="qr-code-container">
                                <img src={QrFlashcards} alt="My Flashcards QR Code" />
                            </div>
                            <p>Scan to use app on your phone.</p>
                        </li>
                        
                        <li className="app-item app-todo-list">
                            <h2>My Todo List</h2>
                             <div className="app-logo">
                                <img src={AppLogoTodoList} alt="My Todo List App Logo" />
                            </div>
                            <div className="qr-code-container">
                                <img src={QrTodoList} alt="My Todo List QR Code" />
                            </div>
                            <p>Scan to use app on your phone.</p>
                        </li>
                        <li className="app-item app-lockedPasswords">
                            <h2>My Locked Passwords</h2>
                            <div className="app-logo">
                                <img src={AppLogoLockedPassword} alt="My Locked Passwords App Logo" />
                            </div>
                            <div className="qr-code-container">
                                <img src={QrLockedPassword} alt="My Locked Passwords QR Code" />
                            </div>
                            <p>Scan to use app on your phone.</p>
                        </li>
                    </ul>

                
                </div>
                
               
            </div>
        </div>
    );
};

export default ComingSoon;