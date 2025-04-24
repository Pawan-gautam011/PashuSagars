import { useEffect, useState } from "react";
import axios from "axios";
import { RefreshCw, AlertTriangle } from "lucide-react";

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  // Function to refresh appointments
  const handleRefresh = () => {
    setLoading(true);
    setError("");
    setRefreshKey(prevKey => prevKey + 1);
  };

  // Update your fetchAppointments function like this:
  const fetchAppointments = async () => {
    try {
      const token = localStorage.getItem("token");
      const userRole = localStorage.getItem("role");
      
      if (!token) {
        setError("Authentication required. Please login again.");
        setLoading(false);
        return;
      }

      // Add console.log to debug
      console.log("Fetching appointments as role:", userRole);
      
      let endpoint = "http://127.0.0.1:8000/api/appointments/";
      
      // This is the key fix: Both admin and veterinarian roles should see all appointments
      if (userRole === "0" || userRole === "2") {
        console.log("Fetching as admin/veterinarian - should see all appointments");
      } else {
        console.log("Fetching as regular user - should only see own appointments");
      }

      console.log("Using endpoint:", endpoint);

      const response = await axios.get(endpoint, {
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      console.log("API Response:", response.data);

      // Simplify data handling
      const data = response.data;
      if (data && (Array.isArray(data) || Array.isArray(data.appointments))) {
        setAppointments(Array.isArray(data) ? data : data.appointments);
      } else {
        console.error("Unexpected data format:", data);
        setAppointments([]);
        setError("No appointments data found");
      }
      
      setLoading(false);
    } catch (err) {
      console.error("API Error:", err);
      console.error("Error details:", err.response?.data);
      setError(
        err.response?.data?.detail || 
        err.response?.data?.message || 
        "Failed to fetch appointments. Please try again."
      );
      setLoading(false);
      setAppointments([]);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [refreshKey]);

  const handleStatusChange = async (e, appointmentId) => {
    const newStatus = e.target.value;
    const token = localStorage.getItem("token");

    if (!token) {
      setError("Authentication required. Please login again.");
      return;
    }

    try {
      const response = await axios.patch(
        `http://127.0.0.1:8000/api/appointments/${appointmentId}/`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 200) {
        // Optimistic UI update
        setAppointments(prevAppointments =>
          prevAppointments.map(appointment =>
            appointment.id === appointmentId
              ? { ...appointment, status: newStatus }
              : appointment
          )
        );
      }
    } catch (err) {
      console.error("Failed to update status:", err);
      alert("Failed to update appointment status. Please try again.");
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Appointments</h2>
        <button 
          onClick={handleRefresh}
          className="px-4 py-2 bg-[#55DD4A] text-white rounded-lg hover:bg-[#45cc3a] transition-colors flex items-center"
          disabled={loading}
        >
          <RefreshCw size={16} className={`mr-2 ${loading ? "animate-spin" : ""}`} />
          {loading ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4 rounded-r">
          <div className="flex items-start">
            <AlertTriangle className="text-red-500 mr-3 mt-0.5" size={20} />
            <div>
              <p className="text-red-700">{error}</p>
              <button 
                onClick={handleRefresh}
                className="mt-2 text-sm text-red-700 underline"
              >
                Try again
              </button>
            </div>
          </div>
        </div>
      )}
      
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#55DD4A]"></div>
        </div>
      ) : appointments.length === 0 ? (
        <div className="text-center py-10 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-gray-500">No appointments found.</p>
          {!error && (
            <button 
              onClick={handleRefresh} 
              className="mt-2 text-sm text-[#55DD4A] underline"
            >
              Refresh
            </button>
          )}
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Client Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pet Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date & Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {appointments.map((appointment) => (
                <tr key={appointment.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    {appointment.first_name} {appointment.last_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {appointment.pet_name || "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {new Date(appointment.appointment_date).toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="max-w-xs overflow-hidden text-ellipsis">
                      {appointment.description}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={appointment.status || "pending"}
                      onChange={(e) => handleStatusChange(e, appointment.id)}
                      className="py-1 px-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-[#55DD4A] focus:border-[#55DD4A]"
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="cancelled">Cancelled</option>
                      <option value="completed">Completed</option>
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