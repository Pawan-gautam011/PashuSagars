import React, { useState } from "react";
import axios from "axios";
import { NavLink } from "react-router";
import { Eye,EyeOff } from 'lucide-react';
import Navbar from "../Components/Navbar"
const Signup = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    axios
      .post("http://127.0.0.1:8000/api/register/", {
        full_name: fullName,
        email,
        password,
      })
      .then((res) => {
        console.log(res.data);
        window.location.href = "/register";
      })
      .catch((err) => console.error(err));
  };

  return (
    <>
    <Navbar/>
    <div className="bg-gradient-to-b from-[#00574B] to-[#009366] flex justify-center items-center  ">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-sm sm:max-w-lg md:max-w-xl mt-20 mb-20 ">
        <h1 className="text-2xl font-bold text-center text-[#00574B]">
          Create your account
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="fullName"
              className="block mb-2 text-sm font-medium text-[#00574B]"
            >
              Full Name
            </label>
            <input
              type="text"
              name="fullName"
              id="fullName"
              className="bg-gray-100 border border-gray-300 text-gray-900 rounded-lg block w-full p-3"
              placeholder="John Doe"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>
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
              placeholder="mail@gmail.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
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
              className="absolute inset-y-0 right-3 top-6 flex items-center justify-center cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <Eye /> : <EyeOff />}
            </div>
          </div>
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
              className="absolute inset-y-0 right-3 flex top-6 items-center justify-center cursor-pointer"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <Eye /> : <EyeOff />}
            </div>
          </div>
          <div>
            <label className="flex items-center text-sm text-[#00574B]">
              <input
                type="checkbox"
                className="w-4 h-4 text-[#009366] border-gray-300 rounded"
                required
              />
              <span className="ml-2 ">
                By creating an account, you agree to our
                <NavLink to="" className="text-[#009366] hover:underline ml-1">
                  terms and conditions
                </NavLink>
                &nbsp; and
                <NavLink to="" className="text-[#009366] hover:underline ml-2">
                  privacy policy
                </NavLink>
              </span>
            </label>
          </div>
          <div className="mt-4">
            <button
              type="submit"
              className="bg-[#009366] text-white font-medium rounded-lg text-sm px-5 py-2.5 hover:bg-[#00574B] focus:outline-none focus:ring-4 focus:ring-[#ADE1B0]"
            >
              Create Account
            </button>
          </div>
        </form>
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