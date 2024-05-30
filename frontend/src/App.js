import React from 'react';
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
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route exact path="/" element={<HomePage />} />
        <Route path="/login" element={<Login/>} />
         <Route path="/campaigns" element={<PrivateRoute><CampaignsPage /></PrivateRoute>}/>
        <Route path="/campaigns/:campaignId/offers" element={<PrivateRoute><OffersPage /></PrivateRoute>} />
        <Route path="/offers/:offerId" element={<PrivateRoute><OfferDetailsPage /></PrivateRoute>} />
        <Route path="/offers/:id/public" element={<PublicOfferDetailsPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
      </Routes>
    </Router>
  );
};

export default App;
