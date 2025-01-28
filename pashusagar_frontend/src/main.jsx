import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./App.css";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./Components/Login.jsx";
import LoginUserPage from "./pages/LoginUserPage.jsx";
import Signup from "./Components/Signup.jsx";
import Pharmacy from "./pages/Pharmacy.jsx";
import OnlineConsultation from "./pages/OnlineConsultation.jsx";
import OnlineBooking from "./pages/OnlineBooking.jsx";
import Aboutus from "./Components/Aboutus.jsx";
import MainLayout from "./Components/MainLayout.jsx";
import PrivateRoute from "./role/PrivateRoute.jsx";
import MyAccount from "./Components/MyAccount.jsx"

createRoot(document.getElementById("root")).render(
  <StrictMode>
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
        <Route path="/myaccount" element ={<MyAccount/>} />

        <Route
          path="/aboutus"
          element={
            <MainLayout>
              <Aboutus />
            </MainLayout>
          }
        />
        <Route path="/user" element={<PrivateRoute allowedRoles={["1"]} />}>
          <Route index element={<LoginUserPage />} />
          <Route path="mainuser" element={<LoginUserPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
