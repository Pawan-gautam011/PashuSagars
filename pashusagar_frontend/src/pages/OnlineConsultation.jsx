import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
function OnlineConsultation() {
  const navigate = useNavigate();
  const [allDoctors, setAllDoctors] = useState([]);

  const getDoctors = async () => {
    const token = localStorage.getItem("token");
    console.log("token", token);

    try {
      const response = await fetch("http://127.0.0.1:8000/api/auth/users/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      // Correct filtering logic
      const filteredData = data.filter(
        (user) => user.role_display === "Veterinarian"
      );

      console.log("Filtered Veterinarians:", filteredData);
      setAllDoctors(filteredData);
    } catch (error) {
      console.error("Error fetching doctors:", error);
    }
  };

  useEffect(() => {
    getDoctors();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
          Available Veterinarians
        </h2>
        {allDoctors.length > 0 ? (
          <ul className="space-y-6">
            {allDoctors.map((doctor) => (
              <div
                key={doctor.id}
                className="bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition-shadow duration-300"
              >
                <li className="text-xl font-semibold text-gray-800">
                  Name: {doctor.username}
                </li>
                <li className="text-gray-600 mt-2">Email: {doctor.email}</li>
                <li className="text-gray-600 mt-2">
                  Phone: {doctor.phone_number}
                </li>
                <button
                  onClick={() => {
                    navigate("/message", { state: { doctor_id: doctor.id } });
                  }}
                >
                  Talk
                </button>
              </div>
            ))}
          </ul>
        ) : (
          <p className="text-center text-gray-600">No veterinarians found.</p>
        )}
      </div>
    </div>
  );
}

export default OnlineConsultation;
