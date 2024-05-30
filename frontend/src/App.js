import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import CampaignsPage from './pages/CampaignsPage';
import OffersPage from './pages/OffersPage';
import OfferDetailsPage from './pages/OfferDetailsPage';
import PublicOfferDetailsPage from './pages/PublicOfferDetailsPage';
import Login from './pages/Login';
import Logout from './pages/Logout';
import PrivateRoute from './components/PrivateRoute';
import NavBar from './components/NavBar';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  return (
    <Router>
      <NavBar isAuthenticated={isAuthenticated} />
      <Routes>
        <Route exact path="/" element={<HomePage />} />
        <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
        <Route path="/campaigns" element={<PrivateRoute isAuthenticated={isAuthenticated}><CampaignsPage /></PrivateRoute>} />
        <Route path="/campaigns/:campaignId/offers" element={<PrivateRoute isAuthenticated={isAuthenticated}><OffersPage /></PrivateRoute>} />
        <Route path="/offers/:offerId" element={<PrivateRoute isAuthenticated={isAuthenticated}><OfferDetailsPage /></PrivateRoute>} />
        <Route path="/offers/:id/public" element={<PublicOfferDetailsPage />} />
        <Route path="/logout" element={<Logout setIsAuthenticated={setIsAuthenticated} />} />
      </Routes>
    </Router>
  );
};

export default App;
