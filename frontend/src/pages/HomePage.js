import React, { useEffect, useState } from 'react';
import { Container, Grid, Card, CardContent, Typography, CardActions, Button } from '@mui/material';
import UAParser from 'ua-parser-js';

const HomePage = () => {
  const [offers, setOffers] = useState([]);

  useEffect(() => {
    fetchOffers();
  }, []);

  const fetchOffers = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/offers`);
      if (response.ok) {
        const data = await response.json();
        setOffers(data.results);
      } else {
        console.error('Failed to fetch offers');
      }
    } catch (error) {
      console.error('Error fetching offers:', error);
    }
  };

  const handleOfferClick = (offer) => {
    const parser = new UAParser();
    const result = parser.getResult();

    const clickData = {
      offer: offer.id,
      landing_page_url: offer.url,
      user_agent: result.ua,
      os: result.os.name,
      browser: result.browser.name,
    };

    fetch(`${process.env.REACT_APP_API_BASE_URL}/api/clicks/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(clickData),
    }).then(response => {
      if (response.ok) {
        window.location.href = offer.url;
      } else {
        console.error('Failed to track click');
      }
    }).catch(error => {
      console.error('Error tracking click:', error);
    });
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Available Offers
      </Typography>
      <Grid container spacing={3}>
        {Array.isArray(offers) && offers.length > 0 ? (
          offers.map(offer => (
            <Grid item key={offer.id} xs={12} sm={6} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h5" component="div">
                    {offer.name}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {offer.description}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button
                    size="small"
                    onClick={() => handleOfferClick(offer)}
                  >
                    Learn More
                  </Button>
                </CardActions>
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

export default HomePage;

