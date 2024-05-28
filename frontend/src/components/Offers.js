import React, { useEffect, useState } from 'react';
import { Container, Typography, Grid, Card, CardContent } from '@mui/material';
import { useParams, useHistory } from 'react-router-dom';

const Offers = () => {
  const { campaignId } = useParams();
  const [offers, setOffers] = useState([]);
  const history = useHistory();

  useEffect(() => {
    fetchOffers();
  }, [campaignId]);

  const fetchOffers = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/campaigns/${campaignId}/offers`);
      const data = await response.json();
      setOffers(data);
    } catch (error) {
      console.error('Error fetching offers:', error);
    }
  };

  const handleOfferClick = (offerId) => {
    history.push(`/offers/${offerId}`);
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Offers
      </Typography>
      <Grid container spacing={3}>
        {Array.isArray(offers) && offers.length > 0 ? (
          offers.map(offer => (
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

export default Offers;
