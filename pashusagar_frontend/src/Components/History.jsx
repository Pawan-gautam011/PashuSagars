// History.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './Navbar';
import Footer from './Footer';
import { Calendar, Package2, AlertCircle, Home, ChevronRight, Loader2 } from 'lucide-react';

const History = () => {
  const [activeTab, setActiveTab] = useState(() => {
    const savedTab = localStorage.getItem('historyActiveTab');
    return savedTab || "both";
  });
  const [orders, setOrders] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState({
    order: null,
    appointment: null
  });

  useEffect(() => {
    localStorage.setItem('historyActiveTab', activeTab);
  }, [activeTab]);

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

  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return '/placeholder.svg';
    if (imageUrl.startsWith('http')) {
      return imageUrl;
    }
    return `http://127.0.0.1:8000${imageUrl}`;
  };

  const calculateOrderTotal = (order) => {
    // First try to get the total from the order object itself
    if (order.total_amount) return order.total_amount;
    if (order.total) return order.total;
    
    // Calculate from items if total isn't provided
    const subtotal = (order.items || order.products || order.cartItems || []).reduce(
      (sum, item) => sum + (item.price * item.quantity), 
      0
    );
    
    const shippingCost = order.shipping_cost || 100;
    return subtotal + shippingCost;
  };

  const handleCancelOrder = async (orderId) => {
    setActionLoading(prev => ({ ...prev, order: orderId }));
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError("Please log in to cancel orders");
        return;
      }

      const response = await axios.post(
        `http://127.0.0.1:8000/api/orders/${orderId}/cancel/`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.status === "success") {
        setOrders(prevOrders => 
          prevOrders.map(order => 
            order.id === orderId || order.order_id === orderId
              ? { ...order, status: "cancelled", payment_status: "cancelled" }
              : order
          )
        );
      }
    } catch (error) {
      console.error("Error cancelling order:", error);
      setError(error.response?.data?.detail || "Failed to cancel order");
    } finally {
      setActionLoading(prev => ({ ...prev, order: null }));
    }
  };

  const fetchHistory = async () => {
    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('user_id');
      
      if (!token) {
        setError("Authentication token missing. Please log in again.");
        setLoading(false);
        return;
      }

      let ordersData = [];
      let appointmentsData = [];
      
      try {
        const historyResponse = await axios.get('http://127.0.0.1:8000/api/history/', {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        if (historyResponse.data.appointments) {
          appointmentsData = historyResponse.data.appointments;
        }
        
        if (historyResponse.data.orders && historyResponse.data.orders.length > 0) {
          ordersData = historyResponse.data.orders.map(order => ({
            ...order,
            // Ensure we have items array even if it's called products or cartItems
            items: order.items || order.products || order.cartItems || []
          }));
        }
      } catch (error) {
        console.error("Error fetching from main history endpoint:", error);
      }
      
      if (ordersData.length === 0) {
        try {
          const ordersResponse = await axios.get('http://127.0.0.1:8000/api/orders/', {
            headers: { Authorization: `Bearer ${token}` },
          });
          
          if (Array.isArray(ordersResponse.data)) {
            ordersData = ordersResponse.data.map(order => ({
              ...order,
              items: order.items || order.products || order.cartItems || []
            }));
          } else if (ordersResponse.data && Array.isArray(ordersResponse.data.orders)) {
            ordersData = ordersResponse.data.orders.map(order => ({
              ...order,
              items: order.items || order.products || order.cartItems || []
            }));
          }
        } catch (error) {
          console.error("Error fetching from orders endpoint:", error);
        }
      }
      
      if (ordersData.length === 0 && userId) {
        try {
          const userOrdersResponse = await axios.get(`http://127.0.0.1:8000/api/user/${userId}/orders/`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          
          if (Array.isArray(userOrdersResponse.data)) {
            ordersData = userOrdersResponse.data.map(order => ({
              ...order,
              items: order.items || order.products || order.cartItems || []
            }));
          } else if (userOrdersResponse.data && Array.isArray(userOrdersResponse.data.orders)) {
            ordersData = userOrdersResponse.data.orders.map(order => ({
              ...order,
              items: order.items || order.products || order.cartItems || []
            }));
          }
        } catch (error) {
          console.error("Error fetching from user orders endpoint:", error);
        }
      }
      
      const cartHistory = localStorage.getItem('orderHistory');
      if (ordersData.length === 0 && cartHistory) {
        try {
          const parsedHistory = JSON.parse(cartHistory);
          if (Array.isArray(parsedHistory) && parsedHistory.length > 0) {
            ordersData = parsedHistory.map(order => ({
              ...order,
              items: order.items || order.products || order.cartItems || []
            }));
          }
        } catch (error) {
          console.error("Error parsing cart history from localStorage:", error);
        }
      }
      
      // Fetch product details for all orders to get images and proper names
      const productIds = new Set();
      ordersData.forEach(order => {
        order.items.forEach(item => productIds.add(item.product || item.id));
      });

      const productDetails = {};
      if (productIds.size > 0) {
        try {
          const productResponses = await Promise.all(
            Array.from(productIds).map(id => 
              axios.get(`http://127.0.0.1:8000/api/products/${id}/`)
            )
          );
          
          productResponses.forEach(response => {
            if (response.data) {
              productDetails[response.data.id] = {
                name: response.data.title || response.data.name,
                image: response.data.image || response.data.images
              };
            }
          });
        } catch (error) {
          console.error("Error fetching product details:", error);
        }
      }

      // Enhance order items with product details
      ordersData = ordersData.map(order => {
        const enhancedItems = order.items.map(item => {
          const productInfo = productDetails[item.product || item.id] || {};
          return {
            ...item,
            product_name: productInfo.name || item.product_name || item.name || item.title || "Product",
            product_image: productInfo.image || item.product_image || item.image || item.images
          };
        });

        return {
          ...order,
          items: enhancedItems,
          // Calculate total if not provided
          total_amount: order.total_amount || calculateOrderTotal(order)
        };
      });

      setOrders(ordersData);
      setAppointments(appointmentsData);
      
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

  useEffect(() => {
    fetchHistory();
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
            <p className="text-[#ADE1B0] text-xl uppercase tracking-wider">
              Check Your History with the platform
            </p>
            <hr className="w-1/2 mx-auto mt-5 border-[#ADE1B0] opacity-50" />
          </div>

          {error && (
            <div className="bg-red-600/30 border border-red-600/50 p-4 mb-8 rounded-lg flex items-center justify-between text-white backdrop-blur-sm">
              <div className="flex items-center">
                <AlertCircle className="mr-2" />
                <p>{error}</p>
              </div>
              <button 
                onClick={() => setError(null)} 
                className="ml-4 bg-white/10 hover:bg-white/20 px-4 py-1 rounded-full text-sm transition-colors"
              >
                Dismiss
              </button>
            </div>
          )}

          <div className="flex flex-col md:flex-row justify-center gap-4 mb-8">
            <button 
              onClick={() => setActiveTab("both")}
              className={`flex items-center gap-3 px-8 py-4 rounded-lg font-semibold transition-all duration-300 shadow-lg ${
                activeTab === "both" 
                  ? "bg-[#55DD4A] text-white shadow-[#55DD4A]/30 transform scale-[1.02]" 
                  : "bg-white/10 text-white hover:bg-white/20 shadow-transparent"
              }`}
            >
              All History
            </button>
            <button 
              onClick={() => setActiveTab("pharmacy")}
              className={`flex items-center gap-3 px-8 py-4 rounded-lg font-semibold transition-all duration-300 shadow-lg ${
                activeTab === "pharmacy" 
                  ? "bg-[#55DD4A] text-white shadow-[#55DD4A]/30 transform scale-[1.02]" 
                  : "bg-white/10 text-white hover:bg-white/20 shadow-transparent"
              }`}
            >
              <Package2 size={20} />
              Pharmacy History
            </button>
            <button 
              onClick={() => setActiveTab("appointment")}
              className={`flex items-center gap-3 px-8 py-4 rounded-lg font-semibold transition-all duration-300 shadow-lg ${
                activeTab === "appointment" 
                  ? "bg-[#55DD4A] text-white shadow-[#55DD4A]/30 transform scale-[1.02]" 
                  : "bg-white/10 text-white hover:bg-white/20 shadow-transparent"
              }`}
            >
              <Calendar size={20} />
              Appointment History
            </button>
          </div>

          {(activeTab === "both" || activeTab === "pharmacy") && (
            <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 text-white mb-8 border border-white/10">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold">Pharmacy History</h3>
                <span className="bg-[#55DD4A]/20 text-[#55DD4A] px-3 py-1 rounded-full text-sm">
                  {orders.length} {orders.length === 1 ? 'order' : 'orders'}
                </span>
              </div>
              
              <div className="grid gap-6">
                {orders.length === 0 ? (
                  <div className="bg-white/5 rounded-lg p-8 text-center border border-dashed border-white/10">
                    <Package2 size={48} className="mx-auto mb-4 text-gray-300/50" />
                    <p className="text-gray-300">No purchase history found.</p>
                    <p className="text-sm text-gray-300/70 mt-2">
                      Your purchases will appear here after you make an order.
                    </p>
                  </div>
                ) : (
                  orders.map((order) => {
                    const status = order.status || order.payment_status || "Processing";
                    let statusColor = "bg-yellow-500/20 text-yellow-300";
                    
                    if (status.toLowerCase() === "accepted" || status.toLowerCase() === "completed") {
                      statusColor = "bg-green-600/20 text-green-300";
                    } else if (status.toLowerCase() === "declined") {
                      statusColor = "bg-red-500/20 text-red-300";
                    } else if (status.toLowerCase() === "cancelled") {
                      statusColor = "bg-gray-600/20 text-gray-300";
                    }
                    
                    const canCancel = ["pending", "accepted"].includes(status.toLowerCase());
                    const orderTotal = order.total_amount || calculateOrderTotal(order);
                    const shippingCost = order.shipping_cost || 100;
                    const subtotal = orderTotal - shippingCost;
                    
                    return (
                      <div
                        key={order.id || order.order_id || Math.random().toString(36).substring(7)}
                        className="bg-white/5 rounded-xl p-6 border border-white/10 hover:border-[#55DD4A]/30 transition-colors"
                      >
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                          <div className="flex items-start gap-4">
                            <div className="bg-[#55DD4A]/10 p-3 rounded-lg">
                              <Package2 size={24} className="text-[#55DD4A]" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-lg">
                                Order #{order.purchase_order_id || order.order_number || order.id || order.order_id || "N/A"}
                              </h4>
                              <p className="text-[#ADE1B0]/80 text-sm">
                                Created on {formatDate(order.created_at || order.date || order.created || order.timestamp)}
                              </p>
                              <div className="mt-1 grid grid-cols-2 gap-x-4 text-sm">
                                <div>
                                  <span className="text-[#ADE1B0]/70">Subtotal: </span>
                                  <span>Rs. {subtotal.toFixed(2)}</span>
                                </div>
                                <div>
                                  <span className="text-[#ADE1B0]/70">Shipping: </span>
                                  <span>Rs. {shippingCost.toFixed(2)}</span>
                                </div>
                                <div className="col-span-2">
                                  <span className="text-[#ADE1B0]/70">Total: </span>
                                  <span className="font-bold">Rs. {orderTotal.toFixed(2)}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <span
                              className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${statusColor}`}
                            >
                              {status}
                            </span>
                            {canCancel && (
                              <button
                                onClick={() => handleCancelOrder(order.id || order.order_id)}
                                disabled={actionLoading.order === (order.id || order.order_id)}
                                className={`mt-2 bg-red-600/90 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                                  actionLoading.order === (order.id || order.order_id) ? 'opacity-70' : ''
                                }`}
                              >
                                {actionLoading.order === (order.id || order.order_id) ? (
                                  <>
                                    <Loader2 size={16} className="animate-spin" />
                                    Cancelling...
                                  </>
                                ) : (
                                  'Cancel Order'
                                )}
                              </button>
                            )}
                          </div>
                        </div>
                        
                        <div className="mt-6">
                          <h5 className="font-bold mb-3 text-[#ADE1B0]">Order Items:</h5>
                          <div className="grid gap-3">
                            {order.items.length > 0 ? (
                              order.items.map((item, index) => (
                                <div key={index} className="flex items-center gap-4 bg-white/10 p-4 rounded-lg">
                                  <img 
                                    src={getImageUrl(item.product_image)} 
                                    alt={item.product_name} 
                                    className="w-16 h-16 rounded-lg object-cover border border-white/10" 
                                  />
                                  <div className="flex-1">
                                    <h6 className="font-semibold">{item.product_name}</h6>
                                    <div className="grid grid-cols-2 gap-2 mt-1 text-sm">
                                      <span>Price: Rs. {item.price || 0}</span>
                                      <span>Quantity: {item.quantity || 1}</span>
                                      <span className="col-span-2">
                                        Subtotal: Rs. {(item.price * item.quantity).toFixed(2)}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              ))
                            ) : (
                              <div className="flex items-center gap-4 bg-white/10 p-4 rounded-lg">
                                <div className="flex-1">
                                  <h6 className="font-semibold">Order details</h6>
                                  <div className="grid grid-cols-2 gap-2 mt-1 text-sm">
                                    <span>Status: {order.payment_status || order.status || "Processing"}</span>
                                    <span>
                                      Total: Rs. {orderTotal.toFixed(2)}
                                    </span>
                                  </div>
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

          {(activeTab === "both" || activeTab === "appointment") && (
            <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 text-white border border-white/10">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold">Appointment History</h3>
                <span className="bg-[#55DD4A]/20 text-[#55DD4A] px-3 py-1 rounded-full text-sm">
                  {appointments.length} {appointments.length === 1 ? 'appointment' : 'appointments'}
                </span>
              </div>
              
              <div className="grid gap-4">
                {appointments.length === 0 ? (
                  <div className="bg-white/5 rounded-lg p-8 text-center border border-dashed border-white/10">
                    <Calendar size={48} className="mx-auto mb-4 text-gray-300/50" />
                    <p className="text-gray-300">No appointment history found.</p>
                    <p className="text-sm text-gray-300/70 mt-2">
                      Your appointments will appear here after you schedule one.
                    </p>
                  </div>
                ) : (
                  appointments.map((appointment) => {
                    const status = appointment.status || (appointment.is_confirmed ? "Confirmed" : "Pending");
                    const isFutureAppointment = new Date(appointment.appointment_date) > new Date();
                    const canCancel = isFutureAppointment && status.toLowerCase() !== "cancelled";
                    
                    return (
                      <div
                        key={appointment.id || Math.random().toString(36).substring(7)}
                        className="bg-white/5 rounded-xl p-6 border border-white/10 hover:border-[#55DD4A]/30 transition-colors"
                      >
                        <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                          <div className="flex items-start gap-4">
                            <div className="bg-[#55DD4A]/10 p-3 rounded-lg">
                              <Calendar size={24} className="text-[#55DD4A]" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-lg">
                                {`${appointment.first_name} ${appointment.last_name}`}
                              </h4>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2 mt-2 text-sm">
                                <div>
                                  <span className="text-[#ADE1B0]/80">Date: </span>
                                  <span>{formatDate(appointment.appointment_date)}</span>
                                </div>
                                <div>
                                  <span className="text-[#ADE1B0]/80">Time: </span>
                                  <span>
                                    {new Date(appointment.appointment_date).toLocaleTimeString([], {
                                      hour: '2-digit',
                                      minute: '2-digit'
                                    })}
                                  </span>
                                </div>
                                {appointment.pet_name && (
                                  <div>
                                    <span className="text-[#ADE1B0]/80">Pet: </span>
                                    <span>{appointment.pet_name}</span>
                                  </div>
                                )}
                                <div>
                                  <span className="text-[#ADE1B0]/80">Status: </span>
                                  <span className={`${
                                    status.toLowerCase() === 'confirmed' ? 'text-green-300' :
                                    status.toLowerCase() === 'pending' ? 'text-yellow-300' :
                                    status.toLowerCase() === 'cancelled' ? 'text-gray-300' : ''
                                  }`}>
                                    {status}
                                  </span>
                                </div>
                              </div>
                              {appointment.description && (
                                <div className="mt-2">
                                  <p className="text-sm text-gray-300">
                                    <span className="text-[#ADE1B0]/80">Notes: </span>
                                    {appointment.description}
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                          
                          {canCancel && (
                            <div className="md:self-center">
                              <button
                                onClick={() => handleCancelAppointment(appointment.id)}
                                disabled={actionLoading.appointment === appointment.id}
                                className={`bg-red-600/90 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                                  actionLoading.appointment === appointment.id ? 'opacity-70' : ''
                                }`}
                              >
                                {actionLoading.appointment === appointment.id ? (
                                  <>
                                    <Loader2 size={16} className="animate-spin" />
                                    Cancelling...
                                  </>
                                ) : (
                                  'Cancel Appointment'
                                )}
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })
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