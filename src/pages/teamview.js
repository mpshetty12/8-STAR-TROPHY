import React, { useState, useEffect } from 'react';
import { db } from './firebase';
import { collection, getDocs, query, where} from 'firebase/firestore';
import './teamview.css';

// const addPlayerIdField = async () => {
//   try {
//     const usersCollection = collection(db, 'users'); // Reference to the users collection
//     const snapshot = await getDocs(usersCollection);
//     var a = 3000;

//     // Loop through each document to add the player_id field
//     for (const userDoc of snapshot.docs) {
//       const userRef = doc(db, 'users', userDoc.id); // Reference to the specific document
//       await updateDoc(userRef, { top: 3 }); // Add or update the player_id field
//     }

//     console.log('player_id field added successfully to all documents.');
//   } catch (error) {
//     console.error('Error updating documents:', error);
//   }
// };


const TeamView = () => {
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState('');
  const [players, setPlayers] = useState([]);
 

  useEffect(() => {
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
  },);


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

  const renderPlayerCard = (player, placeholderText, index) => (
    <div className="player-card" key={index}>
      <div className="player-card-inner">
        {/* Front Side */}
        <div className="player-card-front">
          <div className={`player-type ${player?.player_type}`}>
            {player?.player_type && <span>{player.player_type}</span>}
          </div>
          <img src={player?.photo_url || 'https://via.placeholder.com/150'} alt={player?.name || `Player ${index + 1}`} className="player-image" />
          <h3>{player?.name || `Player ${index + 1}`}</h3>
        </div>
        
        {/* Back Side (Details) */}
        <div className="player-card-back">
          {player ? (
            <>
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
            <p>Details not available</p>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="teamview-container">
      {/* <button onClick={addPlayerIdField}>Admin Panel</button> */}
      <h2>Team View</h2>
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
                return renderPlayerCard(player, placeholderText, index);
              })}
            </div>
          ) : (
            <p className="no-team-selected">Please select a team to view players.</p>
          )}
        </>
    </div>
  );
};

export default TeamView;