import React from 'react';
import { Card, CardContent, Typography, CardActions, Button } from '@mui/material';

const CampaignCard = ({ campaign, onClick }) => {
  return (
    <Card onClick={() => onClick(campaign.id)} style={{ cursor: 'pointer' }}>
      <CardContent>
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
    </Card>
  );
};

export default CampaignCard;
