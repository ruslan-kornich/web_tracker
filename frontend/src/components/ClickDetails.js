import React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Typography } from '@mui/material';

const ClickDetails = ({ detailedClickData }) => {
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
    <div>
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
    </div>
  );
};

export default ClickDetails;
