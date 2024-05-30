// src/pages/OffersPage.js
import React, { useEffect, useState, useCallback } from 'react';
import { Container, Typography, Grid, Card, CardContent } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';

const OffersPage = () => {
  const { campaignId } = useParams();
  const [offers, setOffers] = useState([]);
  const navigate = useNavigate();

  const fetchOffers = useCallback(async () => {
    try {
      const accessToken = localStorage.getItem('access_token');
      if (!accessToken) {
        throw new Error('Access token is missing');
      }

      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/campaigns/${campaignId}/offers`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.status === 401) {
        // Handle token refresh logic here if needed
        console.error('Unauthorized access. Token might be expired.');
        return;
      }

      const data = await response.json();
      setOffers(data);
    } catch (error) {
      console.error('Error fetching offers:', error);
    }
  }, [campaignId]);

  useEffect(() => {
    fetchOffers();
  }, [fetchOffers]);

  const handleOfferClick = (offerId) => {
    navigate(`/offers/${offerId}`);
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Offers
      </Typography>
      <Grid container spacing={3}>
        {Array.isArray(offers) && offers.length > 0 ? (
          offers.map((offer) => (
            <Grid item key={offer.id} xs={12} sm={6} md={4}>
              <Card onClick={() => handleOfferClick(offer.id)}>
                <CardContent>
                  <Typography variant="h6">{offer.name}</Typography>
                  <Typography>{offer.description}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : (
          <Typography variant="body1">No offers available</Typography>
        )}
      </Grid>
    </Container>
  );
};

export default OffersPage;
