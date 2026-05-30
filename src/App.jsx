import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Admin = lazy(() => import('./pages/Admin'));
const AppPage = lazy(() => import('./pages/AppPageV2'));
const Auth = lazy(() => import('./pages/Auth'));
const BarberAuth = lazy(() => import('./pages/BarberAuth'));
const BarberDashboard = lazy(() => import('./pages/BarberDashboardV2'));
const BarberLogin = lazy(() => import('./pages/BarberLogin'));
const BarberProfile = lazy(() => import('./pages/BarberProfileV2'));
const Contact = lazy(() => import('./pages/Contact'));
const ForBarbers = lazy(() => import('./pages/ForBarbers'));
const HowItWorks = lazy(() => import('./pages/HowItWorks'));

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontSize: '1.2rem' }}>Loading Trimzy...</div>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/app" element={<AppPage />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/barber-auth" element={<BarberAuth />} />
          <Route path="/barber-dashboard" element={<BarberDashboard />} />
          <Route path="/barber-login" element={<BarberLogin />} />
          <Route path="/barber-profile" element={<BarberProfile />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/for-barbers" element={<ForBarbers />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
