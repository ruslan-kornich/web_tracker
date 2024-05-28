import React, { useEffect, useState } from 'react';
import { Container, Typography, Grid, Card, CardContent } from '@mui/material'; // Удален Button
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';

const Dashboard = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [offers, setOffers] = useState([]);
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [clickData, setClickData] = useState([]);
  const [leadData, setLeadData] = useState([]);

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/campaigns/`);
      const data = await response.json();
      setCampaigns(data.results); // Извлекаем массив кампаний из results
    } catch (error) {
      console.error('Error fetching campaigns:', error);
    }
  };

  const fetchOffers = async (campaignId) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/offers/?campaign=${campaignId}`);
      const data = await response.json();
      setOffers(data.results);
    } catch (error) {
      console.error('Error fetching offers:', error);
    }
  };

  const fetchAnalytics = async (offerId) => {
    try {
      const clicksResponse = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/offers/${offerId}/clicks/`);
      const leadsResponse = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/offers/${offerId}/leads/`);
      const clicksData = await clicksResponse.json();
      const leadsData = await leadsResponse.json();
      setClickData(clicksData);
      setLeadData(leadsData);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    }
  };

  useEffect(() => {
    if (selectedCampaign) {
      fetchOffers(selectedCampaign.id);
    }
  }, [selectedCampaign]);

  useEffect(() => {
    if (selectedOffer) {
      fetchAnalytics(selectedOffer.id);
    }
  }, [selectedOffer]);

  const formatChartData = (data) => {
    return {
      labels: data.map(d => d.date),
      datasets: [{
        label: 'Count',
        data: data.map(d => d.count),
        borderColor: '#8884d8',
        backgroundColor: '#8884d8',
        fill: false,
      }]
    };
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Campaign Dashboard
      </Typography>
      <Grid container spacing={3}>
        {Array.isArray(campaigns) && campaigns.length > 0 ? (
          campaigns.map(campaign => (
            <Grid item key={campaign.id} xs={12} sm={6} md={4}>
              <Card onClick={() => setSelectedCampaign(campaign)}>
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

      {selectedCampaign && (
        <>
          <Typography variant="h5" style={{ marginTop: '20px' }}>
            Offers for {selectedCampaign.name}
          </Typography>
          <Grid container spacing={3}>
            {Array.isArray(offers) && offers.length > 0 ? (
              offers.map(offer => (
                <Grid item key={offer.id} xs={12} sm={6} md={4}>
                  <Card onClick={() => setSelectedOffer(offer)}>
                    <CardContent>
                      <Typography variant="h6">{offer.name}</Typography>
                      <Typography>{offer.description}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))
            ) : (
              <Typography variant="body1">No offers available</Typography>
            )}
          </Grid>
        </>
      )}

      {selectedOffer && (
        <>
          <Typography variant="h5" style={{ marginTop: '20px' }}>
            Clicks Over Time for {selectedOffer.name}
          </Typography>
          <div style={{ height: 300 }}>
            <Line data={formatChartData(clickData)} />
          </div>
          <Typography variant="h5" style={{ marginTop: '20px' }}>
            Leads Over Time for {selectedOffer.name}
          </Typography>
          <div style={{ height: 300 }}>
            <Line data={formatChartData(leadData)} />
          </div>
        </>
      )}
    </Container>
  );
};

export default Dashboard;
