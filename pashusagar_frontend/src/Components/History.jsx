// History.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Breadcrumbs from './BreadCrumbs';
import Navbar from './Navbar';
import { Calendar, Package2 } from 'lucide-react';

const History = () => {
  // Default active tab set to "both" to display both orders and appointments initially.
  const [activeTab, setActiveTab] = useState("both");
  const [orders, setOrders] = useState([]);           // Always an array
  const [appointments, setAppointments] = useState([]); // Always an array
  const [loading, setLoading] = useState(true);

  const breadcrumbItems = [
    { label: "Home", path: "/" },
    { label: "History", path: "/history" },
  ];

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        // Retrieve the token from localStorage. Adjust the key if needed.
        const token = localStorage.getItem('token'); 
        const response = await axios.get('http://127.0.0.1:8000/api/history/', {
          headers: { Authorization: `Bearer ${token}` },
        });
        // Use fallback arrays to avoid undefined values.
        setOrders(response.data.orders || []);
        setAppointments(response.data.appointments || []);
      } catch (error) {
        console.error("Error fetching history:", error);
        setOrders([]);
        setAppointments([]);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#004D40] to-[#00695C]">
        <Navbar />
        <div className="container mx-auto px-4 pt-16 pb-20 text-center text-white">
          <p>Loading history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#004D40] to-[#00695C]">
      <Navbar />
      <div className="container mx-auto px-4 pt-16 pb-20">
        <Breadcrumbs items={breadcrumbItems} />

        <div className="text-center mb-12">
          <h2 className="text-[#55DD4A] text-5xl font-bold mb-4">History</h2>
          <p className="text-[#ADE1B0] text-xl uppercase">
            Check Your History with the platform
          </p>
          <hr className="w-full mt-5 border-[#ADE1B0]" />
        </div>

        {/* Tab Buttons */}
        <div className="flex flex-col md:flex-row justify-center gap-4 mb-8">
          <button 
            onClick={() => setActiveTab("both")}
            className={`flex items-center gap-3 px-8 py-4 rounded-lg font-semibold transition-all duration-300 ${
              activeTab==="both" ? "bg-[#55DD4A] text-white transform scale-105" : "bg-white/10 text-white hover:bg-white/20"
            }`}
          >
            Both History
          </button>
          <button 
            onClick={() => setActiveTab("pharmacy")}
            className={`flex items-center gap-3 px-8 py-4 rounded-lg font-semibold transition-all duration-300 ${
              activeTab==="pharmacy" ? "bg-[#55DD4A] text-white transform scale-105" : "bg-white/10 text-white hover:bg-white/20"
            }`}
          >
            <Package2 size={24} />
            Pharmacy History
          </button>
          <button 
            onClick={() => setActiveTab("appointment")}
            className={`flex items-center gap-3 px-8 py-4 rounded-lg font-semibold transition-all duration-300 ${
              activeTab==="appointment" ? "bg-[#55DD4A] text-white transform scale-105" : "bg-white/10 text-white hover:bg-white/20"
            }`}
          >
            <Calendar size={24} />
            Appointment History
          </button>
        </div>

        {/* Pharmacy (Orders) History Section */}
        {(activeTab === "both" || activeTab === "pharmacy") && (
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 text-white mb-8">
            <h3 className="text-2xl font-bold mb-6">Pharmacy History</h3>
            <div className="grid gap-4">
              {orders.length === 0 ? (
                <p>No orders found.</p>
              ) : (
                orders.map((order) => (
                  <div
                    key={order.id}
                    className="bg-white/5 rounded-lg p-4"
                  >
                    <div className="flex flex-col md:flex-row justify-between items-center">
                      <div className="flex items-center gap-4">
                        <div>
                          <h4 className="font-semibold text-lg">
                            Order {order.purchase_order_id || order.id}
                          </h4>
                          <p className="text-[#ADE1B0]">
                            Payment Status: {order.payment_status}
                          </p>
                          <p className="text-sm text-gray-300">
                            Created on {new Date(order.created_at).toLocaleDateString()}
                          </p>
                          {order.total && (
                            <p className="text-xl font-bold">Total: Rs. {order.total}</p>
                          )}
                        </div>
                      </div>
                      <span
                        className={`inline-block px-3 py-1 mt-3 md:mt-0 rounded-full text-sm ${
                          order.payment_status === "Completed"
                            ? "bg-green-600 text-green-300"
                            : "bg-red-500/20 text-red-300"
                        }`}
                      >
                        {order.payment_status}
                      </span>
                    </div>
                    <div className="mt-4">
                      <h5 className="font-bold mb-2">Order Items:</h5>
                      <div className="grid gap-4">
                        {order.items && order.items.map((item, index) => (
                          <div key={index} className="flex items-center gap-4 bg-white/20 p-3 rounded">
                            <img 
                              src={`http://127.0.0.1:8000${item.product_image}`} 
                              alt={item.product_name} 
                              className="w-16 h-16 rounded-lg object-cover" 
                            />
                            <div>
                              <h6 className="font-semibold">{item.product_name}</h6>
                              <p className="text-sm">Price: Rs. {item.product_price}</p>
                              <p className="text-sm">Quantity: {item.quantity}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Appointment History Section */}
        {(activeTab === "both" || activeTab === "appointment") && (
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 text-white">
            <h3 className="text-2xl font-bold mb-6">Appointment History</h3>
            <div className="grid gap-4">
              {appointments.length === 0 ? (
                <p>No appointments found.</p>
              ) : (
                appointments.map((appointment) => (
                  <div
                    key={appointment.id}
                    className="bg-white/5 rounded-lg p-4 flex flex-col md:flex-row items-center justify-between"
                  >
                    <div className="flex flex-col">
                      <h4 className="font-semibold text-lg">
                        Appointment for {`${appointment.first_name} ${appointment.last_name} `}
                      </h4>
                      <p className="text-sm text-gray-300">
                        {new Date(appointment.appointment_date).toLocaleDateString()} at{" "}
                        {new Date(appointment.appointment_date).toLocaleTimeString()}
                      </p>
                      <p className="text-sm text-gray-300">
                        Status: {appointment.status || (appointment.is_confirmed ? "Confirmed" : "Pending")}
                      </p>
                      {appointment.description && (
                        <p className="text-sm text-gray-300">
                          Description: {appointment.description}
                        </p>
                      )}
                      {/* Display client's first and last name */}
                      <p className="text-sm text-gray-300">
                        Client: {appointment.first_name} {appointment.last_name}
                      </p>
                    </div>
                    <span className="inline-block px-3 py-1 bg-green-600 text-green-300 rounded-full">
                      {appointment.status || (appointment.is_confirmed ? "Confirmed" : "Pending")}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default History;
