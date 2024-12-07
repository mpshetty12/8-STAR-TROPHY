// import React, { useState, useEffect } from 'react';
// import { db } from './firebase'; // Import Firestore
// import { collection, getDocs, orderBy, query, updateDoc, doc } from 'firebase/firestore'; // Firestore functions
// import './ViewPage.css';
// import { FaWhatsapp } from 'react-icons/fa'; // Import WhatsApp icon from FontAwesome or similar

// const ViewPage = () => {
//   const [users, setUsers] = useState([]);
//   const [filteredUsers, setFilteredUsers] = useState([]);
//   const [playerCount, setPlayerCount] = useState(0);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [playerTypeFilter, setPlayerTypeFilter] = useState('all');

//   const paymentPassword = 'pay_2024_password'; // Password to mark payment as "paid"

//   // Fetch users from Firestore
//   useEffect(() => {
//     const fetchUsers = async () => {
//       const q = query(collection(db, 'users'), orderBy('fmcid', 'asc'));
//       const querySnapshot = await getDocs(q);
//       const usersList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

//       // Exclude "Owner", "Legend Player" and "Icon Player" from the users list
//       const filteredUsersList = usersList.filter(user => user.player_type !== 'Owner' && user.player_type !== 'Icon Player' && user.player_type !== 'Legend Player');
//       setUsers(filteredUsersList);
//       setFilteredUsers(filteredUsersList); // Initially, show all filtered users
//       setPlayerCount(filteredUsersList.length); // Set count for the filtered list
//     };
//     fetchUsers();
//   }, []);

//   // Handle search and filtering logic
//   useEffect(() => {
//     let filtered = users;

//     // Filter by player type
//     if (playerTypeFilter !== 'all') {
//       filtered = filtered.filter(user => user.player_type === playerTypeFilter);
//     }

//     // Filter by search term (name)
//     if (searchTerm) {
//       filtered = filtered.filter(user => user.name.toLowerCase().includes(searchTerm.toLowerCase()));
//     }

//     setFilteredUsers(filtered);
//   }, [searchTerm, playerTypeFilter, users]);

//   // Handle payment status update
//   const handlePaymentUpdate = async (userId) => {
//     const enteredPassword = prompt('Enter payment password to confirm:');
//     if (enteredPassword === paymentPassword) {
//       const userDocRef = doc(db, 'users', userId);
//       await updateDoc(userDocRef, { payment: 'paid' });
//       // Update the local state
//       const updatedUsers = users.map(user => 
//         user.id === userId ? { ...user, payment: 'paid' } : user
//       );
//       setUsers(updatedUsers);
//       setFilteredUsers(updatedUsers); // Update filtered users
//       alert('Payment status updated to "paid".');
//     } else {
//       alert('Incorrect password. Payment status not updated.');
//     }
//   };

//   // Function to create WhatsApp link
//   const createWhatsAppLink = (mobileNumber) => {
//     return `https://wa.me/${mobileNumber}`;
//   };

//   return (
//     <div className="view-container">
//       {/* No password protection for the page anymore */}
      
//       <div className="top-bar">
//         <div className="player-count">
//           Total Players: {playerCount}
//         </div>

//         <div className="search-bar">
//           <input
//             type="text"
//             placeholder="Search by name"
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//           />
//           <select onChange={(e) => setPlayerTypeFilter(e.target.value)} value={playerTypeFilter}>
//             <option value="all">All</option>
//             <option value="Batsman">Batsman</option>
//             <option value="Bowler">Bowler</option>
//             <option value="Wicket Keeper">Wicket Keeper</option>
//             <option value="Allrounder">Allrounder</option>
//           </select>
//         </div>
//       </div>

//       <h2>Players List</h2>
//       <div className="card-list">
//         {filteredUsers.map((user) => (
//           <div className="card" key={user.id}>
//             <div className="card-content-1">
//             <img src={user.photo_url} alt="User" className="user-image" />
//             <h3>{user.name}</h3>
//             </div>
//             <div className="card-content">
//               <p><strong>FMC ID:</strong> FMC{user.fmcid}</p>
//               <p><strong>Shirt Size:</strong> {user.shirt_size}</p>
//               <p><strong>Jersey Number:</strong> {user.jersey_number}</p>
//               <p><strong>Mobile:</strong> {user.mobile_number}</p>
//               <p><strong>Address:</strong> {user.address}</p>
//               <p><strong>Player Type:</strong> {user.player_type}</p>
//               <p>{user.payment || 'Not Paid'}</p>

