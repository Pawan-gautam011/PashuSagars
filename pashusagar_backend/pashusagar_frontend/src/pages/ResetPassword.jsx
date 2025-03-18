// src/pages/ResetPassword.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import Navbar from "../Components/Navbar";

const ResetPassword = () => {
  const location = useLocation();
  const [formData, setFormData] = useState({
    email: "",
    otp: "",
    new_password: "",
    new_password2: "",
  });
  const [message, setMessage] = useState("");

  // Pre-fill email if passed from ForgotPassword page
  useEffect(() => {
    if (location.state && location.state.email) {
      setFormData((prevData) => ({ ...prevData, email: location.state.email }));
    }
  }, [location.state]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();

    axios
      .post("http://127.0.0.1:8000/api/auth/password-reset/confirm/", formData)
      .then((response) => {
        setMessage("Password reset successfully.");
      })
      .catch((error) => {
        console.error(error);
        setMessage("Failed to reset password. Please check the OTP and try again.");
      });
  };

  return (
    <>
      <Navbar />
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Reset Password</h1>
        {message && <p>{message}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="border rounded p-2 w-full"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1">OTP</label>
            <input
              type="text"
              name="otp"
              value={formData.otp}
              onChange={handleChange}
              className="border rounded p-2 w-full"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1">New Password</label>
            <input
              type="password"
              name="new_password"
              value={formData.new_password}
              onChange={handleChange}
              className="border rounded p-2 w-full"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1">Confirm New Password</label>
            <input
              type="password"
              name="new_password2"
              value={formData.new_password2}
              onChange={handleChange}
              className="border rounded p-2 w-full"
              required
            />
          </div>
          <button type="submit" className="bg-green-500 text-white p-2 rounded">
            Reset Password
          </button>
        </form>
      </div>
    </>
  );
};

export default ResetPassword;
