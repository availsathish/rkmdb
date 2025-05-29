import React from 'react';
import { Typography, Box } from '@mui/material';

const NotFound: React.FC = () => {
  return (
    <Box sx={{ textAlign: 'center', mt: 4 }}>
      <Typography variant="h2" gutterBottom>
        404
      </Typography>
      <Typography variant="h4" gutterBottom>
        Page Not Found
      </Typography>
      <Typography variant="body1">
        The page you are looking for does not exist or has been moved.
      </Typography>
    </Box>
  );
};

export default NotFound;
