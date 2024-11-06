// WelcomePage.js

import React from 'react';
import { useNavigate } from 'react-router-dom';
import './WelcomePage.css';

const WelcomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="welcome-container">
      {/* Logo */}
      <img src="./kpl2025.png" alt="KPL 2025" className="logo" />

      {/* President and Vice President images */}
      <div className="leaders-container">
        <div className="leader">
          <img src="./poorna.jpeg" alt="President" className="leader-image" />
          <p className="leader-title">Poornachandra Shetty</p>
          <p className="leader-title1">President</p>
        </div>
        <div className="leader">
          <img src="./surendra.jpeg" alt="Vice President" className="leader-image" />
          <p className="leader-title">Surendra Devadiga</p>
          <p className="leader-title1">Vice President</p>
        </div>
      </div>

      <h1>Welcome to KPL 2025</h1>
      
      {/* Button container with additional "Team View" button */}
      <div className="button-container">
        <button onClick={() => navigate('/form')}>Player Registration</button>
        <button onClick={() => navigate('/view')}>Player Lists</button>
        <button onClick={() => navigate('/teamview')}>Team View</button> {/* New button */}
      </div>

      {/* Footer */}
      <footer className="footer" id='footerright'>
        <p>&copy; 2024 mpshetty. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default WelcomePage;
