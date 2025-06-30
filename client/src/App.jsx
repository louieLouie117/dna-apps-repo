import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import LandingPage from './views/LandingPage'
import Footer from './components/Footer'
import StudentSub from './views/StudentSub'
import AccessSubPage from './views/AccessSubPage'
import Policy from './views/Policy'
import Terms from './views/Terms'
import supabase from './config/SupaBaseClient';
import NewUserForm from './components/NewUserForm';
import SubcriptionForm from './components/SubcriptionForm';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import UserDashboard from './views/UserDashboard';
import SignIn from './components/SignIn';
import ContactUs from './components/ContactUs';


function App() {
  // Check if Supabase is initialized
  if (!supabase) {
    console.error('Supabase is not initialized. Please check your configuration.');
    return <div>Error: Supabase is not initialized.</div>;
  }


  const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/student-access-subscription" element={<StudentSub />} />
        <Route path="/all-app-access-subscription" element={<AccessSubPage />} />
        <Route path="/privacy-policy" element={<Policy />} />
        <Route path='/terms-of-service' element={<Terms />} />
        <Route path='/all-app-access-account' element={<NewUserForm />} />
        <Route path='/user-dashboard' element={<UserDashboard />} />
        <Route path='/sign-in' element={<SignIn />} />
        <Route path='/contact-us-1.html' element={<ContactUs />} />
        <Route
          path="/subcription-all-app-access"
          element={
            <Elements stripe={stripePromise}>
              <SubcriptionForm />
            </Elements>
          }
        />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App
