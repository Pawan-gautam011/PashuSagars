import React, { useState, useEffect } from "react";
import Logo1 from "../assets/Logo.png";
import { NavLink, useNavigate } from "react-router-dom";
import { IoMdMenu } from "react-icons/io";
import { X } from "lucide-react";
import { IoMdPerson } from "react-icons/io"; // Profile Icon
import { FaSignOutAlt } from "react-icons/fa"; // Logout Icon

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState(null); // State to track if user is logged in
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false); // State to control profile menu visibility
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in by checking localStorage
    const storedUsername = localStorage.getItem("username");
    const storedEmail = localStorage.getItem("email");

    if (storedUsername && storedEmail) {
      setUser({ username: storedUsername, email: storedEmail });
    }
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    document.body.style.overflow = isMenuOpen ? "auto" : "hidden";
  };

  const handleLogout = () => {
    localStorage.clear();
    setUser(null); // Clear the user state
    navigate("/login"); // Redirect to login page
  };

  const toggleProfileMenu = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen); // Toggle profile dropdown visibility
  };

  return (
    <nav className="bg-gradient-to-r from-[#004d40] to-[#00695c] backdrop-blur-lg border mt-0 px-4 sm:px-6 lg:px-10 border-gray-700 shadow-md sticky top-0 z-50">
      <div className="flex justify-between items-center p-3">
        {/* Logo */}
        <div className="flex items-center text-2xl sm:text-3xl lg:text-4xl">
          <img src={Logo1} alt="Logo" className="h-10 sm:h-16 lg:h-20 cursor-pointer" />
        </div>

        {/* Menu Icon for Small Screens */}
        <div className="flex lg:hidden items-center text-2xl sm:text-3xl text-white">
          {isMenuOpen ? (
            <X className="cursor-pointer" onClick={toggleMenu} />
          ) : (
            <IoMdMenu className="cursor-pointer" onClick={toggleMenu} />
          )}
        </div>

        <div className="hidden lg:flex space-x-6 text-lg text-white">
          <NavLink
            to="/"
            className="hover:bg-[#55DD4A] p-2 hover:rounded-xl min-w-[100px] text-center uppercase"
          >
            Home
          </NavLink>
          <NavLink
            to="/pharmacy"
            className="hover:bg-[#55DD4A] p-2 hover:rounded-xl min-w-[100px] text-center uppercase"
          >
            Pharmacy
          </NavLink>
          <NavLink
            to="/online-booking"
            className="hover:bg-[#55DD4A] p-2 hover:rounded-xl min-w-[100px] text-center uppercase"
          >
            Booking
          </NavLink>

          <NavLink
            to="/aboutus"
            className="hover:bg-[#55DD4A] p-2 hover:rounded-xl min-w-[100px] text-center uppercase"
          >
            About Us
          </NavLink>
        </div>

        {/* Auth Buttons or Profile Icon */}
        <div className="hidden lg:flex items-center space-x-4 text-lg">
          {user ? (
            <div className="relative">
              <button
                className="flex items-center space-x-2"
                onClick={toggleProfileMenu} 
              >
                <IoMdPerson className="text-white text-2xl" />
                <span className="text-white">{user.username}</span>
              </button>
              {isProfileMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg">
                  <NavLink
                    to="/myaccount"
                    className="block px-4 py-2 text-gray-700 hover:bg-[#55DD4A] hover:text-white"
                  >
                    My Account
                  </NavLink>
                  <button
                    onClick={handleLogout}
                    className="block w-full px-4 py-2 text-gray-700 hover:bg-[#55DD4A] hover:text-white text-left"
                  >
                    <FaSignOutAlt className="inline mr-2" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <NavLink
                to="/login"
                className="hover:bg-[#55DD4A] p-2 hover:rounded-xl min-w-[100px] text-center text-white"
              >
                Login
              </NavLink>
              <NavLink
                to="/signup"
                className="bg-[#55DD4A] p-2 rounded-xl min-w-[100px] text-center hover:bg-green-600 text-white"
              >
                Sign up
              </NavLink>
            </>
          )}
        </div>
      </div>

      {/* Dropdown Menu for Small Screens */}
      {isMenuOpen && (
        <div className="lg:hidden flex flex-col bg-gradient-to-b from-[#00574B] to-[#009366] backdrop-blur-lg border-t border-gray-700 shadow-md">
          <ul className="flex flex-col items-center text-lg text-gray-300 space-y-4 mt-4 uppercase">
            <NavLink
              to="/"
              className="hover:bg-[#55DD4A] p-2 hover:rounded-xl min-w-[150px] text-center"
              onClick={toggleMenu}
            >
              Home
            </NavLink>
            <NavLink
              to="/pharmacy"
              className="hover:bg-[#55DD4A] p-2 hover:rounded-xl min-w-[150px] text-center"
              onClick={toggleMenu}
            >
              Pharmacy
            </NavLink>
            <NavLink
              to="/online-booking"
              className="hover:bg-[#55DD4A] p-2 hover:rounded-xl min-w-[150px] text-center"
              onClick={toggleMenu}
            >
              Booking
            </NavLink>
            <NavLink
              to="/aboutus"
              className="hover:bg-[#55DD4A] p-2 hover:rounded-xl min-w-[150px] text-center"
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
                  className="hover:bg-[#55DD4A] p-2 hover:rounded-xl min-w-[150px] text-center text-white"
                  onClick={toggleMenu}
                >
                  My Account
                </NavLink>
                <button
                  onClick={handleLogout}
                  className="bg-[#55DD4A] p-2 rounded-xl min-w-[150px] text-center hover:bg-green-600 text-white"
                  onClick={toggleMenu}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <NavLink
                  to="/login"
                  className="hover:bg-[#55DD4A] p-2 hover:rounded-xl min-w-[150px] text-center text-white"
                  onClick={toggleMenu}
                >
                  Login
                </NavLink>
                <NavLink
                  to="/signup"
                  className="bg-[#55DD4A] p-2 rounded-xl min-w-[150px] text-center hover:bg-green-600 text-white"
                  onClick={toggleMenu}
                >
                  Sign up
                </NavLink>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;