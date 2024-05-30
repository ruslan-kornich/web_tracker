import React, { useState } from 'react';
import { Modal, Box, TextField, Button, Typography } from '@mui/material';

const AddCampaignModal = ({ open, handleClose, handleAdd }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [budget, setBudget] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!name || !description || !startDate || !endDate || !budget) {
      setError('All fields are required');
      return;
    }

    const newCampaign = { name, description, start_date: startDate, end_date: endDate, budget };
    console.log('Collected Data:', newCampaign);

    const accessToken = localStorage.getItem('access_token');
    console.log('Access Token:', accessToken);

    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/campaigns/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(newCampaign),
      });

      console.log('Response Status:', response.status);

      if (response.ok) {
        const data = await response.json();
        console.log('Response Data:', data);
        handleAdd(data);
        setName('');
        setDescription('');
        setStartDate('');
        setEndDate('');
        setBudget('');
        setError('');
      } else {
        const errorData = await response.json();
        console.error('Error adding campaign:', errorData);
        setError('Failed to add campaign');
      }
    } catch (error) {
      console.error('Error adding campaign:', error);
      setError('Failed to add campaign');
    }
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        display="flex"
        flexDirection="column"
        p={3}
        bgcolor="background.paper"
        style={{
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          position: 'absolute',
          width: '500px',  // Увеличенная ширина модального окна
        }}
      >
        <Typography variant="h6" gutterBottom>
          Add Campaign
        </Typography>
        {error && (
          <Typography color="error" gutterBottom>
            {error}
          </Typography>
        )}
        <TextField
          label="Campaign Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          margin="normal"
          required
          fullWidth
        />
        <TextField
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          margin="normal"
          required
          fullWidth
        />
        <TextField
          label="Start Date"
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          margin="normal"
          required
          fullWidth
          InputLabelProps={{
            shrink: true,
          }}
        />
        <TextField
          label="End Date"
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          margin="normal"
          required
          fullWidth
          InputLabelProps={{
            shrink: true,
          }}
        />
        <TextField
          label="Budget"
          type="number"
          value={budget}
          onChange={(e) => setBudget(e.target.value)}
          margin="normal"
          required
          fullWidth
        />
        <Button variant="contained" color="primary" onClick={handleSubmit}>
          Add Campaign
        </Button>
      </Box>
    </Modal>
  );
};

export default AddCampaignModal;
