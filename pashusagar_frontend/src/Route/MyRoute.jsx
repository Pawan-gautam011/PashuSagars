// MyRoute.jsx
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
import ChangePassword from "../pages/ChangePassword.jsx";
import UpdateProfile from "../pages/UpdateProfile.jsx";
import SearchProduct from "../pages/SearchProduct.jsx";
import PaymentSuccess from "../pages/PaymentSuccess.jsx";
import ResetPassword from "../pages/ResetPassword.jsx";
import ForgotPassword from "../pages/ForgetPassword.jsx";
import History from "../Components/History.jsx";
import ProductDetails from "../pages/ProductDetails.jsx";
import BlogList from "../pages/BlogList.jsx";
import SingleBlog from "../pages/SingleBlog.jsx";
import PaymentFailed from "../pages/paymentFailed.jsx";
import AdminMessagePanel from "../Admin/AdminMessagePanel.jsx"; // Import the AdminMessagePanel
import Message from "../pages/Message.jsx";
import AdminMessage from "../pages/AdminMessage.jsx";
import ProtectedRoutes from "../ProtectedRoutes.jsx";

const MyRoute = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<ProtectedRoutes Component={App}  />} />
          <Route path="/login" element={<Login />} />
          <Route path="/LoginUserpage" element={<LoginUserPage />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/changepassword" element={<ChangePassword />} />
          <Route path="/updateprofile" element={<UpdateProfile />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/pharmacy" element={<Pharmacy />} />
          <Route path="/online-consultation" element={<OnlineConsultation />} />
          <Route path="/online-booking" element={<OnlineBooking />} />
          <Route path="/aboutus" element={<Aboutus />} />
          <Route path="/mycart" element={<Cart />} />
          <Route path="/blogs" element={<BlogList />} />
          <Route path="/singleblog/:id" element={<SingleBlog />} />
          <Route path="/veterinarians" element={<VeterinarianPage />} />
          <Route path="/message" element={<Message />} />
          <Route path="/adminMessage" element={<AdminMessage />} />
          <Route
            path="/veterinarian-Appointment"
            element={<VeterinarianAppointment />}
          />
          <Route
            path="/veterinarian-message"
            element={<VeterinarinanMessage />}
          />
          <Route path="/veterinarian-addMedicine" element={<AddMedicine />} />
          <Route path="/search" element={<SearchProduct />} />
          <Route path="/payment-failed" element={<PaymentFailed />} />
          <Route path="/payment-success" element={<PaymentSuccess />} />
          <Route path="/forgetpassword" element={<ForgotPassword />} />
          <Route path="/resetpassword" element={<ResetPassword />} />
          <Route path="/history" element={<History />} />
          <Route path="/admin-messages" element={<AdminMessagePanel />} /> {/* Add the AdminMessagePanel route */}

          <Route
            path="/veterinarian"
            element={<PrivateRoute allowedRoles={["2"]} />}
          >
            <Route index element={<VeterinarianPage />} />
            <Route path="veterinarian" element={<VeterinarianPage />} />
          </Route>
          <Route path="/admin" element={<PrivateRoute allowedRoles={["0"]} />}>
            <Route index element={<Admin />} />
          </Route>
          <Route path="/user" element={<PrivateRoute allowedRoles={["1"]} />}>
            <Route index element={<MyAccount />} />
            <Route path="accountpage" element={<MyAccount />} />
          </Route>

          <Route path="/myaccount" element={<MyAccount />} />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default MyRoute;