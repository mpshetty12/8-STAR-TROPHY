import React from 'react';
import { useNavigate } from 'react-router-dom';
import './WelcomePage.css';

const WelcomePage = () => {
  const navigate = useNavigate();
  //const [isAdmin, setIsAdmin] = useState(false);
  //const [error, setError] = useState('');

  // Correct Admin Password
  //const correctAdminPassword = '1010';  // Change this password to whatever you prefer
  
  //setIsAdmin(false);
  //setError('');
  // const handleAdminClick = () => {
  //   const enteredPassword = prompt('Please enter the admin password:');
    
  //   if (enteredPassword === correctAdminPassword) {
  //     setIsAdmin(true); // Activate admin mode
  //     setError('');
  //   } else {
  //     setError('Incorrect password! Please try again.');
  //   }
  // };

  return (
    <div className='welcome-container'>
      {/* Logo */}
      <img src="./kpl2025.png" alt="KPL 2025" className="logo" />

      {/* President and Vice President images */}
      <div className="leaders-container">
        <div className="leader">
          <img src="./8star.jpeg" alt="President" className="leader-image" />
          <p className="leader-title">ದಿನಾಂಕ : ಫೆಬ್ರವರಿ 14, 15, 16  2025</p>
          <p className="leader-title1">ಸ್ಥಳ: ಗಾಂಧಿ ಮೈದಾನ ಬೈಂದೂರು</p>
        </div>
        {/* <div className="leader">
          <img src="./surendra.jpeg" alt="Vice President" className="leader-image" />
          <p className="leader-title">Surendra Devadiga</p>
          <p className="leader-title1">Vice President</p>
        </div> */}
      </div>

      {/* Welcome Text */}
      <h1>8 ಸ್ಟಾರ್ ಟ್ರೋಫಿ 2025</h1>
      {/* <h4>Registration Closed, Thanks everyone who are all registered to KPL-2025</h4> */}

      {/* Error Message for Incorrect Password */}
      {/* {error && <p className="error-message">{error}</p>} */}

      {/* Button container */}
      <p>ಬೈಂದೂರು ವಿಧಾನಸಭಾ ಕ್ಷೇತ್ರ ವ್ಯಾಪ್ತಿಗೆ ಒಳಪಟ್ಟ ಆಟಗಾರರು ಮಾತ್ರ ನೋಂದಣಿಯಾಗಬೇಕು</p>
      <div className="button-container">
          <>
            <button onClick={() => navigate('/form')}>Player Registration/ ಆಟಗಾರರ ನೊಂದಣಿ</button>
            <button onClick={() => navigate('/view')}>Players View/ ನೋಂದಣಿಯಾದ ಆಟಗಾರರ ಪಟ್ಟಿ</button>
            {/* <button onClick={() => navigate('/teamview')}>Team View</button>
            <button onClick={() => navigate('/login')}>Team Login</button>
            <button onClick={handleAdminClick}>KPL Organizers Panel</button> */}
          </>
      </div>

      {/* Footer */}
      <footer className="footer" id="footerright">
        <p>&copy; 2024 mpshetty. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default WelcomePage;


