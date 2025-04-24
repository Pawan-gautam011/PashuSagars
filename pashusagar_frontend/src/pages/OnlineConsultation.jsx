import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Components/Navbar";
import Breadcrumbs from "../Components/BreadCrumbs";
import { MessageCircle, Star, Clock, User, Calendar, Search, Home, ChevronRight } from "lucide-react";

function OnlineConsultation() {
  const navigate = useNavigate();
  const [allDoctors, setAllDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const breadcrumbItems = [
    { label: "Home", path: "/" },
    { label: "Online Consultation", path: "/online-consultation" },
  ];

  const getDoctors = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      
      if (!token) {
        setError("You need to be logged in to access this feature");
        setLoading(false);
        return;
      }

      const response = await fetch("http://127.0.0.1:8000/api/auth/users/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      // Filter veterinarians
      const filteredData = data.filter(
        (user) => user.role_display === "Veterinarian"
      );
      
      // Add some sample data for UI enhancement
      const enhancedData = filteredData.map(doctor => ({
        ...doctor,
        rating: (Math.random() * 2 + 3).toFixed(1), // Random rating between 3.0 and 5.0
        specialization: ["General Veterinary", "Pet Care", "Animal Nutrition"][Math.floor(Math.random() * 3)],
        experience: Math.floor(Math.random() * 15) + 1, // Random experience years
        availableToday: Math.random() > 0.3, // 70% chance of being available today
      }));

      setAllDoctors(enhancedData);
      setFilteredDoctors(enhancedData);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching doctors:", error);
      setError("Failed to load veterinarians. Please try again later.");
      setLoading(false);
    }
  };

  useEffect(() => {
    getDoctors();
  }, []);

  // Handle search functionality
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredDoctors(allDoctors);
    } else {
      const filtered = allDoctors.filter(
        doctor => 
          doctor.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (doctor.specialization && doctor.specialization.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      setFilteredDoctors(filtered);
    }
  }, [searchQuery, allDoctors]);

  const handleConsultation = (doctorId) => {
    navigate("/message", { state: { doctor_id: doctorId } });
  };

  
const EnhancedBreadcrumbs = ({ items }) => {
  return (
    <nav className="bg-white/10 backdrop-blur-sm rounded-lg p-3 mb-6">
      <ol className="flex flex-wrap items-center">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={index} className="flex items-center">
              {index === 0 && <Home size={16} className="text-white mr-2" />}
              
              {isLast ? (
                <span className="font-medium text-[#55DD4A]">{item.label}</span>
              ) : (
                <>
                  <a 
                    href={item.path} 
                    className="text-white hover:text-[#ADE1B0] transition-colors"
                  >
                    {item.label}
                  </a>
                  <ChevronRight size={16} className="mx-2 text-white/60" />
                </>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-[#004D40] to-[#00695C] pt-16 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="container mx-auto">
            <EnhancedBreadcrumbs items={breadcrumbItems} />
          </div>
          <div className="text-center mb-12">
            <h2 className="text-[#55DD4A] text-4xl md:text-5xl font-bold animate-fade-in mb-4">
              Online Consultation
            </h2>
            <p className="text-[#ADE1B0] text-lg md:text-xl max-w-2xl mx-auto">
              Connect with our experienced veterinarians for expert advice and care for your pets
            </p>
            <div className="h-px bg-gradient-to-r from-transparent via-[#ADE1B0] to-transparent my-8" />
          </div>

          {/* Search bar */}
          <div className="max-w-md mx-auto mb-8">
            <div className="relative">
              <input
                type="text"
                placeholder="Search by name or specialization..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/10 backdrop-blur-md text-white border border-[#ADE1B0] rounded-full py-3 px-6 pl-12 focus:outline-none focus:ring-2 focus:ring-[#55DD4A] placeholder-white/60"
              />
              <Search className="absolute left-4 top-3.5 text-white/60" size={20} />
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#55DD4A]"></div>
            </div>
          ) : error ? (
            <div className="bg-red-500/20 backdrop-blur-md text-white p-6 rounded-lg max-w-2xl mx-auto text-center">
              <p>{error}</p>
              <button 
                onClick={() => navigate("/login")}
                className="mt-4 bg-white text-[#004D40] px-6 py-2 rounded-full font-medium hover:bg-[#ADE1B0] transition-colors"
              >
                Go to Login
              </button>
            </div>
          ) : filteredDoctors.length === 0 ? (
            <div className="bg-white/10 backdrop-blur-md text-white p-6 rounded-lg max-w-2xl mx-auto text-center">
              <p>No veterinarians matching your search criteria.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDoctors.map((doctor) => (
                <div
                  key={doctor.id}
                  className="bg-white/10 backdrop-blur-md rounded-xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
                >
                  <div className="p-6">
                    <div className="flex items-start">
                      <div className="bg-gradient-to-br from-[#00796B] to-[#00695C] h-16 w-16 rounded-full flex items-center justify-center text-white text-2xl font-bold mr-4">
                        {doctor.username.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-white mb-1">
                          Dr. {doctor.username}
                        </h3>
                        <div className="flex items-center text-[#ADE1B0] text-sm mb-1">
                          <Star className="h-4 w-4 fill-[#55DD4A] text-[#55DD4A] mr-1" />
                          <span>{doctor.rating}</span>
                          <span className="mx-2">•</span>
                          <span>{doctor.specialization}</span>
                        </div>
                        <div className="flex items-center text-white/80 text-sm mb-3">
                          <Clock className="h-4 w-4 mr-1" />
                          <span>{doctor.experience} years experience</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4 space-y-3">
                      <div className="flex items-center text-white/90">
                        <User className="h-4 w-4 mr-2" />
                        <span>Email: {doctor.email}</span>
                      </div>
                      
                      <div className="flex items-center text-white/90">
                        <Calendar className="h-4 w-4 mr-2" />
                        <span>
                          {doctor.availableToday ? (
                            <span className="text-green-400 font-medium">Available today</span>
                          ) : (
                            <span className="text-yellow-400">Limited availability</span>
                          )}
                        </span>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => handleConsultation(doctor.id)}
                      className="w-full mt-6 bg-[#55DD4A] hover:bg-[#4BC940] text-white rounded-lg py-3 px-4 font-medium flex items-center justify-center transition-colors"
                    >
                      <MessageCircle className="mr-2 h-5 w-5" />
                      Start Consultation
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default OnlineConsultation;