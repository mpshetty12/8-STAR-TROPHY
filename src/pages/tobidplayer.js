import React, { useState, useEffect } from 'react';
import { db } from './firebase';
import { collection, getDocs } from 'firebase/firestore';
import './tobidplayer.css';

const TobidPlayer = () => {
  const [players, setPlayers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredPlayers, setFilteredPlayers] = useState([]);

  useEffect(() => {
    const fetchPlayers = async () => {
      const userCollection = collection(db, '8starplayers');
      const userSnapshot = await getDocs(userCollection);
      const sortedPlayers = userSnapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter((player) => player.orderid === 10000) // Exclude players with orderid 10000
        .sort((a, b) => a.fmcid - b.fmcid);

      setPlayers(sortedPlayers);
      setFilteredPlayers(sortedPlayers);
    };

    fetchPlayers();
  }, []);

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = players.filter(
      (player) =>
        player.name?.toLowerCase().includes(query) ||
        player.mobile_number?.toLowerCase().includes(query)
    );

    setFilteredPlayers(filtered);
  };

  return (
    <div className="teamview-container">
      <h2>All Registered Players</h2>

      <div className="search-container">
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearch}
          placeholder="Search by Name or Mobile"
          className="search-input"
        />
      </div>

      <div className="players-grid">
        {filteredPlayers.length > 0 ? (
          filteredPlayers.map((player, index) => (
            <div className="player-card" key={index}>
              <div className="player-card-content">
                <div className="player-image-container">
                  <img
                    src={player?.photo_url || 'https://via.placeholder.com/150'}
                    alt={player?.name || `Player ${index + 1}`}
                    className="player-image"
                  />
                  <h4 className="player-name">
                    {player?.name || `Player ${index + 1}`} ({player.fmcid})
                  </h4>
                </div>
                <div className="player-details">
                  <p>
                    <strong>Shirt Size:</strong> {player.shirt_size}
                  </p>
                  <p>
                    <strong>Mobile:</strong> {player.mobile_number}
                  </p>
                  <p>
                    <strong>Player Type:</strong> {player.player_type}
                  </p>
                  <p>
                    <strong>Jersey Number:</strong> {player.jersey_number}
                  </p>
                  <p>
                    <strong>Address:</strong> {player.address}
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="no-players">No players registered.</p>
        )}
      </div>
    </div>
  );
};

export default TobidPlayer;
