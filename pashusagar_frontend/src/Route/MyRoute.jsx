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
import Appointments from "../veterinarian/Appointments.jsx";
import VeterinarinanMessage from "../veterinarian/VeterinarinanMessage.jsx";
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
import AdminMessagePanel from "../Admin/AdminMessagePanel.jsx";
import Message from "../pages/Message.jsx";
import AdminMessage from "../pages/AdminMessage.jsx";
import ProtectedRoutes from "../ProtectedRoutes.jsx";
import Blog from "../veterinarian/BlogList.jsx"; 
import AddBlog from "../veterinarian/AddBlog.jsx";
import Information from "../Components/Information.jsx";
import FAQS from "../Components/FAQS.jsx";
import Footer from "../Components/Footer.jsx";

const MyRoute = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<ProtectedRoutes Component={App} requireAuth={false} />} />
          <Route path="/login" element={<Login />} />
          <Route path="/LoginUserpage" element={<LoginUserPage />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/information" element={<Information/>} />
          <Route path="/faq" element={<FAQS/>} />
          <Route path="/footer" element={<Footer/>} />
          
          {/* Protected Routes - require authentication */}
          <Route path="/changepassword" element={<ProtectedRoutes Component={ChangePassword} requireAuth={true} />} />
          <Route path="/updateprofile" element={<ProtectedRoutes Component={UpdateProfile} requireAuth={true} />} />
          <Route path="/mycart" element={<ProtectedRoutes Component={Cart} requireAuth={true} />} />
          <Route path="/history" element={<ProtectedRoutes Component={History} requireAuth={true} />} />
          <Route path="/myaccount" element={<ProtectedRoutes Component={MyAccount} requireAuth={true} />} />
          
          {/* Public Routes - don't require authentication */}
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/pharmacy" element={<Pharmacy />} />
          <Route path="/online-consultation" element={<OnlineConsultation />} />
          <Route path="/online-booking" element={<OnlineBooking />} />
          <Route path="/aboutus" element={<Aboutus />} />
          <Route path="/blogs" element={<BlogList />} />
          <Route path="/singleblog/:id" element={<SingleBlog />} />
          <Route path="/search" element={<SearchProduct />} />
          <Route path="/payment-failed" element={<PaymentFailed />} />
          <Route path="/payment-success" element={<PaymentSuccess />} />
          <Route path="/forgetpassword" element={<ForgotPassword />} />
          <Route path="/resetpassword" element={<ResetPassword />} />
          
          {/* General messaging route for users */}
          <Route path="/message" element={<ProtectedRoutes Component={Message} requireAuth={true} />} />
          
          {/* Veterinarian Routes - only for role 2 */}
          <Route path="/veterinarians" element={
            <PrivateRoute allowedRoles={["2"]}>
              <VeterinarianPage />
            </PrivateRoute>
          } />
          
          {/* Updated Veterinarian Blog Routes */}
          <Route path="/veterinarian/blog" element={
            <PrivateRoute allowedRoles={["2"]}>
              <Blog />
            </PrivateRoute>
          } />
          
          <Route path="/veterinarian/add-blog" element={
            <PrivateRoute allowedRoles={["2"]}>
              <AddBlog />
            </PrivateRoute>
          } />
          
          <Route path="/veterinarian-Appointment" element={
            <PrivateRoute allowedRoles={["2"]}>
              <Appointments />
            </PrivateRoute>
          } />
          
          <Route path="/veterinarian-message" element={
            <PrivateRoute allowedRoles={["2"]}>
              <VeterinarinanMessage />
            </PrivateRoute>
          } />
          
          <Route path="/veterinarian-addMedicine" element={
            <PrivateRoute allowedRoles={["2"]}>
              <AddMedicine />
            </PrivateRoute>
          } />
          
          {/* Admin Routes - only for role 0 */}
          <Route path="/adminMessage" element={
            <PrivateRoute allowedRoles={["0"]}>
              <AdminMessage />
            </PrivateRoute>
          } />
          
          <Route path="/admin-messages" element={
            <PrivateRoute allowedRoles={["0"]}>
              <AdminMessagePanel />
            </PrivateRoute>
          } />
          
          {/* Using Outlet pattern for these routes */}
          <Route path="/veterinarian" element={<PrivateRoute allowedRoles={["2"]} />}>
            <Route index element={<VeterinarianPage />} />
            <Route path="blog" element={<Blog />} />
            <Route path="add-blog" element={<AddBlog />} />
            <Route path="messages" element={<VeterinarinanMessage />} />
          </Route>
          
          <Route path="/admin" element={<PrivateRoute allowedRoles={["0"]} />}>
            <Route index element={<Admin />} />
          </Route>
          
          <Route path="/user" element={<PrivateRoute allowedRoles={["1"]} />}>
            <Route index element={<MyAccount />} />
            <Route path="accountpage" element={<MyAccount />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default MyRoute;