//               {/* Payment Button */}
//               {/* {(!user.payment || user.payment.toLowerCase() === 'not paid') && (
//                 <button
//                   className="payment-button"
//                   onClick={() => handlePaymentUpdate(user.id)}
//                 >
//                   Mark as Paid
//                 </button>
//               )} */}

//               {/* WhatsApp Button */}
//               {/* <a
//                 href={createWhatsAppLink(user.mobile_number)}
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="whatsapp-button"
//                 title={`Message ${user.name} on WhatsApp`}
//               >
//                 <FaWhatsapp style={{ color: 'green', fontSize: '24px' }} />
//               </a> */}
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Footer section for copyright */}
//       {/* <footer className="footer" id="footerview">
//         <p>&copy; 2024 mpshetty. All rights reserved.</p>
//       </footer> */}
//     </div>
//   );
// };

// export default ViewPage;


import React, { useState, useEffect } from 'react';
import { db } from './firebase'; // Import Firestore
import { collection, getDocs, orderBy, query, updateDoc, doc } from 'firebase/firestore'; // Firestore functions
import './ViewPage.css';
import { FaWhatsapp } from 'react-icons/fa'; // Import WhatsApp icon from FontAwesome or similar

const ViewPage = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [playerCount, setPlayerCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [playerTypeFilter, setPlayerTypeFilter] = useState('all');

  const paymentPassword = 'pay_2024_password'; // Password to mark payment as "paid"

  // Fetch users from Firestore
  useEffect(() => {
    const fetchUsers = async () => {
      const q = query(collection(db, 'users'), orderBy('payment', 'asc'));
      const querySnapshot = await getDocs(q);
      const usersList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      // Exclude "Owner", "Legend Player" and "Icon Player" from the users list
      const filteredUsersList = usersList.filter(user => user.player_type !== 'Owner' && user.player_type !== 'Icon Player' && user.player_type !== 'Legend Player');
      setUsers(filteredUsersList);
      setFilteredUsers(filteredUsersList); // Initially, show all filtered users
      setPlayerCount(filteredUsersList.length); // Set count for the filtered list
    };
    fetchUsers();
  }, []);

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

  // Handle payment status update
  const handlePaymentUpdate = async (userId) => {
    const enteredPassword = prompt('Enter payment password to confirm:');
    if (enteredPassword === paymentPassword) {
      const userDocRef = doc(db, 'users', userId);
      await updateDoc(userDocRef, { payment: 'paid' });
      // Update the local state
      const updatedUsers = users.map(user => 
        user.id === userId ? { ...user, payment: 'paid' } : user
      );
      setUsers(updatedUsers);
      setFilteredUsers(updatedUsers); // Update filtered users
      alert('Payment status updated to "paid".');
    } else {
      alert('Incorrect password. Payment status not updated.');
    }
  };

  // Function to create WhatsApp link
  const createWhatsAppLink = (mobileNumber) => {
    return `https://wa.me/${mobileNumber}`;
  };

  return (
    <div className="view-container">
      {/* No password protection for the page anymore */}
      
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
            <option value="Wicket Keeper">Wicket Keeper</option>
            <option value="Allrounder">Allrounder</option>
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
              <p><strong>Payment Status:</strong> {user.payment || 'Not Paid'}</p>

              {/* Payment Button */}
              {(!user.payment || user.payment.toLowerCase() === 'not paid') && (
                <button
                  className="payment-button"
                  onClick={() => handlePaymentUpdate(user.id)}
                >
                  Mark as Paid
                </button>
              )}

              {/* WhatsApp Button */}
              <a
                href={createWhatsAppLink(user.mobile_number)}
                target="_blank"
                rel="noopener noreferrer"
                className="whatsapp-button"
                title={`Message ${user.name} on WhatsApp`}
              >
                <FaWhatsapp style={{ color: 'green', fontSize: '24px' }} />
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Footer section for copyright */}
      <footer className="footer" id="footerview">
        <p>&copy; 2024 mpshetty. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default ViewPage;