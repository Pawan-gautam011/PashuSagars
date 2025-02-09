import React, { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import Navbar from "../Components/Navbar";
import { Menu, X } from "lucide-react";

const VeterinarianPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        {/* Mobile Sidebar Toggle */}
        <button
          onClick={toggleSidebar}
          className="lg:hidden fixed top-20 left-4 z-50 p-2 rounded-lg bg-[#004d40] text-white"
        >
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Sidebar */}
        <aside
          className={`bg-gradient-to-b from-[#004d40] to-[#00695c] text-white w-64 fixed lg:static h-[calc(100vh-64px)] overflow-y-auto transition-transform duration-300 ease-in-out z-40 
            ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
        >
          <div className="sticky top-0 p-6">
            <h2 className="text-2xl font-semibold mb-6">Vet Dashboard</h2>
            <ul className="space-y-3">
              <li>
                <NavLink
                  to="/veterinarian-Appointment"
                  className={({ isActive }) =>
                    `flex items-center p-3 rounded-lg transition-colors duration-200 ${
                      isActive 
                        ? "bg-[#55DD4A] text-white" 
                        : "hover:bg-[#55DD4A] hover:text-white"
                    }`
                  }
                  onClick={() => setIsSidebarOpen(false)}
                >
                  <span className="ml-2">View Appointments</span>
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/veterinarian-message"
                  className={({ isActive }) =>
                    `flex items-center p-3 rounded-lg transition-colors duration-200 ${
                      isActive 
                        ? "bg-[#55DD4A] text-white" 
                        : "hover:bg-[#55DD4A] hover:text-white"
                    }`
                  }
                  onClick={() => setIsSidebarOpen(false)}
                >
                  <span className="ml-2">Messages</span>
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/veterinarian-addMedicine"
                  className={({ isActive }) =>
                    `flex items-center p-3 rounded-lg transition-colors duration-200 ${
                      isActive 
                        ? "bg-[#55DD4A] text-white" 
                        : "hover:bg-[#55DD4A] hover:text-white"
                    }`
                  }
                  onClick={() => setIsSidebarOpen(false)}
                >
                  <span className="ml-2">Add Medicine</span>
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

        {/* Overlay for mobile sidebar */}
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
        Welcome to Your Veterinary Dashboard
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
      
        <div className="bg-gradient-to-br from-[#004d40] to-[#00695c] p-6 rounded-lg text-white">
          <h3 className="text-xl font-semibold mb-2">Today's Appointments</h3>
          <p className="text-3xl font-bold">12</p>
          <p className="text-sm mt-2">4 pending confirmations</p>
        </div>

     
        <div className="bg-gradient-to-br from-[#004d40] to-[#00695c] p-6 rounded-lg text-white">
          <h3 className="text-xl font-semibold mb-2">Unread Messages</h3>
          <p className="text-3xl font-bold">5</p>
          <p className="text-sm mt-2">2 urgent messages</p>
        </div>

      
        <div className="bg-gradient-to-br from-[#004d40] to-[#00695c] p-6 rounded-lg text-white">
          <h3 className="text-xl font-semibold mb-2">Medicine Updates</h3>
          <p className="text-3xl font-bold">8</p>
          <p className="text-sm mt-2">3 items low in stock</p>
        </div>
      </div>

      <div className="mt-8 p-6 bg-gray-50 rounded-lg">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button className="p-4 bg-[#55DD4A] text-white rounded-lg hover:bg-green-600 transition-colors duration-200">
            Schedule New Appointment
          </button>
          <button className="p-4 bg-[#55DD4A] text-white rounded-lg hover:bg-green-600 transition-colors duration-200">
            Add New Medicine Entry
          </button>
        </div>
      </div>
    </div>
  );
};

export default VeterinarianPage;