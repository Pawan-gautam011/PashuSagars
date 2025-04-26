import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { 
  PlusCircle, 
  List, 
  CalendarDays, 
  LayoutDashboard, 
  BookOpen, 
  Edit3,
  LogOut,
  User,
  MessageCircle,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

const Sidebar = ({ 
  isSidebarOpen, 
  setIsSidebarOpen, 
  activeTab, 
  setActiveTab, 
  userProfile,
  handleLogout,
  dashboardStats,
  setDashboardStats 
}) => {
  const [unreadMessageCount, setUnreadMessageCount] = useState(0);
  const [collapsed, setCollapsed] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);
  const navigate = useNavigate();

  // Update unread message count
  useEffect(() => {
    if (dashboardStats?.unread_messages !== undefined) {
      setUnreadMessageCount(dashboardStats.unread_messages);
    }
  }, [dashboardStats]);

  // Reset unread count when messages tab is selected
 

  const fetchLatestMessageCount = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://127.0.0.1:8000/api/unread-messages-count/", {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data?.unread_count !== undefined) {
        setUnreadMessageCount(response.data.unread_count);
        setDashboardStats(prev => ({ ...prev, unread_messages: response.data.unread_count }));
      }
    } catch (error) {
      console.error("Error fetching message count:", error);
    }
  };

  // Message polling
  useEffect(() => {
    if (activeTab === "messages") return;
    const interval = setInterval(fetchLatestMessageCount, 30000);
    return () => clearInterval(interval);
  }, [activeTab]);

  const navItems = [
    { id: "dashboard", icon: <LayoutDashboard size={20} />, label: "Dashboard" },
    { id: "addMedicine", icon: <PlusCircle size={20} />, label: "Add Medicine" },
    { id: "medicineList", icon: <List size={20} />, label: "Medicine List" },
    { id: "appointments", icon: <CalendarDays size={20} />, label: "Appointments" },
    { id: "blog", icon: <BookOpen size={20} />, label: "Blog", path: "/veterinarian/blog" },
    { id: "addBlog", icon: <Edit3 size={20} />, label: "Add Blog", path: "/veterinarian/add-blog" },
    { 
      id: "messages", 
      icon: <MessageCircle size={20} />, 
      label: "Messages",
      badge: unreadMessageCount > 0 && activeTab !== "messages"
    },
   
  ];

  return (
    <aside
      className={`bg-gradient-to-b from-[#004d40] to-[#00695c] text-white 
        ${collapsed ? "w-20" : "w-64"} 
        fixed lg:static h-screen transition-all duration-300 ease-in-out z-40
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
    >
      <div className="flex flex-col h-full p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div 
            onClick={() => navigate("/veterinarians")} 
            className="flex items-center cursor-pointer"
          >
            <div className="bg-[#55DD4A] p-2 rounded-lg mr-3">
              <LayoutDashboard size={20} className="text-white" />
            </div>
            {!collapsed && (
              <h1 className="text-xl font-bold text-white">VetPortal</h1>
            )}
          </div>
          <button 
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex items-center justify-center w-8 h-8 rounded-full bg-[#00796b] hover:bg-[#00695c] text-white"
          >
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>

        {/* User Profile */}
        <div className={`flex ${collapsed ? "justify-center" : "items-center"} mb-8`}>
          <div className="relative w-12 h-12 rounded-full bg-[#e0f2f1] flex items-center justify-center overflow-hidden shadow-md">
            {userProfile.profile_image ? (
              <img
                src={`http://127.0.0.1:8000${userProfile.profile_image}`}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <User size={24} className="text-[#004d40]" />
            )}
          </div>
          {!collapsed && (
            <div className="ml-3">
              <h2 className="text-sm font-semibold truncate">{userProfile.username}</h2>
              <p className="text-xs text-gray-200 truncate">{userProfile.email}</p>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsSidebarOpen(false);
                  }}
                  onMouseEnter={() => setHoveredItem(item.id)}
                  onMouseLeave={() => setHoveredItem(null)}
                  className={`flex items-center p-3 rounded-xl transition-all duration-200 w-full 
                    ${activeTab === item.id ? "bg-[#55DD4A] text-white shadow-lg" : "hover:bg-[#00796b]"}
                    ${collapsed ? "justify-center" : "justify-between"}`}
                >
                  <div className="flex items-center">
                    <div className={`transition-transform ${hoveredItem === item.id ? "scale-110" : ""}`}>
                      {item.icon}
                    </div>
                    {!collapsed && (
                      <span className="ml-3 text-sm font-medium">{item.label}</span>
                    )}
                  </div>
                  {!collapsed && item.badge && (
                    <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                      {unreadMessageCount}
                    </span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </nav>

     
          
          <button
            onClick={() => {
              handleLogout();
              setIsSidebarOpen(false);
            }}
            className={`flex items-center w-full p-3 rounded-xl hover:bg-[#00796b] transition-colors mt-2
              ${collapsed ? "justify-center" : ""}`}
          >
            <LogOut size={18} />
            {!collapsed && <span className="ml-3 text-sm">Logout</span>}
          </button>
        </div>

    </aside>
  );
};

export default Sidebar;