import React from 'react';
import { Typography, Box, Grid, Paper } from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import InventoryIcon from '@mui/icons-material/Inventory';

const Dashboard: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper
            sx={{
              p: 3,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              cursor: 'pointer',
              '&:hover': {
                backgroundColor: 'rgba(25, 118, 210, 0.04)',
              },
            }}
            onClick={() => window.location.href = '/customers'}
          >
            <PeopleIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
            <Typography variant="h5" component="div">
              Manage Customers
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
              Add, edit, and delete customer information
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper
            sx={{
              p: 3,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              cursor: 'pointer',
              '&:hover': {
                backgroundColor: 'rgba(25, 118, 210, 0.04)',
              },
            }}
            onClick={() => window.location.href = '/products'}
          >
            <InventoryIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
            <Typography variant="h5" component="div">
              Manage Products
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
              Add, edit, and delete products with image uploads
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
