import React, { useState, useEffect } from 'react';
import { db } from './firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import './teamview.css';

const TeamView = () => {
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState('');
  const [players, setPlayers] = useState([]);
  const [password, setPassword] = useState('');
  const [isPasswordCorrect, setIsPasswordCorrect] = useState(false);

  const predefinedPassword = 'kpl_2025_teamsecret';

  useEffect(() => {
    if (isPasswordCorrect) {
      const fetchTeams = async () => {
        const teamCollection = collection(db, 'teams');
        const teamSnapshot = await getDocs(teamCollection);
        setTeams(
          teamSnapshot.docs.map((doc) => ({
            id: doc.id,
            team_id: doc.data().team_id,
            team_name: doc.data().team_name,
            players: doc.data().players || [],
          }))
        );
      };
      fetchTeams();
    }
  }, [isPasswordCorrect]);

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (password === predefinedPassword) {
      setIsPasswordCorrect(true);
    } else {
      alert('Incorrect password!');
    }
  };

  const handleTeamChange = async (e) => {
    const teamId = e.target.value;
    setSelectedTeam(teamId);

    if (!teamId) {
      setPlayers([]); // Clear players if no team is selected
      return;
    }

    const selected = teams.find((team) => team.team_id === Number(teamId));
    if (selected && selected.players.length > 0) {
      const userQuery = query(
        collection(db, 'users'),
        where('fmcid', 'in', selected.players)
      );
      const userSnapshot = await getDocs(userQuery);
      setPlayers(userSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    } else {
      setPlayers([]);
    }
  };

  const renderPlayerCard = (player, placeholderText) => (
    <div className="player-card" key={player ? player.fmcid : placeholderText}>
      {player ? (
        <>
          {player.photo_url ? (
            <img src={player.photo_url} alt={player.name} className="player-image" />
          ) : (
            <div className="no-image">No Image</div>
          )}
          <h3>{player.name}</h3>
          <p><strong>FMC ID:</strong> FMC{player.fmcid}</p>
          <p><strong>Shirt Size:</strong> {player.shirt_size}</p>
          <p><strong>Jersey Number:</strong> {player.jersey_number}</p>
          <p><strong>Mobile:</strong> {player.mobile_number}</p>
          <p><strong>Address:</strong> {player.address}</p>
          <p><strong>Player Type:</strong> {player.player_type}</p>
          <p><strong>Payment Status:</strong> {player.payment || 'Not Paid'}</p>
        </>
      ) : (
        <div className="placeholder-text">{placeholderText}</div>
      )}
    </div>
  );

  return (
    <div className="teamview-container">
      <h2>Team View</h2>

      {!isPasswordCorrect && (
        <div className="password-container">
          <h2>Enter Password to Access Team View</h2>
          <form onSubmit={handlePasswordSubmit}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              required
            />
            <button type="submit">Submit</button>
          </form>
        </div>
      )}

      {isPasswordCorrect && (
        <>
          <header className="header">
        <h1>Friends Marikamba Trophy - 2024</h1>
        <p>
          <strong>Date:</strong> 18-01-2025 to 19-01-2025 | <strong>Venue:</strong> M.P.
          Krishnayya Sherugar Cricket Ground, Kalavadi
        </p>
        <p>
          <strong>Opening Ceremony:</strong> 5:00 PM
        </p>
      </header>

      <nav className="navbar">
        <h2>Select Team</h2>
        <select value={selectedTeam} onChange={handleTeamChange}>
          <option value="">Choose a team</option>
          {teams.map((team) => (
            <option key={team.team_id} value={team.team_id}>
              {team.team_name}
            </option>
          ))}
        </select>
      </nav>

          {selectedTeam ? (
            <div className="players-list">
              {Array.from({ length: 10 }).map((_, index) => {
                const player = players[index];
                const placeholderText = `Player ${index + 1} - ${
                  index < players.length ? '' : 'Not yet registered'
                }`;
                return renderPlayerCard(player, placeholderText);
              })}
            </div>
          ) : (
            <p className="no-team-selected">Please select a team to view players.</p>
          )}
        </>
      )}
    </div>
  );
};

export default TeamView;

