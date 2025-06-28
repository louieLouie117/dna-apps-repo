import React from 'react';
import Backgound from '../assets/img/AllAppAccess.png'; // Assuming this is the correct path to your image
import PageHeader from '../components/PageHeader';
import StripePaymentCard from '../assets/img/StripePaymentCard.png'; // Adjust the path as needed
import AppLogosFooter from '../components/AppLogosFooter'; // Import the new component

const StudentSub = () => {
    return (
         <div className='student-sub-page'>
            <header>
            <PageHeader />

            </header>
            <h1>Membership/Subscription</h1>
            <main>
                <img src={Backgound} alt="Description of image" />
                <div>
                     <h2>All App Access</h2>
                <p>Enjoy full access instantly to all apps with all the benefits of new updates, app privacy, no in-app purchases, and no advertisements.</p>

                </div>
               

            </main>
            <div>
                <aside>
                <h3>Single App Access</h3>

                <div>

                     <ul>
                        <li>My Flashcards</li>
                      
                    </ul>
                    <footer>
                      <a href="https://buy.stripe.com/aFaaEWfCYeSOelX1pGeIw01">
                <button className='main-btn'>Subscribe</button>
                </a>
                
                <a href="https://stripe.com/" target='_blank' rel="noopener noreferrer">
                <img src={StripePaymentCard} alt="" />

                </a>
                <p>$1.00/m billed annually.</p>
        </footer>

                </div>
              

            </aside>
             <aside>
                <h3 className='mainSale'>All App Access</h3>
                <div>
                    <ul>
                        <li>My Flashcards</li>
                        <li>My To-do List</li>
                        <li>My Monthly Budget</li>
                        <li>My Locked Passwords​</li>
                        <li>My Receipts</li>
                        <li>My PenCal</li>
                        <li>+Any future app released</li>
                    </ul>

                    <footer>
                      <a href="https://buy.stripe.com/00w8wO3UgeSOgu52tKeIw02">
                <button className='main-btn'>Subscribe</button>
                </a>
                
                <a href="https://stripe.com/" target='_blank' rel="noopener noreferrer">
                <img src={StripePaymentCard} alt="" />

                </a>
                <p>$2.99/month.</p>
        </footer>

                </div>
              

            </aside>
             <aside>
                <h3>Triple App Acess</h3>
                <div>
                <ul>
                        <li>My Flashcards</li>
                        <li>My To-do List</li>
                        <li>My Monthly Budget</li>
                     
                    </ul>
                    <footer>
                      <a href="https://buy.stripe.com/00wbJ0cqM11Y2Df5FWeIw03">
                <button className='main-btn'>Subscribe</button>
                </a>
                
                <a href="https://stripe.com/" target='_blank' rel="noopener noreferrer">
                <img src={StripePaymentCard} alt="" />

                </a>
                <p>$1.30/m billed annually.</p>

            </footer>
                </div>
              

            </aside>


            </div>
            
            <AppLogosFooter /> {/* Use the new component here */}
        </div>
    );
};

export default StudentSub;