import React, { useEffect, useState } from 'react';
import { Container, Typography, TextField, Pagination, Box, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import CampaignList from '../components/CampaignList';
import EditCampaignModal from '../components/EditCampaignModal';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal';
import AddCampaignModal from '../components/AddCampaignModal';

const CampaignsPage = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const accessToken = localStorage.getItem('access_token');
        if (!accessToken) {
          throw new Error('Access token is missing');
        }

        const response = await fetch(
          `${process.env.REACT_APP_API_BASE_URL}/api/campaigns/?page=${page}&search=${searchQuery}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        if (response.status === 401) {
          console.error('Unauthorized access. Token might be expired.');
          return;
        }

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

  const handleEditClick = (campaign) => {
    setSelectedCampaign(campaign);
    setEditModalOpen(true);
  };

  const handleDeleteClick = (campaign) => {
    setSelectedCampaign(campaign);
    setDeleteModalOpen(true);
  };

  const handleSave = async (updatedCampaign) => {
    const accessToken = localStorage.getItem('access_token');
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/campaigns/${updatedCampaign.id}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(updatedCampaign),
      });

      if (response.ok) {
        setCampaigns((prevCampaigns) =>
          prevCampaigns.map((campaign) => (campaign.id === updatedCampaign.id ? updatedCampaign : campaign))
        );
      } else {
        console.error('Error updating campaign');
      }
    } catch (error) {
      console.error('Error updating campaign:', error);
    }
  };

  const handleDelete = async () => {
    const accessToken = localStorage.getItem('access_token');
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/campaigns/${selectedCampaign.id}/`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.ok) {
        setCampaigns((prevCampaigns) => prevCampaigns.filter((campaign) => campaign.id !== selectedCampaign.id));
        setDeleteModalOpen(false);
      } else {
        console.error('Error deleting campaign');
      }
    } catch (error) {
      console.error('Error deleting campaign:', error);
    }
  };

  const handleAdd = async (newCampaign) => {
    const accessToken = localStorage.getItem('access_token');
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/campaigns/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(newCampaign),
      });

      if (response.ok) {
        const data = await response.json();
        setCampaigns((prevCampaigns) => [...prevCampaigns, data]);
        setAddModalOpen(false);
      } else {
        console.error('Error adding campaign');
      }
    } catch (error) {
      console.error('Error adding campaign:', error);
    }
  };

  return (
    <Container>
      <Helmet>
        <title>Campaigns</title>
      </Helmet>
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
      <Button variant="contained" color="primary" onClick={() => setAddModalOpen(true)}>
        Add Campaign
      </Button>
      <CampaignList
        campaigns={campaigns}
        onCardClick={handleCardClick}
        onEditClick={handleEditClick}
        onDeleteClick={handleDeleteClick}
      />
      <Box mt={3} display="flex" justifyContent="center">
        <Pagination
          count={totalPages}
          page={page}
          onChange={(event, value) => setPage(value)}
          color="primary"
        />
      </Box>
      <EditCampaignModal
        open={editModalOpen}
        handleClose={() => setEditModalOpen(false)}
        campaign={selectedCampaign}
        handleSave={handleSave}
      />
      <DeleteConfirmationModal
        open={deleteModalOpen}
        handleClose={() => setDeleteModalOpen(false)}
        handleDelete={handleDelete}
      />
      <AddCampaignModal
        open={addModalOpen}
        handleClose={() => setAddModalOpen(false)}
        handleAdd={handleAdd}
      />
    </Container>
  );
};

export default CampaignsPage;
