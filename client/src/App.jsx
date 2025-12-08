import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import LandingPage from './views/LandingPage'
import Footer from './components/Footer'
import StudentSub from './views/StudentSub'
// import AccessSubPage from './views/AccessSubPage' //old all app access subscription page
import Policy from './views/Policy'
import Terms from './views/Terms'
import supabase from './config/SupaBaseClient';
// import NewUserForm from './components/NewUserForm';
import SubcriptionForm from './components/SubcriptionForm';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import UserDashboard from './views/UserDashboard';
import SignIn from './components/SignIn';
import ContactUs from './components/ContactUs';
import Unsubscribe from './components/Unsubscribe';
import GetUsers from './components/GetUsers';
import Wrapper from './views/Wrapper';
import AdminWrapper from './views/AdminWrapper';
import RegAllApps from './components/RegAllApps';
import DashboardAdmin from './views/DashboardAdmin'
import WrapperJWT from './views/WrapperJWT';
import DashboardUser from './views/DashboardUser'
import LoginTest from './components/LoginTest';
import RequestPasswordReset from './components/RequestPasswordReset';
import ConfirmPasswordReset from './components/ConfirmPasswordReset';
import SubPage from './views/SubPage';


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
        <Route path="/all-app-access-subscription" element={<SubPage />} />
        <Route path="/subscription" element={<SubPage />} />

        {/* new Sub url base on single app or sub  */}
        <Route path="/all-app-subscription" element={<RegAllApps />} />
        <Route path="/student-membership" element={<RegAllApps />} />
        <Route path="/budget-monthly" element={<RegAllApps />} />
        <Route path="/locked-passwords" element={<RegAllApps />} />
        <Route path="/flashcards" element={<RegAllApps />} />
        <Route path="/todo-list" element={<RegAllApps />} />



        <Route path="/privacy-policy.html" element={<Policy />} />
        <Route path='/terms-of-service.html' element={<Terms />} />

        {/* <Route path="/register-all-apps" element={<RegAllApps />} /> */}
        <Route path='/stripe-all-app-access-account' element={<RegAllApps />} />
        <Route path='/paypal-all-app-access-account' element={<RegAllApps />} />

     
        <Route path='/contact-us-1.html' element={<ContactUs />} />
        <Route path='/unsubscribe' element={<Unsubscribe />} />

        <Route path='/request-password-reset' element={<RequestPasswordReset />} />
        <Route path="/reset-password" element={<ConfirmPasswordReset />} />

        <Route path='/user-dashboard' element={
          <Wrapper>
            <UserDashboard />
          </Wrapper>
        } />

        <Route path='/dashboard' element={
          <WrapperJWT>
            <DashboardUser />
          </WrapperJWT>
        } />

        {/* login test */}
        <Route path='/login' element={
            <LoginTest />
        } />

           <Route path='/sign-in' element={
            <LoginTest />
         }
          />

          <Route path='/sign-in-old' element={
            <SignIn />
         }
          />

         <Route path='/get-users' element={
          <AdminWrapper>
            <GetUsers />
          </AdminWrapper>
        } />

          <Route path='/dashboard-admin-25' element={
          <AdminWrapper>
            <DashboardAdmin />
          </AdminWrapper>
        } />
    
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
