import React from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import App from "../App.jsx";
import Login from "../Components/Login.jsx";
import LoginUserPage from "../pages/LoginUserPage.jsx";
import Signup from "../Components/Signup.jsx";
import Pharmacy from "../pages/Pharmacy.jsx";
import OnlineConsultation from "../pages/OnlineConsultation.jsx";
import OnlineBooking from "../pages/OnlineBooking.jsx";
import Aboutus from "../Components/Aboutus.jsx";
import PrivateRoute from "../role/PrivateRoute.jsx";
import MyAccount from "../Components/MyAccount.jsx";
import Cart from "../Components/Cart.jsx";
import VeterinarianPage from "../veterinarian/VeterinarianPage.jsx";
import VeterinarianAppointment from "../veterinarian/veterinarianAppointment.jsx";
import VeterinarinanMessage from "../veterinarian/veterinarinanMessage.jsx";
import AddMedicine from "../veterinarian/AddMedicine.jsx";
import Admin from "../Admin/Admin.jsx";


const MyRoute = () => {
  return (
    <>
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/login" element={<Login />} />
      <Route path="/LoginUserpage" element={<LoginUserPage />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/pharmacy" element={<Pharmacy />} />
      <Route path="/online-consultation" element={<OnlineConsultation />} />
      <Route path="/online-booking" element={<OnlineBooking />} />
      <Route path="/aboutus" element={<Aboutus />} />
      <Route path="/myaccount" element={<MyAccount />} />
      <Route path="/mycart" element={<Cart />} />
      <Route path='/veterinarian' element={<VeterinarianPage/>} />
      <Route path='/veterinarian-Appointment' element={<VeterinarianAppointment/>} />
      <Route path='/veterinarian-message' element={<VeterinarinanMessage/>} />
      <Route path='/veterinarian-addMedicine' element={<AddMedicine/>} />

        <Route path="/admin" element={<Admin/>} />
      
    

      <Route path="/user" element={<PrivateRoute allowedRoles={["1"]} />}>
        <Route index element={<LoginUserPage />} />
        <Route path="mainuser" element={<LoginUserPage />} />
      </Route>
    </Routes>
    </BrowserRouter>
    </>
  );
};

export default MyRoute;
