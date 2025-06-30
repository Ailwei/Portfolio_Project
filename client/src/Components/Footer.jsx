import React from 'react';
import { Box, Typography } from '@mui/material';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        mt: 'auto',
        py: 2,
        px: 3,
        textAlign: 'center',
        backgroundColor: '#f5f5f5',
        borderTop: '1px solid #ddd',
      }}
    >
      <Typography variant="body2" color="textSecondary">
        &copy; {new Date().getFullYear()} My Website. All rights reserved.
      </Typography>
    </Box>
  );
};

export default Footer;
