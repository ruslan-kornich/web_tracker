import React, { useEffect, useState, useCallback } from 'react';
import { Container, Typography, Grid, Button } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import OfferCard from '../components/OfferCard';
import EditOfferModal from '../components/EditOfferModal';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal';
import AddOfferModal from '../components/AddOfferModal';

const OffersPage = () => {
  const { campaignId } = useParams();
  const [offers, setOffers] = useState([]);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState(null);
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

  const handleEditClick = (offer) => {
    setSelectedOffer(offer);
    setEditModalOpen(true);
  };

  const handleDeleteClick = (offer) => {
    setSelectedOffer(offer);
    setDeleteModalOpen(true);
  };

  const handleSave = async (offer, isNew) => {
    const accessToken = localStorage.getItem('access_token');
    const method = isNew ? 'POST' : 'PUT';
    const url = isNew
      ? `${process.env.REACT_APP_API_BASE_URL}/api/offers/`
      : `${process.env.REACT_APP_API_BASE_URL}/api/offers/${offer.id}/`;

    const formData = new FormData();
    formData.append('name', offer.name);
    formData.append('description', offer.description);
    formData.append('url', offer.url);
    formData.append('price', offer.price);
    formData.append('campaign', campaignId);
    if (offer.existing_photos) {
      formData.append('existing_photos', JSON.stringify(offer.existing_photos));
    }
    offer.photos.forEach((photo) => {
      if (photo.file) {
        formData.append('photo_files', photo.file);
      }
    });

    try {
      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: formData,
      });

      if (response.ok) {
        fetchOffers();
        if (isNew) {
          setAddModalOpen(false);
        } else {
          setEditModalOpen(false);
        }
      } else {
        console.error('Error saving offer');
      }
    } catch (error) {
      console.error('Error saving offer:', error);
    }
  };

  const handleDelete = async () => {
    const accessToken = localStorage.getItem('access_token');
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/offers/${selectedOffer.id}/`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.ok) {
        setOffers((prevOffers) => prevOffers.filter((offer) => offer.id !== selectedOffer.id));
        setDeleteModalOpen(false);
      } else {
        console.error('Error deleting offer');
      }
    } catch (error) {
      console.error('Error deleting offer:', error);
    }
  };

  const handleAddClick = () => {
    setAddModalOpen(true); // Открываем модалку добавления
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Offers
      </Typography>
      <Button variant="contained" color="primary" onClick={handleAddClick} style={{ marginBottom: '16px' }}>
        Add Offer
      </Button>
      <Grid container spacing={3}>
        {Array.isArray(offers) && offers.length > 0 ? (
          offers.map((offer) => (
            <Grid item key={offer.id} xs={12} sm={6} md={4}>
              <OfferCard
                offer={offer}
                onClick={handleOfferClick}
                onEditClick={handleEditClick}
                onDeleteClick={handleDeleteClick}
              />
            </Grid>
          ))
        ) : (
          <Typography variant="body1">No offers available</Typography>
        )}
      </Grid>
      <EditOfferModal
        open={editModalOpen}
        handleClose={() => setEditModalOpen(false)}
        offer={selectedOffer}
        handleSave={(offer) => handleSave(offer, false)}
      />
      <DeleteConfirmationModal
        open={deleteModalOpen}
        handleClose={() => setDeleteModalOpen(false)}
        handleDelete={handleDelete}
      />
      <AddOfferModal
        open={addModalOpen}
        handleClose={() => setAddModalOpen(false)}
        handleSave={(offer) => handleSave(offer, true)}
        campaignId={campaignId}
      />
    </Container>
  );
};

export default OffersPage;
