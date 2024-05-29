// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import CampaignsPage from './pages/CampaignsPage';
import OffersPage from './pages/OffersPage';
import OfferDetailsPage from './pages/OfferDetailsPage';
import NavBar from './components/NavBar';
import PublicOfferDetailsPage from './pages/PublicOfferDetailsPage';
const App = () => {
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route exact path="/" element={<HomePage />} />
        <Route path="/campaigns" element={<CampaignsPage />} />
        <Route path="/campaigns/:campaignId/offers" element={<OffersPage />} />
        <Route path="/offers/:offerId" element={<OfferDetailsPage />} />
        <Route path="/offers/:id/public" element={<PublicOfferDetailsPage />} />
      </Routes>
    </Router>
  );
};

export default App;
