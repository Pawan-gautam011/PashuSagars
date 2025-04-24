import React from 'react';
import { Link } from 'react-router-dom';
import Logo2 from "../assets/Logo2.png";
import { MapPin, Phone, Mail, Facebook, Instagram, Twitter, Heart } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gradient-to-b from-[#003830] to-[#004d40] text-white">
      <div className="container mx-auto px-4 pt-16 pb-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Column 1: Logo and Info */}
          <div className="space-y-4">
            <Link to="/" className="inline-block">
              <img src={Logo2} alt="PashuSagar" className="h-16 w-auto" />
            </Link>
            
            <p className="text-gray-300 text-sm mt-4 max-w-xs">
              Empowering pet owners with comprehensive veterinary services, 
              quality products, and expert care for your animal companions.
            </p>
            
            <div className="flex items-center space-x-4 pt-2">
              <a href="#" className="bg-white/10 p-2 rounded-full hover:bg-[#55DD4A]/20 transition-colors">
                <Facebook size={18} className="text-white" />
              </a>
              <a href="#" className="bg-white/10 p-2 rounded-full hover:bg-[#55DD4A]/20 transition-colors">
                <Instagram size={18} className="text-white" />
              </a>
              <a href="#" className="bg-white/10 p-2 rounded-full hover:bg-[#55DD4A]/20 transition-colors">
                <Twitter size={18} className="text-white" />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="lg:ml-8">
            <h3 className="text-[#55DD4A] font-medium text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-[#ADE1B0] transition-colors inline-block py-1">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/pharmacy" className="text-gray-300 hover:text-[#ADE1B0] transition-colors inline-block py-1">
                  Pharmacy
                </Link>
              </li>
              <li>
                <Link to="/online-booking" className="text-gray-300 hover:text-[#ADE1B0] transition-colors inline-block py-1">
                  Appointment Booking
                </Link>
              </li>
              <li>
                <Link to="/online-consultation" className="text-gray-300 hover:text-[#ADE1B0] transition-colors inline-block py-1">
                  Online Consultation
                </Link>
              </li>
              <li>
                <Link to="/blogs" className="text-gray-300 hover:text-[#ADE1B0] transition-colors inline-block py-1">
                  Blogs
                </Link>
              </li>
              <li>
                <Link to="/faqs" className="text-gray-300 hover:text-[#ADE1B0] transition-colors inline-block py-1">
                  FAQs
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Services */}
          <div>
            <h3 className="text-[#55DD4A] font-medium text-lg mb-4">Our Services</h3>
            <ul className="space-y-2">
              <li className="text-gray-300 hover:text-[#ADE1B0] transition-colors inline-block py-1">
                <Link to="/pharmacy">Veterinary Pharmacy</Link>
              </li>
              <li className="text-gray-300 hover:text-[#ADE1B0] transition-colors inline-block py-1">
                <Link to="/online-consultation">Virtual Consultations</Link>
              </li>
              <li className="text-gray-300 hover:text-[#ADE1B0] transition-colors inline-block py-1">
                <Link to="/online-booking">Clinic Appointments</Link>
              </li>
              <li className="text-gray-300 hover:text-[#ADE1B0] transition-colors inline-block py-1">
                <Link to="/emergency">Emergency Services</Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact Us */}
          <div>
            <h3 className="text-[#55DD4A] font-medium text-lg mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex">
                <MapPin className="text-[#ADE1B0] mr-3 h-5 w-5 mt-0.5 flex-shrink-0" />
                <span className="text-gray-300">AmritNagar, Kirtipur, Kathmandu</span>
              </li>
              <li className="flex">
                <Phone className="text-[#ADE1B0] mr-3 h-5 w-5 mt-0.5 flex-shrink-0" />
                <span className="text-gray-300">+977 9864152876</span>
              </li>
              <li className="flex">
                <Mail className="text-[#ADE1B0] mr-3 h-5 w-5 mt-0.5 flex-shrink-0" />
                <a href="mailto:PashuSagar@gmail.com" className="text-gray-300 hover:text-white transition-colors">
                  PashuSagar@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-white/10 my-8"></div>

        {/* Bottom Footer */}
        <div className="flex flex-col md:flex-row justify-between items-center text-sm">
          <div className="mb-4 md:mb-0 text-center md:text-left">
            <p className="text-gray-400">
              &copy; {currentYear} PashuSagar. All rights reserved.
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-4 text-gray-400">
            <Link to="/privacy-policy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="hover:text-white transition-colors">
              Terms & Conditions
            </Link>
            <Link to="/sitemap" className="hover:text-white transition-colors">
              Sitemap
            </Link>
          </div>
        </div>
        
        <div className="text-center text-xs text-gray-500 mt-6">
          <p className="flex items-center justify-center">
            Made with <Heart size={12} className="mx-1 text-red-400" /> for animal companions
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;