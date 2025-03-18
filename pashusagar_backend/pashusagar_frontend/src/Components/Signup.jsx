// React Signup Component (Already provided by you)
import React, { useState } from "react";
import axios from "axios";
import { NavLink, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import Navbar from "../Components/Navbar";

const Signup = () => {
  const [username, setUsername] = useState(""); // Username State
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState(""); // Phone Number State
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState(""); // Error State
  const [success, setSuccess] = useState(""); // Success State

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Basic validation
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (phoneNumber.length !== 10) {
      setError("Phone number must be 10 digits.");
      return;
    }

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/auth/register/user/",
        {
          username, 
          email,
          phone_number: phoneNumber, 
          password,
          password2: confirmPassword,
          role: 1, 
        }
      );

      console.log(response.data);
      setSuccess("Registration successful! Redirecting to login...");

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      console.error(err);
      if (err.response && err.response.data) {
        const messages = Object.values(err.response.data).flat();
        setError(messages.join(" "));
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    }
  };

  return (
    <>
      <Navbar />
      <div className="bg-gradient-to-b from-[#00574B] to-[#009366] flex justify-center items-center min-h-screen">
        <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md sm:max-w-lg md:max-w-xl mt-20 mb-20">
          <h1 className="text-2xl font-bold text-center text-[#00574B]">
            Create Your Account
          </h1>

          {success && (
            <div
              className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mt-4"
              role="alert"
            >
              <span className="block sm:inline">{success}</span>
            </div>
          )}

          {error && (
            <div
              className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mt-4"
              role="alert"
            >
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6 mt-6">
            {/* Username Field */}
            <div>
              <label
                htmlFor="username"
                className="block mb-2 text-sm font-medium text-[#00574B]"
              >
                Username
              </label>
              <input
                type="text"
                name="username"
                id="username"
                className="bg-gray-100 border border-gray-300 text-gray-900 rounded-lg block w-full p-3"
                placeholder="user123a"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block mb-2 text-sm font-medium text-[#00574B]"
              >
                Email
              </label>
              <input
                type="email"
                name="email"
                id="email"
                className="bg-gray-100 border border-gray-300 text-gray-900 rounded-lg block w-full p-3"
                placeholder="usera@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* Phone Number Field */}
            <div>
              <label
                htmlFor="phoneNumber"
                className="block mb-2 text-sm font-medium text-[#00574B]"
              >
                Phone Number
              </label>
              <input
                type="tel"
                name="phoneNumber"
                id="phoneNumber"
                className="bg-gray-100 border border-gray-300 text-gray-900 rounded-lg block w-full p-3"
                placeholder="1234567890"
                required
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                pattern="[0-9]{10}"
                title="Enter a valid 10-digit phone number"
              />
            </div>

            {/* Password Field */}
            <div className="relative">
              <label
                htmlFor="password"
                className="block mb-2 text-sm font-medium text-[#00574B]"
              >
                Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                id="password"
                className="bg-gray-100 border border-gray-300 text-gray-900 rounded-lg block w-full p-3"
                placeholder="••••••••"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <div
                className="absolute inset-y-0 right-3 top-10 flex items-center justify-center cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
              </div>
            </div>

            {/* Confirm Password Field */}
            <div className="relative">
              <label
                htmlFor="confirmPassword"
                className="block mb-2 text-sm font-medium text-[#00574B]"
              >
                Confirm Password
              </label>
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                id="confirmPassword"
                className="bg-gray-100 border border-gray-300 text-gray-900 rounded-lg block w-full p-3"
                placeholder="••••••••"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <div
                className="absolute inset-y-0 right-3 top-10 flex items-center justify-center cursor-pointer"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <Eye size={20} /> : <EyeOff size={20} />}
              </div>
            </div>

            {/* Terms and Conditions */}
            <div>
              <label className="flex items-center text-sm text-[#00574B]">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-[#009366] border-gray-300 rounded"
                  required
                />
                <span className="ml-2">
                  By creating an account, you agree to our
                  <NavLink
                    to="/terms"
                    className="text-[#009366] hover:underline ml-1"
                  >
                    terms and conditions
                  </NavLink>
                  &nbsp; and
                  <NavLink
                    to="/privacy"
                    className="text-[#009366] hover:underline ml-2"
                  >
                    privacy policy
                  </NavLink>
                  .
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <div className="mt-4">
              <button
                type="submit"
                className="w-full bg-[#009366] text-white font-medium rounded-lg text-sm px-5 py-2.5 hover:bg-[#00574B] focus:outline-none focus:ring-4 focus:ring-[#ADE1B0]"
              >
                Create Account
              </button>
            </div>
          </form>

          {/* Redirect to Login */}
          <p className="text-sm text-center text-gray-500 mt-4">
            Already have an account?{" "}
            <NavLink to="/login" className="text-[#009366] hover:underline">
              Login
            </NavLink>
          </p>
        </div>
      </div>
    </>
  );
};

export default Signup;
