import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Components/Navbar";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const UpdateProfile = () => {
  const initialState = {
    username: "",
    email: "",
    phone_number: "",
    profile_image: null,
  };

  const [profile, setProfile] = useState(initialState);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    axios
      .get("http://127.0.0.1:8000/api/auth/profile/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setProfile({
          username: response.data.username || "",
          email: response.data.email || "",
          phone_number: response.data.phone_number || "",
          profile_image: response.data.profile_image || null,
        });
      })
      .catch((error) => {
        console.error("Error fetching profile:", error);
        toast.error("Failed to fetch profile data");
      });
  }, []);

  const handleChange = (e) =>
    setProfile({ ...profile, [e.target.name]: e.target.value });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const maxSize = 10 * 1024 * 1024; 
      if (file.size > maxSize) {
        toast.error("File is too large. Please select an image under 10MB.");
        return;
      }
      setProfile({ ...profile, profile_image: file });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Not authenticated. Please login again.");
      return;
    }

    const formData = new FormData();
    formData.append("username", profile.username);
    formData.append("email", profile.email);
    formData.append("phone_number", profile.phone_number);
    if (profile.profile_image) {
      formData.append("profile_image", profile.profile_image);
    }

    axios
      .put("http://127.0.0.1:8000/api/auth/profile/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        localStorage.setItem("username", response.data.username);
        localStorage.setItem("email", response.data.email);
        if (response.data.profile_image) {
          localStorage.setItem("profile_image", response.data.profile_image);
        }
        
        setProfile(initialState);
        toast.success("Profile updated successfully!");
        
        const fileInput = document.querySelector('input[type="file"]');
        if (fileInput) {
          fileInput.value = '';
        }
        
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      })
      .catch((error) => {
        console.error("Error updating profile:", error);
        toast.error(error.response?.data?.message || "Failed to update profile");
      });
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-[#004D40] to-[#00695C] py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto">
          <div className="bg-white shadow-lg rounded-lg px-8 pt-6 pb-8 mb-4">
            <div className="mb-6 text-center">
              <h2 className="text-2xl font-bold text-gray-900">Update Profile</h2>
              <p className="mt-2 text-sm text-gray-600">
                Manage your account information
              </p>
            </div>

            <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-5">
              <div className="flex justify-center mb-6">
                {profile.profile_image && (
                  <div className="relative">
                    <img
                      src={
                        typeof profile.profile_image === 'string'
                          ? profile.profile_image
                          : URL.createObjectURL(profile.profile_image)
                      }
                      alt="Profile Preview"
                      className="h-24 w-24 object-cover rounded-full border-4 border-[#1F2937]"
                    />
                  </div>
                )}
              </div>

              <div>
                <label 
                  className="block text-sm font-medium text-gray-700 mb-1" 
                  htmlFor="username"
                >
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  id="username"
                  value={profile.username}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#009366] text-gray-900"
                  placeholder="Enter your username"
                  required
                />
              </div>

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
                  value={profile.email}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#009366] text-gray-900"
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div>
                <label 
                  className="block text-sm font-medium text-gray-700 mb-1" 
                  htmlFor="phone_number"
                >
                  Phone Number
                </label>
                <input
                  type="text"
                  name="phone_number"
                  id="phone_number"
                  value={profile.phone_number}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#009366] text-gray-900"
                  placeholder="Enter your phone number"
                />
              </div>

              <div>
                <label 
                  className="block text-sm font-medium text-gray-700 mb-1" 
                  htmlFor="profile_image"
                >
                  Profile Image
                </label>
                <input
                  type="file"
                  name="profile_image"
                  id="profile_image"
                  onChange={handleFileChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#009366] text-gray-900 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#1F2937] file:text-white hover:file:bg-[#374151]"
                  accept="image/*"
                />
                <p className="mt-1 text-sm text-gray-500">
                  Maximum file size: 10MB
                </p>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full bg-[#60dd57] text-white py-2 px-4 rounded-md hover:bg-[#41d636] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1F2937] transition-colors duration-200"
                >
                  Update Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <ToastContainer 
        position="top-right" 
        autoClose={2000}
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

export default UpdateProfile;