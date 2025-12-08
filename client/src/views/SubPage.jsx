import {useState} from 'react';
import Backgound from '../assets/img/AllAppAccess.png'; // Assuming this is the correct path to your image
import PageHeader from '../components/PageHeader';
import StripePaymentCard from '../assets/img/StripePaymentCard.png'; // Adjust the path as needed
import AppLogosFooter from '../components/AppLogosFooter'; // Import the new component
import PayPalLog from '../assets/img/sPayPal.png'; // Assuming you have a PayPal logo image


const StudentSub = () => {
const [isOn, setIsOn] = useState(true);

    const handleToggle = () => {
        setIsOn(prev => {
            const newState = !prev;
            console.log(`button was changed to ${newState ? 'on' : 'off'}`);
            return newState;
        });
    };

    return (
         <div className='student-sub-page'>
            <header>
            <PageHeader />

            </header>
            <h1>Membership/Subscription</h1>
            <main>
                <img src={Backgound} alt="Description of image" />
                <div>
                     <h2>App Access</h2>
                
                </div>
               

            </main>
            <div>
                <aside>
                <h3>Single App Access</h3>

                <div>
                    <select style={{
                        width: '100%',
                        padding: '10px',
                        fontSize: '16px',
                        borderRadius: '5px',
                        border: '2px solid #ddd',
                        backgroundColor: '#f9f9f9',
                        marginBottom: '20px'
                    }}>
                        <option value="">Select an app</option>
                        <option value="MyBudgetMonthly">My Budget Monthly - $5.99/month</option>
                        <option value="MyLockedPasswords">My Locked Passwords - $5.99/month</option>
                        <option value="MyFlashcards">My Flashcards - $5.99/month</option>
                        <option value="MyTodoList">My Todo List - $5.99/month</option>
                    </select>
                     {isOn ? (
                    <footer>
                            <a href="https://buy.stripe.com/aFaaEWfCYeSOelX1pGeIw01">
                        <button className='main-btn'>Subscribe</button>
                        </a>
                        
                        <a href="https://stripe.com/" target='_blank' rel="noopener noreferrer">
                        <img src={StripePaymentCard} alt="" />
                        </a>
                        <p>$5.99/month.</p>

                </footer>
                        ) : (
                            <>
                            <form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_top">
                            <input type="hidden" name="cmd" value="_s-xclick" />
                            <input type="hidden" name="hosted_button_id" value="3QAJPKNCNE6Q8" />
                            <input type="image" src="https://www.paypalobjects.com/en_US/i/btn/btn_subscribeCC_LG.gif" border="0" name="submit" alt="PayPal - The safer, easier way to pay online!" />
                            <img alt="" border="0" src="https://www.paypalobjects.com/en_US/i/scr/pixel.gif" width="1" height="1" />
                            </form>
                             <a href="https://paypal.com/" target='_blank' rel="noopener noreferrer">
                                <img src={PayPalLog} alt="PayPal" />
                            </a>
                        <p>$1.00/m billed annually.</p>

                            </>
                        )}

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
                        <li>My PenCal</li>
                        <li>+Any future app released</li>
                    </ul>

                    {isOn ? (
                    <footer>
                      <a href="https://buy.stripe.com/00w8wO3UgeSOgu52tKeIw02">
                <button className='main-btn'>Subscribe</button>
                </a>
                
                <a href="https://stripe.com/" target='_blank' rel="noopener noreferrer">
                <img src={StripePaymentCard} alt="" />

                </a>
                <p>$8.99/month.</p>
        </footer>
        ) : (
                            <>
                          <form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_top">
                        <input type="hidden" name="cmd" value="_s-xclick" />
                        <input type="hidden" name="hosted_button_id" value="NWLM7RBYBU2QS" />
                        <input type="image" src="https://www.paypalobjects.com/en_US/i/btn/btn_subscribeCC_LG.gif" border="0" name="submit" alt="PayPal - The safer, easier way to pay online!" />
                        <img alt="" border="0" src="https://www.paypalobjects.com/en_US/i/scr/pixel.gif" width="1" height="1" />
                            </form>
                             <a href="https://paypal.com/" target='_blank' rel="noopener noreferrer">
                                <img src={PayPalLog} alt="PayPal" />
                            </a>
                                       <p>$5.99/month.</p>


                            </>
                        )}


                </div>
              

            </aside>
            
           


            </div>
              {/* <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '-100px', columnGap: '10px', marginBottom: '20px' }}>
                   <p>
            {isOn
                ? "Current payment method: Stripe — switch to PayPal"
                : "Current payment method: PayPal — switch to Stripe"}
            </p>


                <button
                    onClick={handleToggle}
                    style={{
                        width: '40px',
                        height: '24px',
                        borderRadius: '12px',
                        background: isOn ? '#FFC439' : '#0074D4',
                        border: 'none',
                        position: 'relative',
                        cursor: 'pointer',
                        outline: 'none',
                        display: 'inline-block',
                        verticalAlign: 'middle',
                        transition: 'background 0.2s'
                    }}
                    aria-label="Toggle switch"
                >
                    <span
                        style={{
                            display: 'block',
                            width: '18px',
                            height: '18px',
                            borderRadius: '50%',
                            background: '#fff',
                            position: 'absolute',
                            top: '3px',
                            left: isOn ? '19px' : '3px',
                            transition: 'left 0.2s'
                        }}
                    />
                </button>
            </div> */}
            
            <AppLogosFooter /> {/* Use the new component here */}
        </div>
    );
};

export default StudentSub;