import React from 'react';
import { Card, CardContent, Typography, CardActions, IconButton, Button } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';

const CampaignCard = ({ campaign, onClick, onEditClick, onDeleteClick }) => {
  return (
    <Card style={{ position: 'relative' }}>
      <CardContent onClick={() => onClick(campaign.id)} style={{ cursor: 'pointer' }}>
        <Typography variant="h5" component="div">
          {campaign.name}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          {campaign.description}
        </Typography>
        <Typography variant="body2" color="textSecondary" style={{ marginTop: 10 }}>
          <strong>Start Date:</strong> {new Date(campaign.start_date).toLocaleDateString()}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          <strong>End Date:</strong> {new Date(campaign.end_date).toLocaleDateString()}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          <strong>Budget:</strong> ${campaign.budget}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small" onClick={(e) => { e.stopPropagation(); onClick(campaign.id); }}>
          View Details
        </Button>
      </CardActions>
      <div style={{ position: 'absolute', top: 10, right: 10 }}>
        <IconButton onClick={(e) => { e.stopPropagation(); onEditClick(campaign); }} aria-label="edit">
          <Edit />
        </IconButton>
        <IconButton onClick={(e) => { e.stopPropagation(); onDeleteClick(campaign); }} aria-label="delete">
          <Delete />
        </IconButton>
      </div>
    </Card>
  );
};

export default CampaignCard;
