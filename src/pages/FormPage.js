import React, { useState } from 'react';
import { storage, db } from './firebase'; // Import Firebase storage and Firestore
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'; // Firebase storage functions
import { collection, addDoc, query, where, getDocs, orderBy, limit } from 'firebase/firestore'; // Firestore functions
import './FormPage.css';

const FormPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    shirtSize: '',
    jerseyNumber: '',
    address: '',
    mobileNumber: '',
    photo: null,
    playerType: '',
  });
  const [formSubmitted, setFormSubmitted] = useState(false); // Track submission state
  const [isSubmitting, setIsSubmitting] = useState(false); // Track if submit button should be disabled

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, photo: e.target.files[0] });
  };

  const checkIfMobileNumberExists = async (mobileNumber) => {
    const q = query(collection(db, 'users'), where('mobile_number', '==', mobileNumber));
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty; // Returns true if a user with the same mobile number exists
  };

  const getNextFmcid = async () => {
    const q = query(collection(db, 'users'), orderBy('fmcid', 'desc'), limit(1)); // Query the highest fmcid
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const lastUser = querySnapshot.docs[0].data();
      return lastUser.fmcid + 1; // Increment the last fmcid
    } else {
      return 31; // If no users, start at 31
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Block multiple submissions by disabling the submit button
    setIsSubmitting(true);

    if (!formData.photo) {
      alert('Please select a photo to upload.');
      setIsSubmitting(false); // Re-enable submit button on failure
      return;
    }

    try {
      // Check if the mobile number is already registered
      const mobileNumberExists = await checkIfMobileNumberExists(formData.mobileNumber);
      if (mobileNumberExists) {
        alert('This mobile number is already registered. Please use a different number.');
        setIsSubmitting(false); // Re-enable submit button if already registered
        return; // Stop form submission if the number is already registered
      }

      // Get the next available fmcid
      const nextFmcid = await getNextFmcid();

      const fileName = `${Date.now()}_${formData.photo.name}`; // Create a unique filename
      const storageRef = ref(storage, `playerPhotos/${fileName}`);

      // Upload photo to Firebase Storage
      await uploadBytes(storageRef, formData.photo);

      // Get photo URL
      const photoUrl = await getDownloadURL(storageRef);

      // Insert form data into Firestore
      await addDoc(collection(db, 'users'), {
        name: formData.name,
        shirt_size: formData.shirtSize,
        jersey_number: formData.jerseyNumber,
        address: formData.address,
        mobile_number: formData.mobileNumber,
        photo_url: photoUrl,
        player_type: formData.playerType,
        fmcid: nextFmcid, // Use the next fmcid
        teamid:0,
        payment:"",
      });

      setFormSubmitted(true);
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('An error occurred. Please try again.');
      setIsSubmitting(false); // Re-enable submit button on error
    }
  };

  return (
    <div className="form-container">
      {formSubmitted ? (
        <div className="success-message">
          <h2>Form Submitted Successfully!</h2>
          <div className="checkmark">&#10004;</div>
          <p>Your details have been recorded.</p>
        </div>
      ) : (
        <>
          <h2>Enter Player Details</h2>
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Name"
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-group">
              <label htmlFor="shirtSize">Shirt Size</label>
              <select
                id="shirtSize"
                name="shirtSize"
                onChange={handleChange}
                required
              >
                <option value="">Select Shirt Size</option>
                <option value="XS">XS</option>
                <option value="S">S</option>
                <option value="M">M</option>
                <option value="L">L</option>
                <option value="XL">XL</option>
                <option value="XXL">XXL</option>
              </select>
            </div>

            <div className="input-group">
              <label htmlFor="jerseyNumber">Jersey Number (0-999)</label>
              <input
                type="number"
                id="jerseyNumber"
                name="jerseyNumber"
                placeholder="Jersey Number"
                min="0"
                max="999"
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-group">
              <label htmlFor="address">Address</label>
              <input
                type="text"
                id="address"
                name="address"
                placeholder="Address"
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-group">
              <label htmlFor="mobileNumber">Mobile Number</label>
              <input
                type="text"
                id="mobileNumber"
                name="mobileNumber"
                placeholder="Mobile Number"
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-group">
              <label htmlFor="playerType">Player Type</label>
              <select
                id="playerType"
                name="playerType"
                onChange={handleChange}
                required
              >
                <option value="">Select Player Type</option>
                <option value="Batsman">Batsman</option>
                <option value="Bowler">Bowler</option>
                <option value="Wicket Keeper">Wicket Keeper</option>
                <option value="Allrounder">Allrounder</option>
              </select>
            </div>

            <div className="input-group">
              <label htmlFor="photo">Upload Photo</label>
              <input type="file" id="photo" onChange={handleFileChange} required />
            </div>

            <button type="submit" disabled={isSubmitting}>Submit</button>
          </form>
        </>
      )}
      <footer className="footer" id="formfooter">
        <p>© 2024 mpshetty. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default FormPage;
