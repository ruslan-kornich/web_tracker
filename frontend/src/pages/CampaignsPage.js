// src/pages/CampaignsPage.js
import React, { useEffect, useState } from 'react';
import { Container, Typography, Grid, Card, CardContent } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const CampaignsPage = () => {
  const [campaigns, setCampaigns] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/campaigns/`);
      const data = await response.json();
      setCampaigns(data.results);
    } catch (error) {
      console.error('Error fetching campaigns:', error);
    }
  };

  const handleCampaignClick = (campaignId) => {
    navigate(`/campaigns/${campaignId}/offers`);
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Campaigns
      </Typography>
      <Grid container spacing={3}>
        {Array.isArray(campaigns) && campaigns.length > 0 ? (
          campaigns.map(campaign => (
            <Grid item key={campaign.id} xs={12} sm={6} md={4}>
              <Card onClick={() => handleCampaignClick(campaign.id)}>
                <CardContent>
                  <Typography variant="h5">{campaign.name}</Typography>
                  <Typography>{campaign.description}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : (
          <Typography variant="body1">No campaigns available</Typography>
        )}
      </Grid>
    </Container>
  );
};

export default CampaignsPage;
