import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './App.css'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
// import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
// import Navbar from './Components/Navbar.jsx';
// import Footer from './Components/Footer.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
    <App />
     </BrowserRouter>
     {/* <Router>
      <Routes>
        <Route path="/nav" element={<Navbar/>} />
        <Route path="/footer" element={<Footer/>} />
      </Routes>
    </Router> */}
   
    
  </StrictMode>,
)
