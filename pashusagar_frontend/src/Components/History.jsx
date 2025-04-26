// History.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Breadcrumbs from './BreadCrumbs';
import Navbar from './Navbar';
import Footer from './Footer';
import { Calendar, Package2, AlertCircle, Home, ChevronRight } from 'lucide-react';

const History = () => {
  // Default active tab set to "both" to display both orders and appointments initially.
  const [activeTab, setActiveTab] = useState("both");
  const [orders, setOrders] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
  
  const breadcrumbItems = [
    { label: "Home", path: "/" },
    { label: "History", path: "/history" },
  ];

  // Helper function to format dates consistently
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return 'Invalid date';
    }
  };

  // Helper for product images
  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return '/placeholder.svg';
    if (imageUrl.startsWith('http')) {
      return imageUrl;
    }
    return `http://127.0.0.1:8000${imageUrl}`;
  };

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('user_id');
        
        if (!token) {
          setError("Authentication token missing. Please log in again.");
          setLoading(false);
          return;
        }

        console.log("Fetching user history - User ID:", userId, "Token:", token ? "Present" : "Missing");
        
        // We'll track our fetch attempts and results
        let ordersData = [];
        let appointmentsData = [];
        let fetchAttempts = [];
        
        // 1. Try to fetch from the main history endpoint
        try {
          const historyResponse = await axios.get('http://127.0.0.1:8000/api/history/', {
            headers: { Authorization: `Bearer ${token}` },
          });
          
          fetchAttempts.push({
            endpoint: '/api/history/',
            success: true,
            data: historyResponse.data
          });
          
          if (historyResponse.data.appointments) {
            appointmentsData = historyResponse.data.appointments;
          }
          
          if (historyResponse.data.orders && historyResponse.data.orders.length > 0) {
            ordersData = historyResponse.data.orders;
            console.log("Found orders in main history endpoint:", ordersData.length);
          }
        } catch (error) {
          fetchAttempts.push({
            endpoint: '/api/history/',
            success: false,
            error: error.message
          });
          console.error("Error fetching from main history endpoint:", error);
        }
        
        // 2. If no orders yet, try to fetch directly from orders endpoint
        if (ordersData.length === 0) {
          try {
            const ordersResponse = await axios.get('http://127.0.0.1:8000/api/orders/', {
              headers: { Authorization: `Bearer ${token}` },
            });
            
            fetchAttempts.push({
              endpoint: '/api/orders/',
              success: true,
              data: ordersResponse.data
            });
            
            if (Array.isArray(ordersResponse.data)) {
              ordersData = ordersResponse.data;
              console.log("Found orders in orders endpoint:", ordersData.length);
            } else if (ordersResponse.data && Array.isArray(ordersResponse.data.orders)) {
              ordersData = ordersResponse.data.orders;
              console.log("Found orders in orders.orders:", ordersData.length);
            }
          } catch (error) {
            fetchAttempts.push({
              endpoint: '/api/orders/',
              success: false,
              error: error.message
            });
            console.error("Error fetching from orders endpoint:", error);
          }
        }
        
        // 3. If still no orders, try the user-specific orders endpoint
        if (ordersData.length === 0 && userId) {
          try {
            const userOrdersResponse = await axios.get(`http://127.0.0.1:8000/api/user/${userId}/orders/`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            
            fetchAttempts.push({
              endpoint: `/api/user/${userId}/orders/`,
              success: true,
              data: userOrdersResponse.data
            });
            
            if (Array.isArray(userOrdersResponse.data)) {
              ordersData = userOrdersResponse.data;
              console.log("Found orders in user orders endpoint:", ordersData.length);
            } else if (userOrdersResponse.data && Array.isArray(userOrdersResponse.data.orders)) {
              ordersData = userOrdersResponse.data.orders;
              console.log("Found orders in user orders.orders:", ordersData.length);
            }
          } catch (error) {
            fetchAttempts.push({
              endpoint: `/api/user/${userId}/orders/`,
              success: false,
              error: error.message
            });
            console.error("Error fetching from user orders endpoint:", error);
          }
        }
        
        // 4. Last resort - check if there are any purchase orders in localStorage
        const cartHistory = localStorage.getItem('orderHistory');
        if (ordersData.length === 0 && cartHistory) {
          try {
            const parsedHistory = JSON.parse(cartHistory);
            if (Array.isArray(parsedHistory) && parsedHistory.length > 0) {
              ordersData = parsedHistory;
              console.log("Using order history from localStorage:", ordersData.length);
            }
          } catch (error) {
            console.error("Error parsing cart history from localStorage:", error);
          }
        }
        
        // Check for updated order status
        const checkOrderStatusUpdates = async () => {
          const token = localStorage.getItem('token');
          const orderHistory = localStorage.getItem('orderHistory');
          
          if (!token || !orderHistory) return;
          
          try {
            const parsedOrders = JSON.parse(orderHistory);
            
            if (!Array.isArray(parsedOrders) || parsedOrders.length === 0) return;
            
            // For each locally stored order, check if its status has been updated in the backend
            const orderIds = parsedOrders.map(order => order.id || order.order_id).filter(id => id);
            
            if (orderIds.length === 0) return;
            
            // Try to get updated status for these orders
            for (const orderId of orderIds) {
              try {
                const response = await axios.get(`http://127.0.0.1:8000/api/orders/${orderId}/`, {
                  headers: { Authorization: `Bearer ${token}` }
                });
                
                if (response.data && response.data.status) {
                  // Update the local storage with the new status
                  const updatedOrders = parsedOrders.map(order => {
                    if ((order.id === orderId || order.order_id === orderId)) {
                      return {
                        ...order,
                        status: response.data.status,
                        payment_status: response.data.status
                      };
                    }
                    return order;
                  });
                  
                  localStorage.setItem('orderHistory', JSON.stringify(updatedOrders));
                  console.log(`Updated status for order ${orderId} to ${response.data.status}`);
                  
                  // Also update the current orders state if needed
                  ordersData = ordersData.map(order => {
                    if ((order.id === orderId || order.order_id === orderId)) {
                      return {
                        ...order,
                        status: response.data.status,
                        payment_status: response.data.status
                      };
                    }
                    return order;
                  });
                }
              } catch (err) {
                console.log(`Could not get updated status for order ${orderId}`);
              }
            }
          } catch (err) {
            console.error("Error checking for order status updates:", err);
          }
        };
        
        // Call the status update check
        await checkOrderStatusUpdates();
        
        // Set the final data
        setOrders(ordersData);
        setAppointments(appointmentsData);
        
        // Log the full fetch attempts for debugging
        console.log("All fetch attempts:", fetchAttempts);
        
        if (ordersData.length === 0 && appointmentsData.length === 0) {
          console.log("No history data found in any endpoint");
        }
      } catch (error) {
        console.error("Error in main fetch history function:", error);
        setError("Failed to load history. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
    
    // Set up periodic status checking if needed
    // const statusInterval = setInterval(fetchHistory, 60000); // Check every minute
    // return () => clearInterval(statusInterval);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#004D40] to-[#00695C]">
        <Navbar />
        <div className="container mx-auto px-4 pt-16 pb-20 text-center text-white">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#55DD4A]" />
          </div>
          <p>Loading history...</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div>
      <Navbar/>
    <div className="min-h-screen bg-gradient-to-b from-[#004D40] to-[#00695C] pt-16 pb-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <EnhancedBreadcrumbs items={breadcrumbItems} />

        <div className="text-center mb-12">
          <h2 className="text-[#55DD4A] text-5xl font-bold mb-4">History</h2>
          <p className="text-[#ADE1B0] text-xl uppercase">
            Check Your History with the platform
          </p>
          <hr className="w-full mt-5 border-[#ADE1B0]" />
        </div>

        {error && (
          <div className="bg-red-600 bg-opacity-20 p-4 mb-8 rounded-lg flex items-center justify-center text-white">
            <AlertCircle className="mr-2" />
            <p>{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="ml-4 bg-white text-red-800 px-4 py-1 rounded-full text-sm"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Tab Buttons */}
        <div className="flex flex-col md:flex-row justify-center gap-4 mb-8">
          <button 
            onClick={() => setActiveTab("both")}
            className={`flex items-center gap-3 px-8 py-4 rounded-lg font-semibold transition-all duration-300 ${
              activeTab==="both" ? "bg-[#55DD4A] text-white transform scale-105" : "bg-white/10 text-white hover:bg-white/20"
            }`}
          >
            All History
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
                <div className="bg-white/5 rounded-lg p-8 text-center">
                  <Package2 size={48} className="mx-auto mb-4 text-gray-300" />
                  <p>No purchase history found.</p>
                  <p className="text-sm text-gray-300 mt-2">Your purchases will appear here after you make an order.</p>
                </div>
              ) : (
                orders.map((order) => {
                  console.log("Rendering order:", order);
                  
                  // Determine status color
                  let statusColor = "bg-yellow-500/20 text-yellow-300"; // Default for pending
                  if (order.status === "accepted" || order.payment_status === "accepted") {
                    statusColor = "bg-green-600 text-green-300";
                  } else if (order.status === "declined" || order.payment_status === "declined") {
                    statusColor = "bg-red-500/20 text-red-300";
                  } else if (order.status === "completed" || order.payment_status === "completed") {
                    statusColor = "bg-green-600 text-green-300";
                  }
                  
                  return (
                    <div
                      key={order.id || order.order_id || Math.random().toString(36).substring(7)}
                      className="bg-white/5 rounded-lg p-4"
                    >
                      <div className="flex flex-col md:flex-row justify-between items-center">
                        <div className="flex items-center gap-4">
                          <div>
                            <h4 className="font-semibold text-lg">
                              Order #{order.purchase_order_id || order.order_number || order.id || order.order_id || "N/A"}
                            </h4>
                            <p className="text-[#ADE1B0]">
                              Payment Status: {order.payment_status || order.status || "Pending"}
                            </p>
                            <p className="text-sm text-gray-300">
                              Created on {formatDate(order.created_at || order.date || order.created || order.timestamp)}
                            </p>
                            {(order.total || order.amount || order.total_amount) && (
                              <p className="text-xl font-bold">
                                Total: Rs. {order.total || order.amount || order.total_amount}
                              </p>
                            )}
                          </div>
                        </div>
                        <span
                          className={`inline-block px-3 py-1 mt-3 md:mt-0 rounded-full text-sm ${statusColor}`}
                        >
                          {order.status || order.payment_status || "Processing"}
                        </span>
                      </div>
                      <div className="mt-4">
                        <h5 className="font-bold mb-2">Order Items:</h5>
                        <div className="grid gap-4">
                          {/* Regular items format */}
                          {order.items && order.items.length > 0 && order.items.map((item, index) => (
                            <div key={index} className="flex items-center gap-4 bg-white/20 p-3 rounded">
                              <img 
                                src={getImageUrl(item.product_image || item.image)} 
                                alt={item.product_name || item.name || "Product"} 
                                className="w-16 h-16 rounded-lg object-cover" 
                              />
                              <div>
                                <h6 className="font-semibold">{item.product_name || item.name || "Product"}</h6>
                                <p className="text-sm">Price: Rs. {item.product_price || item.price || 0}</p>
                                <p className="text-sm">Quantity: {item.quantity || 1}</p>
                              </div>
                            </div>
                          ))}
                          
                          {/* Alternative items format as products */}
                          {order.products && order.products.length > 0 && order.products.map((item, index) => (
                            <div key={index} className="flex items-center gap-4 bg-white/20 p-3 rounded">
                              <img 
                                src={getImageUrl(item.image || item.product_image)} 
                                alt={item.name || item.title || "Product"} 
                                className="w-16 h-16 rounded-lg object-cover" 
                              />
                              <div>
                                <h6 className="font-semibold">{item.name || item.title || item.product_name || "Product"}</h6>
                                <p className="text-sm">Price: Rs. {item.price || item.product_price || 0}</p>
                                <p className="text-sm">Quantity: {item.quantity || 1}</p>
                              </div>
                            </div>
                          ))}
                          
                          {/* Cart items directly if nothing else */}
                          {order.cartItems && order.cartItems.length > 0 && order.cartItems.map((item, index) => (
                            <div key={index} className="flex items-center gap-4 bg-white/20 p-3 rounded">
                              <img 
                                src={getImageUrl(item.images || item.image)} 
                                alt={item.title || item.name || "Product"} 
                                className="w-16 h-16 rounded-lg object-cover" 
                              />
                              <div>
                                <h6 className="font-semibold">{item.title || item.name || "Product"}</h6>
                                <p className="text-sm">Price: Rs. {item.price || 0}</p>
                                <p className="text-sm">Quantity: {item.quantity || 1}</p>
                              </div>
                            </div>
                          ))}
                          
                          {/* Order details without item details */}
                          {(!order.items || order.items.length === 0) && 
                           (!order.products || order.products.length === 0) &&
                           (!order.cartItems || order.cartItems.length === 0) && (
                            <div className="flex items-center gap-4 bg-white/20 p-3 rounded">
                              <div>
                                <h6 className="font-semibold">Order details</h6>
                                <p className="text-sm">Status: {order.payment_status || order.status || "Processing"}</p>
                                {(order.total || order.amount || order.total_amount) && (
                                  <p className="text-sm">
                                    Total: Rs. {order.total || order.amount || order.total_amount}
                                  </p>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
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
                <div className="bg-white/5 rounded-lg p-8 text-center">
                  <Calendar size={48} className="mx-auto mb-4 text-gray-300" />
                  <p>No appointment history found.</p>
                  <p className="text-sm text-gray-300 mt-2">Your appointments will appear here after you schedule one.</p>
                </div>
              ) : (
                appointments.map((appointment) => (
                  <div
                    key={appointment.id || Math.random().toString(36).substring(7)}
                    className="bg-white/5 rounded-lg p-4 flex flex-col md:flex-row items-center justify-between"
                  >
                    <div className="flex flex-col">
                      <h4 className="font-semibold text-lg">
                        Appointment for {`${appointment.first_name} ${appointment.last_name} `}
                      </h4>
                      <p className="text-sm text-gray-300">
                        {formatDate(appointment.appointment_date)} at{" "}
                        {new Date(appointment.appointment_date).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                      <p className="text-sm text-gray-300">
                        Status: {appointment.status || (appointment.is_confirmed ? "Confirmed" : "Pending")}
                      </p>
                      {appointment.description && (
                        <p className="text-sm text-gray-300 mt-2">
                          Description: {appointment.description}
                        </p>
                      )}
                      {/* Display pet name if available */}
                      {appointment.pet_name && (
                        <p className="text-sm text-gray-300">
                          Pet: {appointment.pet_name}
                        </p>
                      )}
                    </div>
                    <span className="inline-block px-3 py-1 mt-3 md:mt-0 bg-green-600 text-green-300 rounded-full">
                      {appointment.status || (appointment.is_confirmed ? "Confirmed" : "Pending")}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
    </div>
  );
};

export default History;