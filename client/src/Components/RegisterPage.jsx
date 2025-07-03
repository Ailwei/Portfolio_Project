import React, { useState } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Button,
  Typography,
  Box,
  Link,
  TextField
} from '@mui/material';

const RegisterPage = ({setCurrentView}) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const [registerError, setRegisterError] = useState('');

  const registerUser = async () => {
    if (!firstName || !lastName || !email || !password) {
      setRegisterError('All fields are required.');
      return;
    }

    if (!password) {
      setRegisterError('Passwords do not match.');
      return;
    }

    try {
      await axios.post('http://localhost:5000/signup', {
        first_name: firstName,
        last_name: lastName,
        email: email,
        password: password,
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });
      setRegisterError('');
      navigate("/login");
    } catch (error) {
      console.error('Registration error:', error);
      if (error.response) {
        if (error.response.status === 409) {
          setRegisterError("Email already exists");
        } else {
          setRegisterError("An unexpected error occurred");
        }
      } else {
        setRegisterError("Network error");
      }
    }
  };

  return (
     <Box sx={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
          <AppBar position="static" sx={{ backgroundColor: '#1976d2' }}>
            <Toolbar>
              <Typography onClick={() => setCurrentView('landing')} variant="h6" sx={{ flexGrow: 1 }}>
                CommHub
              </Typography>
               <Button onClick={() => setCurrentView('login')} color="inherit">Login</Button>
              <Button onClick={() => setCurrentView('register')} color="inherit">Register</Button>
            
            </Toolbar>
          </AppBar>
    <Box
      sx={{
        minHeight: '100vh',
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
            padding: 8,
        
          }}
        >
          <Typography variant="h6" sx={{  color: 'white' }}>
            Create an Account
          </Typography>
          <TextField
            type="text"
            fullWidth
            label='First Name'
            sx={{ width: '40vw', backgroundColor: 'white', mb: 2 }}
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
          <TextField
            type="text"
            fullWidth
            label='Last Name'
            sx={{ width: '40vw', backgroundColor: 'white', mb: 2 }}
             value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            
          />
          <TextField
            type="email"
            fullWidth
            label='Email'
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
              width: '20vw',
              color: 'white',
              '&:hover': {
                backgroundColor: 'skyblue',
              },
            }}
            onClick={registerUser}
          >
            Register
          </Button>

          <Typography color="white">
            Already Registred? <Link underline="hover" onClick={() => setCurrentView('login')}>Login</Link>
          </Typography>
        </Box>
      </Box>
    </Box>
    <Box sx={{ backgroundColor: '#1976d2', color: 'white', py: 2, textAlign: 'center' }}>
            <Typography variant="body2">&copy; 2024 CommHub. All rights reserved.</Typography>
          </Box>
    </Box>
  );
};
export default RegisterPage;
