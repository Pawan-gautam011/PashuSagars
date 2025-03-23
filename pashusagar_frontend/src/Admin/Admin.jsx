import { useState, useEffect } from "react";
import { Menu, X, Pill, FileText, Users, CalendarDays, LayoutDashboard, FileCheck, User, LogOut } from "lucide-react";
import AddMedicine from "../veterinarian/AddMedicine";
import MedicineList from "../veterinarian/MedicineList";
import UsersList from "./UsersList";
import Appointments from "../veterinarian/Appointments";
import axios from "axios";
import AdminMessage from "../pages/AdminMessage";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router";

// Move DefaultContent definition here
const DefaultContent = ({ setActiveTab }) => {
  const [dashboardStats, setDashboardStats] = useState({
    total_users: 0,
    total_products: 0,
    total_appointments: 0,
    total_orders: 0,
    total_revenue: 0,
    pending_orders: 0,
    completed_orders: 0,
    failed_orders: 0,
    refunded_orders: 0,
  });

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/dashboard-stats/")
      .then((response) => {
        setDashboardStats(response.data);
      })
      .catch((error) => {
        console.error("Error fetching dashboard stats:", error);
      });
  }, []);

  const generateReport = () => {
    axios
      .get("http://127.0.0.1:8000/api/generate-report/")
      .then((response) => {
        setDashboardStats(response.data);
      })
      .catch((error) => {
        console.error("Error generating report:", error);
      });
  };

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
        {/* Total Users */}
        <div className="bg-gradient-to-br from-[#004d40] to-[#00695c] p-6 rounded-lg text-white">
          <h3 className="text-lg font-semibold mb-2">Total Users</h3>
          <p className="text-3xl font-bold">{dashboardStats.total_users}</p>
        </div>

        {/* Total Products */}
        <div className="bg-gradient-to-br from-[#004d40] to-[#00695c] p-6 rounded-lg text-white">
          <h3 className="text-lg font-semibold mb-2">Total Products</h3>
          <p className="text-3xl font-bold">{dashboardStats.total_products}</p>
        </div>

        {/* Total Appointments */}
        <div className="bg-gradient-to-br from-[#004d40] to-[#00695c] p-6 rounded-lg text-white">
          <h3 className="text-lg font-semibold mb-2">Total Appointments</h3>
          <p className="text-3xl font-bold">{dashboardStats.total_appointments}</p>
        </div>

        {/* Total Orders */}
        <div className="bg-gradient-to-br from-[#004d40] to-[#00695c] p-6 rounded-lg text-white">
          <h3 className="text-lg font-semibold mb-2">Total Orders</h3>
          <p className="text-3xl font-bold">{dashboardStats.total_orders}</p>
        </div>

        {/* Total Revenue */}
        <div className="bg-gradient-to-br from-[#004d40] to-[#00695c] p-6 rounded-lg text-white">
          <h3 className="text-lg font-semibold mb-2">Total Revenue</h3>
          <p className="text-3xl font-bold">₹{dashboardStats.total_revenue}</p>
        </div>

        {/* Pending Orders */}
        <div className="bg-gradient-to-br from-[#FFAA00] to-[#CC8800] p-6 rounded-lg text-white">
          <h3 className="text-lg font-semibold mb-2">Pending Orders</h3>
          <p className="text-3xl font-bold">{dashboardStats.pending_orders}</p>
        </div>

        {/* Completed Orders */}
        <div className="bg-gradient-to-br from-[#00AA55] to-[#008844] p-6 rounded-lg text-white">
          <h3 className="text-lg font-semibold mb-2">Completed Orders</h3>
          <p className="text-3xl font-bold">{dashboardStats.completed_orders}</p>
        </div>

        {/* Failed Orders */}
        <div className="bg-gradient-to-br from-[#FF4444] to-[#CC2222] p-6 rounded-lg text-white">
          <h3 className="text-lg font-semibold mb-2">Failed Orders</h3>
          <p className="text-3xl font-bold">{dashboardStats.failed_orders}</p>
        </div>

        {/* Refunds */}
        <div className="bg-gradient-to-br from-[#5566FF] to-[#3344DD] p-6 rounded-lg text-white">
          <h3 className="text-lg font-semibold mb-2">Refunded Orders</h3>
          <p className="text-3xl font-bold">{dashboardStats.refunded_orders}</p>
        </div>
      </div>

      <div className="text-center mt-8">
        <button
          onClick={generateReport}
          className="px-6 py-3 bg-[#55DD4A] text-white font-semibold rounded-lg hover:bg-[#44BB3A] transition-colors"
        >
          <FileCheck className="inline-block mr-2" /> Generate Report
        </button>
      </div>
    </div>
  );
};

