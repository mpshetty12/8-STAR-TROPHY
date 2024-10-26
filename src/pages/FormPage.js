import React, { useState } from 'react';
import { storage, db } from './firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import './FormPage.css';

const FormPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    shirtSize: '',
    jerseyNumber: '',
    address: '',
    mobileNumber: '',
    photo: null,
    paymentScreenshot: null,
    playerType: '',
  });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isPaymentAttempted, setIsPaymentAttempted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, photo: e.target.files[0] });
  };

  const handlePaymentScreenshotChange = (e) => {
    setFormData({ ...formData, paymentScreenshot: e.target.files[0] });
  };

  const checkIfMobileNumberExists = async (mobileNumber) => {
    const q = query(collection(db, 'users'), where('mobile_number', '==', mobileNumber));
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  };

  const getNextFmcid = async () => {
    const q = query(collection(db, 'users'), orderBy('fmcid', 'desc'), limit(1));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const lastUser = querySnapshot.docs[0].data();
      return lastUser.fmcid + 1;
    } else {
      return 31;
    }
  };

  const handlePaymentAttempt = () => {
    const paymentLink = 'https://link.upilink.in/frien97438859@barodampay/300';
    window.open(paymentLink, '_blank');
    setIsPaymentAttempted(true);  // Set to true after the first payment attempt
    alert("After completing the payment, please take a screenshot and upload it below.");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.photo || !formData.paymentScreenshot) {
      alert('Please upload both a profile photo and a payment screenshot.');
      return;
    }

    setLoading(true);

    try {
      const mobileNumberExists = await checkIfMobileNumberExists(formData.mobileNumber);
      if (mobileNumberExists) {
        alert('This mobile number is already registered. Please use a different number.');
        setLoading(false);
        return;
      }

      const nextFmcid = await getNextFmcid();

      const photoFileName = `${Date.now()}_${formData.photo.name}`;
      const photoStorageRef = ref(storage, `playerPhotos/${photoFileName}`);
      await uploadBytes(photoStorageRef, formData.photo);
      const photoUrl = await getDownloadURL(photoStorageRef);

      const paymentFileName = `${Date.now()}_payment_${formData.paymentScreenshot.name}`;
      const paymentStorageRef = ref(storage, `paymentsPhoto/${paymentFileName}`);
      await uploadBytes(paymentStorageRef, formData.paymentScreenshot);
      const paymentPhotoUrl = await getDownloadURL(paymentStorageRef);

      await addDoc(collection(db, 'users'), {
        name: formData.name,
        shirt_size: formData.shirtSize,
        jersey_number: formData.jerseyNumber,
        address: formData.address,
        mobile_number: formData.mobileNumber,
        photo_url: photoUrl,
        payment_photo_url: paymentPhotoUrl,
        player_type: formData.playerType,
        fmcid: nextFmcid,
        teamid: 0,
        payment: "Confirmed",
      });

      setFormSubmitted(true);
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('An error occurred. Please try again.');
      setLoading(false);
    } finally {
      setLoading(false);
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
              <label htmlFor="photo">Upload Profile Photo</label>
              <input type="file" id="photo" onChange={handleFileChange} required />
            </div>

            {isPaymentAttempted ? (
              <>
                <div>
                  <p>Payment Completed? Please upload your payment screenshot below. If failed please pay 300 to upi : <strong>frien97438859@barodampay</strong> and take screenshot</p>
                  <div className="input-group">
                    <label htmlFor="paymentScreenshot">Upload Payment Screenshot</label>
                    <input type="file" id="paymentScreenshot" onChange={handlePaymentScreenshotChange} required />
                  </div>
                  <button type="submit" disabled={loading}>
                    {loading ? 'Submitting...' : 'Submit'}
                  </button>
                </div>
              </>
            ) : (
              <div>
                <p>Please make the payment using the following UPI ID:</p>
                <button type="button" onClick={handlePaymentAttempt}>
                  Pay & Confirm
                </button>
                <p>Once payment is completed, return here and new field will come to upload a screenshot.</p>
              </div>
            )}
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
