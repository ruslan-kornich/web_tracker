import React, { useEffect, useState, useCallback } from 'react';
import { Container, Typography, Button, ButtonGroup } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
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
import LeadDetails from '../components/LeadDetails';

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
  const [detailedLeadData, setDetailedLeadData] = useState([]);
  const [offerInfo, setOfferInfo] = useState({});
  const [tabIndex, setTabIndex] = useState(0);
  const [showClicks, setShowClicks] = useState(true);
  const navigate = useNavigate();

  const fetchAnalytics = useCallback(async () => {
    try {
      const accessToken = localStorage.getItem('access_token');
      if (!accessToken) {
        navigate('/login');
        return;
      }

      const clicksResponse = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/offers/${offerId}/clicks/`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const leadsResponse = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/offers/${offerId}/leads/`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const clicksData = await clicksResponse.json();
      const leadsData = await leadsResponse.json();
      setClickData(clicksData);
      setLeadData(leadsData);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    }
  }, [offerId, navigate]);

  const fetchDetailedClicks = useCallback(async () => {
    try {
      const accessToken = localStorage.getItem('access_token');
      if (!accessToken) {
        navigate('/login');
        return;
      }

      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/offers/${offerId}/detailed_clicks/`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = await response.json();
      setDetailedClickData(data);
    } catch (error) {
      console.error('Error fetching detailed click data:', error);
    }
  }, [offerId, navigate]);

  const fetchDetailedLeads = useCallback(async () => {
    try {
      const accessToken = localStorage.getItem('access_token');
      if (!accessToken) {
        navigate('/login');
        return;
      }

      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/offers/${offerId}/detailed_leads/`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = await response.json();
      setDetailedLeadData(data);
    } catch (error) {
      console.error('Error fetching detailed lead data:', error);
    }
  }, [offerId, navigate]);

  const fetchOfferInfo = useCallback(async () => {
    try {
      const accessToken = localStorage.getItem('access_token');
      if (!accessToken) {
        navigate('/login');
        return;
      }

      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/offers/${offerId}/`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = await response.json();
      setOfferInfo(data);
    } catch (error) {
      console.error('Error fetching offer info:', error);
    }
  }, [offerId, navigate]);

  useEffect(() => {
    fetchAnalytics();
    fetchDetailedClicks();
    fetchDetailedLeads();
    fetchOfferInfo();
  }, [fetchAnalytics, fetchDetailedClicks, fetchDetailedLeads, fetchOfferInfo]);

  return (
    <Container>
      <Helmet>
        <title>{offerInfo.name ? `Offer Details - ${offerInfo.name}` : 'Loading...'}</title>
      </Helmet>
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
      <ButtonGroup style={{ marginTop: '20px' }}>
        <Button onClick={() => setShowClicks(true)} variant={showClicks ? 'contained' : 'outlined'}>
          Click Details
        </Button>
        <Button onClick={() => setShowClicks(false)} variant={!showClicks ? 'contained' : 'outlined'}>
          Lead Details
        </Button>
      </ButtonGroup>
      {showClicks ? (
        <ClickDetails detailedClickData={detailedClickData} />
      ) : (
        <LeadDetails leadData={detailedLeadData} />
      )}
    </Container>
  );
};

export default OfferDetailsPage;