const Admin = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const navigate=useNavigate()
  const { isAuthenticated, user: auth0User, logout: auth0Logout, isLoading } = useAuth0();

  const handleLogout = () => {
    if (isAuthenticated) {
      auth0Logout({ returnTo: window.location.origin });
    }
    localStorage.clear();
    setUser(null);
    navigate("/login");
  };

  const [user, setUser] = useState({
    name: "Admin",
    role: "Administrator",
    avatar: "/api/placeholder/60/60"
  });

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <DefaultContent setActiveTab={setActiveTab} />;
      case "addMedicine":
        return <AddMedicine />;
      case "medicineList":
        return <MedicineList />;
      case "userList":
        return <UsersList />;
      case "appointments":
        return <Appointments />;
      case "adminMessage":
        return <AdminMessage />;
      case "profile":
        return <UserProfile user={user} />;
      default:
        return <DefaultContent setActiveTab={setActiveTab} />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <button
        onClick={toggleSidebar}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-[#004d40] text-white"
      >
        {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>
      
      {/* Sidebar with Profile */}
      <aside
        className={`bg-gradient-to-b from-[#004d40] to-[#00695c] text-white w-72 fixed lg:static h-screen overflow-y-auto transition-transform duration-300 ease-in-out z-40 
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        {/* User Profile Section */}
        <div className="p-6 border-b border-[#00897b]">
          <div className="flex items-center mb-4">
            <div className="w-16 h-16 rounded-full bg-[#e0f2f1] flex items-center justify-center overflow-hidden mr-4">
              <img src={user.avatar} alt="User avatar" className="w-full h-full object-cover" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">{user.name}</h2>
              <p className="text-[#b2dfdb]">{user.role}</p>
            </div>
          </div>
          <button 
            onClick={() => {
              setActiveTab("profile");
              setIsSidebarOpen(false);
            }}
            className="text-sm flex items-center text-[#b2dfdb] hover:text-white transition-colors"
          >
            <User size={16} className="mr-2" /> View Profile
          </button>
        </div>
        
        {/* Navigation Menu */}
        <div className="p-6">
          <h3 className="text-sm uppercase text-[#b2dfdb] font-semibold mb-4">Main Menu</h3>
          <ul className="space-y-2">
            <li>
              <button
                onClick={() => {
                  setActiveTab("dashboard");
                  setIsSidebarOpen(false);
                }}
                className={`flex items-center p-3 rounded-lg transition-colors duration-200 w-full ${
                  activeTab === "dashboard" ? "bg-[#55DD4A] text-white" : "hover:bg-[#00897b] hover:text-white"
                }`}
              >
                <LayoutDashboard size={20} className="mr-3" />
                <span>Dashboard</span>
              </button>
            </li>

            <li>
              <button
                onClick={() => {
                  setActiveTab("appointments");
                  setIsSidebarOpen(false);
                }}
                className={`flex items-center p-3 rounded-lg transition-colors duration-200 w-full ${
                  activeTab === "appointments" ? "bg-[#55DD4A] text-white" : "hover:bg-[#00897b] hover:text-white"
                }`}
              >
                <CalendarDays size={20} className="mr-3" />
                <span>Appointments</span>
              </button>
            </li>


                        
            <li>
              <button
                onClick={() => {
                  setActiveTab("adminMessage");
                  setIsSidebarOpen(false);
                }}
                className={`flex items-center p-3 rounded-lg transition-colors duration-200 w-full ${
                  activeTab === "adminMessage" ? "bg-[#55DD4A] text-white" : "hover:bg-[#00897b] hover:text-white"
                }`}
              >
                <CalendarDays size={20} className="mr-3" />
                <span>adminMessage</span>
              </button>
            </li>



            <li>
              <button
                onClick={() => {
                  setActiveTab("userList");
                  setIsSidebarOpen(false);
                }}
                className={`flex items-center p-3 rounded-lg transition-colors duration-200 w-full ${
                  activeTab === "userList" ? "bg-[#55DD4A] text-white" : "hover:bg-[#00897b] hover:text-white"
                }`}
              >
                <Users size={20} className="mr-3" />
                <span>User List</span>
              </button>
            </li>
          </ul>

          <h3 className="text-sm uppercase text-[#b2dfdb] font-semibold mt-8 mb-4">Inventory</h3>
          <ul className="space-y-2">
            <li>
              <button
                onClick={() => {
                  setActiveTab("addMedicine");
                  setIsSidebarOpen(false);
                }}
                className={`flex items-center p-3 rounded-lg transition-colors duration-200 w-full ${
                  activeTab === "addMedicine" ? "bg-[#55DD4A] text-white" : "hover:bg-[#00897b] hover:text-white"
                }`}
              >
                <Pill size={20} className="mr-3" />
                <span>Add Medicine</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  setActiveTab("medicineList");
                  setIsSidebarOpen(false);
                }}
                className={`flex items-center p-3 rounded-lg transition-colors duration-200 w-full ${
                  activeTab === "medicineList" ? "bg-[#55DD4A] text-white" : "hover:bg-[#00897b] hover:text-white"
                }`}
              >
                <FileText size={20} className="mr-3" />
                <span>Medicine List</span>
              </button>
            </li>
          </ul>
          
          <div className="absolute bottom-8 left-0 w-full px-6">
            <button  

             onClick={()=>{
              setActiveTab("logout");
              setIsSidebarOpen(false);
              handleLogout()

             }}
            
            className="flex items-center p-3 text-[#b2dfdb] hover:text-white transition-colors w-full">
              <LogOut size={20} className="mr-3" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-4 lg:p-8">
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h1 className="text-2xl font-semibold text-gray-800 mb-2">
              {activeTab === "dashboard" && "Dashboard"}
              {activeTab === "addMedicine" && "Add Medicine"}
              {activeTab === "medicineList" && "Medicine List"}
              {activeTab === "userList" && "User List"}
              {activeTab === "appointments" && "Appointments"}
              {activeTab === "profile" && "My Profile"}
            </h1>
            <div className="h-1 w-16 bg-[#55DD4A] rounded-full mb-6"></div>
            {renderContent()}
          </div>
        </div>
      </main>
    </div>
  );
};

const UserProfile = ({ user }) => {
  return (
    <div className="mt-4">
      <div className="flex flex-col md:flex-row items-start md:items-center">
        <div className="w-24 h-24 rounded-full bg-[#e0f2f1] flex items-center justify-center overflow-hidden mr-6 mb-4 md:mb-0">
          <img src={user.avatar} alt="User profile" className="w-full h-full object-cover" />
        </div>
        <div>
          <h2 className="text-2xl font-semibold">{user.name}</h2>
          <p className="text-gray-500">{user.role}</p>
          <div className="mt-4 space-x-3">
            <button className="px-4 py-2 bg-[#004d40] text-white rounded-lg hover:bg-[#00695c] transition-colors">
              Edit Profile
            </button>
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors">
              Change Password
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;