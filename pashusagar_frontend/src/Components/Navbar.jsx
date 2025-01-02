import React, { useState } from "react";
import Logo1 from "../assets/Logo.png";
import { NavLink } from "react-router-dom";
import { IoMdMenu} from "react-icons/io";
import { X } from 'lucide-react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);

    document.body.style.overflow = isMenuOpen ? "auto" : "hidden";
  };

  return (
    <nav className=" bg-gradient-to-r from-[#004d40] to-[#00695c] backdrop-blur-lg border mt-0 px-4 sm:px-6 lg:px-10 border-gray-700 shadow-md sticky top-0 z-50">
      <div className="flex justify-between items-center p-3">
        <div className="flex items-center text-2xl sm:text-3xl lg:text-4xl">
          <img src={Logo1} alt="Logo" className="h-10 sm:h-16 lg:h-20 cursor-pointer" />
        </div>

        <div className="flex lg:hidden items-center text-2xl sm:text-3xl text-white">
          {isMenuOpen ? (
            <X
            className="cursor-pointer" onClick={toggleMenu} />
          ) : (
            <IoMdMenu className="cursor-pointer" onClick={toggleMenu} />
          )}
        </div>

        <div className="hidden lg:flex space-x-6 text-lg text-white">
          {["Home", "Services", "Blog", "About Us"].map((item) => (
            <NavLink
              key={item}
              className="hover:bg-[#55DD4A] p-2 hover:rounded-xl min-w-[100px] text-center  uppercase"
            >
              {item}
            </NavLink>
          ))}
        </div>

        <div className="hidden lg:flex space-x-4 text-lg items-center uppercase">
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
        </div>
      </div>

      {isMenuOpen && (
        <div className="lg:hidden flex flex-col from-[#00574B] to-[#009366] backdrop-blur-lg border-t border-gray-700 shadow-md">
          <ul className="flex flex-col items-center text-lg text-gray-300 space-y-4 mt-4 uppercase">
            {["Home", "Services", "Blog", "About Us"].map((item) => (
              <NavLink
                key={item}
                className="hover:bg-[#55DD4A] p-2 hover:rounded-xl min-w-[150px] text-center"
                onClick={toggleMenu}
              >
                {item}
              </NavLink>
            ))}
          </ul>
          <div className="flex space-x-4 mt-8 mb-4 items-center justify-center uppercase">
            <NavLink
              to="/login"
              className="hover:bg-[#55DD4A] p-2 hover:rounded-xl min-w-[100px] text-center text-white"
              onClick={toggleMenu}
            >
              Login
            </NavLink>
            <NavLink
              to="/signup"
              className="bg-[#55DD4A] p-2 rounded-xl min-w-[100px] text-center hover:bg-green-600 text-white"
              onClick={toggleMenu}
            >
              Sign up
            </NavLink>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;