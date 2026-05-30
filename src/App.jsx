import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import Admin from './pages/Admin';
import AppPage from './pages/AppPage';
import Auth from './pages/Auth';
import BarberAuth from './pages/BarberAuth';
import BarberDashboard from './pages/BarberDashboard';
import BarberLogin from './pages/BarberLogin';
import BarberProfile from './pages/BarberProfile';
import Contact from './pages/Contact';
import ForBarbers from './pages/ForBarbers';
import HowItWorks from './pages/HowItWorks';

function App() {
  return (
    <BrowserRouter>
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
    </BrowserRouter>
  );
}

export default App;
