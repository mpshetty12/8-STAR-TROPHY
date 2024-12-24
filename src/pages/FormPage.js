import React, { useState, useEffect } from 'react';
import { storage, db } from './firebase';
import { useNavigate } from 'react-router-dom';

import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, query, where, getDocs, orderBy, limit, updateDoc, arrayUnion, doc } from 'firebase/firestore';
import './FormPage.css';

const FormPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    shirtSize: '',
    jerseyNumber: '',
    address: '',
    mobileNumber: '',
    photo: null,
    playerType: '',
    aadharNumber: '',
    aadharPhoto: null,
    team: '', // Store the selected team ID here
    top: 1000,
    orderid: 10000
  });
  const [teams, setTeams] = useState([]);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch teams from Firestore on component mount
  useEffect(() => {
    const fetchTeams = async () => {
      const teamCollection = collection(db, 'teams');
      const teamSnapshot = await getDocs(teamCollection);
      setTeams(teamSnapshot.docs.map((doc) => ({
        id: doc.id,
        team_id: doc.data().team_id,
        team_name: doc.data().team_name,
      })));
    };
    fetchTeams();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.files[0] });
  };

  const checkIfMobileNumberExists = async (mobileNumber) => {
    const q = query(collection(db, '8starplayers'), where('mobile_number', '==', mobileNumber));
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  };

  const getNextFmcid = async () => {
    const q = query(collection(db, '8starplayers'), orderBy('fmcid', 'desc'), limit(1));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const lastUser = querySnapshot.docs[0].data();
      return lastUser.fmcid + 1;
    } else {
      return 31;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!formData.photo) {
      alert('Please select a photo to upload.');
      setIsSubmitting(false);
      return;
    }

    try {
      const mobileNumberExists = await checkIfMobileNumberExists(formData.mobileNumber);
      if (mobileNumberExists) {
        alert('This mobile number is already registered. Please use a different number.');
        setIsSubmitting(false);
        return;
      }

      const nextFmcid = await getNextFmcid();
      const photoFileName = `${Date.now()}_${formData.photo.name}`;
      const storageRef = ref(storage, `8starplayers/${photoFileName}`);
      await uploadBytes(storageRef, formData.photo);
      const photoUrl = await getDownloadURL(storageRef);

      // let aadharPhotoUrl = null;
      // if (formData.playerType === 'Legend Player' && formData.aadharPhoto) {
      //   const aadharFileName = `${Date.now()}_${formData.aadharPhoto.name}`;
      //   const aadharStorageRef = ref(storage, `aadharPhotos/${aadharFileName}`);
      //   await uploadBytes(aadharStorageRef, formData.aadharPhoto);
      //   aadharPhotoUrl = await getDownloadURL(aadharStorageRef);
      // }

      // Add player data to the "8starplayers" collection
      await addDoc(collection(db, '8starplayers'), {
        name: formData.name,
        shirt_size: formData.shirtSize,
        jersey_number: formData.jerseyNumber,
        address: formData.address,
        mobile_number: formData.mobileNumber,
        photo_url: photoUrl,
        player_type: formData.playerType,
        fmcid: nextFmcid,
        teamid: formData.team,
        payment: '',
        orderid: 10000,
        top: 1000
        // ...(formData.playerType === 'Legend Player' && {
        //   aadhar_number: formData.aadharNumber,
        //   aadhar_photo_url: aadharPhotoUrl,
        // }),
      });

      // Update the selected team document in the "teams" collection
      if (formData.team) {
        const selectedTeam = teams.find((team) => team.team_id === Number(formData.team));
        if (selectedTeam) {
          const teamDocRef = doc(db, 'teams', selectedTeam.id);
          await updateDoc(teamDocRef, {
            players: arrayUnion(nextFmcid),
          });
        }
      }

      setFormSubmitted(true);
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('An error occurred. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="form-container">
      {formSubmitted ? (
        <div className="success-message">
          <h2>Form Submitted Successfully!</h2>
          <div className="checkmark">&#10004;</div>
          <p>ನಿಮ್ಮ ವಿವರಗಳು ಗಣನೆಗೆ ತೆಗೆದುಕೊಂಡಿದೆ, ನಿರ್ವಾಹಕರುಗಳು ನಿಮ್ಮನ್ನು ಸಂಪರ್ಕಿಸುವರು. ನಿಮ್ಮ ನೋಂದಣಿಯ ವಿವರಗಳನ್ನು ವೀಕ್ಷಿಸಲು ಈ ಕೆಳಗಿನ ಲಿಂಕ್ ಅಲ್ಲಿ ನೋಡಿ</p>
          <button onClick={() => navigate('/view')}>Players View/ ನೋಂದಣಿಯಾದ ಆಟಗಾರರ ಪಟ್ಟಿ</button>
        </div>
      ) : (
        <>
          <h2>Enter Player Details / ಆಟಗಾರರ ವಿವರಗಳು  (ಬೈಂದೂರು ವಿಧಾನಸಭಾ ಕ್ಷೇತ್ರ ವ್ಯಾಪ್ತಿಗೆ ಒಳಪಟ್ಟ ಆಟಗಾರರು ಮಾತ್ರ ನೋಂದಣಿಯಾಗಬೇಕು)</h2>
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label htmlFor="name">Name/ ಹೆಸರು</label>
              <input type="text" id="name" name="name" onChange={handleChange} required />
            </div>
            <div className="input-group">
              <label htmlFor="shirtSize">T-Shirt Size/ ಟೀ ಶರ್ಟ್ ಸೈಜ್ </label>
              <select id="shirtSize" name="shirtSize" onChange={handleChange} required>
                <option value="">ಸೈಜ್ ಆಯ್ಕೆ ಮಾಡಿ</option>
                <option value="S">S</option>
                <option value="M">M</option>
                <option value="L">L</option>
                <option value="XL">XL</option>
                <option value="XXL">XXL</option>
              </select>
            </div>

            <div className="input-group">
              <label htmlFor="jerseyNumber">Jersey Number/ ಜೆರ್ಸಿ ನಂಬರ್ (0-999)</label>
              <input type="number" id="jerseyNumber" name="jerseyNumber" min="0" max="999" onChange={handleChange} required />
            </div>

            <div className="input-group">
              <label htmlFor="address">Address / ವಿಳಾಸ</label>
              <input type="text" id="address" name="address" onChange={handleChange} required />
            </div>

            <div className="input-group">
              <label htmlFor="mobileNumber">Mobile Numbe0r/ ಮೊಬೈಲ್ ಸಂಖ್ಯೆ</label>
              <input type="text" id="mobileNumber" name="mobileNumber" onChange={handleChange} required />
            </div>

            <div className="input-group">
              <label htmlFor="playerType">Player Type/ ಆಟಗಾರನ ವಿಧ</label>
              <select id="playerType" name="playerType" onChange={handleChange} required>
                <option value="">ಆಯ್ಕೆ ಮಾಡಿ</option>
                <option value="Batsman">Batsman/ ಬ್ಯಾಟ್ಸ್ ಮ್ಯಾನ್</option>
                <option value="Bowler">Bowler/ ಬೋಲರ್</option>
                <option value="Wicket Keeper">Wicket Keeper/ ವಿಕೆಟ್ ಕೀಪರ್ </option>
                <option value="Allrounder">Allrounder/ ಆಲ್ ರೌಂಡರ್</option>
                {/* <option value="Owner">Owner (ನೊಂದಾಯಿಸಿದ ತಂಡದವರಿಗೆ ಮಾತ್ರ)</option>
                <option value="Icon Player">Icon Player (ನೊಂದಾಯಿಸಿದ ತಂಡದವರಿಗೆ ಮಾತ್ರ)</option>
                <option value="Legend Player">Legend Player (ನೊಂದಾಯಿಸಿದ ತಂಡದವರಿಗೆ ಮಾತ್ರ)</option> */}
              </select>
            </div>

            {/* {formData.playerType === 'Legend Player' && (
              <>
                <div className="input-group">
                  <label htmlFor="aadharNumber">Aadhar Number</label>
                  <input type="text" id="aadharNumber" name="aadharNumber" onChange={handleChange} required />
                </div>

                <div className="input-group">
                  <label htmlFor="aadharPhoto">Upload Aadhar Photo</label>
                  <input type="file" id="aadharPhoto" name="aadharPhoto" onChange={handleFileChange} required />
                </div>
              </>
            )} */}

            {/* {(formData.playerType === 'Owner' || formData.playerType === 'Icon Player' || formData.playerType === 'Legend Player') && (
              <div className="input-group">
                <label htmlFor="team">Select Team</label>
                <select id="team" name="team" onChange={handleChange} required>
                  <option value="">Select Team</option>
                  {teams.map((team) => (
                    <option key={team.team_id} value={team.team_id}>{team.team_name}</option>
                  ))}
                </select>
              </div>
            )} */}

            <div className="input-group">
              <label htmlFor="photo">Upload Photo/ ಫೋಟೋ</label>
              <input type="file" id="photo" name="photo" onChange={handleFileChange} required />
            </div>

            <button type="submit" disabled={isSubmitting}>Submit/ ಸಲ್ಲಿಸಿ</button>
          </form>
        </>
      )}
   
    </div>
  );
};

export default FormPage;
