import {useState} from 'react';
import Backgound from '../assets/img/AllAppAccess.png'; // Assuming this is the correct path to your image
import PageHeader from '../components/PageHeader';
import StripePaymentCard from '../assets/img/StripePaymentCard.png'; // Adjust the path as needed


const SubPage = () => {
const [selectedApp, setSelectedApp] = useState('');

    // Mapping of apps to their Stripe subscription URLs
    const appSubscriptionUrls = {
        'MyBudgetMonthly': 'https://buy.stripe.com/9B6dR862oh0W3Hj4BSeIw07', // ready for production
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
                     <h2>App Access</h2>
                
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
                        {/* render pricing on selected item */}
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
                      <a href="https://buy.stripe.com/dRm7sK4YkdOK91Db0geIw06">
                <button className='main-btn'>Subscribe</button>
                </a>
                
                <a href="https://stripe.com/" target='_blank' rel="noopener noreferrer">
                <img src={StripePaymentCard} alt="" />

                </a>
                <p>$7.99/month.</p>
        </footer>
        
                         


                </div>
              

            </aside>
            
           


            </div>
           
            
        </div>
    );
};

export default SubPage;