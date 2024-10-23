// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { supabase } from '../supabaseClient'; // Import Supabase client to fetch data
// import './WelcomePage.css';

// const WelcomePage = () => {
//   const [userCount, setUserCount] = useState(0);
//   const [currentCount, setCurrentCount] = useState(0); // State for animated count
//   const navigate = useNavigate();

//   useEffect(() => {
//     // Fetch the number of registered users from the database
//     const fetchUserCount = async () => {
//       const { error, count } = await supabase.from('users').select('*', { count: 'exact' });
//       if (error) {
//         console.error('Error fetching user count:', error);
//       } else {
//         setUserCount(count); // Set the actual count of users
//       }
//     };

//     fetchUserCount();
//   }, []);

//   // Animation logic for running numbers
//   useEffect(() => {
//     if (userCount > 0 && currentCount < userCount) {
//       const interval = setInterval(() => {
//         setCurrentCount((prevCount) => {
//           if (prevCount < userCount) {
//             return prevCount + 1; // Increment count until it reaches the total
//           } else {
//             clearInterval(interval); // Clear the interval once the count is reached
//             return prevCount;
//           }
//         });
//       }, 50); // Speed of the counting animation (50ms per increment)

//       return () => clearInterval(interval); // Cleanup interval on unmount
//     }
//   }, [userCount, currentCount]);

//   return (
//     <div className="welcome-container">
//       {/* Add the logo image at the top */}
//       <img src="./kpl2025.png" alt="KPL 2025" className="logo" />

//       {/* Animated user count */}
//       <div className="user-count-container">
//         <div className="animated-count">{currentCount}</div>
//         <div className="count-text">Registered Players</div>
//       </div>

//       <h1>Welcome to KPL 2025</h1>
//       <div className="button-container">
//         {/* Button to navigate directly to the form */}
//         <button onClick={() => navigate('/form')}>Player Registration</button>

//         {/* Button to navigate directly to the view page */}
//         <button onClick={() => navigate('/view')}>Player Lists</button>
//       </div>
      
//       {/* Footer section for copyright */}
//       <footer className="footer" id='footerright'>
//         <p>&copy; 2024 mpshetty. All rights reserved.</p>
//       </footer>
//     </div>
//   );
// };

// export default WelcomePage;








import React from 'react';
import { useNavigate } from 'react-router-dom';
import './WelcomePage.css';

const WelcomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="welcome-container">
      {/* Add the logo image at the top */}
      <img src="./kpl2025.png" alt="KPL 2025" className="logo" />

      {/* Add president and vice president images */}
      <div className="leaders-container">
        {/* President on the left */}
        <div className="leader">
          <img src="./poorna.jpeg" alt="President" className="leader-image" />
          <p className="leader-title">Poornachandra Shetty</p>
          <p className="leader-title1">President</p>
        </div>

        {/* Vice President on the right */}
        <div className="leader">
          <img src="./surendra.jpeg" alt="Vice President" className="leader-image" />
          <p className="leader-title">Surendra Devadiga</p>
          <p className="leader-title1">Vice President</p>
        </div>
      </div>

      <h1>Welcome to KPL 2025</h1>
      
      <div className="button-container">
        <button onClick={() => navigate('/form')}>Player Registration</button>
        <button onClick={() => navigate('/view')}>Player Lists</button>
      </div>

      {/* Footer section for copyright */}
      <footer className="footer" id='footerright'>
        <p>&copy; 2024 mpshetty. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default WelcomePage;
