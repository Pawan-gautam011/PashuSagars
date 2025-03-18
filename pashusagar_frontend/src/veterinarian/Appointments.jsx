import { useEffect, useState } from "react";
import axios from "axios";

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://127.0.0.1:8000/api/appointments/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        // Assume the response includes a status field for each appointment
        setAppointments(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch appointments.");
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const handleStatusChange = async (e, appointmentId) => {
    const newStatus = e.target.value;
    const token = localStorage.getItem("token");

    try {
      // Update the status in the backend using PATCH
      await axios.patch(
        `http://127.0.0.1:8000/api/appointment/${appointmentId}/`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setAppointments((prevAppointments) =>
        prevAppointments.map((appointment) =>
          appointment.id === appointmentId
            ? { ...appointment, status: newStatus }
            : appointment
        )
      );
    } catch (err) {
      console.error("Failed to update status:", err);
      // Optionally, you could update the UI to show an error message to the user
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Appointments</h2>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : appointments.length === 0 ? (
        <p>No appointments found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-2">Client Name</th>
                <th className="border p-2">Pet Name</th>
                <th className="border p-2">Date</th>
                <th className="border p-2">Description</th>
                <th className="border p-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((appointment, index) => (
                <tr key={appointment.id || index} className="hover:bg-gray-100">
                  <td className="border p-2">
                    {appointment.first_name} {appointment.last_name}
                  </td>
                  <td className="border p-2">{appointment.pet_name || "N/A"}</td>
                  <td className="border p-2">
                    {new Date(appointment.appointment_date).toLocaleString()}
                  </td>
                  <td className="border p-2">{appointment.description}</td>
                  <td className="border p-2">
                    <select
                      value={appointment.status}
                      onChange={(e) => handleStatusChange(e, appointment.id)}
                      className="p-1 border rounded"
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Appointments;
