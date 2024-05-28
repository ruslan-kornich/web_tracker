import React, { useEffect, useState } from 'react';
import { Container, Typography } from '@mui/material';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import { useParams } from 'react-router-dom';

const OfferDetails = () => {
  const { offerId } = useParams();
  const [clickData, setClickData] = useState([]);
  const [leadData, setLeadData] = useState([]);

  useEffect(() => {
    fetchAnalytics();
  }, [offerId]);

  const fetchAnalytics = async () => {
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
        Offer Details
      </Typography>
      <Typography variant="h5" style={{ marginTop: '20px' }}>
        Clicks Over Time
      </Typography>
      <div style={{ height: 300 }}>
        <Line data={formatChartData(clickData)} />
      </div>
      <Typography variant="h5" style={{ marginTop: '20px' }}>
        Leads Over Time
      </Typography>
      <div style={{ height: 300 }}>
        <Line data={formatChartData(leadData)} />
      </div>
    </Container>
  );
};

export default OfferDetails;
