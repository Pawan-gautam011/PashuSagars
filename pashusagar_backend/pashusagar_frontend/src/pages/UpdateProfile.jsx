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
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Update Profile</h1>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div className="mb-4">
            <label className="block mb-1">Username</label>
            <input
              type="text"
              name="username"
              value={profile.username}
              onChange={handleChange}
              className="border rounded p-2 w-full"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={profile.email}
              onChange={handleChange}
              className="border rounded p-2 w-full"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1">Phone Number</label>
            <input
              type="text"
              name="phone_number"
              value={profile.phone_number}
              onChange={handleChange}
              className="border rounded p-2 w-full"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1">Profile Image</label>
            <input
              type="file"
              name="profile_image"
              onChange={handleFileChange}
              className="border rounded p-2 w-full"
              accept="image/*"
            />
            {profile.profile_image && (
              <img
                src={
                  typeof profile.profile_image === 'string'
                    ? profile.profile_image
                    : URL.createObjectURL(profile.profile_image)
                }
                alt="Profile Preview"
                className="mt-2 h-20 w-20 object-cover rounded-full"
              />
            )}
          </div>
          <button
            type="submit"
            className="bg-green-500 text-white p-2 rounded hover:bg-green-600"
          >
            Update Profile
          </button>
        </form>
        <ToastContainer
          position="top-right"
          autoClose={2000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </div>
    </>
  );
};

export default UpdateProfile;