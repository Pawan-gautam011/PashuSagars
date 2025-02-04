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
    <nav className="bg-gradient-to-r from-[#004d40] to-[#00695c] backdrop-blur-lg border mt-0 px-4 sm:px-6 lg:px-10 border-gray-700 shadow-md sticky top-0 z-50">
<div className="">


      <div className="flex justify-between items-center p-3">
        <div className="flex items-center text-2xl sm:text-3xl lg:text-4xl">
          <img src={Logo1} alt="Logo" className="h-10 sm:h-12 lg:h-14 cursor-pointer" />
        </div>

        <div className="flex lg:hidden items-center space-x-4 text-white">
          <button
            onClick={handleCartClick}
            className="p-2 hover:bg-[#55DD4A] rounded-full transition-colors duration-200 relative"
          >
            <ShoppingCart size={24} />
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
            <Search size={24} />
          </button>
          {isMenuOpen ? (
            <X className="cursor-pointer" onClick={toggleMenu} />
          ) : (
            <IoMdMenu className="cursor-pointer" onClick={toggleMenu} />
          )}
        </div>

        <div className="hidden lg:flex items-center justify-between flex-1 ml-6">
          <div className="flex space-x-6 text-lg text-white">
            <NavLink
              to="/"
              className="hover:bg-[#55DD4A] p-2 hover:rounded-xl min-w-[100px] text-center uppercase transition-colors duration-200"
            >
              Home
            </NavLink>
            <NavLink
              to="/pharmacy"
              className="hover:bg-[#55DD4A] p-2 hover:rounded-xl min-w-[100px] text-center uppercase transition-colors duration-200"
            >
              Pharmacy
            </NavLink>
            <NavLink
              to="/online-booking"
              className="hover:bg-[#55DD4A] p-2 hover:rounded-xl min-w-[100px] text-center uppercase transition-colors duration-200"
            >
              Booking
            </NavLink>

         
            <NavLink
              to="/aboutus"
              className="hover:bg-[#55DD4A] p-2 hover:rounded-xl min-w-[100px] text-center uppercase text-white transition-colors duration-200"
              >
              About Us
            </NavLink>
              </div>

          <div className=" flex items-center gap-x-7"> 

            <button
              onClick={handleCartClick}
              className="text-white p-2 hover:bg-[#55DD4A] rounded-full transition-colors duration-200 relative"
            >
              <ShoppingCart size={24} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>

            <button
              onClick={toggleSearch}
              className="text-white p-2 hover:bg-[#55DD4A] rounded-full transition-colors duration-200"
              >
              <Search size={24} />
            </button>
              </div>

            {user ? (
              <div className="relative">
                <button
                  className="flex items-center space-x-2 hover:bg-[#55DD4A] p-2 rounded-xl transition-colors duration-200"
                  onClick={toggleProfileMenu}
                >
                  <IoMdPerson className="text-white text-2xl" />
                  <span className="text-white">{user.username}</span>
                </button>
                {isProfileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg overflow-hidden">
                    <NavLink
                      to="/myaccount"
                      className="block px-4 py-2 text-gray-700 hover:bg-[#55DD4A] hover:text-white transition-colors duration-200"
                    >
                      My Account
                    </NavLink>
                    <button
                      onClick={handleLogout}
                      className="block w-full px-4 py-2 text-gray-700 hover:bg-[#55DD4A] hover:text-white text-left transition-colors duration-200"
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
                  className="hover:bg-[#55DD4A] p-2 hover:rounded-xl min-w-[100px] text-center text-white transition-colors duration-200"
                >
                  Login
                </NavLink>
                <NavLink
                  to="/signup"
                  className="bg-[#55DD4A] p-2 rounded-xl min-w-[100px] text-center hover:bg-green-600 text-white transition-colors duration-200"
                >
                  Sign up
                </NavLink>
              </div>
            )}
          
        </div>
      </div>

      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity duration-300 ${
          isSearchOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={toggleSearch}
      >
        <div
          className={`absolute top-0 left-0 w-full transform transition-transform duration-300 ${
            isSearchOpen ? "translate-y-0" : "-translate-y-full"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
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
                  className="bg-[#004d40] text-white p-3 hover:bg-[#00695c] transition-colors duration-200"
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

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden flex flex-col bg-gradient-to-b from-[#00574B] to-[#009366] backdrop-blur-lg border-t border-gray-700 shadow-md">
          <ul className="flex flex-col items-center text-lg text-gray-300 space-y-4 mt-4 uppercase">
            <NavLink
              to="/"
              className="hover:bg-[#55DD4A] p-2 hover:rounded-xl min-w-[150px] text-center transition-colors duration-200"
              onClick={toggleMenu}
            >
              Home
            </NavLink>
            <NavLink
              to="/pharmacy"
              className="hover:bg-[#55DD4A] p-2 hover:rounded-xl min-w-[150px] text-center transition-colors duration-200"
              onClick={toggleMenu}
            >
              Pharmacy
            </NavLink>
            <NavLink
              to="/online-booking"
              className="hover:bg-[#55DD4A] p-2 hover:rounded-xl min-w-[150px] text-center transition-colors duration-200"
              onClick={toggleMenu}
            >
              Booking
            </NavLink>
            <NavLink
              to="/aboutus"
              className="hover:bg-[#55DD4A] p-2 hover:rounded-xl min-w-[150px] text-center transition-colors duration-200"
              onClick={toggleMenu}
            >
              About Us
            </NavLink>
          </ul>
          <div className="flex space-x-4 mt-8 mb-4 items-center justify-center uppercase">
            {user ? (
              <>
                <NavLink
                  to="/myaccount"
                  className="hover:bg-[#55DD4A] p-2 hover:rounded-xl min-w-[150px] text-center text-white transition-colors duration-200"
                  onClick={toggleMenu}
                >
                  My Account
                </NavLink>
                <button
                  onClick={handleLogout}
                  className="bg-[#55DD4A] p-2 rounded-xl min-w-[150px] text-center hover:bg-green-600 text-white transition-colors duration-200"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <NavLink
                  to="/login"
                  className="hover:bg-[#55DD4A] p-2 hover:rounded-xl min-w-[150px] text-center text-white transition-colors duration-200"
                  onClick={toggleMenu}
                >
                  Login
                </NavLink>
                <NavLink
                  to="/signup"
                  className="bg-[#55DD4A] p-2 rounded-xl min-w-[150px] text-center hover:bg-green-600 text-white transition-colors duration-200"
                  onClick={toggleMenu}
                >
                  Sign up
                </NavLink>
              </>
            )}
          </div>
        </div>
      )}
    </div>
    </nav>
  );
};

export default Navbar;