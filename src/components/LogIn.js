// src/components/Login.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css'; // Import custom CSS file for additional styles

const LogIn = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleLogin = () => {
    // Perform form validation
    const validationErrors = {};
    if (!username) {
      validationErrors.username = 'Username is required';
    }
    if (!password) {
      validationErrors.password = 'Password is required';
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Perform authentication (you can add your authentication logic here)
    // For this example, we'll assume authentication is successful
    navigate('/home');
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card login-card">
            <div className="card-body">
              <h2 className="card-title text-center">Login</h2>
              <form>
                <div className="form-group">
                  <label htmlFor="username">Username</label>
                  <input
                    type="text"
                    className={`form-control ${errors.username ? 'is-invalid' : ''}`}
                    id="username"
                    placeholder="Enter your username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                  {errors.username && <div className="invalid-feedback">{errors.username}</div>}
                </div>
                <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <input
                    type="password"
                    className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                    id="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                </div>
                <button
                  type="button"
                  className="btn btn-primary btn-block"
                  onClick={handleLogin}
                >
                  Login
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogIn;
