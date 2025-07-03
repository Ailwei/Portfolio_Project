import React from 'react';
import {
  AppBar,
  Toolbar,
  Button,
  Typography,
  Box
} from '@mui/material';
import communityImage from '../assets/community.jpg'


const LandingPage = ({setCurrentView}) => {
  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      <AppBar position="static" sx={{ backgroundColor: '#1976d2' }}>
        <Toolbar>
          <Typography  onClick={() => setCurrentView('landing')} variant="h6" sx={{ flexGrow: 1 }}>
            CommHub
          </Typography>
           <Button onClick={() => setCurrentView('login')} color="inherit">Login</Button>
          <Button onClick={() => setCurrentView('register')} color="inherit">Register</Button>
        
        </Toolbar>
      </AppBar>

      <Box
        sx={{
          backgroundImage: `url(${communityImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          height: '60vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          color: 'black',
          opacity: 3
            
          
        }}
      >
        <Box>
          <Typography variant="h3" fontWeight="bold">Connect and Interact</Typography>
<Typography
  variant="h6"
  sx={{
    mt: 2,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    color: 'white',
    px: 2, 
    py: 1, 
    borderRadius: 1,
    display: 'flex'
  }}
>
  Join our platform and engage with a vibrant community of users.
</Typography>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => setCurrentView('register')}
            sx={{ mt: 10,  backgroundColor: 'rgba(240, 9, 140, 0.7)',mb: 2, '&:hover':{
              backgroundColor: 'rgba(57, 55, 58, 0.7)'
              

            } }}
          >
            Get Started
          </Button>
        </Box>
      </Box>
      <Box sx={{ textAlign: 'center', py: 5, backgroundColor: '#e3f2fd' }}>
        <Typography variant="h4" gutterBottom>Join Our Community Today</Typography>
        <Typography variant="body1" gutterBottom >
          Start exploring, connecting, and sharing with our diverse community of users.
        </Typography>
        <Button variant="contained" color="primary" onClick={() => setCurrentView('register')} sx={{ mt: 2 }}>
          Get Started
        </Button>
      </Box>

      {/* FOOTER */}
      <Box sx={{ backgroundColor: '#1976d2', color: 'white', py: 2, textAlign: 'center' }}>
        <Typography variant="body2">&copy; 2024 CommHub. All rights reserved.</Typography>
      </Box>
    </Box>
  );
};

export default LandingPage;
