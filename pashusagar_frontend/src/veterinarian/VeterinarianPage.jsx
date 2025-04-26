import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Menu, X } from "lucide-react";
import AddMedicine from "./AddMedicine";
import MedicineList from "./MedicineList";
import Appointments from "./Appointments";
import VeterinarinanMessage from "./VeterinarinanMessage";
import Sidebar from "./Sidebar";
import BlogList from "../veterinarian/BlogList";
import AddBlog from "../veterinarian/AddBlog";

const DefaultContent = ({ setActiveTab, dashboardStats }) => {
  return (
    <div className="text-center py-8">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">
        Welcome to Your Veterinary Dashboard
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        <div
          onClick={() => setActiveTab("medicineList")}
          className="bg-gradient-to-br from-[#004d40] to-[#00695c] p-6 rounded-lg text-white cursor-pointer hover:opacity-80 transition-all duration-300 transform hover:scale-105 shadow-md"
        >
          <h3 className="text-xl font-semibold mb-2">Medicine Updates</h3>
          <p className="text-3xl font-bold">{dashboardStats.total_products || 0}</p>
          <p className="text-sm mt-2">Total products</p>
        </div>
        <div
          onClick={() => setActiveTab("appointments")}
          className="bg-gradient-to-br from-[#004d40] to-[#00695c] p-6 rounded-lg text-white cursor-pointer hover:opacity-80 transition-all duration-300 transform hover:scale-105 shadow-md"
        >
          <h3 className="text-xl font-semibold mb-2">Pending Appointments</h3>
          <p className="text-3xl font-bold">{dashboardStats.pending_appointments || 0}</p>
          <p className="text-sm mt-2">Appointments waiting</p>
        </div>
        <div
          onClick={() => setActiveTab("messages")}
          className="bg-gradient-to-br from-[#004d40] to-[#00695c] p-6 rounded-lg text-white cursor-pointer hover:opacity-80 transition-all duration-300 transform hover:scale-105 shadow-md"
        >
          <h3 className="text-xl font-semibold mb-2">Message Requests</h3>
          <p className="text-3xl font-bold">{dashboardStats.unread_messages || 0}</p>
          <p className="text-sm mt-2">Unread messages</p>
        </div>
      </div>
    </div>
  );
};

const VeterinarianPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [dashboardStats, setDashboardStats] = useState({
    total_products: 0,
    pending_appointments: 0,
    unread_messages: 0,
  });
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState({
    username: "",
    email: "",
    role: null,
    profile_image: null
  });
  const [loading, setLoading] = useState(true);

  const fetchDashboardStats = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }
      
      const response = await axios.get("http://127.0.0.1:8000/api/dashboard-stats/", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      setDashboardStats(response.data);
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
    }
  };

  const fetchUserProfile = async () => {
    const token = localStorage.getItem("token");
    
    if (!token) {
      navigate("/login");
      return;
    }
    
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/auth/profile/", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      setUserProfile({
        username: response.data.username || "Veterinarian",
        email: response.data.email || "",
        role: response.data.role,
        profile_image: response.data.profile_image
      });
      
      if (response.data.role !== 2) {
        console.log("Unauthorized access. User is not a veterinarian");
        navigate("/");
        return;
      }
      
      setLoading(false);
    } catch (error) {
      console.error("Error fetching user profile:", error);
      navigate("/login");
    }
  };

  useEffect(() => {
    fetchUserProfile();
    fetchDashboardStats();
    
    const interval = setInterval(() => {
      fetchDashboardStats();
    }, 120000);
    
    return () => clearInterval(interval);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  
  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <DefaultContent setActiveTab={setActiveTab} dashboardStats={dashboardStats} />;
      case "addMedicine":
        return <AddMedicine />;
      case "medicineList":
        return <MedicineList />;
      case "appointments":
        return <Appointments />;
      case "blog":
        return <BlogList/>;
      case "addBlog":
        return <AddBlog />;
      case "messages":
        return <VeterinarinanMessage />;
      default:
        return <DefaultContent setActiveTab={setActiveTab} dashboardStats={dashboardStats} />;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#55DD4A]"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen">
      <div className="flex flex-1 overflow-hidden">
        <button
          onClick={toggleSidebar}
          className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-[#004d40] text-white shadow-md hover:bg-[#00332c] transition-colors"
          aria-label={isSidebarOpen ? "Close menu" : "Open menu"}
        >
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <Sidebar
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          userProfile={userProfile}
          handleLogout={handleLogout}
          dashboardStats={dashboardStats}
          setDashboardStats={setDashboardStats}
        />

        <main className="flex-1 overflow-y-auto bg-gray-50 p-4 lg:p-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default VeterinarianPage;