import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "../Components/Navbar";

const ResetPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    otp: "",
    new_password: "",
    new_password2: "",
  });

  useEffect(() => {
    if (location.state && location.state.email) {
      setFormData((prevData) => ({ ...prevData, email: location.state.email }));
    }
  }, [location.state]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const validateForm = () => {
    if (!formData.email || !formData.otp || !formData.new_password || !formData.new_password2) {
      toast.error("Please fill in all fields");
      return false;
    }
    if (formData.new_password !== formData.new_password2) {
      toast.error("Passwords do not match");
      return false;
    }
    if (formData.new_password.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/auth/password-reset/confirm/",
        formData
      );
      
      toast.success("Password reset successfully!");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      console.error(error);
      if (error.response?.data?.detail) {
        toast.error(error.response.data.detail);
      } else if (error.response?.data) {
        Object.keys(error.response.data).forEach(key => {
          toast.error(`${key}: ${error.response.data[key]}`);
        });
      } else {
        toast.error("Failed to reset password. Please check the OTP and try again.");
      }
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#F3F4F6] py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto">
          <div className="bg-white shadow-lg rounded-lg px-8 pt-6 pb-8 mb-4">
            <div className="mb-6 text-center">
              <h2 className="text-2xl font-bold text-gray-900">Reset Password</h2>
              <p className="mt-2 text-sm text-gray-600">
                Enter your details to reset your password
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label 
                  className="block text-sm font-medium text-gray-700 mb-1" 
                  htmlFor="email"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={location.state?.email}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label 
                  className="block text-sm font-medium text-gray-700 mb-1" 
                  htmlFor="otp"
                >
                  OTP Code
                </label>
                <input
                  type="text"
                  name="otp"
                  id="otp"
                  value={formData.otp}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                  placeholder="Enter OTP code"
                />
              </div>

              <div>
                <label 
                  className="block text-sm font-medium text-gray-700 mb-1" 
                  htmlFor="new_password"
                >
                  New Password
                </label>
                <input
                  type="password"
                  name="new_password"
                  id="new_password"
                  value={formData.new_password}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                  placeholder="Enter new password"
                />
              </div>

              <div>
                <label 
                  className="block text-sm font-medium text-gray-700 mb-1" 
                  htmlFor="new_password2"
                >
                  Confirm New Password
                </label>
                <input
                  type="password"
                  name="new_password2"
                  id="new_password2"
                  value={formData.new_password2}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                  placeholder="Confirm new password"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full bg-[#1F2937] text-white py-2 px-4 rounded-md hover:bg-[#374151] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1F2937] transition-colors duration-200"
                >
                  Reset Password
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <ToastContainer 
        position="top-right" 
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  );
};

export default ResetPassword;