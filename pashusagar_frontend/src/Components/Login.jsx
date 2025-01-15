import React, { useState } from "react";
import axios from "axios";
import { NavLink } from "react-router";
import Navbar from "./Navbar";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("http://127.0.0.1:8000/api/login/", { email, password })
      .then((res) => {
        console.log(res.data);
        localStorage.setItem("token", res.data.access);
        localStorage.setItem("username", res.data.username);
        localStorage.setItem("email", res.data.email);
        localStorage.setItem("role", res.data.role);
        window.location.href = "/";
      });
  };

  return (
    <>
    <Navbar/>
    <div className="bg-gradient-to-b from-[#00574B] to-[#009366] h-screen flex justify-center items-center">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-sm sm:max-w-lg md:max-w-xl">
        <h1 className="text-2xl font-bold text-center text-[#00574B]">
          Sign in to your account
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              className="block mb-2 text-sm font-medium text-[#00574B]"
            >
              Your email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              className="bg-gray-100 border border-gray-300 text-gray-900 rounded-lg block w-full p-3 "
              placeholder="mail@gmail.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label
              className="block mb-2 text-sm font-medium text-[#00574B]"
            >
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              className="bg-gray-100 border border-gray-300 text-gray-900 rounded-lg block w-full p-3 "
              placeholder="••••••••"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="flex items-center justify-between">
            <label className="flex items-center text-sm text-[#00574B]">
              <input
                type="checkbox"
                className="w-4 h-4 text-[#009366] border-gray-300 rounded "
              />
              <span className="ml-2">Remember me</span>
            </label>
            <a
              href="#"
              className="text-sm text-[#009366] hover:underline"
            >
              Forgot password?
            </a>
          </div>

          <div className="mt-4">
            <NavLink 
              to="/LoginUserpage"
              type="submit"
              className=" bg-[#009366] text-white font-medium rounded-lg text-sm px-5 py-2.5 hover:bg-[#00574B] focus:outline-none focus:ring-4 focus:ring-[#ADE1B0]"
            >
              Sign in
            </NavLink>
          </div>
        </form>
        <p className="text-sm text-center text-gray-500 mt-4">
          Don’t have an account yet?{" "}
          <NavLink to="/signup" className="text-[#009366] hover:underline">
            Sign up
          </NavLink>
        </p>
      </div>
    </div>
    </>
  );
};

export default Login;
