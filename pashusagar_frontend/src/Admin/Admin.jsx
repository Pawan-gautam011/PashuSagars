import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import AddMedicine from "../veterinarian/AddMedicine";
import MedicineList from "../veterinarian/MedicineList";
import UsersList from "./UsersList";
import Appointments from "../veterinarian/Appointments";
import OrderManagement from "./OrderManagement";
import axios from "axios";
import AdminMessage from "../pages/AdminMessage";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import SidebarAdmin from "./SidebarAdmin";
import DefaultContent from "./DefaultContent";
import UserProfile from "./UserProfile";

const Admin = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [collapsed, setCollapsed] = useState(false);
  const [user, setUser] = useState({
    username: "",
    email: "",
    phone_number: "",
    profile_image: "",
    role: "",
  });
  const navigate = useNavigate();
  const { isAuthenticated, logout: auth0Logout } = useAuth0();

  const handleLogout = () => {
    if (isAuthenticated) {
      auth0Logout({ returnTo: window.location.origin });
    }
    localStorage.clear();
    setUser({});
    navigate("/login");
  };

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/api/auth/profile/",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setUser({
          username: response.data.username || "",
          email: response.data.email || "",
          phone_number: response.data.phone_number || "",
          profile_image: response.data.profile_image,
          role: response.data.role,
        });
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast.error("Failed to fetch profile data");
        handleLogout();
      }
    };

    fetchProfile();
  }, [navigate]);

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
      case "orderManagement":
        return <OrderManagement />;
      default:
        return <DefaultContent setActiveTab={setActiveTab} />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Mobile sidebar toggle button */}
      <button
        onClick={toggleSidebar}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-[#004d40] text-white"
        aria-label="Toggle sidebar"
      >
        {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <SidebarAdmin
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        userProfile={user}
        handleLogout={handleLogout}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
      />

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
              {activeTab === "adminMessage" && "Admin Messages"}
              {activeTab === "profile" && "My Profile"}
              {activeTab === "orderManagement" && "Order Management"}
            </h1>
            <div className="h-1 w-16 bg-[#55DD4A] rounded-full mb-6"></div>
            {renderContent()}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Admin;