import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "../Components/Navbar";
import axios from "axios";
import { ChevronRight, Home } from "lucide-react";

const ChangePassword = () => {
  const [formData, setFormData] = useState({
    old_password: "",
    new_password: "",
    new_password2: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const validateForm = () => {
    if (!formData.old_password || !formData.new_password || !formData.new_password2) {
      toast.error("Please fill in all fields");
      return false;
    }
    if (formData.new_password !== formData.new_password2) {
      toast.error("New passwords do not match");
      return false;
    }
    if (formData.new_password.length < 8) {
      toast.error("New password must be at least 8 characters long");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const token = localStorage.getItem("token");

    try {
      await axios.put(
        "http://127.0.0.1:8000/api/auth/change-password/",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Password updated successfully!");
      setTimeout(() => {
        navigate("/LoginUserpage"); // or wherever you want to redirect after success
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
        toast.error("Failed to update password. Please try again.");
      }
    }
  };
  
  const EnhancedBreadcrumbs = ({ items }) => {
    return (
      <nav className="bg-white/10 backdrop-blur-sm rounded-lg p-3 mb-6">
        <ol className="flex flex-wrap items-center">
          {items.map((item, index) => {
            const isLast = index === items.length - 1;
            return (
              <li key={index} className="flex items-center">
                {index === 0 && <Home size={16} className="text-white mr-2" />}
                
                {isLast ? (
                  <span className="font-medium text-[#55DD4A]">{item.label}</span>
                ) : (
                  <>
                    <a 
                      href={item.path} 
                      className="text-white hover:text-[#ADE1B0] transition-colors"
                    >
                      {item.label}
                    </a>
                    <ChevronRight size={16} className="mx-2 text-white/60" />
                  </>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    );
  };
  
  const breadcrumbItems = [
    { label: "Home", path: "/" },
    { label: "Change Password", path: "/changepassword" },
  ];

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-[#004d40] to-[#00695c] pt-16 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="container mx-auto">
            <EnhancedBreadcrumbs items={breadcrumbItems} />
          </div>
          
          <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg px-8 pt-6 pb-8 mb-4">
            <div className="mb-6 text-center">
              <h2 className="text-2xl font-bold text-gray-900">Change Password</h2>
              <p className="mt-2 text-sm text-gray-600">
                Update your account password
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label 
                  className="block text-sm font-medium text-gray-700 mb-1" 
                  htmlFor="old_password"
                >
                  Current Password
                </label>
                <input
                  type="password"
                  name="old_password"
                  id="old_password"
                  value={formData.old_password}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#009366] text-gray-900"
                  placeholder="Enter current password"
                  required
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#009366] text-gray-900"
                  placeholder="Enter new password"
                  required
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#009366] text-gray-900"
                  placeholder="Confirm new password"
                  required
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full bg-[#55DD4A] text-white py-2 px-4 rounded-md hover:bg-[#60dd57] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1F2937] transition-colors duration-200"
                >
                  Update Password
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

export default ChangePassword;