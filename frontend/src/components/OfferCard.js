import React from 'react';
import { Card, CardContent, Typography, CardActions, IconButton, Button, Box } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';

const OfferCard = ({ offer, onClick, onEditClick, onDeleteClick }) => {
  return (
    <Card style={{ position: 'relative' }}>
      <CardContent onClick={() => onClick(offer.id)} style={{ cursor: 'pointer' }}>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start">
          <Typography variant="h6" component="div" style={{ flex: 1 }}>
            {offer.name}
          </Typography>
          <Box>
            <IconButton onClick={(e) => { e.stopPropagation(); onEditClick(offer); }} aria-label="edit">
              <Edit />
            </IconButton>
            <IconButton onClick={(e) => { e.stopPropagation(); onDeleteClick(offer); }} aria-label="delete">
              <Delete />
            </IconButton>
          </Box>
        </Box>
        <Typography variant="body2" color="textSecondary" style={{ marginTop: 10 }}>
          {offer.description}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small" onClick={(e) => { e.stopPropagation(); onClick(offer.id); }}>
          View Details
        </Button>
      </CardActions>
    </Card>
  );
};

export default OfferCard;
