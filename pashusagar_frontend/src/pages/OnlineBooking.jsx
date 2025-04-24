import { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../Components/Navbar";
import Breadcrumbs from "../Components/BreadCrumbs";
import Footer from "../Components/Footer";
import { Calendar, CheckCircle, AlertCircle, Clock, ChevronRight, Home } from "lucide-react";

const OnlineBooking = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    petName: "",
    appointmentDate: "",
    description: "",
  });

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [minDateTime, setMinDateTime] = useState("");

  // Set minimum date-time to current time + 15 minutes
  useEffect(() => {
    const now = new Date();
    // Add 15 minutes to current time
    now.setMinutes(now.getMinutes() + 15);
    
    // Format to YYYY-MM-DDThh:mm
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    
    const formattedDateTime = `${year}-${month}-${day}T${hours}:${minutes}`;
    setMinDateTime(formattedDateTime);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const appointmentData = {
      first_name: formData.firstName,
      last_name: formData.lastName,
      email: formData.email,
      phone_number: formData.phoneNumber,
      pet_name: formData.petName,
      appointment_date: new Date(formData.appointmentDate).toISOString(),
      description: formData.description,
    };

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://127.0.0.1:8000/api/appointments/",
        appointmentData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Appointment booked successfully", response.data);
      setSuccessMessage("Your appointment has been booked successfully.");
      setErrorMessage("");
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        petName: "",
        appointmentDate: "",
        description: "",
      });
    } catch (error) {
      console.error("Error booking appointment", error);
      setErrorMessage("Failed to book appointment. Please try again.");
      setSuccessMessage("");
    }
  };

  const breadcrumbItems = [
    { label: "Home", path: "/" },
    { label: "Online Booking", path: "/online-booking" },
  ];
  
  
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

  // Left side information content
  const InfoContent = () => (
    <div className="text-white">
      <h3 className="text-[#55DD4A] text-2xl font-bold mb-6">Why Book Online?</h3>
      
      <div className="space-y-6">
        <div className="flex items-start space-x-4">
          <div className="bg-[#55DD4A] p-2 rounded-full">
            <Clock className="h-6 w-6 text-[#004d40]" />
          </div>
          <div>
            <h4 className="text-[#ADE1B0] text-lg font-semibold">Save Time</h4>
            <p className="mt-2 text-gray-100">Skip phone calls and book your appointment anytime, day or night, at your convenience.</p>
          </div>
        </div>
        
        <div className="flex items-start space-x-4">
          <div className="bg-[#55DD4A] p-2 rounded-full">
            <Calendar className="h-6 w-6 text-[#004d40]" />
          </div>
          <div>
            <h4 className="text-[#ADE1B0] text-lg font-semibold">Flexible Scheduling</h4>
            <p className="mt-2 text-gray-100">View all available time slots and choose what works best for you and your pet.</p>
          </div>
        </div>
        
        <div className="flex items-start space-x-4">
          <div className="bg-[#55DD4A] p-2 rounded-full">
            <CheckCircle className="h-6 w-6 text-[#004d40]" />
          </div>
          <div>
            <h4 className="text-[#ADE1B0] text-lg font-semibold">Instant Confirmation</h4>
            <p className="mt-2 text-gray-100">Receive immediate confirmation of your appointment via email.</p>
          </div>
        </div>
      </div>
      
      <div className="mt-10 bg-[#003830] p-6 rounded-lg">
        <h3 className="text-[#ADE1B0] text-xl font-semibold mb-4">Our Services</h3>
        <ul className="space-y-2">
          <li className="flex items-center">
            <span className="text-[#55DD4A] mr-2">•</span>
            Routine check-ups and vaccinations
          </li>
          <li className="flex items-center">
            <span className="text-[#55DD4A] mr-2">•</span>
            Preventive care and wellness exams
          </li>
          <li className="flex items-center">
            <span className="text-[#55DD4A] mr-2">•</span>
            Dental care and treatment
          </li>
          <li className="flex items-center">
            <span className="text-[#55DD4A] mr-2">•</span>
            Treatment for illness or injury
          </li>
          <li className="flex items-center">
            <span className="text-[#55DD4A] mr-2">•</span>
            Nutritional counseling
          </li>
          <li className="flex items-center">
            <span className="text-[#55DD4A] mr-2">•</span>
            Specialized treatments
          </li>
        </ul>
      </div>
    </div>
  );

  return (
    <>
      <Navbar />
      <div className="bg-gradient-to-b from-[#004d40] to-[#00695c] min-h-screen">
        <div className="pt-16 pb-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">

          <div className="container mx-auto">
            <EnhancedBreadcrumbs items={breadcrumbItems} />
          </div>
            
            <div className="text-center mb-8">
              <h2 className="text-[#55DD4A] text-6xl">Online Booking</h2>
              <h1 className="uppercase mt-9 text-xl text-[#ADE1B0]">
                Book an appointment with our expert veterinarians
              </h1>
              <hr className="mt-5 border-[#ADE1B0]" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
              {/* Left Side - Information Content */}
              <div className="order-2 lg:order-1">
                <InfoContent />
              </div>
              
              {/* Right Side - Form */}
              <div className="order-1 lg:order-2">
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                  <div className="p-8">
                    <h1 className="text-2xl font-bold text-center text-[#00574B] mb-6">
                      Schedule Your Appointment
                    </h1>
                    
                    {successMessage && (
                      <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4 flex items-start">
                        <CheckCircle className="h-5 w-5 mr-2 mt-0.5" />
                        <span>{successMessage}</span>
                      </div>
                    )}
                    
                    {errorMessage && (
                      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4 flex items-start">
                        <AlertCircle className="h-5 w-5 mr-2 mt-0.5" />
                        <span>{errorMessage}</span>
                      </div>
                    )}
                    
                    <form onSubmit={handleSubmit} className="space-y-4 mt-6">
                      {/* First Name & Last Name */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label
                            htmlFor="firstName"
                            className="block text-sm font-medium text-[#00574B] mb-1"
                          >
                            First Name <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            id="firstName"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            placeholder="Enter your first name"
                            required
                            className="bg-gray-100 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5 focus:outline-none focus:ring-2 focus:ring-[#55DD4A] focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="lastName"
                            className="block text-sm font-medium text-[#00574B] mb-1"
                          >
                            Last Name <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            id="lastName"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            placeholder="Enter your last name"
                            required
                            className="bg-gray-100 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5 focus:outline-none focus:ring-2 focus:ring-[#55DD4A] focus:border-transparent"
                          />
                        </div>
                      </div>

                      {/* Email & Phone Number */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label
                            htmlFor="email"
                            className="block text-sm font-medium text-[#00574B] mb-1"
                          >
                            Email <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Enter your email"
                            required
                            className="bg-gray-100 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5 focus:outline-none focus:ring-2 focus:ring-[#55DD4A] focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="phoneNumber"
                            className="block text-sm font-medium text-[#00574B] mb-1"
                          >
                            Phone Number <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            id="phoneNumber"
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={handleChange}
                            placeholder="Enter your phone number"
                            required
                            className="bg-gray-100 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5 focus:outline-none focus:ring-2 focus:ring-[#55DD4A] focus:border-transparent"
                          />
                        </div>
                      </div>

                      {/* Pet Name & Appointment Date */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label
                            htmlFor="petName"
                            className="block text-sm font-medium text-[#00574B] mb-1"
                          >
                            Pet Name (if applicable)
                          </label>
                          <input
                            type="text"
                            id="petName"
                            name="petName"
                            value={formData.petName}
                            onChange={handleChange}
                            placeholder="Enter your pet's name"
                            className="bg-gray-100 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5 focus:outline-none focus:ring-2 focus:ring-[#55DD4A] focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="appointmentDate"
                            className="block text-sm font-medium text-[#00574B] mb-1"
                          >
                            Appointment Date & Time <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="datetime-local"
                            id="appointmentDate"
                            name="appointmentDate"
                            value={formData.appointmentDate}
                            onChange={handleChange}
                            min={minDateTime}
                            required
                            className="bg-gray-100 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5 focus:outline-none focus:ring-2 focus:ring-[#55DD4A] focus:border-transparent"
                          />
                          <p className="text-xs text-gray-500 mt-1">
                            Appointments must be scheduled at least 15 minutes in advance
                          </p>
                        </div>
                      </div>

                      {/* Description */}
                      <div>
                        <label
                          htmlFor="description"
                          className="block text-sm font-medium text-[#00574B] mb-1"
                        >
                          Description <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          id="description"
                          name="description"
                          value={formData.description}
                          onChange={handleChange}
                          placeholder="Describe your pet's condition or reason for appointment"
                          rows="4"
                          required
                          className="bg-gray-100 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5 focus:outline-none focus:ring-2 focus:ring-[#55DD4A] focus:border-transparent"
                        ></textarea>
                      </div>

                      {/* Submit Button */}
                      <button
                        type="submit"
                        className="w-full bg-[#009366] text-white font-medium rounded-lg text-sm px-5 py-2.5 hover:bg-[#00574B] focus:outline-none focus:ring-4 focus:ring-[#ADE1B0] mt-4 transition-colors duration-200"
                      >
                        Book Appointment
                      </button>
                    </form>
                  </div>

                  {/* Additional Information */}
                  <div className="bg-[#004d40] p-6 border-t border-[#ADE1B0]/20">
                    <h4 className="text-lg font-medium text-[#ADE1B0]">Important Information</h4>
                    <ul className="mt-3 space-y-2 text-white text-sm">
                      <li className="flex items-start">
                        <span className="text-[#55DD4A] mr-2">•</span>
                        Please arrive 15 minutes before your scheduled appointment.
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#55DD4A] mr-2">•</span>
                        Bring any previous medical records or prescriptions for your pet.
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#55DD4A] mr-2">•</span>
                        You'll receive a confirmation email with details about your appointment.
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#55DD4A] mr-2">•</span>
                        If you need to cancel or reschedule, please do so at least 24 hours in advance.
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default OnlineBooking;