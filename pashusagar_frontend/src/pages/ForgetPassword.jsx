// src/pages/ForgotPassword.js
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../Components/Navbar";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    axios
      .post("http://127.0.0.1:8000/api/auth/password-reset/forgot/", { email })
      .then((response) => {
        setMessage("OTP sent to your email.");
        navigate("/resetpassword", { state: { email } });
      })
      .catch((error) => {
        console.error(error);
        setMessage("Failed to send OTP. Please try again.");
      });
  };

  return (
    <>
      <Navbar />
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Forgot Password</h1>
        {message && <p>{message}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border rounded p-2 w-full"
              required
            />
          </div>
          <button type="submit" className="bg-blue-500 text-white p-2 rounded">
            Send OTP
          </button>
        </form>
      </div>
    </>
  );
};

export default ForgotPassword;
