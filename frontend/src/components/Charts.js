import React from 'react';
import { Line, Bar, Pie } from 'react-chartjs-2';
import { Box, Tabs, Tab } from '@mui/material';

const Charts = ({ tabIndex, handleTabChange, clickData, leadData, detailedClickData }) => {
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

  return (
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
  );
};

export default Charts;
