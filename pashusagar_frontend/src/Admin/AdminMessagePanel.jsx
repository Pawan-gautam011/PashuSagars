import React, { useState, useEffect } from "react";

const AdminMessagePanel = () => {
  const [messages, setMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [doctors, setDoctors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMessages = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("http://localhost:8000/api/messages/", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch messages.");
        }
        const data = await response.json();
        setMessages(data);
      } catch (err) {
        setError("Failed to fetch messages.");
      } finally {
        setIsLoading(false);
      }
    };

    const fetchDoctors = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/doctors/", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch doctors.");
        }
        const data = await response.json();
        console.log(data)
        setDoctors(data);
      } catch (err) {
        setError("Failed to fetch doctors.");
      }
    };

    fetchMessages();
    fetchDoctors();
  }, []);

  const handleAssignDoctor = async () => {
    if (!selectedMessage || !selectedDoctor) {
      setError("Please select a message and a doctor.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:8000/api/assign-doctor/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          message_id: selectedMessage,
          doctor_id: selectedDoctor,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to assign doctor.");
      }

      alert("Doctor assigned and email sent.");
    } catch (err) {
      setError("Failed to assign doctor. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-lg max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Admin Message Panel</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Select Message</label>
          <select
            value={selectedMessage}
            onChange={(e) => setSelectedMessage(e.target.value)}
            className="border p-2 rounded w-full"
          >
            <option value="">Select a message</option>
            {messages?.map((message) => (
              <option key={message.id} value={message.id}>
                {message?.problem} (from {message?.user?.username})
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Select Doctor</label>
          <select
            value={selectedDoctor}
            onChange={(e) => setSelectedDoctor(e.target.value)}
            className="border p-2 rounded w-full"
          >
            <option value="">Select a doctor</option>
            {doctors.map((doctor) => (
              <option key={doctor.id} value={doctor.id}>
                {doctor.username}
              </option>
            ))}
          </select>
        </div>
        <button
          onClick={handleAssignDoctor}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-blue-300"
          disabled={isLoading}
        >
          {isLoading ? "Assigning..." : "Assign Doctor"}
        </button>
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </div>
    </div>
  );
};

export default AdminMessagePanel;