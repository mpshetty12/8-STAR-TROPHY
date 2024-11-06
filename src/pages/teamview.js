import React, { useState, useEffect } from 'react';
import { db } from './firebase';
import { collection, getDocs, query, where, doc, updateDoc } from 'firebase/firestore';
import './teamview.css';

const TeamView = () => {
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState('');
  const [players, setPlayers] = useState([]);
  const [password, setPassword] = useState(''); // State for password input
  const [isPasswordCorrect, setIsPasswordCorrect] = useState(false); // State to track password validation

  // Predefined password for validation
  const predefinedPassword = 'kpl_2025_teamsecret'; // Set your password here

  useEffect(() => {
    if (isPasswordCorrect) {
      // Fetch all teams if password is correct
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

  const markAsPaid = async (playerId) => {
    try {
      const playerDocRef = doc(db, 'users', playerId);
      await updateDoc(playerDocRef, { payment: 'Paid' });
      setPlayers(players.map((player) =>
        player.id === playerId ? { ...player, payment: 'Paid' } : player
      ));
    } catch (error) {
      console.error('Error updating payment status:', error);
    }
  };

  if (!isPasswordCorrect) {
    return (
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
    );
  }

  return (
    <div className="teamview-container">
      <h2>Team View</h2>
      <div className="team-select">
        <label htmlFor="team">Select Team:</label>
        <select id="team" value={selectedTeam} onChange={handleTeamChange}>
          <option value="">Choose a team</option>
          {teams.map((team) => (
            <option key={team.team_id} value={team.team_id}>
              {team.team_name}
            </option>
          ))}
        </select>
      </div>

      <div className="players-list">
        {players.length > 0 ? (
          players.map((player) => (
            <div className="player-card" key={player.fmcid}>
              {/* Display player image */}
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
              {player.payment !== 'Paid' && (
                <button onClick={() => markAsPaid(player.id)} className="mark-paid-btn">
                  Mark as Paid
                </button>
              )}
            </div>
          ))
        ) : (
          <p className="no-players-message">No players found for this team.</p>
        )}
      </div>
    </div>
  );
};

export default TeamView;
