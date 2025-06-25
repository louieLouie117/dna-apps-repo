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


function App() {
  // Check if Supabase is initialized
  if (!supabase) {
    console.error('Supabase is not initialized. Please check your configuration.');
    return <div>Error: Supabase is not initialized.</div>;
  }

  // Check if Stripe is working by attempting to load the Stripe publishable key from your config

  if (!import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY) {
    console.error('Stripe is not configured. Please check your environment variables.');
    return <div>Error: Stripe is not configured.</div>;
  }else
  {
    console.log('Stripe Publishable Key: Are working!');
  }
  
  return (
    
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/student-access-subscription" element={<StudentSub />} />
        <Route path="/all-app-access-subscription" element={<AccessSubPage />} />
        <Route path="/privacy-policy" element={<Policy />} />
        <Route path='/terms-of-service' element={<Terms />} />
        <Route path='/all-app-access-account' element={<NewUserForm />} />
      </Routes>
      <Footer />
    </Router>
  )
}

export default App
