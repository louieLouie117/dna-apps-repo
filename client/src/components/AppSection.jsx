// import React from 'react';

// import FlashcardArt from "../assets/img/app-art/FlashcardArt.png";
import TodoListArtImg from "../assets/img/app-art/TodoListArt.png";
import LockPasswords from "../assets/img/app-art/LockPasswords.png";
import BudgetArt from "../assets/img/app-art/BudgetArt.png";
import PenCal from "../assets/img/app-art/PenCal.png";
// import ReceitTracker from "../assets/img/app-art/ReceitTracker.png";

const appItems = [
    // {
    //     src: FlashcardArt,
    //     alt: "Flashcards App",
    //     url: "https://apps.microsoft.com/detail/9wzdncrdsnzk?hl=en-US&gl=US",
    // },
    {
        src: TodoListArtImg,
        alt: "Todo List App",
        url: "https://apps.microsoft.com/detail/9nblggh318dq?hl=en-US&gl=US",
    },
    {
        src: LockPasswords,
        alt: "Lock Passwords App",
        url: "https://apps.microsoft.com/detail/9nblggh3tktw?hl=en-US&gl=US",
    },
    {
        src: BudgetArt,
        alt: "Budget App",
        url: "https://apps.microsoft.com/detail/9pmzc1nvwk02?hl=en-US&gl=US",
    },
    {
        src: PenCal,
        alt: "Pen Cal App",
        url: "https://apps.microsoft.com/detail/9nblggh2kbbk?hl=en-US&gl=US",
    },
    // {
    //     src: ReceitTracker,
    //     alt: "Receipt Tracker App",
    //     url: "https://apps.microsoft.com/detail/9nblggh4z5q3?hl=en-US&gl=US",
    // },

];




const AppSection = () => {
    return (
        <div className="app-container">
            {appItems.map((item, index) => (
                <div key={index} className="app-item">
                    <div className="image-container">
                        <img src={item.src} alt={item.alt} className="app-image" />
                    </div>
                    <a href={item.url} target="_blank" rel="noopener noreferrer" className="app-link">
                        <button>Learn More</button>
                    </a>
                </div>
            ))}
        </div>
    );
};


export default AppSection;