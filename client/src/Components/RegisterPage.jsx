import React, { useState } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import PropTypes from 'prop-types';
import '../../styles/RegisterPage.css';

const RegisterPage = ({ Error, setError }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [comfirmPassword, setComfirmPassword] = useState('');
  const navigate = useNavigate();
  const [registerError, setRegisterError] = useState('');

  const registerUser = () => {
    if (!firstName || !lastName || !email || !password || !comfirmPassword) {
      setRegisterError('Please fill in all fields.');
      setError('Please fill in all fields.');
      return;
    }
    if (password !== comfirmPassword) {
      setRegisterError('Passwords do not match.');
      setError('Passwords do not match.');
      return;
    }

    axios.post('https://13.53.199.9/signup', {
      first_name: firstName,
      last_name: lastName,
      email: email,
      password: password,
      comfirm_password: comfirmPassword,
    })
    .then(function (response) {
      console.log(response);
      setRegisterError('');
      setError('');
      navigate("/login");
    })
    .catch(function (error) {
      console.log(error);
      if (error.response && error.response.status === 401) {
        setRegisterError("Invalid credentials");
        setError("Invalid credentials");
      } else {
        setRegisterError("Email already exists");
        setError("Email already exists");
      }
    });
  };

  return (
    <div className="register-container">
      <div className="register-form">
        <h2>Create Your Account</h2>
        <div className="form-group">
          <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="First Name" />
        </div>
        <div className="form-group">
          <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Last Name" />
        </div>
        <div className="form-group">
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email Address" />
        </div>
        <div className="form-group">
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
        </div>
        <div className="form-group">
          <input type="password" value={comfirmPassword} onChange={(e) => setComfirmPassword(e.target.value)} placeholder="Confirm Password" />
        </div>
        <div className="form-group">
          <button className="btn-primary" onClick={registerUser}>Register Account</button>
        </div>
        {registerError && (
          <div className="alert alert-danger" role="alert">
            {registerError}
          </div>
        )}
        <p className="login-link">Already have an account? <a href="/login">Login</a></p>
      </div>
    </div>
  );
}

RegisterPage.propTypes = {
  Error: PropTypes.string,
  setError: PropTypes.func.isRequired,
};

export default RegisterPage;
