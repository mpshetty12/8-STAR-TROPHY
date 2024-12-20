import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './WelcomePage.css';

const WelcomePage = () => {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState('');

  // Correct Admin Password
  const correctAdminPassword = '1010';  // Change this password to whatever you prefer
  

  const handleAdminClick = () => {
    const enteredPassword = prompt('Please enter the admin password:');
    
    if (enteredPassword === correctAdminPassword) {
      setIsAdmin(true); // Activate admin mode
      setError('');
    } else {
      setError('Incorrect password! Please try again.');
    }
  };

  return (
    <div className={`welcome-container ${isAdmin ? 'admin-mode' : ''}`}>
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

      {/* Welcome Text */}
      <h1>Welcome to KPL 2025</h1>
      <h4>Registration Closed, Thanks everyone who are all registered to KPL-2025</h4>

      {/* Error Message for Incorrect Password */}
      {error && <p className="error-message">{error}</p>}

      {/* Button container */}
      <div className="button-container">
        {!isAdmin ? (
          <>
            <button onClick={() => navigate('/p')}>Bidd View</button>
            <button onClick={() => navigate('/teamview')}>Team View</button>
            <button onClick={() => navigate('/login')}>Team Login</button>
            <button onClick={handleAdminClick}>KPL Organizers Panel</button>
          </>
        ) : (
          <>
            {/* <button onClick={() => navigate('/form')}>Player Registration</button> */}
            {/* <button onClick={() => navigate('/view')}>Player Lists</button> */}
            {/* <button onClick={() => navigate('/teamview')}>Team View</button> */}
            {/* <button onClick={() => navigate('/login')}>Bidding</button> */}
            <button onClick={() => navigate('/admin12345678980')}>Bidd Start</button>
            {/* <button onClick={() => navigate('/p')}>Bidd View</button> */}
          </>
        )}
      </div>

      {/* Footer */}
      <footer className="footer" id="footerright">
        <p>&copy; 2024 mpshetty. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default WelcomePage;


