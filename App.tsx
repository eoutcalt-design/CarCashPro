
import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Deals from './pages/Deals';
import Pace from './pages/Pace';
import Monitor from './pages/Monitor';
import Profile from './pages/Profile';
import PayPlanScreen from './pages/PayPlan';
import Achievements from './pages/Achievements';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Goals from './pages/Goals';
import Settings from './pages/Settings';
import Landing from './pages/Landing';
import PrivacyPolicy from './pages/PrivacyPolicy';
import RefundPolicy from './pages/RefundPolicy';
import ReturnsPolicy from './pages/ReturnsPolicy';

// Auth Guard Component
const ProtectedRoutes = () => {
  const { user } = useApp();
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/deals" element={<Deals />} />
        <Route path="/pace" element={<Pace />} />
        <Route path="/monitor" element={<Monitor />} />
        <Route path="/profile" element={<Profile />} />
        
        {/* Sub Routes */}
        <Route path="/payplan" element={<PayPlanScreen />} />
        <Route path="/achievements" element={<Achievements />} />
        <Route path="/goals" element={<Goals />} />
        <Route path="/history" element={<Deals />} />
        <Route path="/settings" element={<Settings />} />
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
};

const PublicRoutes = () => {
    const { user } = useApp();
    
    // We allow access to legal pages even if logged in, handled by separate Route check in Main usually, 
    // but here we just put them in public. If user is logged in, they usually redirect to Dash.
    // However, legal pages should be accessible by everyone. 
    // The current router logic redirects logged-in users to "/" if they hit a public route.
    // We need to move legal routes OUTSIDE this check or make an exception.
    
    // Simplest fix: Keep legal routes in a separate group that doesn't redirect.
    return (
        <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/refund-policy" element={<RefundPolicy />} />
            <Route path="/returns-policy" element={<ReturnsPolicy />} />
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
};

const Main = () => {
    const { user } = useApp();
    // If we want legal pages to be viewable by logged in users too without redirecting to dashboard:
    // We can check the path, but HashRouter makes that tricky inside the component rendering the router.
    // For now, let's keep standard behavior: if logged in, you go to app. 
    // If you need legal pages while logged in, we can add them to protected routes too.
    
    // Actually, for Ad compliance, the bots are not logged in, so PublicRoutes is where they need to be.
    return user ? <ProtectedRoutes /> : <PublicRoutes />;
};

const App = () => {
  return (
    <AppProvider>
      <Router>
        <Main />
      </Router>
    </AppProvider>
  );
};

export default App;
