import React, { useState } from "react";
import { 
  LayoutDashboard,
  ShoppingBag,
  CalendarDays,
  MessageSquare,
  Users,
  Pill,
  FileText,
  User,
  LogOut,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

const SidebarAdmin = ({ 
  isSidebarOpen, 
  setIsSidebarOpen, 
  activeTab, 
  setActiveTab,
  userProfile,
  handleLogout,
  collapsed,
  setCollapsed
}) => {
  const [hoveredItem, setHoveredItem] = useState(null);

  const mainMenuItems = [
    { id: "dashboard", icon: <LayoutDashboard size={20} />, label: "Dashboard" },
    { id: "orderManagement", icon: <ShoppingBag size={20} />, label: "Orders" },
    { id: "appointments", icon: <CalendarDays size={20} />, label: "Appointments" },
    { id: "adminMessage", icon: <MessageSquare size={20} />, label: "Messages" },
    { id: "userList", icon: <Users size={20} />, label: "User List" },
    { id: "addMedicine", icon: <Pill size={20} />, label: "Add Medicine" },
    { id: "medicineList", icon: <FileText size={20} />, label: "Medicine List" },
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
          <div className="flex items-center cursor-pointer">
            <div className="bg-[#55DD4A] p-2 rounded-lg mr-3">
              <LayoutDashboard size={20} className="text-white" />
            </div>
            {!collapsed && (
              <h1 className="text-xl font-bold text-white">Admin Portal</h1>
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


            {!collapsed && (
              <li className="px-3 pt-2 text-xs font-semibold text-[#b2dfdb] uppercase">
                Main Menu
              </li>
            )}
            {mainMenuItems.map((item) => (
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
                </button>
              </li>
            ))}

            {/* {!collapsed && (
              <li className="px-3 pt-4 text-xs font-semibold text-[#b2dfdb] uppercase">
                Inventory
              </li>
            )} */}
            {/* {inventoryItems.map((item) => (
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
                </button>
              </li>
            ))} */}
          </ul>
        </nav>

        {/* Profile & Logout */}
        <div className="mt-auto">
        
          
          <button
            onClick={() => {
              handleLogout();
              setIsSidebarOpen(false);
            }}
            className={`flex items-center w-full p-3 rounded-xl hover:bg-[#00796b] transition-colors
              ${collapsed ? "justify-center" : ""}`}
          >
            <LogOut size={18} />
            {!collapsed && <span className="ml-3 text-sm">Logout</span>}
          </button>
        </div>
      </div>
    </aside>
  );
};

export default SidebarAdmin;