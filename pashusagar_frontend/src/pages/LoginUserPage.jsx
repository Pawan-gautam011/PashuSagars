// src/pages/LoginUserPage.js
import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../Components/Navbar';

const LoginUserPage = () => {
  const [user, setUser] = useState({ username: '', email: '' });
  const navigate = useNavigate(); 

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    const storedEmail = localStorage.getItem('email');

    if (storedUsername && storedEmail) {
      setUser({ username: storedUsername, email: storedEmail });
    } else {
      navigate('/login'); 
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/myaccount'); 
  };

  return (
    <>
      <Navbar />
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
          <h1 className="text-4xl text-center mb-6">Login Successfully</h1>
          <div className="mb-4">
            <p className="text-lg">
              <span className="font-semibold">Username:</span> {user.username}
            </p>
            <p className="text-lg">
              <span className="font-semibold">Email:</span> {user.email}
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition-colors mb-4"
          >
            Logout
          </button>
          <div className="text-center">
            <Link to="/forgotpassword" className="text-blue-500 hover:underline">
              Forgot Password?
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginUserPage;
