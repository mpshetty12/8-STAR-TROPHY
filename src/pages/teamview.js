import React, { useState, useEffect } from 'react';
import { db } from './firebase';
import { collection, getDocs, query, where, doc, updateDoc } from 'firebase/firestore';
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
          {player.payment !== 'Paid' && (
            <button onClick={() => markAsPaid(player.id)} className="mark-paid-btn">
              Mark as Paid
            </button>
          )}
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
          <div className="team-select">
            <label htmlFor="team">Select Team:</label>
            <select id="team" value={selectedTeam} onChange={handleTeamChange}>
              <option value="">Choose a team</option>
              {teams.length > 0 ? (
                teams.map((team) => (
                  <option key={team.team_id} value={team.team_id}>
                    {team.team_name}
                  </option>
                ))
              ) : (
                <option>Loading teams...</option>
              )}
            </select>
          </div>

          {selectedTeam ? (
            <div className="players-list">
              {Array.from({ length: 9 }).map((_, index) => {
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
