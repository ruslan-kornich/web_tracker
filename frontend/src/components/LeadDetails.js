import React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Typography } from '@mui/material';

const LeadDetails = ({ leadData }) => {
  const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'full_name', headerName: 'Full Name', width: 150 },
    { field: 'email', headerName: 'Email', width: 200 },
    { field: 'phone', headerName: 'Phone', width: 150 },
    { field: 'notes', headerName: 'Notes', width: 300 },
    { field: 'lead_time', headerName: 'Lead Time', width: 180 },
  ];

  return (
    <div>
      <Typography variant="h5" style={{ marginTop: '20px' }}>
        Detailed Lead Information
      </Typography>
      <div style={{ height: 400, width: '100%' }}>
        <DataGrid
          rows={leadData}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[10, 20, 30]}
          checkboxSelection
          disableSelectionOnClick
          getRowId={(row) => row.id}
        />
      </div>
    </div>
  );
};

export default LeadDetails;
