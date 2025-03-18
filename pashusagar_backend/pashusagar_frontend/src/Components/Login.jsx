import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom"; // For programmatic navigation
import Navbar from "./Navbar";

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); 

    try {
      const response = await axios.post("http://127.0.0.1:8000/api/auth/login/", {
        email,
        password,
      });

      const { access, username, email: userEmail, role } = response.data;

      if (!role) {
        throw new Error("Role not found in the response.");
      }

      localStorage.setItem("token", access);
      localStorage.setItem("username", username);
      localStorage.setItem("email", userEmail);
      localStorage.setItem("role", role);

      if (role === 2) {
        navigate("/admin");
      } else if (role === 1) {
        navigate("/user");
      } else {
        navigate("/");
      }
    } catch (err) {
      console.error(err);

      if (err.response) {
        setError(err.response.data.detail || "Invalid email or password.");
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    }
  };

  return (
    <>
      <Navbar />
      <div className="bg-gradient-to-b from-[#00574B] to-[#009366] h-screen flex justify-center items-center">
        <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-sm sm:max-w-lg md:max-w-xl">
          <h1 className="text-2xl font-bold text-center text-[#00574B]">
            Sign in to your account
          </h1>

          {error && <p className="text-red-500 text-center mt-2">{error}</p>}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block mb-2 text-sm font-medium text-[#00574B]">
                Your email
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

            <div>
              <label className="block mb-2 text-sm font-medium text-[#00574B]">
                Password
              </label>
              <input
                type="password"
                name="password"
                id="password"
                className="bg-gray-100 border border-gray-300 text-gray-900 rounded-lg block w-full p-3"
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
                  className="w-4 h-4 text-[#009366] border-gray-300 rounded"
                />
                <span className="ml-2">Remember me</span>
              </label>
              <Link to="/forgetpassword" className="text-sm text-[#009366] hover:underline">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              className="bg-[#009366] w-full text-white font-medium rounded-lg text-sm px-5 py-2.5 hover:bg-[#00574B] focus:outline-none focus:ring-4 focus:ring-[#ADE1B0]"
            >
              Sign in
            </button>
          </form>

          <p className="text-sm text-center text-gray-500 mt-4">
            Don’t have an account yet?{" "}
            <Link to="/signup" className="text-[#009366] hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default Login;
