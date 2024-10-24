// import React, { useState, useEffect } from 'react';
// import { supabase } from '../supabaseClient';
// import './ViewPage.css';

// const ViewPage = () => {
//   const [users, setUsers] = useState([]);
//   const [password, setPassword] = useState('');
//   const [authenticated, setAuthenticated] = useState(false);
  
//   const correctPassword = 'kpl_12_2025';  // Replace with the correct password

//   useEffect(() => {
//     if (authenticated) {
//       const fetchUsers = async () => {
//         let { data: users, error } = await supabase
//           .from('users')
//           .select('*')
//           .order('player_type', { ascending: true });  // Sort users by player type
//         if (error) console.error(error);
//         else setUsers(users);
//       };
//       fetchUsers();
//     }
//   }, [authenticated]);

//   const handlePasswordChange = (e) => {
//     setPassword(e.target.value);
//   };

//   const handlePasswordSubmit = (e) => {
//     e.preventDefault();
//     if (password === correctPassword) {
//       setAuthenticated(true);
//     } else {
//       alert('Incorrect password. Please try again.');
//     }
//   };

//   return (
//     <div className="view-container">
//       {!authenticated ? (
//         <div className="password-protect">
//           <h2>Password Required</h2>
//           <form onSubmit={handlePasswordSubmit}>
//             <input
//               type="password"
//               placeholder="Enter password"
//               value={password}
//               onChange={handlePasswordChange}
//               required
//             />
//             <button type="submit">Submit</button>
//           </form>
//         </div>
//       ) : (
//         <>
//           <h2>Players List</h2>
//           <div className="card-list">
//             {users.map((user) => (
//               <div className="card" key={user.id}>
//                 <img src={user.photo_url} alt="User" className="user-image" />
//                 <div className="card-content">
//                   <h3>{user.name}</h3>
//                   <p><strong>FMC ID:</strong> {user.fmcid}</p>
//                   <p><strong>Shirt Size:</strong> {user.shirt_size}</p>
//                   <p><strong>Jersey Number:</strong> {user.jersey_number}</p>
//                   <p><strong>Mobile:</strong> {user.mobile_number}</p>
//                   <p><strong>Address:</strong> {user.address}</p>
//                   <p><strong>Player Type:</strong> {user.player_type}</p>
//                   <p><strong>Payment Status:</strong> {user.payment}</p>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </>
//       )}
//        {/* Footer section for copyright */}
//        <footer className="footer" id='footerview'>
//         <p>&copy; 2024 mpshetty. All rights reserved.</p>
//       </footer>
//     </div>
//   );
// };

// export default ViewPage;














import React, { useState, useEffect } from 'react';
import { db } from './firebase'; // Import Firestore
import { collection, getDocs, orderBy, query } from 'firebase/firestore'; // Firestore functions
import './ViewPage.css';

const ViewPage = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [playerCount, setPlayerCount] = useState(0);
  const [password, setPassword] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [playerTypeFilter, setPlayerTypeFilter] = useState('all');
  
  const correctPassword = 'kpl_2025_secret';  // Replace with the correct password

  useEffect(() => {
    if (authenticated) {
      const fetchUsers = async () => {
        const q = query(collection(db, 'users'), orderBy('player_type', 'asc'));
        const querySnapshot = await getDocs(q);
        const usersList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setUsers(usersList);
        setFilteredUsers(usersList); // Initially, show all users
        setPlayerCount(usersList.length);
      };
      fetchUsers();
    }
  }, [authenticated]);

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (password === correctPassword) {
      setAuthenticated(true);
    } else {
      alert('Incorrect password. Please try again.');
    }
  };

  // Handle search and filtering logic
  useEffect(() => {
    let filtered = users;

    // Filter by player type
    if (playerTypeFilter !== 'all') {
      filtered = filtered.filter(user => user.player_type === playerTypeFilter);
    }

    // Filter by search term (name)
    if (searchTerm) {
      filtered = filtered.filter(user => user.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }

    setFilteredUsers(filtered);
  }, [searchTerm, playerTypeFilter, users]);

  return (
    <div className="view-container">
      {!authenticated ? (
        <div className="password-protect">
          <h2>Password Required</h2>
          <form onSubmit={handlePasswordSubmit}>
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={handlePasswordChange}
              required
            />
            <button type="submit">Submit</button>
          </form>
        </div>
      ) : (
        <>
          <div className="top-bar">
            <div className="player-count">
              Total Players: {playerCount}
            </div>

            <div className="search-bar">
              <input
                type="text"
                placeholder="Search by name"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <select onChange={(e) => setPlayerTypeFilter(e.target.value)} value={playerTypeFilter}>
                <option value="all">All</option>
                <option value="Batsman">Batsman</option>
                <option value="Bowler">Bowler</option>
              </select>
            </div>
          </div>

          <h2>Players List</h2>
          <div className="card-list">
            {filteredUsers.map((user) => (
              <div className="card" key={user.id}>
                <img src={user.photo_url} alt="User" className="user-image" />
                <div className="card-content">
                  <h3>{user.name}</h3>
                  <p><strong>FMC ID:</strong> FMC{user.fmcid}</p>
                  <p><strong>Shirt Size:</strong> {user.shirt_size}</p>
                  <p><strong>Jersey Number:</strong> {user.jersey_number}</p>
                  <p><strong>Mobile:</strong> {user.mobile_number}</p>
                  <p><strong>Address:</strong> {user.address}</p>
                  <p><strong>Player Type:</strong> {user.player_type}</p>
                  <p><strong>Payment Status:</strong> {user.payment}</p>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
      {/* Footer section for copyright */}
      <footer className="footer" id="footerview">
        <p>&copy; 2024 mpshetty. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default ViewPage;
