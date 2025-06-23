import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import LandingPage from './views/LandingPage'
import Footer from './components/Footer'
import StudentSub from './views/StudentSub'
import AccessSubPage from './views/AccessSubPage'
import Policy from './views/Policy'
import Terms from './views/Terms'
import supabase from './config/SupaBaseClient';


function App() {
  // Check if Supabase is initialized
  if (!supabase) {
    console.error('Supabase is not initialized. Please check your configuration.');
    return <div>Error: Supabase is not initialized.</div>;
  }
  return (
    
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/student-access-subscription" element={<StudentSub />} />
        <Route path="/all-app-access-subscription" element={<AccessSubPage />} />
        <Route path="/privacy-policy" element={<Policy />} />
        <Route path='/terms-of-service' element={<Terms />} />
      </Routes>
      <Footer />
    </Router>
  )
}

export default App
