import React, { useEffect, useState } from 'react';
import { Container, Typography, TextField, Pagination, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import CampaignList from '../components/CampaignList';

const CampaignsPage = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/campaigns/?page=${page}&search=${searchQuery}`);
        const data = await response.json();
        setCampaigns(data.results);
        setTotalPages(Math.ceil(data.count / 10)); // Assuming 10 items per page
      } catch (error) {
        console.error('Error fetching campaigns:', error);
      }
    };

    fetchCampaigns();
  }, [page, searchQuery]);

  const handleCardClick = (id) => {
    navigate(`/campaigns/${id}/offers`);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    setPage(1);
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Campaigns
      </Typography>
      <TextField
        label="Search Campaigns"
        variant="outlined"
        fullWidth
        margin="normal"
        value={searchQuery}
        onChange={handleSearchChange}
      />
      <CampaignList campaigns={campaigns} onCardClick={handleCardClick} />
      <Box mt={3} display="flex" justifyContent="center">
        <Pagination
          count={totalPages}
          page={page}
          onChange={(event, value) => setPage(value)}
          color="primary"
        />
      </Box>
    </Container>
  );
};

export default CampaignsPage;
