import React, { useEffect, useState, useCallback } from 'react';
import { Container, Grid, Card, CardContent, Typography, CardActions, Button, TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';

const HomePage = () => {
  const [offers, setOffers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  const fetchOffers = useCallback(async () => {
    let url = `${process.env.REACT_APP_API_BASE_URL}/api/public_offers/?page=${page}`;

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

  const handleLearnMoreClick = (id) => {
    navigate(`/offers/${id}/public`);
  };

  const truncateDescription = (description, maxLength) => {
    if (description.length <= maxLength) {
      return description;
    }
    return description.substr(0, maxLength) + '...';
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
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
                  <Typography variant="h5" component="div" style={{ fontWeight: 'bold' }}>
                    {offer.name}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {truncateDescription(offer.description, 100)}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" style={{ marginTop: 10 }}>
                    <strong>Price:</strong> ${offer.price}
                  </Typography>
                  <Typography variant="caption" color="textSecondary" style={{ marginTop: 10 }}>
                    {formatDate(offer.updated_at)}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button
                    size="small"
                    onClick={() => handleLearnMoreClick(offer.id)}
                    style={{ color: 'white', backgroundColor: 'blue' }}
                  >
                    Read More
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))
        ) : (
          <div className="no-offers-container">
            <Typography variant="body1" className="no-offers-message">
              No offers available
            </Typography>
          </div>
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
