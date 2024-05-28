import React, { useEffect, useState, useCallback } from 'react';
import { Container, Grid, Card, CardContent, Typography, CardActions, Button, TextField } from '@mui/material';
import UAParser from 'ua-parser-js';

const HomePage = () => {
  const [offers, setOffers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchOffers = useCallback(async () => {
    let url = `${process.env.REACT_APP_API_BASE_URL}/api/offers/?page=${page}`;

    if (searchQuery) {
      url += `&search=${searchQuery}`;
    }

    try {
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setOffers(data.results);
        setTotalPages(Math.ceil(data.count / 10));  // Assuming 10 items per page
      } else {
        console.error('Failed to fetch offers');
      }
    } catch (error) {
      console.error('Error fetching offers:', error);
    }
  }, [page, searchQuery]);

  useEffect(() => {
    fetchOffers();
  }, [fetchOffers]);

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
      <TextField
        label="Search"
        variant="outlined"
        fullWidth
        margin="normal"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
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
      <div style={{ marginTop: '20px' }}>
        <Button
          disabled={page <= 1}
          onClick={() => setPage(page - 1)}
        >
          Previous
        </Button>
        <span>Page {page} of {totalPages}</span>
        <Button
          disabled={page >= totalPages}
          onClick={() => setPage(page + 1)}
        >
          Next
        </Button>
      </div>
    </Container>
  );
};

export default HomePage;
