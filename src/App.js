// src/App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Navigate, Routes } from 'react-router-dom';
import Login from './components/LogIn';
import Home from './components/Home';

function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={loggedIn ? <Navigate to="/home" /> : <Login setLoggedIn={setLoggedIn} />} />
          <Route path="/home" element={<Home />} />
          {/* Add other routes here */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
