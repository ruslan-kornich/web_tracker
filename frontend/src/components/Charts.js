import React from 'react';
import { Line, Bar, Pie } from 'react-chartjs-2';
import { Box, Tabs, Tab } from '@mui/material';
import 'chartjs-adapter-date-fns';
import { format, parseISO } from 'date-fns';

const Charts = ({ tabIndex, handleTabChange, clickData, leadData, detailedClickData }) => {
  const groupDataByPeriod = (data, period) => {
    return data.reduce((acc, click) => {
      const date = format(parseISO(click.date), period);
      acc[date] = (acc[date] || 0) + click.count;
      return acc;
    }, {});
  };

  const getPeriod = (data) => {
    const days = new Set(data.map(d => format(parseISO(d.date), 'yyyy-MM-dd')));
    if (days.size <= 31) {
      return 'yyyy-MM-dd'; // Group by day
    } else if (days.size <= 365) {
      return 'yyyy-MM'; // Group by month
    } else {
      return 'yyyy'; // Group by year
    }
  };

  const formatChartData = (data, label) => {
    const period = getPeriod(data);
    const groupedData = groupDataByPeriod(data, period);
    return {
      labels: Object.keys(groupedData),
      datasets: [{
        label: label,
        data: Object.values(groupedData),
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
