// This is the full Admin.jsx with modifications to include the Order Management section
import { useState, useEffect } from "react";
import {
  Menu,
  X,
  Pill,
  FileText,
  Users,
  CalendarDays,
  LayoutDashboard,
  FileCheck,
  User,
  LogOut,
  MessageSquare,
  ShoppingBag
} from "lucide-react";
import AddMedicine from "../veterinarian/AddMedicine";
import MedicineList from "../veterinarian/MedicineList";
import UsersList from "./UsersList";
import Appointments from "../veterinarian/Appointments";
import OrderManagement from "./OrderManagement"; // Import the new component
import axios from "axios";
import AdminMessage from "../pages/AdminMessage";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";

const UserProfile = ({ user }) => {
  return (
    <div className="mt-4">
      <div className="flex flex-col md:flex-row items-start md:items-center">
        <div className="w-24 h-24 rounded-full bg-[#e0f2f1] flex items-center justify-center overflow-hidden mr-6 mb-4 md:mb-0">
          {user.avatar ? (
            <img
              src={user.avatar}
              alt="User profile"
              className="w-full h-full object-cover"
            />
          ) : (
            <User size={48} className="text-[#004d40]" />
          )}
        </div>
        <div>
          <h2 className="text-2xl font-semibold">{user.username || "User"}</h2>
          <p className="text-gray-500 capitalize">
            {user.role === 0 ? "Admin" : "User"}
          </p>
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
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/api/dashboard-stats/"
        );
        setDashboardStats(response.data);
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
        toast.error("Failed to load dashboard statistics");
      }
    };

    fetchDashboardStats();
  }, []);

  const generateReport = async () => {
    setIsGeneratingReport(true);
    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/api/generate-report/"
      );
      setDashboardStats(response.data);
      toast.success("Report generated successfully");
    } catch (error) {
      console.error("Error generating report:", error);
      toast.error("Failed to generate report");
    } finally {
      setIsGeneratingReport(false);
    }
  };

  const stats = [
    {
      title: "Total Users",
      value: dashboardStats.total_users,
      bg: "from-[#004d40] to-[#00695c]",
    },
    {
      title: "Total Products",
      value: dashboardStats.total_products,
      bg: "from-[#004d40] to-[#00695c]",
    },
    {
      title: "Total Appointments",
      value: dashboardStats.total_appointments,
      bg: "from-[#004d40] to-[#00695c]",
    },
    {
      title: "Total Orders",
      value: dashboardStats.total_orders,
      bg: "from-[#004d40] to-[#00695c]",
      onClick: () => setActiveTab("orderManagement") // Add click handler to navigate to order management
    },
    {
      title: "Total Revenue",
      value: `₹${dashboardStats.total_revenue || 0}`,
      bg: "from-[#004d40] to-[#00695c]",
    },
    {
      title: "Pending Orders",
      value: dashboardStats.pending_orders,
      bg: "from-[#FFAA00] to-[#CC8800]",
      onClick: () => setActiveTab("orderManagement") // Add click handler to navigate to order management
    },
    {
      title: "Completed Orders",
      value: dashboardStats.completed_orders,
      bg: "from-[#00AA55] to-[#008844]",
    },
    {
      title: "Failed Orders",
      value: dashboardStats.failed_orders,
      bg: "from-[#FF4444] to-[#CC2222]",
    },
    {
      title: "Refunded Orders",
      value: dashboardStats.refunded_orders,
      bg: "from-[#5566FF] to-[#3344DD]",
    },
  ];

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
        {stats.map((stat, index) => (
          <div
            key={index}
            className={`bg-gradient-to-br ${stat.bg} p-6 rounded-lg text-white ${stat.onClick ? 'cursor-pointer hover:shadow-lg transition-shadow' : ''}`}
            onClick={stat.onClick}
          >
            <h3 className="text-lg font-semibold mb-2">{stat.title}</h3>
            <p className="text-3xl font-bold">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="text-center mt-8">
        <button
          onClick={generateReport}
          disabled={isGeneratingReport}
          className="px-6 py-3 bg-[#55DD4A] text-white font-semibold rounded-lg hover:bg-[#44BB3A] transition-colors disabled:opacity-50"
        >
          <FileCheck className="inline-block mr-2" />
          {isGeneratingReport ? "Generating..." : "Generate Report"}
        </button>
      </div>
    </div>
  );
};

const Admin = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
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

        console.log(response)
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

  const menuItems = [
    {
      id: "dashboard",
      icon: <LayoutDashboard size={20} className="mr-3" />,
      label: "Dashboard",
    },
    {
      id: "orderManagement",
      icon: <ShoppingBag size={20} className="mr-3" />,
      label: "Orders",
    },
    {
      id: "appointments",
      icon: <CalendarDays size={20} className="mr-3" />,
      label: "Appointments",
    },
    {
      id: "adminMessage",
      icon: <MessageSquare size={20} className="mr-3" />,
      label: "Messages",
    },
    {
      id: "userList",
      icon: <Users size={20} className="mr-3" />,
      label: "User List",
    },
  ];

  const inventoryItems = [
    {
      id: "addMedicine",
      icon: <Pill size={20} className="mr-3" />,
      label: "Add Medicine",
    },
    {
      id: "medicineList",
      icon: <FileText size={20} className="mr-3" />,
      label: "Medicine List",
    },
  ];

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
      <aside
        className={`bg-gradient-to-b from-[#004d40] to-[#00695c] text-white w-72 fixed lg:static h-screen overflow-y-auto transition-transform duration-300 ease-in-out z-40 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* User Profile Section */}
        <div className="p-6 border-b border-[#00897b]">
          <div className="flex items-center mb-4">
            <div className="w-16 h-16 rounded-full bg-[#e0f2f1] flex items-center justify-center overflow-hidden mr-4">
              {user.profile_image ? (
                <img
                  src={`http://127.0.0.1:8000/${user.profile_image}`}
                  alt="User avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                <User size={32} className="text-[#004d40]" />
              )}
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">
                {user.username || "Admin"}
              </h2>

              <p className="text-[#b2dfdb] capitalize">
                {user?.role === 0 ? "Admin" : "User"}
              </p>
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
          <h3 className="text-sm uppercase text-[#b2dfdb] font-semibold mb-4">
            Main Menu
          </h3>
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsSidebarOpen(false);
                  }}
                  className={`flex items-center p-3 rounded-lg transition-colors duration-200 w-full ${
                    activeTab === item.id
                      ? "bg-[#55DD4A] text-white"
                      : "hover:bg-[#00897b] hover:text-white"
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              </li>
            ))}
          </ul>

          <h3 className="text-sm uppercase text-[#b2dfdb] font-semibold mt-8 mb-4">
            Inventory
          </h3>
          <ul className="space-y-2">
            {inventoryItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsSidebarOpen(false);
                  }}
                  className={`flex items-center p-3 rounded-lg transition-colors duration-200 w-full ${
                    activeTab === item.id
                      ? "bg-[#55DD4A] text-white"
                      : "hover:bg-[#00897b] hover:text-white"
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              </li>
            ))}
          </ul>

          {/* Logout Button */}
          <div className="absolute bottom-8 left-0 w-full px-6">
            <button
              onClick={handleLogout}
              className="flex items-center p-3 text-[#b2dfdb] hover:text-white transition-colors w-full"
            >
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