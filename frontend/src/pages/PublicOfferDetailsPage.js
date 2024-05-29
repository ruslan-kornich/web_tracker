import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Typography, Button } from '@mui/material';
import ImageGallery from 'react-image-gallery';
import 'react-image-gallery/styles/css/image-gallery.css';
import './PublicOfferDetailsPage.css';
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

  const images = offer.photos?.map((photo) => ({
    original: photo.image,
    thumbnail: photo.image,
  })) || [];

  return (
    <Container>
      <div className="offer-details">
        {images.length > 0 && (
          <div className="offer-gallery">
            <ImageGallery
              items={images}
              showThumbnails={true}
              showFullscreenButton={true}
              showPlayButton={false}
            />
          </div>
        )}
        <div className="offer-info">
          <Typography variant="h5" component="h5">
            {offer.name}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {offer.description}
          </Typography>
          <Typography variant="body2" color="textSecondary" className="price">
            Price: ${offer.price}
          </Typography>
          <Button size="large" onClick={handleBuyClick} className="buy-button">
            Buy
          </Button>
        </div>
      </div>
      <LeadFormModal isModalOpen={isModalOpen} handleModalClose={handleModalClose} offerId={offer.id} />
    </Container>
  );
};

export default PublicOfferDetailsPage;
