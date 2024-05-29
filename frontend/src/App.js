import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import CampaignsPage from './pages/CampaignsPage';
import OffersPage from './pages/OffersPage';
import OfferDetailsPage from './pages/OfferDetailsPage';
import PublicOfferDetailsPage from './pages/PublicOfferDetailsPage';
import Login from './pages/Login'; // Импортируем компонент Login
import PrivateRoute from './components/PrivateRoute'; // Импортируем компонент PrivateRoute
import NavBar from './components/NavBar';

const App = () => {
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route exact path="/" element={<HomePage />} />
        <Route path="/login" element={<Login/>} />
          <Route path="/campaigns" element={<PrivateRoute><CampaignsPage /></PrivateRoute>}/>
        <Route path="/campaigns/:campaignId/offers" element={<OffersPage />} />
        <Route path="/offers/:offerId" element={<OfferDetailsPage />} />
        <Route path="/offers/:id/public" element={<PublicOfferDetailsPage />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
};

export default App;
