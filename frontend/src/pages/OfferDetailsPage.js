import React, { useEffect, useState, useCallback } from 'react';
import { Container, Typography, Tabs, Tab, Box, Paper } from '@mui/material';
import { Line, Bar, Pie } from 'react-chartjs-2';
import { DataGrid } from '@mui/x-data-grid';
import { useParams } from 'react-router-dom';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const OfferDetailsPage = () => {
  const { offerId } = useParams();
  const [clickData, setClickData] = useState([]);
  const [leadData, setLeadData] = useState([]);
  const [detailedClickData, setDetailedClickData] = useState([]);
  const [offerInfo, setOfferInfo] = useState({});
  const [tabIndex, setTabIndex] = useState(0);

  const fetchAnalytics = useCallback(async () => {
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
  }, [offerId]);

  const fetchDetailedClicks = useCallback(async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/offers/${offerId}/detailed_clicks/`);
      const data = await response.json();
      setDetailedClickData(data);
    } catch (error) {
      console.error('Error fetching detailed click data:', error);
    }
  }, [offerId]);

  const fetchOfferInfo = useCallback(async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/offers/${offerId}/`);
      const data = await response.json();
      setOfferInfo(data);
    } catch (error) {
      console.error('Error fetching offer info:', error);
    }
  }, [offerId]);

  useEffect(() => {
    fetchAnalytics();
    fetchDetailedClicks();
    fetchOfferInfo();
  }, [fetchAnalytics, fetchDetailedClicks, fetchOfferInfo]);

  const formatChartData = (data, label) => {
    return {
      labels: data.map(d => d.date),
      datasets: [{
        label: label,
        data: data.map(d => d.count),
        borderColor: '#8884d8',
        backgroundColor: '#8884d8',
        fill: false,
      }]
    };
  };

  const formatBarChartData = (data, label) => {
    const countByOS = data.reduce((acc, click) => {
      acc[click.os] = (acc[click.os] || 0) + 1;
      return acc;
    }, {});
    return {
      labels: Object.keys(countByOS),
      datasets: [{
        label: label,
        data: Object.values(countByOS),
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
      }]
    };
  };

  const formatPieChartData = (data, label) => {
    const countByBrowser = data.reduce((acc, click) => {
      acc[click.browser] = (acc[click.browser] || 0) + 1;
      return acc;
    }, {});
    return {
      labels: Object.keys(countByBrowser),
      datasets: [{
        label: label,
        data: Object.values(countByBrowser),
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
      }]
    };
  };

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'user_ip', headerName: 'User IP', width: 150 },
    { field: 'user_agent', headerName: 'User Agent', width: 300 },
    { field: 'os', headerName: 'OS', width: 120 },
    { field: 'browser', headerName: 'Browser', width: 120 },
    { field: 'click_time', headerName: 'Click Time', width: 180 },
    { field: 'landing_page_url', headerName: 'Landing Page URL', width: 200 },
  ];

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Offer Details
      </Typography>
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px' }}>
        <div>
          <Tabs value={tabIndex} onChange={handleTabChange}>
            <Tab label="Clicks Over Time" />
            <Tab label="Leads Over Time" />
            <Tab label="Clicks by OS" />
            <Tab label="Clicks by Browser" />
          </Tabs>
          <Box mt={3}>
            {tabIndex === 0 && (
              <div style={{ height: 300 }}>
                <Line data={formatChartData(clickData, 'Clicks Over Time')} />
              </div>
            )}
            {tabIndex === 1 && (
              <div style={{ height: 300 }}>
                <Line data={formatChartData(leadData, 'Leads Over Time')} />
              </div>
            )}
            {tabIndex === 2 && (
              <div style={{ height: 300 }}>
                <Bar data={formatBarChartData(detailedClickData, 'Clicks by OS')} />
              </div>
            )}
            {tabIndex === 3 && (
              <div style={{ height: 300 }}>
                <Pie data={formatPieChartData(detailedClickData, 'Clicks by Browser')} />
              </div>
            )}
          </Box>
        </div>
        <div>
          <Paper style={{ padding: 16 }}>
            <Typography variant="h6">Offer Information</Typography>
            <Typography><strong>Name:</strong> {offerInfo.name}</Typography>
            <Typography><strong>Description:</strong> {offerInfo.description}</Typography>
            <Typography><strong>URL:</strong> {offerInfo.url}</Typography>
            <Typography><strong>Created At:</strong> {new Date(offerInfo.created_at).toLocaleString()}</Typography>
            <Typography><strong>Updated At:</strong> {new Date(offerInfo.updated_at).toLocaleString()}</Typography>
            <Typography><strong>Total Clicks:</strong> {detailedClickData.length}</Typography>
            <Typography><strong>Operating Systems Used:</strong> {Object.keys(detailedClickData.reduce((acc, click) => {
              acc[click.os] = true;
              return acc;
            }, {})).join(', ')}</Typography>
            <Typography><strong>Browsers Used:</strong> {Object.keys(detailedClickData.reduce((acc, click) => {
              acc[click.browser] = true;
              return acc;
            }, {})).join(', ')}</Typography>
          </Paper>
        </div>
      </div>
      <Typography variant="h5" style={{ marginTop: '20px' }}>
        Detailed Click Information
      </Typography>
      <div style={{ height: 400, width: '100%' }}>
        <DataGrid
          rows={detailedClickData}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[10, 20, 30]}
          checkboxSelection
          disableSelectionOnClick
        />
      </div>
    </Container>
  );
};

export default OfferDetailsPage;
