// src/pages/OfferDetailsPage.js
import React, { useEffect, useState, useCallback } from 'react';
import { Container, Typography } from '@mui/material';
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
import Charts from '../components/Charts';
import OfferInfo from '../components/OfferInfo';
import ClickDetails from '../components/ClickDetails';

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

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Offer Details
      </Typography>
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px' }}>
        <Charts
          tabIndex={tabIndex}
          handleTabChange={(event, newValue) => setTabIndex(newValue)}
          clickData={clickData}
          leadData={leadData}
          detailedClickData={detailedClickData}
        />
        <OfferInfo offerInfo={offerInfo} detailedClickData={detailedClickData} leadData={leadData} />
      </div>
      <ClickDetails detailedClickData={detailedClickData} />
    </Container>
  );
};

export default OfferDetailsPage;
