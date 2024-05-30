import React, { useState } from 'react';
import { Modal, Box, TextField, Button, Typography, IconButton, Alert } from '@mui/material';
import { AddPhotoAlternate, Delete } from '@mui/icons-material';

const AddOfferModal = ({ open, handleClose, handleSave, campaignId }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [url, setUrl] = useState('');
  const [price, setPrice] = useState('');
  const [photos, setPhotos] = useState([]);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [error, setError] = useState('');

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
    setPhotos((prevPhotos) => prevPhotos.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!name || !description || !price || photos.length === 0) {
      setError('Name, description, price, and at least one photo are required');
      return;
    }

    const newOffer = { name, description, url, price, photos, campaign: campaignId };
    await handleSave(newOffer);
    setUpdateSuccess(true);
    setTimeout(() => {
      setUpdateSuccess(false);
    }, 3000); // Hide success message after 3 seconds
    handleFormReset();
  };

  const handleFormReset = () => {
    setName('');
    setDescription('');
    setUrl('');
    setPrice('');
    setPhotos([]);
    setError('');
  };

  const handleCloseModal = () => {
    handleFormReset();
    handleClose();
  };

  return (
    <Modal open={open} onClose={handleCloseModal}>
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
          multiline
          rows={4}
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
            Offer added successfully!
          </Alert>
        )}
        <Box mt={2} display="flex" justifyContent="flex-end">
          <Button variant="contained" color="primary" onClick={handleSubmit} sx={{ mr: 2 }}>
            Save
          </Button>
          <Button variant="contained" color="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default AddOfferModal;

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
