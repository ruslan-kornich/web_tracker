import React from 'react';
import { Modal, Box, Typography, Button } from '@mui/material';

const DeleteConfirmationModal = ({ open, handleClose, handleDelete }) => {
  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={{ ...modalStyle }}>
        <Typography variant="h6" gutterBottom>
          Are you sure you want to delete this campaign?
        </Typography>
        <Button variant="contained" color="secondary" onClick={handleDelete}>
          Yes
        </Button>
        <Button variant="contained" onClick={handleClose} sx={{ ml: 2 }}>
          No
        </Button>
      </Box>
    </Modal>
  );
};

export default DeleteConfirmationModal;

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
