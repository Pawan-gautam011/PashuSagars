import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './App.css';
import './index.css';
import App from './App.jsx';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from './Components/Login.jsx';
import LoginUserPage from './pages/LoginUserPage.jsx';
import Signup from './Components/Signup.jsx';
import Pharmacy from './pages/Pharmacy.jsx';
import OnlineConsultation from './pages/OnlineConsultation.jsx';
import OnlineBooking from './pages/OnlineBooking.jsx';
import Aboutus from './Components/Aboutus.jsx';
// import Navbar from './Components/Navbar.jsx';
// import Footer from './Components/Footer.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/login" element={<Login />} />
        <Route path="/LoginUserpage" element={<LoginUserPage/>} />
        <Route path="/signup" element={<Signup/>}  />
        <Route path="/pharmacy" element={<Pharmacy/>}  />
        <Route path="/online-consultation" element={<OnlineConsultation/>}  />
        <Route path="/online-booking" element={<OnlineBooking/>}  />
        <Route path="/aboutus" element={<Aboutus/>} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
