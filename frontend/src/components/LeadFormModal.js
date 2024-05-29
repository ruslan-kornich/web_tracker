import React, { useState } from 'react';
import { Modal, Box, Typography, TextField, Button, Alert } from '@mui/material';

const LeadFormModal = ({ isModalOpen, handleModalClose, offerId }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleFormSubmit = async () => {
    if (!fullName || !email) {
      setError('Full Name and Email are required.');
      return;
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/leads/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          offer: offerId,
          full_name: fullName,
          email,
          phone,
          notes,
        }),
      });
      if (response.status === 201) {
        setMessage('Thank you for your purchase! We will contact you soon.');
        setError('');
      } else {
        setMessage('Failed to create lead.');
      }
    } catch (error) {
      console.error('Error creating lead:', error);
      setMessage('Error creating lead.');
    }
  };

  return (
    <Modal open={isModalOpen} onClose={handleModalClose}>
      <Box sx={{ ...style, width: 400 }}>
        {!message ? (
          <>
            <Typography variant="h6" component="h2">
              Enter Your Details
            </Typography>
            {error && <Alert severity="error">{error}</Alert>}
            <TextField
              label="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="Phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              fullWidth
              margin="normal"
            />
            <Button onClick={handleFormSubmit} variant="contained" color="primary">
              Submit
            </Button>
          </>
        ) : (
          <>
            <Typography variant="h6" component="h2">
              {message}
            </Typography>
            <Button onClick={handleModalClose} variant="contained" color="primary">
              Close
            </Button>
          </>
        )}
      </Box>
    </Modal>
  );
};

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};

export default LeadFormModal;
