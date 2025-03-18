import { useState, useEffect } from "react";
import Logo1 from "../assets/Logo.png";
import { NavLink, useNavigate } from "react-router-dom";
import { IoMdMenu } from "react-icons/io";
import { X, Search, ShoppingCart, ChevronDown } from "lucide-react";
import { IoMdPerson } from "react-icons/io";
import { FaSignOutAlt } from "react-icons/fa";
import { useSelector } from "react-redux";
import { Bell } from "lucide-react";
import { useAuth0 } from "@auth0/auth0-react";

const Navbar = () => {
  const { isAuthenticated, user: auth0User, logout: auth0Logout, isLoading } = useAuth0();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isMobileProfileOpen, setIsMobileProfileOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Notification states
  const [notifications, setNotifications] = useState([]);
  const [isNotifsOpen, setIsNotifsOpen] = useState(false);
  const [isLoadingNotifications, setIsLoadingNotifications] = useState(false);
  
  const navigate = useNavigate();
  const cartItems = useSelector((state) => state.cart.items);
  const cartCount = cartItems?.reduce((total, item) => total + item.quantity, 0) || 0;
  const role = localStorage.getItem("role");

  // Close other menus when one is opened
  const closeAllMenus = (exceptMenu) => {
    if (exceptMenu !== 'profile') setIsProfileMenuOpen(false);
    if (exceptMenu !== 'mobileProfile') setIsMobileProfileOpen(false);
    if (exceptMenu !== 'notifications') setIsNotifsOpen(false);
    if (exceptMenu !== 'search') setIsSearchOpen(false);
    if (exceptMenu !== 'menu') setIsMenuOpen(false);
  };

  // Handle escape key to close menus
  useEffect(() => {
    const handleEscKey = (e) => {
      if (e.key === 'Escape') {
        closeAllMenus();
      }
    };
    
    window.addEventListener('keydown', handleEscKey);
    return () => {
      window.removeEventListener('keydown', handleEscKey);
      // Ensure overflow is reset when component unmounts
      document.body.style.overflow = 'auto';
    };
  }, []);

  useEffect(() => {
    // If Auth0 is in use and authenticated, use that user info
    if (auth0User && isAuthenticated) {
      setUser({
        username: auth0User.name || auth0User.nickname || auth0User.email,
        email: auth0User.email,
        profile_image: auth0User.picture,
      });
    } else {
      // Fall back to localStorage
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
    }
  }, [auth0User, isAuthenticated]);

  // Fetch notifications
  useEffect(() => {
    if (user) {
      const fetchNotifications = async () => {
        setIsLoadingNotifications(true);
        try {
          const token = localStorage.getItem("token");
          if (!token) {
            throw new Error("No authentication token found");
          }
          
          const response = await fetch("http://127.0.0.1:8000/api/notifications/", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          
          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(`Failed to fetch notifications: ${response.status} ${response.statusText} ${errorData.detail || ''}`);
          }
          
          const data = await response.json();
          setNotifications(data);
        } catch (error) {
          console.error("Error fetching notifications:", error);
          // Optionally show a toast or other user feedback
        } finally {
          setIsLoadingNotifications(false);
        }
      };
      
      fetchNotifications();
      
      // Optional: Set up polling for notifications
      // const intervalId = setInterval(fetchNotifications, 60000); // every minute
      // return () => clearInterval(intervalId);
    }
  }, [user]);

  // Mark notification as read
  const markNotificationAsRead = async (notifId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      
      const response = await fetch(`http://127.0.0.1:8000/api/notifications/${notifId}/read/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ read: true }),
      });
      
      if (!response.ok) {
        throw new Error("Failed to mark notification as read");
      }
      
      // Update local state
      setNotifications((prev) =>
        prev.map((n) => (n.id === notifId ? { ...n, read: true } : n))
      );
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  // Mark all notifications as read
  const markAllNotificationsAsRead = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      
      const unreadNotifs = notifications.filter((n) => !n.read);
      
      // Optimistic UI update
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      
      // Process all API calls in parallel
      await Promise.all(
        unreadNotifs.map((notif) =>
          fetch(`http://127.0.0.1:8000/api/notifications/${notif.id}/read/`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ read: true }),
          })
        )
      );
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
      // Revert the optimistic update if there was an error
      const response = await fetch("http://127.0.0.1:8000/api/notifications/", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setNotifications(data);
      }
    }
  };

  // Toggle mobile menu
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    closeAllMenus('menu');
    document.body.style.overflow = !isMenuOpen ? "hidden" : "auto";
  };

  // Logout handler
  const handleLogout = () => {
    if (isAuthenticated) {
      auth0Logout({ returnTo: window.location.origin });
    }
    localStorage.clear();
    setUser(null);
    navigate("/login");
  };

  // Toggle profile menu
  const toggleProfileMenu = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
    closeAllMenus('profile');
  };

  // Toggle mobile profile menu
  const toggleMobileProfile = () => {
    setIsMobileProfileOpen(!isMobileProfileOpen);
    closeAllMenus('mobileProfile');
  };

  // Toggle search
  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
    closeAllMenus('search');
    if (!isSearchOpen) {
      setTimeout(() => {
        document.getElementById("search-input")?.focus();
      }, 100);
    }
  };

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      setIsSearchOpen(false);
    }
  };

  // Handle cart click
  const handleCartClick = () => {
    navigate("/mycart");
  };

  // Toggle notifications
  const toggleNotifications = () => {
    setIsNotifsOpen(!isNotifsOpen);
    closeAllMenus('notifications');
  };

  // Profile menu component
  const ProfileMenu = ({ isMobile = false }) => (
    <div
      className={`${
        isMobile
          ? "bg-[#005d4f] mt-2"
          : "absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg"
      } overflow-hidden z-50`}
      role="menu"
    >
      <NavLink
        to="/myaccount"
        className={`block px-4 py-2 ${
          isMobile
            ? "text-white hover:bg-[#006d5f]"
            : "text-gray-700 hover:bg-[#55DD4A] hover:text-white"
        } transition-colors duration-200`}
        onClick={() => isMobile && toggleMenu()}
        role="menuitem"
      >
        My Account
      </NavLink>
      <NavLink
        to="/history"
        className={`block px-4 py-2 ${
          isMobile
            ? "text-white hover:bg-[#006d5f]"
            : "text-gray-700 hover:bg-[#55DD4A] hover:text-white"
        } transition-colors duration-200`}
        onClick={() => isMobile && toggleMenu()}
        role="menuitem"
      >
        History
      </NavLink>
      <NavLink
        to="/changepassword"
        className={`block px-4 py-2 ${
          isMobile
            ? "text-white hover:bg-[#006d5f]"
            : "text-gray-700 hover:bg-[#55DD4A] hover:text-white"
        } transition-colors duration-200`}
        onClick={() => isMobile && toggleMenu()}
        role="menuitem"
      >
        Change Password
      </NavLink>
      <NavLink
        to="/updateprofile"
        className={`block px-4 py-2 ${
          isMobile
            ? "text-white hover:bg-[#006d5f]"
            : "text-gray-700 hover:bg-[#55DD4A] hover:text-white"
        } transition-colors duration-200`}
        onClick={() => isMobile && toggleMenu()}
        role="menuitem"
      >
        Update Profile
      </NavLink>
      
      {role === "seller" && (
        <NavLink
          to="/seller/dashboard"
          className={`block px-4 py-2 ${
            isMobile
              ? "text-white hover:bg-[#006d5f]"
              : "text-gray-700 hover:bg-[#55DD4A] hover:text-white"
          } transition-colors duration-200`}
          onClick={() => isMobile && toggleMenu()}
          role="menuitem"
        >
          Seller Dashboard
        </NavLink>
      )}
      
      {role === "admin" && (
        <NavLink
          to="/admin/dashboard"
          className={`block px-4 py-2 ${
            isMobile
              ? "text-white hover:bg-[#006d5f]"
              : "text-gray-700 hover:bg-[#55DD4A] hover:text-white"
          } transition-colors duration-200`}
          onClick={() => isMobile && toggleMenu()}
          role="menuitem"
        >
          Admin Dashboard
        </NavLink>
      )}
      
      {role === "user" && (
        <NavLink
          to="/user/dashboard"
          className={`block px-4 py-2 ${
            isMobile
              ? "text-white hover:bg-[#006d5f]"
              : "text-gray-700 hover:bg-[#55DD4A] hover:text-white"
          } transition-colors duration-200`}
          onClick={() => isMobile && toggleMenu()}
          role="menuitem"
        >
          User Dashboard
        </NavLink>
      )}

      <button
        onClick={() => {
          handleLogout();
          isMobile && toggleMenu();
        }}
        className={`w-full px-4 py-2 text-left ${
          isMobile
            ? "text-white hover:bg-[#006d5f]"
            : "text-gray-700 hover:bg-[#55DD4A] hover:text-white"
        } transition-colors duration-200`}
        role="menuitem"
      >
        <FaSignOutAlt className="inline mr-2" />
        Logout
      </button>
    </div>
  );

  // Notifications dropdown component
  const NotificationsDropdown = () => (
    <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg overflow-hidden z-50">
      <div className="max-h-60 overflow-y-auto p-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-semibold text-gray-800">Notifications</h3>
          {notifications.some(n => !n.read) && (
            <button
              onClick={markAllNotificationsAsRead}
              className="text-sm text-blue-500 hover:underline"
              aria-label="Mark all notifications as read"
            >
              Mark all as read
            </button>
          )}
        </div>

        {isLoadingNotifications ? (
          <p className="text-gray-700 text-sm py-2">Loading notifications...</p>
        ) : notifications.length === 0 ? (
          <p className="text-gray-700 text-sm py-2">No notifications</p>
        ) : (
          notifications.map((notif) => (
            <div
              key={notif.id}
              className={`mb-2 p-2 rounded shadow-sm text-sm ${
                notif.read ? "bg-gray-100 text-gray-700" : "bg-white text-gray-800 border-l-4 border-blue-500"
              }`}
            >
              <p>{notif.message}</p>
              <div className="mt-1 flex justify-between items-center text-xs text-gray-500">
                {notif.created_at && (
                  <span>{new Date(notif.created_at).toLocaleString()}</span>
                )}
                {!notif.read && (
                  <button
                    onClick={() => markNotificationAsRead(notif.id)}
                    className="text-blue-500 hover:underline"
                    aria-label="Mark as read"
                  >
                    Mark as read
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );

  return (
    <nav className="bg-gradient-to-r from-[#004d40] to-[#00695c] backdrop-blur-lg shadow-md sticky top-0 z-50">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div className="flex-shrink-0">
            <NavLink to="/">
              <img
                src={Logo1}
                alt="Logo"
                className="h-8 w-auto sm:h-10 md:h-12 lg:h-14 transition-all duration-200"
              />
            </NavLink>
          </div>

          {/* Mobile Right Icons */}
          <div className="flex items-center space-x-4 lg:hidden">
            {/* Cart */}
            <button
              onClick={handleCartClick}
              className="p-2 hover:bg-[#55DD4A] rounded-full transition-colors duration-200 relative"
              aria-label={`Shopping cart with ${cartCount} items`}
            >
              <ShoppingCart className="text-white" size={24} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Notifications (Mobile) */}
            {user && (
              <button
                onClick={toggleNotifications}
                className="relative p-2 hover:bg-[#55DD4A] rounded-full transition-colors duration-200"
                aria-label="Notifications"
                aria-expanded={isNotifsOpen}
                aria-haspopup="true"
              >
                <Bell className="text-white" size={24} />
                {notifications.filter(n => !n.read).length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {notifications.filter(n => !n.read).length}
                  </span>
                )}
              </button>
            )}

            {/* Search */}
            <button
              onClick={toggleSearch}
              className="p-2 hover:bg-[#55DD4A] rounded-full transition-colors duration-200"
              aria-label="Search"
              aria-expanded={isSearchOpen}
            >
              <Search className="text-white" size={24} />
            </button>

            {/* Profile or Login */}
            {user && (
              <button
                onClick={toggleProfileMenu}
                className="p-2 hover:bg-[#55DD4A] rounded-full transition-colors duration-200"
                aria-label="User profile menu"
                aria-expanded={isProfileMenuOpen}
                aria-haspopup="true"
              >
                {user.profile_image ? (
                  <img
                    src={auth0User.picture}
                    // alt={`${user.username}'s profile`}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <IoMdPerson className="text-white text-2xl" />
                )}
              </button>
            )}

            {/* Mobile menu toggle */}
            <button
              onClick={toggleMenu}
              className="p-2 hover:bg-[#55DD4A] rounded-full transition-colors duration-200"
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? (
                <X className="text-white" size={24} />
              ) : (
                <IoMdMenu className="text-white text-2xl" />
              )}
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center justify-between flex-1 ml-8">
            {/* Left Nav Links */}
            <div className="flex ml-24 space-x-4 xl:space-x-8">
              {[
                { to: "/", label: "Home" },
                { to: "/pharmacy", label: "Pharmacy" },
                { to: "/online-booking", label: "Booking" },
                { to: "/online-consultation", label: "Online Consultation" },
              ].map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    `px-4 py-2 text-white uppercase text-sm xl:text-base transition-colors duration-200 
                    ${isActive ? "bg-[#55DD4A] rounded-xl" : "hover:bg-[#55DD4A] rounded-xl"}`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </div>

            {/* Right Icons */}
            <div className="flex items-center space-x-6">
              {/* Cart */}
              <button
                onClick={handleCartClick}
                className="relative p-2 hover:bg-[#55DD4A] rounded-full transition-colors duration-200"
                aria-label={`Shopping cart with ${cartCount} items`}
              >
                <ShoppingCart className="text-white" size={24} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* Notifications (Desktop) */}
              {user && (
                <div className="relative">
                  <button
                    onClick={toggleNotifications}
                    className="relative p-2 hover:bg-[#55DD4A] rounded-full transition-colors duration-200"
                    aria-label="Notifications"
                    aria-expanded={isNotifsOpen}
                    aria-haspopup="true"
                  >
                    <Bell className="text-white" size={24} />
                    {notifications.filter(n => !n.read).length > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {notifications.filter(n => !n.read).length}
                      </span>
                    )}
                  </button>
                  {isNotifsOpen && <NotificationsDropdown />}
                </div>
              )}

              {/* Search */}
              <button
                onClick={toggleSearch}
                className="p-2 hover:bg-[#55DD4A] rounded-full transition-colors duration-200"
                aria-label="Search"
                aria-expanded={isSearchOpen}
              >
                <Search className="text-white" size={24} />
              </button>

              {/* User Profile or Login/Signup */}
              {user ? (
                <div className="relative">
                  <button
                    onClick={toggleProfileMenu}
                    className="flex items-center space-x-2 px-4 py-2 text-white hover:bg-[#55DD4A] rounded-xl transition-colors duration-200"
                    aria-label="User profile menu"
                    aria-expanded={isProfileMenuOpen}
                    aria-haspopup="true"
                  >
                    {user.profile_image ? (
                      <img
                        src={auth0User.picture}
                        // alt={`${user.username}'s profile`}
                        className="w-5 h-5 rounded-full object-cover"
                      />
                    ) : (
                      <IoMdPerson className="text-xl" />
                    )}
                    <span className="text-sm font-medium">{user.username}</span>
                  </button>
                  {isProfileMenuOpen && <ProfileMenu />}
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <NavLink
                    to="/login"
                    className="px-4 py-2 text-white hover:bg-[#55DD4A] rounded-xl transition-colors duration-200"
                  >
                    Login
                  </NavLink>
                  <NavLink
                    to="/signup"
                    className="px-4 py-2 bg-[#55DD4A] text-white rounded-xl hover:bg-green-600 transition-colors duration-200"
                  >
                    Sign up
                  </NavLink>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`lg:hidden transition-all duration-300 ease-in-out ${
            isMenuOpen ? "max-h-screen opacity-100 visible" : "max-h-0 opacity-0 invisible"
          }`}
          aria-hidden={!isMenuOpen}
        >
          <div className="py-4 space-y-2">
            {[
              { to: "/", label: "Home" },
              { to: "/pharmacy", label: "Pharmacy" },
              { to: "/online-booking", label: "Booking" },
              { to: "/online-consultation", label: "Online Consultation" },
            ].map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={toggleMenu}
                className={({ isActive }) =>
                  `block px-4 py-2 text-white text-center uppercase text-sm transition-colors duration-200
                  ${isActive ? "bg-[#55DD4A]" : "hover:bg-[#55DD4A]"}`}
              >
                {link.label}
              </NavLink>
            ))}

            {/* Mobile Profile Menu */}
            {user ? (
              <div className="space-y-2 pt-4">
                <button
                  onClick={toggleMobileProfile}
                  className="w-full flex items-center justify-center px-4 py-2 text-white hover:bg-[#55DD4A] transition-colors duration-200"
                  aria-expanded={isMobileProfileOpen}
                  aria-haspopup="true"
                >
                  <span className="mr-2">Profile Menu</span>
                  <ChevronDown
                    size={20}
                    className={`transform transition-transform duration-200 ${
                      isMobileProfileOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {isMobileProfileOpen && <ProfileMenu isMobile={true} />}
              </div>
            ) : (
              <div className="space-y-2 pt-4">
                <NavLink
                  to="/login"
                  onClick={toggleMenu}
                  className="block px-4 py-2 text-white text-center hover:bg-[#55DD4A] transition-colors duration-200"
                >
                  Login
                </NavLink>
                <NavLink
                  to="/signup"
                  onClick={toggleMenu}
                  className="block px-4 py-2 text-white text-center bg-[#55DD4A] hover:bg-green-600 transition-colors duration-200"
                >
                  Sign up
                </NavLink>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Search Overlay */}
      {isSearchOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-50"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              toggleSearch();
            }
          }}
          role="dialog"
          aria-modal="true"
          aria-label="Search"
        >
          <div className="absolute top-0 left-0 w-full transform">
            <form onSubmit={handleSearch} className="bg-white shadow-lg">
              <div className="container mx-auto max-w-4xl p-4">
                <div className="flex items-center bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                  <input
                    id="search-input"
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search..."
                    className="flex-1 p-3 bg-transparent focus:outline-none text-lg"
                    aria-label="Search query"
                  />
                  <button
                    type="submit"
                    className="p-3 bg-[#004d40] text-white hover:bg-[#00695c] transition-colors duration-200"
                    aria-label="Submit search"
                  >
                    <Search size={20} />
                  </button>
                  <button
                    type="button"
                    onClick={toggleSearch}
                    className="p-3 text-gray-600 hover:text-gray-900 hover:bg-gray-200 transition-colors duration-200"
                    aria-label="Close search"
                  >
                    <X size={24} />
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Notification indicator for mobile when menu is closed */}
      {isNotifsOpen && (
        <div 
          className="fixed inset-0 z-40"
          onClick={() => setIsNotifsOpen(false)}
        />
      )}
    </nav>
  );
};

export default Navbar;