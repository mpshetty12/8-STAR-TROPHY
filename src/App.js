import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import WelcomePage from './pages/WelcomePage';
import FormPage from './pages/FormPage';
// import ViewPage from './pages/ViewPage';
// import TeamView from './pages/teamview';
// import BiddingPage from './pages/BiddingPage_temp';
// import Admin from './pages/Admin';
// import LoginPage from './pages/Logipppage';
// import PubliccDisplay from './pages/Publicc';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/form" element={<FormPage />} />
        {/* <Route path="/view" element={<ViewPage />} />
        <Route path="/teamview" element={<TeamView />} />
        <Route path="/bidding" element={<BiddingPage />} />
        <Route path="/admin12345678980" element={<Admin />} />
        <Route path='/login' element={<LoginPage/>} />
        <Route path='/p' element={<PubliccDisplay/>} /> */}
        {/* <Route path="/viewp" element={<AdminViewOnly/>}/> */}
      </Routes>
    </Router>
  );
}

export default App;
