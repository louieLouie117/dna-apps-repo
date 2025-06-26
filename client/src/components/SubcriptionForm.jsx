import { useState } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { useNavigate } from 'react-router-dom';



const SubcriptionForm = () => {
   
  
  const navigate = useNavigate();
    const [email, setEmail] = useState('');

  const stripe = useStripe();
  const elements = useElements();
  const [fullName, setFullName] = useState('');
  const [billingAddress, setBillingAddress] = useState({
    street: '',
    city: '',
    state: '',
    zip: '',
  });
  const [subButton, setSubButton] = useState('Subscribe');
  const [error, setError] = useState(null);
  const [isCardComplete, setIsCardComplete] = useState(true);

  const handleCardChange = (event) => {
    setIsCardComplete(event.complete);
  };
  const handleSubscription = async (e) => {
    e.preventDefault();
    alert('Subscription handler was called');
    if (!email || !fullName || !billingAddress.street || !billingAddress.city || !billingAddress.state || !billingAddress.zip) {
      setError('Please fill in all fields.');
      return;
    }


    setSubButton('Processing Subscription...');
    setError(null);

    if (!stripe || !elements) return;
    const cardElement = elements.getElement(CardElement);

    try {
      // Step 1: Create a Stripe Customer
      const customerResponse = await fetch('https://api.stripe.com/v1/customers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Bearer ${import.meta.env.VITE_STRIPE_SECRET_KEY}`,
      },
      body: new URLSearchParams({ email: email }),
      });

      const customerData = await customerResponse.json();
      console.log('Customer Created:', customerData);

      if (customerData.error) {
      throw new Error(customerData.error.message);
      }

      const customerId = customerData.id;

      // Step 2: Create a PaymentMethod
      const { error: pmError, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: cardElement,
      billing_details: {
        email: email,
        name: fullName,
        address: {
        line1: billingAddress.street,
        city: billingAddress.city,
        state: billingAddress.state,
        postal_code: billingAddress.zip,
        country: 'US',
        },
      },
      });

      if (pmError) {
      throw new Error(pmError.message);
      }

      console.log('PaymentMethod:', paymentMethod);

      // Step 3: Attach the PaymentMethod to the Customer
      const attachResponse = await fetch(`https://api.stripe.com/v1/payment_methods/${paymentMethod.id}/attach`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Bearer ${import.meta.env.VITE_STRIPE_SECRET_KEY}`,
      },
      body: new URLSearchParams({
        customer: customerId,
      }),
      });

      const attachData = await attachResponse.json();
      if (attachData.error) {
      throw new Error(attachData.error.message);
      }

      console.log('Payment Method Attached:', attachData);

      // Step 4: Create the Subscription
      const subscriptionResponse = await fetch('https://api.stripe.com/v1/subscriptions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Bearer ${import.meta.env.VITE_STRIPE_SECRET_KEY}`,
      },
      body: new URLSearchParams({
        customer: customerId,
        'items[0][price]': 'price_1RXhv2PkoLXDYzUahIq3DfZS',
        'items[0][quantity]': '1',
        default_payment_method: paymentMethod.id,
      }),
      });

      const subscriptionData = await subscriptionResponse.json();
      console.log('Subscription Created:', subscriptionData);

      if (subscriptionData.error) {
        throw new Error(subscriptionData.error.message);
      }

      if (subscriptionData.status === 'active') {
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Error during subscription:', error);
      setError(error.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setSubButton('Subscribe');
    }
  };

  return (
    <div className='strip-subcription-form'>
        
      {error && <p>{error}</p>}
      <form onSubmit={handleSubscription}>
         <input
    type="email"
    placeholder="Email"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
    required
  />
      
      <h2>Payment Information</h2>

  <div className='border'>
        <CardElement onChange={handleCardChange} />

        </div>
         <input
          type="text"
          placeholder="Full Name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
        />
        <h2>Billing Address</h2>
        <input
          type="text"
          placeholder="Street Address"
          value={billingAddress.street}
          onChange={(e) => setBillingAddress({ ...billingAddress, street: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="City"
          value={billingAddress.city}
          onChange={(e) => setBillingAddress({ ...billingAddress, city: e.target.value })}
          required
        />
        <select
          value={billingAddress.state}
          onChange={(e) => setBillingAddress({ ...billingAddress, state: e.target.value })}
          required
        >
          <option value="" disabled>
            Select State
          </option>
          <option value="AL">AL</option>
          <option value="AK">AK</option>
          <option value="AZ">AZ</option>
          <option value="AR">AR</option>
          <option value="CA">CA</option>
          <option value="CO">CO</option>
          <option value="CT">CT</option>
          <option value="DE">DE</option>
          <option value="FL">FL</option>
          <option value="GA">GA</option>
          <option value="HI">HI</option>
          <option value="ID">ID</option>
          <option value="IL">IL</option>
          <option value="IN">IN</option>
          <option value="IA">IA</option>
          <option value="KS">KS</option>
          <option value="KY">KY</option>
          <option value="LA">LA</option>
          <option value="ME">ME</option>
          <option value="MD">MD</option>
          <option value="MA">MA</option>
          <option value="MI">MI</option>
          <option value="MN">MN</option>
          <option value="MS">MS</option>
          <option value="MO">MO</option>
          <option value="MT">MT</option>
          <option value="NE">NE</option>
          <option value="NV">NV</option>
          <option value="NH">NH</option>
          <option value="NJ">NJ</option>
          <option value="NM">NM</option>
          <option value="NY">NY</option>
          <option value="NC">NC</option>
          <option value="ND">ND</option>
          <option value="OH">OH</option>
          <option value="OK">OK</option>
          <option value="OR">OR</option>
          <option value="PA">PA</option>
          <option value="RI">RI</option>
          <option value="SC">SC</option>
          <option value="SD">SD</option>
          <option value="TN">TN</option>
          <option value="TX">TX</option>
          <option value="UT">UT</option>
          <option value="VT">VT</option>
          <option value="VA">VA</option>
          <option value="WA">WA</option>
          <option value="WV">WV</option>
          <option value="WI">WI</option>
          <option value="WY">WY</option>
        </select>
        <input
          type="text"
          placeholder="ZIP Code"
          value={billingAddress.zip}
          onChange={(e) => setBillingAddress({ ...billingAddress, zip: e.target.value })}
          required
        />
        <button className="mainBTN" type="submit" disabled={!stripe || !isCardComplete}>
          {subButton}
        </button>
      </form>
      </div>
  );
};

export default SubcriptionForm;