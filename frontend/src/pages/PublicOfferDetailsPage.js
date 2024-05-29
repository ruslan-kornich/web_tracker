import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Card, CardContent, Typography, Button } from '@mui/material';
import LeadFormModal from '../components/LeadFormModal';

const PublicOfferDetailsPage = () => {
  const { id } = useParams();
  const [offer, setOffer] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchOffer = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/public_offers/${id}/`);
        const data = await response.json();
        setOffer(data);
      } catch (error) {
        console.error('Error fetching offer:', error);
      }
    };

    fetchOffer();
  }, [id]);

  const handleBuyClick = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  if (!offer) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Container>
      <Card>
        <CardContent>
          <Typography variant="h5" component="div">
            {offer.name}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {offer.description}
          </Typography>
          <Typography variant="body2" color="textSecondary" style={{ marginTop: 10 }}>
            <strong>URL:</strong> <a href={offer.url} target="_blank" rel="noopener noreferrer">{offer.url}</a>
          </Typography>
          <Typography variant="body2" color="textSecondary">
            <strong>Created At:</strong> {new Date(offer.created_at).toLocaleDateString()}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            <strong>Updated At:</strong> {new Date(offer.updated_at).toLocaleDateString()}
          </Typography>
        </CardContent>
        <Button size="large" onClick={handleBuyClick}>
          Buy
        </Button>
      </Card>
      <LeadFormModal isModalOpen={isModalOpen} handleModalClose={handleModalClose} offerId={offer.id} />
    </Container>
  );
};

export default PublicOfferDetailsPage;
