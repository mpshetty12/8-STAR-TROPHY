import React from 'react';
import { useNavigate } from 'react-router-dom';
import './WelcomePage.css';

const WelcomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="welcome-container">
      <h1>Welcome to KPL 2025</h1>
      <div className="button-container">
        {/* Button to navigate directly to the form */}
        <button onClick={() => navigate('/form')}>Player Registration</button>

        {/* Button to navigate directly to the view page */}
        <button onClick={() => navigate('/view')}>Player Lists</button>
      </div>
      
      {/* Footer section for copyright */}
      <footer className="footer">
        <p>&copy; 2024 mpshetty. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default WelcomePage;
