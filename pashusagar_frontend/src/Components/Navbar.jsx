import React, { useState, useEffect } from "react";
import Logo1 from "../assets/Logo.png";
import { NavLink, useNavigate } from "react-router-dom";
import { IoMdMenu } from "react-icons/io";
import { X, Search, ShoppingCart } from "lucide-react";
import { IoMdPerson } from "react-icons/io";
import { FaSignOutAlt } from "react-icons/fa";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [cartCount, setCartCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    const storedEmail = localStorage.getItem("email");
    const storedCartCount = localStorage.getItem("cartCount") || 0;

    if (storedUsername && storedEmail) {
      setUser({ username: storedUsername, email: storedEmail });
    }
    setCartCount(Number(storedCartCount));
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    document.body.style.overflow = isMenuOpen ? "auto" : "hidden";
  };

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
    navigate("/login");
  };

  const toggleProfileMenu = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
    if (!isSearchOpen) {
      setTimeout(() => {
        document.getElementById("search-input")?.focus();
      }, 100);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    console.log("Searching for:", searchQuery);
    setIsSearchOpen(false);
    setSearchQuery("");
  };

  const handleCartClick = () => {
    navigate("/mycart");
  };

  return (
    <nav className="bg-gradient-to-r from-[#004d40] to-[#00695c] backdrop-blur-lg shadow-md sticky top-0 z-50">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo Section */}
          <div className="flex-shrink-0">
            <img 
              src={Logo1} 
              alt="Logo" 
              className="h-8 w-auto sm:h-10 md:h-12 lg:h-14 transition-all duration-200"
            />
          </div>

          {/* Mobile Navigation Icons */}
          <div className="flex lg:hidden items-center space-x-3">
            <button
              onClick={handleCartClick}
              className="p-2 hover:bg-[#55DD4A] rounded-full transition-colors duration-200 relative"
            >
              <ShoppingCart className="text-white" size={24} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
            <button
              onClick={toggleSearch}
              className="p-2 hover:bg-[#55DD4A] rounded-full transition-colors duration-200"
            >
              <Search className="text-white" size={24} />
            </button>
            <button
              onClick={toggleMenu}
              className="p-2 hover:bg-[#55DD4A] rounded-full transition-colors duration-200"
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
            <div className="flex space-x-4 xl:space-x-8">
              {[
                { to: "/", label: "Home" },
                { to: "/pharmacy", label: "Pharmacy" },
                { to: "/online-booking", label: "Booking" },
                { to: "/online-consultation", label: "Online Consultation" },
                { to: "/aboutus", label: "About Us" },
              ].map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    `px-4 py-2 text-white uppercase text-sm xl:text-base transition-colors duration-200 
                    ${isActive ? 'bg-[#55DD4A] rounded-xl' : 'hover:bg-[#55DD4A] rounded-xl'}`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </div>

            {/* Desktop Right Section */}
            <div className="flex items-center space-x-6">
              <button
                onClick={handleCartClick}
                className="relative p-2 hover:bg-[#55DD4A] rounded-full transition-colors duration-200"
              >
                <ShoppingCart className="text-white" size={24} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>
              <button
                onClick={toggleSearch}
                className="p-2 hover:bg-[#55DD4A] rounded-full transition-colors duration-200"
              >
                <Search className="text-white" size={24} />
              </button>

              {user ? (
                <div className="relative">
                  <button
                    onClick={toggleProfileMenu}
                    className="flex items-center space-x-2 px-4 py-2 text-white hover:bg-[#55DD4A] rounded-xl transition-colors duration-200"
                  >
                    <IoMdPerson className="text-xl" />
                    <span className="text-sm font-medium">{user.username}</span>
                  </button>
                  {isProfileMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg overflow-hidden">
                      <NavLink
                        to="/myaccount"
                        className="block px-4 py-2 text-gray-700 hover:bg-[#55DD4A] hover:text-white transition-colors duration-200"
                      >
                        My Account
                      </NavLink>
                      <button
                        onClick={handleLogout}
                        className="w-full px-4 py-2 text-left text-gray-700 hover:bg-[#55DD4A] hover:text-white transition-colors duration-200"
                      >
                        <FaSignOutAlt className="inline mr-2" />
                        Logout
                      </button>
                    </div>
                  )}
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
            isMenuOpen
              ? "max-h-screen opacity-100 visible"
              : "max-h-0 opacity-0 invisible"
          }`}
        >
          <div className="py-4 space-y-2">
            {[
              { to: "/", label: "Home" },
              { to: "/pharmacy", label: "Pharmacy" },
              { to: "/online-booking", label: "Booking" },
              { to: "/online-consultation", label: "Online Consultation" },
              { to: "/aboutus", label: "About Us" },
            ].map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={toggleMenu}
                className={({ isActive }) =>
                  `block px-4 py-2 text-white text-center uppercase text-sm transition-colors duration-200
                  ${isActive ? 'bg-[#55DD4A]' : 'hover:bg-[#55DD4A]'}`
                }
              >
                {link.label}
              </NavLink>
            ))}

            {user ? (
              <div className="space-y-2 pt-4">
                <NavLink
                  to="/myaccount"
                  onClick={toggleMenu}
                  className="block px-4 py-2 text-white text-center hover:bg-[#55DD4A] transition-colors duration-200"
                >
                  My Account
                </NavLink>
                <button
                  onClick={() => {
                    handleLogout();
                    toggleMenu();
                  }}
                  className="w-full px-4 py-2 text-white text-center bg-[#55DD4A] hover:bg-green-600 transition-colors duration-200"
                >
                  Logout
                </button>
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
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
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
                  />
                  <button
                    type="submit"
                    className="p-3 bg-[#004d40] text-white hover:bg-[#00695c] transition-colors duration-200"
                  >
                    <Search size={20} />
                  </button>
                  <button
                    type="button"
                    onClick={toggleSearch}
                    className="p-3 text-gray-600 hover:text-gray-900 hover:bg-gray-200 transition-colors duration-200"
                  >
                    <X size={24} />
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;