import { useState, useEffect } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { useNavigate } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

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
  const [loading, setLoading] = useState(false);

  // State for showing/hiding forms
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [form, setForm] = useState({ email: '', password: '' });

    useEffect(() => {
    if (showPasswordForm) {
      const handleBeforeUnload = (e) => {
        e.preventDefault();
        e.returnValue = 'You must create your account before leaving this page, or you may lose access.';
        return e.returnValue;
      };
      window.addEventListener('beforeunload', handleBeforeUnload);
      return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }
  }, [showPasswordForm]);

  const handleCardChange = (event) => {
    setIsCardComplete(event.complete);
  };

  // Handle Stripe Subscription
  const handleSubscription = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    setSubButton('Processing Subscription...');
    setError(null);

    if (
      !email ||
      !fullName ||
      !billingAddress.street ||
      !billingAddress.city ||
      !billingAddress.state ||
      !billingAddress.zip
    ) {
      setError('Please fill in all fields.');
      setLoading(false);
      setSubButton('Subscribe');
      return;
    }

    if (!stripe || !elements) {
      setError('Stripe is not loaded.');
      setLoading(false);
      setSubButton('Subscribe');
      return;
    }
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
      if (customerData.error) throw new Error(customerData.error.message);
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
      if (pmError) throw new Error(pmError.message);

      // Step 3: Attach the PaymentMethod to the Customer
      const attachResponse = await fetch(
        `https://api.stripe.com/v1/payment_methods/${paymentMethod.id}/attach`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: `Bearer ${import.meta.env.VITE_STRIPE_SECRET_KEY}`,
          },
          body: new URLSearchParams({
            customer: customerId,
          }),
        }
      );
      const attachData = await attachResponse.json();
      if (attachData.error) throw new Error(attachData.error.message);

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
      if (subscriptionData.error) throw new Error(subscriptionData.error.message);

      if (subscriptionData.status === 'active') {
        // Hide Stripe form, show password form
        setShowPasswordForm(true);
        setForm({ email, password: '' });
      }
    } catch (error) {
      setError(error.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setSubButton('Subscribe');
      setLoading(false);
    }
  };

  // Handle Supabase Auth and Users table
  const handleSupabaseSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    const { email, password } = form;

    // 1. Sign up user with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      if (
        authError.message &&
        (authError.message.toLowerCase().includes('user already registered') ||
          authError.message.toLowerCase().includes('user already exists') ||
          (authError.message.toLowerCase().includes('account') && authError.message.toLowerCase().includes('exists')))
      ) {
        setMessage('Account already has been created. Please log in or contact support if you need assistance.');
      } else {
        setMessage(`Auth Error: ${authError.message} (${JSON.stringify(authError)})`);
      }
      setLoading(false);
      return;
    }

    // 2. Insert into Users table
    const { error: tableError } = await supabase
      .from('Users')
      .insert([{ email, password }]);

    if (tableError) {
      setMessage(`Table Error: ${tableError.message}`);
    } else {
      setMessage('User added successfully!');
      setForm({ email: '', password: '' });
      // Optionally, navigate or reset state here
      navigate('/dashboard');
    }
    setLoading(false);
  };

  return (
    <div className='strip-subcription-form'>
      {error && <p>{error}</p>}
      {!showPasswordForm ? (
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
            {/* ...state options... */}
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
          <button
            className="mainBTN"
            type="submit"
            disabled={!stripe || !isCardComplete || loading}
          >
            {subButton}
          </button>
        </form>
      ) : (
        
        <form onSubmit={handleSupabaseSignup}>
          <h2>Create Your Account</h2>
          <input
            type="email"
            placeholder="Email"
            value={form.email}
            readOnly
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
          <button className="mainBTN" type="submit" disabled={loading}>
            Create Account
          </button>
          {message && <p>{message}</p>}
        </form>
      )}
      {showPasswordForm && (
  <div style={{ background: '#fff3cd', color: '#856404', padding: '10px', marginBottom: '16px', borderRadius: '4px', border: '1px solid #ffeeba' }}>
    <strong>Important:</strong> You must create your account before leaving or refreshing this page.
  </div>
)}
    </div>
  );
};

export default SubcriptionForm;