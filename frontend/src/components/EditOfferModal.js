import React, { useState, useEffect } from 'react';
import { Modal, Box, TextField, Button, Typography, IconButton, Alert } from '@mui/material';
import { AddPhotoAlternate, Delete } from '@mui/icons-material';

const EditOfferModal = ({ open, handleClose, offer, handleSave }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [url, setUrl] = useState('');
  const [price, setPrice] = useState('');
  const [photos, setPhotos] = useState([]);
  const [existingPhotos, setExistingPhotos] = useState([]);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (offer) {
      setName(offer.name);
      setDescription(offer.description);
      setUrl(offer.url);
      setPrice(offer.price);
      const updatedPhotos = offer.photos.map(photo => ({
        ...photo,
        url: `${process.env.REACT_APP_API_BASE_URL}${photo.image}`
      }));
      setPhotos(updatedPhotos);
      setExistingPhotos(updatedPhotos.map(photo => photo.id));
    }
  }, [offer]);

  const handlePhotoChange = (e) => {
    if (e.target.files.length > 0) {
      const newPhotos = Array.from(e.target.files).map(file => ({
        file,
        url: URL.createObjectURL(file),
      }));
      setPhotos((prevPhotos) => [...prevPhotos, ...newPhotos].slice(0, 5)); // Limit to 5 photos
    }
  };

  const handlePhotoDelete = (index) => {
    const photoToDelete = photos[index];
    if (photoToDelete.id) {
      setExistingPhotos(existingPhotos.filter(photoId => photoId !== photoToDelete.id));
    }
    setPhotos((prevPhotos) => prevPhotos.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!name || !description || !price || photos.length === 0) {
      setError('Name, description, price, and at least one photo are required');
      return;
    }

    const updatedOffer = { ...offer, name, description, url, price, photos, existing_photos: existingPhotos };
    await handleSave(updatedOffer);
    setUpdateSuccess(true);
    setTimeout(() => {
      setUpdateSuccess(false);
    }, 3000); // Hide success message after 3 seconds
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={{ ...modalStyle }}>
        <TextField
          label="Name"
          variant="outlined"
          fullWidth
          margin="normal"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <TextField
          label="Description"
          variant="outlined"
          fullWidth
          margin="normal"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <TextField
          label="URL"
          variant="outlined"
          fullWidth
          margin="normal"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <TextField
          label="Price"
          variant="outlined"
          fullWidth
          margin="normal"
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />
        <Box mt={2}>
          <Typography variant="h6">Photos</Typography>
          <input
            accept="image/*"
            style={{ display: 'none' }}
            id="upload-photo"
            multiple
            type="file"
            onChange={handlePhotoChange}
            required
          />
          <label htmlFor="upload-photo">
            <Button
              variant="contained"
              color="primary"
              component="span"
              startIcon={<AddPhotoAlternate />}
              disabled={photos.length >= 5} // Limit to 5 photos
            >
              Add Photos
            </Button>
          </label>
          <Box mt={2} display="flex" flexWrap="wrap" gap={2}>
            {photos.map((photo, index) => (
              <Box key={index} position="relative">
                <img src={photo.url} alt="offer" width="100" height="100" style={{ objectFit: 'cover' }} />
                <IconButton
                  size="small"
                  color="secondary"
                  onClick={() => handlePhotoDelete(index)}
                  style={{ position: 'absolute', top: 0, right: 0 }}
                >
                  <Delete />
                </IconButton>
              </Box>
            ))}
          </Box>
        </Box>
        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
        {updateSuccess && (
          <Alert severity="success" sx={{ mt: 2 }}>
            Data updated successfully!
          </Alert>
        )}
        <Box mt={2} display="flex" justifyContent="flex-end">
          <Button variant="contained" color="primary" onClick={handleSubmit} sx={{ mr: 2 }}>
            Save
          </Button>
          <Button variant="contained" color="secondary" onClick={handleClose}>
            Close
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default EditOfferModal;

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};
