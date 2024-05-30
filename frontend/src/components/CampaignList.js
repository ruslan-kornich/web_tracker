import React from 'react';
import { Grid, Typography } from '@mui/material';
import CampaignCard from './CampaignCard';

const CampaignList = ({ campaigns, onCardClick, onEditClick, onDeleteClick }) => {
  return (
    <Grid container spacing={3}>
      {Array.isArray(campaigns) && campaigns.length > 0 ? (
        campaigns.map(campaign => (
          <Grid item key={campaign.id} xs={12} sm={6} md={4}>
            <CampaignCard
              campaign={campaign}
              onClick={onCardClick}
              onEditClick={onEditClick}
              onDeleteClick={onDeleteClick}
            />
          </Grid>
        ))
      ) : (
        <Typography variant="body1">No campaigns available</Typography>
      )}
    </Grid>
  );
};

export default CampaignList;