// import React, { useState, useEffect } from "react";
// import { db } from "./firebase";
// import { collection, getDocs, query, where } from "firebase/firestore";
// import "./teamview.css";

// const TeamView = () => {
//   const [teams, setTeams] = useState([]);
//   const [selectedTeam, setSelectedTeam] = useState("");
//   const [players, setPlayers] = useState([]);
//   const [flippedCard, setFlippedCard] = useState(null); // Track which card is flipped

//   useEffect(() => {
//     const fetchTeams = async () => {
//       const teamCollection = collection(db, "teams");
//       const teamSnapshot = await getDocs(teamCollection);
//       setTeams(
//         teamSnapshot.docs.map((doc) => ({
//           id: doc.id,
//           team_id: doc.data().team_id,
//           team_name: doc.data().team_name,
//           players: doc.data().players || [],
//         }))
//       );
//     };
//     fetchTeams();
//   }, []);

//   const handleTeamChange = async (e) => {
//     const teamId = e.target.value;
//     setSelectedTeam(teamId);

//     if (!teamId) {
//       setPlayers([]);
//       return;
//     }

//     const selected = teams.find((team) => team.team_id === Number(teamId));
//     if (selected && selected.players.length > 0) {
//       const userQuery = query(
//         collection(db, "users"),
//         where("fmcid", "in", selected.players)
//       );
//       const userSnapshot = await getDocs(userQuery);
//       setPlayers(userSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
//     } else {
//       setPlayers([]);
//     }
//   };

//   const toggleFlipCard = (index) => {
//     setFlippedCard(flippedCard === index ? null : index); // Toggle flip
//   };

//   return (
//     <div className="teamview-container">
//       <header className="header">
//         <h1>Friends Marikamba Trophy - 2024</h1>
//         <p>
//           <strong>Date:</strong> 27-01-2024 to 28-01-2024 | <strong>Venue:</strong> M.P.
//           Krishnayya Sherugar Cricket Ground, Kalavadi
//         </p>
//         <p>
//           <strong>Opening Ceremony:</strong> 5:00 PM
//         </p>
//       </header>

//       <nav className="navbar">
//         <h2>Select Team</h2>
//         <select value={selectedTeam} onChange={handleTeamChange}>
//           <option value="">Choose a team</option>
//           {teams.map((team) => (
//             <option key={team.team_id} value={team.team_id}>
//               {team.team_name}
//             </option>
//           ))}
//         </select>
//       </nav>

//       {selectedTeam && (
//         <div className="team-section">
//           <h2>{teams.find((team) => team.team_id === Number(selectedTeam))?.team_name}</h2>
//           <div className="players-grid">
//             {Array.from({ length: 11 }).map((_, index) => {
//               const player = players[index];
//               return (
//                 <div
//                   className={`player-card ${flippedCard === index ? "flipped" : ""}`}
//                   key={index}
//                   onClick={() => toggleFlipCard(index)}
//                 >
//                   {/* Front Side */}
//                   <div className="card-front">
//                     <img
//                       src={player?.photo_url || "https://via.placeholder.com/150"}
//                       alt={player?.name || `Player ${index + 1}`}
//                       className="player-image"
//                     />
//                     <h3>{player?.name || `Player ${index + 1}`}</h3>
//                     <p>{player?.player_type || "Player"}</p>
//                   </div>

//                   {/* Back Side */}
//                   <div className="card-back">
//                     {player ? (
//                       <>
//                         <h3>{player.name}</h3>
//                         <p><strong>FMC ID:</strong> FMC{player.fmcid}</p>
//                         <p><strong>Shirt Size:</strong> {player.shirt_size}</p>
//                         <p><strong>Jersey Number:</strong> {player.jersey_number}</p>
//                         <p><strong>Mobile:</strong> {player.mobile_number}</p>
//                         <p><strong>Address:</strong> {player.address}</p>
//                         <p><strong>Player Type:</strong> {player.player_type}</p>
//                         <p><strong>Payment Status:</strong> {player.payment || "Not Paid"}</p>
//                       </>
//                     ) : (
//                       <p>Details not available</p>
//                     )}
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default TeamView;
