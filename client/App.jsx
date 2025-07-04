import React, { useState, useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import Dashboard from './src/Components/Dashboard';
import LandingPage from './src/Components/LandingPage';
import LoginPage from './src/Components/LoginPage';
import RegisterPage from './src/Components/RegisterPage';

function App() {
  const [authToken, setAuthToken] = useState(localStorage.getItem('authToken') || '');
  const [currentView, setCurrentView] = useState('landing');

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    setAuthToken(token || '');
  }, []);


  useEffect(() => {
    if (authToken) {
      setCurrentView('dashboard');
    }
  }, [authToken]);

  return (
    <BrowserRouter>
      {currentView === 'dashboard' && (
        <Dashboard authToken={authToken} setAuthToken={setAuthToken} setCurrentView={setCurrentView}/>
      )}
      {currentView === 'landing' && (
        <LandingPage setCurrentView={setCurrentView} />
      )}
      {currentView === 'login' && (
        <LoginPage setAuthToken={setAuthToken} setCurrentView={setCurrentView} />
      )}
      {currentView === 'register' && (
         <RegisterPage setCurrentView={setCurrentView} />
      )}
      
    </BrowserRouter>
  );
}

export default App;
