import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { 
  Menu, X, Search, ShoppingCart, User, 
  Bell, ChevronDown, LogOut, ChevronRight
} from "lucide-react";
import Logo from "../assets/Logo.png";
import { toast } from "react-toastify";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotifsOpen, setIsNotifsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [user, setUser] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  
  const navigate = useNavigate();
  const cartItems = useSelector((state) => state.cart.items);
  const cartCount = cartItems?.reduce((total, item) => total + item.quantity, 0) || 0;

  // Close all menus when one is opened
  const closeAllMenus = (exceptMenu) => {
    if (exceptMenu !== 'profile') setIsProfileMenuOpen(false);
    if (exceptMenu !== 'notifications') setIsNotifsOpen(false);
    if (exceptMenu !== 'search') setIsSearchOpen(false);
    if (exceptMenu !== 'menu') setIsMenuOpen(false);
  };

  useEffect(() => {
    // Set user from local storage or Auth0
    const storedUsername = localStorage.getItem("username");
    const storedEmail = localStorage.getItem("email");
    const storedProfileImage = localStorage.getItem("profile_image");
    
    if (storedUsername && storedEmail) {
      setUser({
        username: storedUsername,
        email: storedEmail,
        profile_image: storedProfileImage,
      });
    }
    
    // Fetch notifications if user is logged in
    if (storedUsername) {
      fetchNotifications();
    }
    
    // Handle escape key to close menus
    const handleEscKey = (e) => {
      if (e.key === 'Escape') closeAllMenus();
    };
    
    window.addEventListener('keydown', handleEscKey);
    return () => {
      window.removeEventListener('keydown', handleEscKey);
      document.body.style.overflow = 'auto';
    };
  }, []);

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      
      const response = await fetch("http://127.0.0.1:8000/api/notifications/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (response.ok) {
        const data = await response.json();
        setNotifications(data);
        setUnreadCount(data.filter(n => !n.read).length);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  const markNotificationAsRead = async (notifId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      
      const response = await fetch(`http://127.0.0.1:8000/api/notifications/delete/${notifId}/`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        }
      });
      
      if (response.ok) {
        setNotifications(notifications.filter(n => n.id !== notifId));
        setUnreadCount(prev => prev - 1);
        toast.success("Notification removed");
      }
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
    navigate("/login");
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    closeAllMenus('menu');
    document.body.style.overflow = !isMenuOpen ? "hidden" : "auto";
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
    closeAllMenus('search');
    if (!isSearchOpen) {
      setTimeout(() => document.getElementById("search-input")?.focus(), 100);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      setIsSearchOpen(false);
    }
  };

  return (
    <nav className="bg-gradient-to-r from-[#004d40] to-[#00695c] backdrop-blur-lg shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-3">
          {/* Logo */}
          <NavLink to="/" className="flex-shrink-0 flex items-center">
            <img src={Logo} alt="PashuSagar" className="h-10 md:h-12 w-auto transition-all" />
          </NavLink>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-6">
            {/* Main Nav Links */}
            <div className="flex items-center space-x-1">
              {[
                { to: "/", label: "Home" },
                { to: "/pharmacy", label: "Pharmacy" },
                { to: "/online-booking", label: "Booking" },
                { to: "/online-consultation", label: "Consultation" },
              ].map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    `px-4 py-2 text-white rounded-md text-sm font-medium transition-colors duration-200 
                    ${isActive ? "bg-[#55DD4A]" : "hover:bg-white/10"}`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </div>

            {/* Right Side Icons */}
            <div className="flex items-center space-x-4">
              {/* Cart */}
              <button
                onClick={() => navigate("/mycart")}
                className="relative p-2 text-white hover:bg-white/10 rounded-full transition-colors"
                aria-label={`Shopping cart with ${cartCount} items`}
              >
                <ShoppingCart size={22} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* Notifications */}
              {user && (
                <div className="relative">
                  <button
                    onClick={() => {
                      setIsNotifsOpen(!isNotifsOpen);
                      closeAllMenus('notifications');
                    }}
                    className="relative p-2 text-white hover:bg-white/10 rounded-full transition-colors"
                    aria-label="Notifications"
                  >
                    <Bell size={22} />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {unreadCount}
                      </span>
                    )}
                  </button>
                  
                  {/* Notifications Dropdown */}
                  {isNotifsOpen && (
                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg overflow-hidden z-50">
                      <div className="p-3 border-b border-gray-200">
                        <h3 className="font-semibold text-gray-800">Notifications</h3>
                      </div>
                      <div className="max-h-80 overflow-y-auto">
                        {notifications.length === 0 ? (
                          <p className="text-gray-500 p-4 text-center">No notifications</p>
                        ) : (
                          notifications.map((notif) => (
                            <div
                              key={notif.id}
                              className={`p-3 border-b border-gray-100 ${
                                !notif.read ? 'bg-blue-50' : ''
                              }`}
                            >
                              <p className="text-sm text-gray-800">{notif.message}</p>
                              <div className="mt-1 flex justify-between items-center">
                                <span className="text-xs text-gray-500">
                                  {new Date(notif.created_at).toLocaleString()}
                                </span>
                                {!notif.read && (
                                  <button
                                    onClick={() => markNotificationAsRead(notif.id)}
                                    className="text-xs text-blue-600 hover:underline"
                                  >
                                    Dismiss
                                  </button>
                                )}
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Search */}
              <button
                onClick={toggleSearch}
                className="p-2 text-white hover:bg-white/10 rounded-full transition-colors"
                aria-label="Search"
              >
                <Search size={22} />
              </button>

              {/* User Menu */}
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => {
                      setIsProfileMenuOpen(!isProfileMenuOpen);
                      closeAllMenus('profile');
                    }}
                    className="flex items-center space-x-2 text-white hover:bg-white/10 rounded-md p-2 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-[#55DD4A] flex items-center justify-center overflow-hidden">
                      {user.profile_image ? (
                        <img
                          src={user.profile_image}
                          alt={user.username}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User size={20} className="text-white" />
                      )}
                    </div>
                    <span className="text-sm font-medium">{user.username}</span>
                    <ChevronDown size={16} />
                  </button>
                  
                  {/* Profile Dropdown */}
                  {isProfileMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg overflow-hidden z-50">
                      <NavLink
                        to="/myaccount"
                        className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                      >
                        My Account
                      </NavLink>
                      <NavLink
                        to="/history"
                        className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                      >
                        History
                      </NavLink>
                      <NavLink
                        to="/updateprofile"
                        className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                      >
                        Update Profile
                      </NavLink>
                      <NavLink
                        to="/changepassword"
                        className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                      >
                        Change Password
                      </NavLink>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
                      >
                        <LogOut size={16} className="inline mr-2" />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex space-x-2">
                  <NavLink
                    to="/login"
                    className="px-4 py-2 text-white hover:bg-white/10 rounded-md text-sm font-medium transition-colors"
                  >
                    Login
                  </NavLink>
                  <NavLink
                    to="/signup"
                    className="px-4 py-2 bg-[#55DD4A] text-white rounded-md text-sm font-medium hover:bg-[#4cc043] transition-colors"
                  >
                    Sign Up
                  </NavLink>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Controls */}
          <div className="flex items-center space-x-4 lg:hidden">
            <button
              onClick={() => navigate("/mycart")}
              className="relative p-2 text-white"
              aria-label={`Shopping cart with ${cartCount} items`}
            >
              <ShoppingCart size={22} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
            
            <button
              onClick={toggleSearch}
              className="p-2 text-white"
              aria-label="Search"
            >
              <Search size={22} />
            </button>
            
            <button
              onClick={toggleMenu}
              className="p-2 text-white"
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`fixed inset-0 z-40 bg-gradient-to-b from-[#004d40] to-[#00695c] lg:hidden transition-opacity duration-300 ${
            isMenuOpen
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none"
          }`}
        >
          <div className="flex flex-col h-full p-4">
            <div className="flex justify-between items-center mb-8">
              <NavLink to="/" onClick={toggleMenu}>
                <img src={Logo} alt="PashuSagar" className="h-10" />
              </NavLink>
              <button
                onClick={toggleMenu}
                className="p-2 text-white"
                aria-label="Close menu"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto">
              {user && (
                <div className="flex items-center space-x-4 p-4 bg-white/10 rounded-lg mb-6">
                  <div className="w-12 h-12 rounded-full bg-[#55DD4A] flex items-center justify-center">
                    {user.profile_image ? (
                      <img
                        src={user.profile_image}
                        alt={user.username}
                        className="w-full h-full object-cover rounded-full"
                      />
                    ) : (
                      <User size={24} className="text-white" />
                    )}
                  </div>
                  <div>
                    <p className="text-white font-medium">{user.username}</p>
                    <p className="text-white/70 text-sm">{user.email}</p>
                  </div>
                </div>
              )}
              
              <div className="space-y-1 mb-6">
                {[
                  { to: "/", label: "Home", icon: <span className="w-6">🏠</span> },
                  { to: "/pharmacy", label: "Pharmacy", icon: <span className="w-6">💊</span> },
                  { to: "/online-booking", label: "Booking", icon: <span className="w-6">📅</span> },
                  { to: "/online-consultation", label: "Consultation", icon: <span className="w-6">💬</span> },
                ].map((link) => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    onClick={toggleMenu}
                    className={({ isActive }) =>
                      `flex items-center p-3 rounded-lg text-white ${
                        isActive ? "bg-[#55DD4A]" : "hover:bg-white/10"
                      }`
                    }
                  >
                    {link.icon}
                    <span className="ml-3">{link.label}</span>
                    <ChevronRight size={18} className="ml-auto" />
                  </NavLink>
                ))}
              </div>
              
              {user ? (
                <div className="space-y-1 border-t border-white/20 pt-6">
                  <p className="text-white/70 px-3 mb-2 text-sm">My Account</p>
                  {[
                    { to: "/myaccount", label: "Profile", icon: <span className="w-6">👤</span> },
                    { to: "/history", label: "History", icon: <span className="w-6">📜</span> },
                    { to: "/updateprofile", label: "Settings", icon: <span className="w-6">⚙️</span> },
                    { to: "/changepassword", label: "Security", icon: <span className="w-6">🔒</span> },
                  ].map((link) => (
                    <NavLink
                      key={link.to}
                      to={link.to}
                      onClick={toggleMenu}
                      className="flex items-center p-3 rounded-lg text-white hover:bg-white/10"
                    >
                      {link.icon}
                      <span className="ml-3">{link.label}</span>
                      <ChevronRight size={18} className="ml-auto" />
                    </NavLink>
                  ))}
                  <button
                    onClick={() => {
                      handleLogout();
                      toggleMenu();
                    }}
                    className="flex items-center w-full p-3 rounded-lg text-white hover:bg-white/10"
                  >
                    <span className="w-6">🚪</span>
                    <span className="ml-3">Logout</span>
                  </button>
                </div>
              ) : (
                <div className="mt-6 space-y-3">
                  <NavLink
                    to="/login"
                    onClick={toggleMenu}
                    className="block w-full py-3 px-4 text-center bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
                  >
                    Login
                  </NavLink>
                  <NavLink
                    to="/signup"
                    onClick={toggleMenu}
                    className="block w-full py-3 px-4 text-center bg-[#55DD4A] text-white rounded-lg hover:bg-[#4cc043] transition-colors"
                  >
                    Sign Up
                  </NavLink>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Search Overlay */}
      {isSearchOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-start pt-16"
          onClick={(e) => {
            if (e.target === e.currentTarget) toggleSearch();
          }}
        >
          <div className="w-full max-w-2xl mx-auto px-4">
            <form onSubmit={handleSearch} className="relative">
              <input
                id="search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for products..."
                className="w-full p-4 pr-12 rounded-lg shadow-lg text-lg focus:outline-none"
                autoComplete="off"
              />
              <button
                type="submit"
                className="absolute right-0 top-0 h-full px-4 text-gray-500 hover:text-gray-700"
              >
                <Search size={20} />
              </button>
            </form>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;