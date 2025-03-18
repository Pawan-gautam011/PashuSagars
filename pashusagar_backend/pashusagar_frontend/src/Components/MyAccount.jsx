import React, { useState, useEffect } from "react";
import Navbar from "../Components/Navbar";

const MyAccount = () => {
  const [user, setUser] = useState(null); 

  useEffect(() => {

    const username = localStorage.getItem("username");
    const email = localStorage.getItem("email");
    const phoneNumber = localStorage.getItem("phone_number");

    if (username && email && phoneNumber) {
      setUser({ username, email, phoneNumber }); 
    } else {
      window.location.href = "/login";
    }
  }, []);

  return (
    <>
      <Navbar />


      <div className="bg-gradient-to-b from-[#00574B] to-[#009366] flex justify-center items-center min-h-screen">
        <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md sm:max-w-lg md:max-w-xl mt-20 mb-20">
          <h1 className="text-2xl font-bold text-center text-[#00574B]">
            My Account
          </h1>

          {user ? (
            <div className="space-y-4 mt-6">
              <div className="flex justify-between">
                <span className="font-medium text-[#00574B]">Username:</span>
                <span>{user.username}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-[#00574B]">Email:</span>
                <span>{user.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-[#00574B]">Phone Number:</span>
                <span>{user.phoneNumber}</span>
              </div>
            </div>
          ) : (
            <div className="text-center text-red-500">
              <p>No user information found. Please log in again.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default MyAccount;
