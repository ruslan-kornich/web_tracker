import React, { useState, useEffect } from 'react';
import { Modal, Box, TextField, Button, Typography } from '@mui/material';

const EditCampaignModal = ({ open, handleClose, campaign, handleSave }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [budget, setBudget] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (campaign) {
      console.log('Editing campaign:', campaign);
      setName(campaign.name);
      setDescription(campaign.description);
      setStartDate(campaign.start_date ? campaign.start_date.split('T')[0] : '');
      setEndDate(campaign.end_date ? campaign.end_date.split('T')[0] : '');
      setBudget(campaign.budget);
    }
  }, [campaign]);

  const handleSubmit = async () => {
    if (!name || !description || !startDate || !endDate || !budget) {
      setError('All fields are required');
      return;
    }

    const updatedCampaign = { ...campaign, name, description, start_date: startDate, end_date: endDate, budget };
    await handleSave(updatedCampaign);
    handleClose();
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
          Edit Campaign
        </Typography>
        {error && (
          <Typography color="error" gutterBottom>
            {error}
          </Typography>
        )}
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
          Save
        </Button>
      </Box>
    </Modal>
  );
};

export default EditCampaignModal;
