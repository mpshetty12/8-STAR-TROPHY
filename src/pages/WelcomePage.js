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
      
      {/* Button container with additional "Team View" and "Bidding" buttons */}
      <div className="button-container">
        <button onClick={() => navigate('/form')}>Player Registration</button>
        <button onClick={() => navigate('/view')}>Player Lists</button>
        <button onClick={() => navigate('/teamview')}>Team View</button>
        <button onClick={() => navigate('/login')}>Bidding</button> {/* New button for Bidding */}
        <button onClick={() => navigate('/admin12345678980')}>Bidd start</button> {/* New button for Bidding */}
      </div>

      {/* Footer */}
      <footer className="footer" id='footerright'>
        <p>&copy; 2024 mpshetty. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default WelcomePage;




// // WelcomePage.js

// import React from 'react';
// import { useNavigate } from 'react-router-dom';
// import { getFirestore, collection, getDocs, updateDoc, doc, setDoc } from 'firebase/firestore';
// import './WelcomePage.css';

// const WelcomePage = () => {
//   const navigate = useNavigate();
//   const db = getFirestore();

//   // Function to reset bidding points for all teams in the `teams` collection
//   const resetBiddingPointsForAllTeams = async () => {
//     try {
//       const teamsCollection = collection(db, 'teams');
//       const snapshot = await getDocs(teamsCollection);
      
//       snapshot.forEach(async (teamDoc) => {
//         const teamRef = doc(db, 'teams', teamDoc.id);
//         await updateDoc(teamRef, { 
//           currentbidpoint: 0,
//           minbidpoint: 0,
//           maxbidpoint: 100
//         });
//       });

//       alert("Bidding points have been reset for all teams.");
//     } catch (error) {
//       console.error("Error updating teams:", error);
//       alert("Failed to reset bidding points.");
//     }
//   };

//   // Function to create teams in the `teams` collection
//   const createTeams = async () => {
//     const teamNames = [
//       "ಕಲ್ಪವೃಕ್ಷ ಬಿಜೂರ", 
//       "ಶ್ರೀ ಜೈನ ಜಟ್ಟಿಗೇಶ್ವರ ಫ್ರೆಂಡ್ಸ್", 
//       "ಉತ್ಸವಿ ಫ್ರೆಂಡ್ಸ್ ನಾಗೂರು", 
//       "ಅಹನ್ ಪ್ರಥ್ವಿ ಫ್ರೆಂಡ್ಸ್ ಬೈಂದೂರ್", 
//       "ನಂದಿಕೇಶ್ವರ ಬಿಜೂರ್", 
//       "ಫ್ರೆಂಡ್ಸ್ ಉಪ್ಪುಂದ", 
//       "ಯಂಗ್ ಸ್ಟಾರ್ ಬೈಂದೂರು"
//     ];

//     try {
//       for (let i = 0; i < teamNames.length; i++) {
//         const teamId = (i + 1).toString(); // Document ID as "1", "2", ..., "7"
//         const teamData = {
//           team_id: teamId,
//           team_name: teamNames[i],
//           currentbidpoint: 100,
//           maxbidpoint: 100,
//           minbidpoint: 0
//         };

//         await setDoc(doc(db, "teams", teamId), teamData);
//       }
//       alert("Teams created successfully!");
//     } catch (error) {
//       console.error("Error creating teams:", error);
//       alert("Failed to create teams.");
//     }
//   };

//   return (
//     <div className="welcome-container">
//       <img src="./kpl2025.png" alt="KPL 2025" className="logo" />

//       <div className="leaders-container">
//         <div className="leader">
//           <img src="./poorna.jpeg" alt="President" className="leader-image" />
//           <p className="leader-title">Poornachandra Shetty</p>
//           <p className="leader-title1">President</p>
//         </div>
//         <div className="leader">
//           <img src="./surendra.jpeg" alt="Vice President" className="leader-image" />
//           <p className="leader-title">Surendra Devadiga</p>
//           <p className="leader-title1">Vice President</p>
//         </div>
//       </div>

//       <h1>Welcome to KPL 2025</h1>
      
//       <div className="button-container">
//         <button onClick={() => navigate('/form')}>Player Registration</button>
//         <button onClick={() => navigate('/view')}>Player Lists</button>
//         <button onClick={() => navigate('/teamview')}>Team View</button>
//         <button onClick={() => navigate('/login')}>Bidding</button>
//         <button onClick={resetBiddingPointsForAllTeams}>Reset Bidding Points</button>
//         <button onClick={createTeams}>Initialize Teams</button> {/* Button to create teams */}
//       </div>

//       <footer className="footer" id='footerright'>
//         <p>&copy; 2024 mpshetty. All rights reserved.</p>
//       </footer>
//     </div>
//   );
// };

// export default WelcomePage;
