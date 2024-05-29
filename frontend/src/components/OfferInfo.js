import React from 'react';
import { Paper, Typography } from '@mui/material';

const OfferInfo = ({ offerInfo, detailedClickData, leadData }) => {
  const osUsed = Object.keys(detailedClickData.reduce((acc, click) => {
    acc[click.os] = true;
    return acc;
  }, {})).join(', ');

  const browsersUsed = Object.keys(detailedClickData.reduce((acc, click) => {
    acc[click.browser] = true;
    return acc;
  }, {})).join(', ');

  return (
    <Paper style={{ padding: 16 }}>
      <Typography variant="h6">Offer Information</Typography>
      <Typography><strong>Name:</strong> {offerInfo.name}</Typography>
      <Typography><strong>URL:</strong> {offerInfo.url}</Typography>
      <Typography><strong>Created At:</strong> {new Date(offerInfo.created_at).toLocaleString()}</Typography>
      <Typography><strong>Updated At:</strong> {new Date(offerInfo.updated_at).toLocaleString()}</Typography>
      <Typography><strong>Total Clicks:</strong> {detailedClickData.length}</Typography>
      <Typography><strong>Total Leads:</strong> {leadData.length}</Typography>
      <Typography><strong>Operating Systems Used:</strong> {osUsed}</Typography>
      <Typography><strong>Browsers Used:</strong> {browsersUsed}</Typography>
    </Paper>
  );
};

export default OfferInfo;
