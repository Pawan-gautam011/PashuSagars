import  { useState } from "react";
import axios from "axios";
import Navbar from "../Components/Navbar";

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

  return (
    <>
      <Navbar />
      <div className="bg-gradient-to-b from-[#00574B] to-[#009366] min-h-screen flex justify-center items-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md sm:max-w-lg md:max-w-xl">
          <h1 className="text-2xl font-bold text-center text-[#00574B]">
            Online Booking
          </h1>
          {successMessage && (
            <p className="text-green-600 text-center mt-4">{successMessage}</p>
          )}
          {errorMessage && (
            <p className="text-red-600 text-center mt-4">{errorMessage}</p>
          )}
          <form onSubmit={handleSubmit} className="space-y-4 mt-6">
            {/* First Name & Last Name */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="firstName"
                  className="block text-sm font-medium text-[#00574B] mb-1"
                >
                  First Name
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="Enter your first name"
                  required
                  className="bg-gray-100 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                />
              </div>
              <div>
                <label
                  htmlFor="lastName"
                  className="block text-sm font-medium text-[#00574B] mb-1"
                >
                  Last Name
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Enter your last name"
                  required
                  className="bg-gray-100 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
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
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  required
                  className="bg-gray-100 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                />
              </div>
              <div>
                <label
                  htmlFor="phoneNumber"
                  className="block text-sm font-medium text-[#00574B] mb-1"
                >
                  Phone Number
                </label>
                <input
                  type="text"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                  required
                  className="bg-gray-100 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
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
                  className="bg-gray-100 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                />
              </div>
              <div>
                <label
                  htmlFor="appointmentDate"
                  className="block text-sm font-medium text-[#00574B] mb-1"
                >
                  Appointment Date & Time
                </label>
                <input
                  type="datetime-local"
                  id="appointmentDate"
                  name="appointmentDate"
                  value={formData.appointmentDate}
                  onChange={handleChange}
                  required
                  className="bg-gray-100 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-[#00574B] mb-1"
              >
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe your condition"
                rows="4"
                required
                className="bg-gray-100 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
              ></textarea>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-[#009366] text-white font-medium rounded-lg text-sm px-5 py-2.5 hover:bg-[#00574B]"
            >
              Book Appointment
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default OnlineBooking;
