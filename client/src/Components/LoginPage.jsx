import React, { useState, useEffect } from "react";
import axios from 'axios';
import { useNavigate, useLocation } from "react-router-dom";
import '../../styles/LoginPage.css';

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
            const response = await axios.post('http://13.53.199.9/login', {
                email: email,
                password: password
            });
            const authToken = response.data.access_token;
            localStorage.setItem('authToken', authToken);
            axios.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;

            setTimeout(() => {
                localStorage.removeItem('authToken');
                navigate('/login', { state: { sessionExpired: true } });
            }, 30 * 10 * 1000); 

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
        <div className="login-container">
            <div className="login-form">
                <h2>Log Into Your Account</h2>
                {sessionExpired && (
                    <div className="alert alert-warning" role="alert">
                        Your session has expired. Please login again.
                    </div>
                )}
                {loginError && (
                    <div className="alert alert-danger" role="alert">
                        {loginError}
                    </div>
                )}
                <form>
                    <div className="form-group">
                        <label htmlFor="email">Email address</label>
                        <input type="email" value={email} onChange={(e) => { setEmail(e.target.value); setLoginError(''); }} id="email" className="form-control" placeholder="Enter your email address" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input type="password" value={password} onChange={(e) => { setPassword(e.target.value); setLoginError(''); }} id="password" className="form-control" placeholder="Enter your password" />
                    </div>
                    <div className="form-group form-check">
                        <input type="checkbox" className="form-check-input" id="rememberMe" />
                        <label className="form-check-label" htmlFor="rememberMe">Remember me</label>
                    </div>
                    <button type="button" className="btn btn-primary" onClick={logInUser}>Login</button>
                    <p className="mt-3">Don't have an account? <a href="/register">Register</a></p>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;
