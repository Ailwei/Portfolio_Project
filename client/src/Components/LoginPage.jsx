import React, { useState, useEffect } from "react";
import axios from 'axios';
import { useNavigate, useLocation } from "react-router-dom";
import {Box, Button, Typography, TextField, Link} from '@mui/material';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [sessionExpired, setSessionExpired] = useState(false);
    const [loginError, setLoginError] = useState('');
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (location.state && location.state.sessionExpired) {
            setSessionExpired(true);
        }
    }, [location.state]);

    const logInUser = async () => {
        try {
            if (!email || !password){
                setLoginError('Email and password are required fields')
                return;
            }
            const response = await axios.post('http://127.0.0.1:5000/login', {
                email: email,
                password: password
            });
            const authToken = response.data.access_token;
            localStorage.setItem('authToken', authToken);
            axios.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;

            setTimeout(() => {
                localStorage.removeItem('authToken');
                navigate('/login', { state: { sessionExpired: true } });
            }, 30 * 60 * 1000); 

            navigate('/Dashboard');
         
        } catch (error) {
            if (error.response) {
                if (error.response.status === 401) {
                    setLoginError("Invalid email or password")
                } else {
                    setLoginError('An error occurred. Please try again later')
                }
            } else {
                setLoginError('Network error. Please try again later')
            }
        }
    };

    return (
        <Box
      sx={{
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
      }}
    >
      <Box
        component="form"
        sx={{
          backgroundColor: 'grey',
          width: '48vw',
          borderRadius: 2,
          boxShadow: 3,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: 4,
          }}
        >
          <Typography variant="h6" sx={{ padding: 2, color: 'white' }}>
            Login Into Your Account
          </Typography>

          <TextField
            type="email"
            fullWidth
            label="Title"
            sx={{ width: '40vw', backgroundColor: 'white', mb: 2 }}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            type="password"
            fullWidth
            label='Password'
            sx={{ width: '40vw', backgroundColor: 'white', mb: 4 }}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button
            sx={{
              backgroundColor: 'deepskyblue',
              padding: 2,
              marginBottom: 2,
              width: '40vw',
              color: 'white',
              '&:hover': {
                backgroundColor: 'skyblue',
              },
            }}
            onClick={logInUser}
          >
            Login
          </Button>

          <Typography color="white">
            Don't have an account? <Link underline="hover" href='/register'>Register</Link>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default LoginPage;
