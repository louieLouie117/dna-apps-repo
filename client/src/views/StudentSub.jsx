import {useState} from 'react';
import Backgound from '../assets/img/AllAppAccess.png'; // Assuming this is the correct path to your image
import PageHeader from '../components/PageHeader';
import StripePaymentCard from '../assets/img/StripePaymentCard.png'; // Adjust the path as needed
import PayPalLog from '../assets/img/sPayPal.png'; // Assuming you have a PayPal logo image


const StudentSub = () => {
const [selectedApp, setSelectedApp] = useState('');

    // Mapping of apps to their Stripe subscription URLs
    const appSubscriptionUrls = {
        'MyBudgetMonthly': 'https://buy.stripe.com/budget-monthly-url',
        'MyLockedPasswords': 'https://buy.stripe.com/locked-passwords-url',
        'MyFlashcards': 'https://buy.stripe.com/flashcards-url',
        'MyTodoList': 'https://buy.stripe.com/todo-list-url'
    };

   

    const handleAppSelection = (event) => {
        setSelectedApp(event.target.value);
        console.log('Selected app:', event.target.value);
    };

    return (
         <div className='student-sub-page'>
            <header>
            <PageHeader />

            </header>
            <main>
                <img src={Backgound} alt="Description of image" />
                <div>
                     <h2>App Access for Students</h2>
                
                </div>
               

            </main>
            <div>
                <aside>
                <h3>Single App Access</h3>

                <div>
                    <select 
                        value={selectedApp}
                        onChange={handleAppSelection}
                        style={{
                        width: '100%',
                        padding: '10px',
                        fontSize: '16px',
                        borderRadius: '5px',
                        border: '2px solid #ddd',
                        backgroundColor: '#f9f9f9',
                        marginBottom: '20px'
                    }}>
                        <option value="">Select an app</option>
                        <option value="MyBudgetMonthly">My Budget Monthly - $3.99/month</option>
                        <option value="MyLockedPasswords">My Locked Passwords - $3.99/month</option>
                        <option value="MyFlashcards">My Flashcards - $3.99/month</option>
                        <option value="MyTodoList">My Todo List - $3.99/month</option>
                    </select>
                    <footer>
                            <a href={selectedApp ? appSubscriptionUrls[selectedApp] : '#'} 
                               onClick={(e) => {
                                   if (!selectedApp) {
                                       e.preventDefault();
                                       alert('Subscribe');
                                   }
                               }}>
                        <button 
                            className='main-btn' 
                            disabled={!selectedApp}
                            style={{
                                backgroundColor: selectedApp ? '#007bff' : '#ccc',
                                cursor: selectedApp ? 'pointer' : 'not-allowed',
                                opacity: selectedApp ? 1 : 0.6,
                                transition: 'all 0.3s ease'
                            }}
                        >
                            {selectedApp ? `Subscribe` : 'Subscribe'}
                        </button>
                        </a>
                        
                        <a href="https://stripe.com/" target='_blank' rel="noopener noreferrer">
                        <img src={StripePaymentCard} alt="" />
                        </a>
                    <p>{selectedApp ? '$3.99/month' : ''}</p>


                </footer>
                       
                </div>

              

            </aside>
             <aside>
                <h3 className='mainSale'>All App Access</h3>
                <div>
                    <ul>
                        <li>My To-do List</li>
                        <li>My Flashcards</li>
                        <li>My Monthly Budget</li>
                        <li>My Locked Passwords​</li>
                        <li>My PenCal</li>
                        <li>+Any future app released</li>
                    </ul>

                    <footer>
                      <a href="https://buy.stripe.com/dRm7sK4YkdOK91Db0geIw06?prefilled_promo_code=Student24MonthsOff">
                <button className='main-btn'>Subscribe</button>
                </a>
                
                <a href="https://stripe.com/" target='_blank' rel="noopener noreferrer">
                <img src={StripePaymentCard} alt="" />

                </a>
                <div style={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    borderRadius: '12px',
                    padding: '20px',
                    margin: '15px 0',
                    color: 'white',
                    position: 'relative',
                    overflow: 'hidden',
                    boxShadow: '0 8px 25px rgba(102, 126, 234, 0.3)'
                }}>
                    {/* Student Badge */}
                    <div style={{
                        position: 'absolute',
                        top: '7px',
                        right: '-5px',
                        background: '#ff6b6b',
                        color: 'white',
                        padding: '8px 16px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        transform: 'rotate(15deg)',
                        boxShadow: '0 4px 12px rgba(255, 107, 107, 0.4)'
                    }}>
                        🎓 STUDENT
                    </div>
                    
                    {/* Pricing Content */}
                    <div style={{ position: 'relative', zIndex: 2 }}>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            marginBottom: '8px'
                        }}>
                            <span style={{
                                fontSize: '28px',
                                fontWeight: 'bold',
                                color: '#ffd700'
                            }}>$4.99</span>
                            <span style={{
                                fontSize: '16px',
                                opacity: 0.9
                            }}>/month</span>
                            <span style={{
                                fontSize: '18px',
                                textDecoration: 'line-through',
                                opacity: 0.7,
                                color: '#ffcccb'
                            }}>$7.99</span>
                        </div>
                        
                        <div style={{
                            background: 'rgba(255, 255, 255, 0.15)',
                            borderRadius: '8px',
                            padding: '12px',
                            backdropFilter: 'blur(10px)',
                            border: '1px solid rgba(255, 255, 255, 0.2)'
                        }}>
                            <p style={{
                                margin: 0,
                                fontSize: '14px',
                                fontWeight: '500',
                                lineHeight: '1.4'
                            }}>
                                🎯 <strong>Student Discount:</strong> Save 37% for 24 months<br/>
                                {/* 💝 Use code: <code style={{
                                    background: 'rgba(255, 255, 255, 0.2)',
                                    padding: '2px 6px',
                                    borderRadius: '4px',
                                    fontWeight: 'bold'
                                }}>Student24MonthsOff</code> */}
                            </p>
                        </div>
                    </div>
                </div>
                

        </footer>
                        


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
            
        </div>
    );
};

export default StudentSub;