import React, { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import Navbar from "../Components/Navbar";
import { Menu, X, Activity, Calendar, Pill, Star, Users, Settings, FileText } from "lucide-react";

const Admin = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <button
          onClick={toggleSidebar}
          className="lg:hidden fixed top-20 left-4 z-50 p-2 rounded-lg bg-[#004d40] text-white"
        >
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        <aside
          className={`bg-gradient-to-b from-[#004d40] to-[#00695c] text-white w-64 fixed lg:static h-[calc(100vh-64px)] overflow-y-auto transition-transform duration-300 ease-in-out z-40 
            ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
        >
          <div className="sticky top-0 p-6">
            <h2 className="text-2xl font-semibold mb-6">Admin Dashboard</h2>
            <ul className="space-y-3">
              <li>
                <NavLink
                  to=""
                  className={({ isActive }) =>
                    `flex items-center p-3 rounded-lg transition-colors duration-200 ${
                      isActive 
                        ? "bg-[#55DD4A] text-white" 
                        : "hover:bg-[#55DD4A] hover:text-white"
                    }`
                  }
                  onClick={() => setIsSidebarOpen(false)}
                >
                  <Activity size={20} className="mr-3" />
                  <span>Analytics</span>
                </NavLink>
              </li>
              <li>
                <NavLink
                  to=""
                  className={({ isActive }) =>
                    `flex items-center p-3 rounded-lg transition-colors duration-200 ${
                      isActive 
                        ? "bg-[#55DD4A] text-white" 
                        : "hover:bg-[#55DD4A] hover:text-white"
                    }`
                  }
                  onClick={() => setIsSidebarOpen(false)}
                >
                  <Calendar size={20} className="mr-3" />
                  <span>Appointments</span>
                </NavLink>
              </li>
              <li>
                <NavLink
                  to=""
                  className={({ isActive }) =>
                    `flex items-center p-3 rounded-lg transition-colors duration-200 ${
                      isActive 
                        ? "bg-[#55DD4A] text-white" 
                        : "hover:bg-[#55DD4A] hover:text-white"
                    }`
                  }
                  onClick={() => setIsSidebarOpen(false)}
                >
                  <Pill size={20} className="mr-3" />
                  <span>Medicines</span>
                </NavLink>
              </li>
              <li>
                <NavLink
                  to=""
                  className={({ isActive }) =>
                    `flex items-center p-3 rounded-lg transition-colors duration-200 ${
                      isActive 
                        ? "bg-[#55DD4A] text-white" 
                        : "hover:bg-[#55DD4A] hover:text-white"
                    }`
                  }
                  onClick={() => setIsSidebarOpen(false)}
                >
                  <Star size={20} className="mr-3" />
                  <span>Reviews</span>
                </NavLink>
              </li>
              <li>
                <NavLink
                  to=""
                  className={({ isActive }) =>
                    `flex items-center p-3 rounded-lg transition-colors duration-200 ${
                      isActive 
                        ? "bg-[#55DD4A] text-white" 
                        : "hover:bg-[#55DD4A] hover:text-white"
                    }`
                  }
                  onClick={() => setIsSidebarOpen(false)}
                >
                  <Users size={20} className="mr-3" />
                  <span>Users</span>
                </NavLink>
              </li>
              <li>
                <NavLink
                  to=""
                  className={({ isActive }) =>
                    `flex items-center p-3 rounded-lg transition-colors duration-200 ${
                      isActive 
                        ? "bg-[#55DD4A] text-white" 
                        : "hover:bg-[#55DD4A] hover:text-white"
                    }`
                  }
                  onClick={() => setIsSidebarOpen(false)}
                >
                  <FileText size={20} className="mr-3" />
                  <span>Reports</span>
                </NavLink>
              </li>
              <li>
                <NavLink
                  to=""
                  className={({ isActive }) =>
                    `flex items-center p-3 rounded-lg transition-colors duration-200 ${
                      isActive 
                        ? "bg-[#55DD4A] text-white" 
                        : "hover:bg-[#55DD4A] hover:text-white"
                    }`
                  }
                  onClick={() => setIsSidebarOpen(false)}
                >
                  <Settings size={20} className="mr-3" />
                  <span>Settings</span>
                </NavLink>
              </li>
            </ul>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-gray-100 p-4 lg:p-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <Outlet />
            <DefaultContent />
          </div>
        </main>

        {/* Overlay for Mobile Sidebar */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
      </div>
    </div>
  );
};

const DefaultContent = () => {
  return (
    <div className="text-center py-8">
      <h1 className="text-3xl font-semibold text-gray-800 mb-4">
        Admin Control Panel
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {/* Appointments Overview */}
        <div className="bg-gradient-to-br from-[#004d40] to-[#00695c] p-6 rounded-lg text-white">
          <h3 className="text-xl font-semibold mb-2">Today's Appointments</h3>
          <p className="text-3xl font-bold">25</p>
          <p className="text-sm mt-2">8 new bookings</p>
        </div>

        {/* Medicine Overview */}
        <div className="bg-gradient-to-br from-[#004d40] to-[#00695c] p-6 rounded-lg text-white">
          <h3 className="text-xl font-semibold mb-2">Medicine Inventory</h3>
          <p className="text-3xl font-bold">152</p>
          <p className="text-sm mt-2">12 low stock alerts</p>
        </div>

        {/* Reviews Overview */}
        <div className="bg-gradient-to-br from-[#004d40] to-[#00695c] p-6 rounded-lg text-white">
          <h3 className="text-xl font-semibold mb-2">New Reviews</h3>
          <p className="text-3xl font-bold">18</p>
          <p className="text-sm mt-2">4.8 average rating</p>
        </div>
      </div>

      {/* Analytics Overview */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Revenue Stats */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Revenue Overview</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Today's Revenue</span>
              <span className="text-green-600 font-semibold">₹12,450</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Weekly Revenue</span>
              <span className="text-green-600 font-semibold">₹86,230</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Monthly Revenue</span>
              <span className="text-green-600 font-semibold">₹3,24,150</span>
            </div>
          </div>
        </div>

        {/* User Stats */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">User Statistics</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Users</span>
              <span className="text-blue-600 font-semibold">1,245</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Active Users</span>
              <span className="text-blue-600 font-semibold">892</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">New Users (This Week)</span>
              <span className="text-blue-600 font-semibold">48</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 p-6 bg-gray-50 rounded-lg">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <NavLink to='/veterinarian-addMedicine' className="p-4 bg-[#55DD4A] text-white rounded-lg hover:bg-green-600 transition-colors duration-200">
            Add New Medicine
          </NavLink>
          <button className="p-4 bg-[#55DD4A] text-white rounded-lg hover:bg-green-600 transition-colors duration-200">
            View Appointments
          </button>
          <button className="p-4 bg-[#55DD4A] text-white rounded-lg hover:bg-green-600 transition-colors duration-200">
            Generate Reports
          </button>
        </div>
      </div>
    </div>
  );
};

export default Admin;