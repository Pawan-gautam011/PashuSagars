import React, { useState } from "react";
import Navbar from "../Components/Navbar";

const OnlineBooking = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    selectedDoctor: "",
    description: "",
  });

  const doctors = [
    "Dr. Suresh Kumar",
    "Dr. Priya Shah",
    "Dr. Ramesh Adhikari",
    "Dr. Nisha Thapa",
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
  };

  return (
    <>
    <Navbar/>
    <div className="bg-gradient-to-b from-[#00574B] to-[#009366] h-screen flex justify-center items-center">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-sm sm:max-w-lg md:max-w-xl">
        <h1 className="text-2xl font-bold text-center text-[#00574B] ">
            Online Booking
          </h1>
          <form
            onSubmit={handleSubmit}
            className="space-y-6"
          >
         
            <div>
              <label className="block text-sm font-medium text-[#00574B] mb-2">
                Full Name
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="bg-gray-100 border border-gray-300 text-gray-900 rounded-lg block w-full p-3"
                placeholder="Enter your full name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#00574B] mb-2">
                Phone Number
              </label>
              <input
                type="text"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                className="bg-gray-100 border border-gray-300 text-gray-900 rounded-lg block w-full p-3"
                placeholder="Enter your phone number"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#00574B] mb-2">
                Select Doctor
              </label>
              <select
                id="selectedDoctor"
                name="selectedDoctor"
                value={formData.selectedDoctor}
                onChange={handleChange}
                className="bg-gray-100 border border-gray-300 text-gray-900 rounded-lg block w-full p-3"
                required
              >
                <option value="">Select a doctor</option>
                {doctors.map((doctor, index) => (
                  <option key={index} value={doctor}>
                    {doctor}
                  </option>
                ))}
              </select>
            </div>

     
            <div>
              <label className="block text-sm font-medium text-[#00574B] mb-2">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="bg-gray-100 border border-gray-300 text-gray-900 rounded-lg block w-full p-3"
                placeholder="Describe your condition or what happened"
                rows="4"
                required
              ></textarea>
            </div>


            <div className="mt-4">
              <button
                type="submit"
                className="w-full bg-[#009366] text-white font-medium rounded-lg text-sm px-5 py-2.5 hover:bg-[#00574B] focus:outline-none focus:ring-4 focus:ring-[#ADE1B0]"
              >
                Book Appointment
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default OnlineBooking;
