import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye,
  RefreshCw,
  Truck,
  CheckSquare,
  Clock,
  DollarSign,
  FileText,
  Download,
  File,
} from "lucide-react";

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewOrderDetails, setViewOrderDetails] = useState(null);
  const [processingOrderId, setProcessingOrderId] = useState(null);
  const [viewingPrescription, setViewingPrescription] = useState(null);

  const statusColors = {
    Pending: "bg-yellow-100 text-yellow-800",
    Accepted: "bg-green-100 text-green-800",
    Declined: "bg-red-100 text-red-800",
    Completed: "bg-green-100 text-green-800",
    Failed: "bg-red-100 text-red-800",
    Refunded: "bg-purple-100 text-purple-800",
  };

  const statusIcons = {
    Pending: <Clock size={16} className="mr-1" />,
    Accepted: <CheckSquare size={16} className="mr-1" />,
    Declined: <XCircle size={16} className="mr-1" />,
    Completed: <CheckCircle size={16} className="mr-1" />,
    Failed: <XCircle size={16} className="mr-1" />,
    Refunded: <RefreshCw size={16} className="mr-1" />,
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "http://127.0.0.1:8000/api/admin/orders/",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (Array.isArray(response.data)) {
        setOrders(response.data);
      } else if (response.data && Array.isArray(response.data.orders)) {
        setOrders(response.data.orders);
      } else {
        setOrders([]);
        toast.warning("No orders found");
      }
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError("Failed to fetch orders. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    setProcessingOrderId(orderId);
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `http://127.0.0.1:8000/api/orders/${orderId}/status/`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setOrders(
        orders.map((order) =>
          order.id === orderId ? { ...order, payment_status: newStatus } : order
        )
      );

      toast.success(`Order status updated to ${newStatus}`);
    } catch (err) {
      console.error(`Error updating order status:`, err);
      toast.error(`Failed to update order status. Please try again.`);
    } finally {
      setProcessingOrderId(null);
    }
  };

const getOrderTotal = (order) => {
  let subtotal = 0;
  if (order.items && Array.isArray(order.items) && order.items.length > 0) {
    subtotal = order.items.reduce((sum, item) => {
      const price = item.price ?? item.product_price ?? 0;   
      return sum + (price * item.quantity);
    }, 0);
  }
  return subtotal + 100;
};



  const handleDownloadPrescription = async (orderId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://127.0.0.1:8000/api/orders/${orderId}/prescription/`,
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: "blob",
        }
      );

      let filename = `prescription-order-${orderId}`;
      const contentDisposition = response.headers["content-disposition"];
      
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="?(.+)"?/);
        if (filenameMatch && filenameMatch[1]) {
          filename = filenameMatch[1].replace(/"/g, '');
        }
      }

      const contentType = response.headers["content-type"];
      if (!filename.includes('.')) {
        if (contentType.includes('pdf')) {
          filename += '.pdf';
        } else if (contentType.includes('jpeg') || contentType.includes('jpg')) {
          filename += '.jpg';
        } else if (contentType.includes('png')) {
          filename += '.png';
        }
      }

      const url = window.URL.createObjectURL(new Blob([response.data], { type: contentType }));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      
      setTimeout(() => {
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }, 100);

      toast.success("Prescription downloaded successfully");
    } catch (error) {
      console.error("Error downloading prescription:", error);
      if (error.response && error.response.status === 404) {
        toast.error("No prescription file found for this order");
      } else {
        toast.error("Failed to download prescription. Please try again later.");
      }
    }
  };

  const handleViewPrescription = async (orderId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `http://127.0.0.1:8000/api/orders/${orderId}/prescription/`,
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: 'blob',
        }
      );

      const blob = new Blob([response.data]);
      const url = window.URL.createObjectURL(blob);
      
      const contentType = response.headers['content-type'];
      
      setViewingPrescription({ 
        orderId, 
        url, 
        contentType,
        filename: response.headers['content-disposition']?.split('filename=')[1]?.replace(/"/g, '') || `prescription-${orderId}`
      });
    } catch (error) {
      console.error('Error viewing prescription:', error);
      if (error.response && error.response.status === 404) {
        toast.error('No prescription found for this order');
      } else {
        toast.error('Failed to load prescription');
      }
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleString();
    } catch (error) {
      return dateString;
    }
  };

  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return "/placeholder.svg";
    if (imageUrl.startsWith("http")) return imageUrl;
    return `http://127.0.0.1:8000${imageUrl}`;
  };

  const renderPrescriptionViewer = () => {
    if (!viewingPrescription) return null;
  
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] flex flex-col">
          <div className="sticky top-0 bg-white p-4 border-b flex justify-between items-center">
            <h3 className="text-lg font-semibold">
              Prescription for Order #{viewingPrescription.orderId}
            </h3>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleDownloadPrescription(viewingPrescription.orderId)}
                className="p-2 text-blue-600 hover:text-blue-800 flex items-center"
              >
                <Download size={20} />
              </button>
              <button
                onClick={() => {
                  window.URL.revokeObjectURL(viewingPrescription.url);
                  setViewingPrescription(null);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <XCircle size={24} />
              </button>
            </div>
          </div>
          
          <div className="flex-1 overflow-auto p-4">
            {viewingPrescription.contentType.includes('application/pdf') ? (
              <object 
                data={viewingPrescription.url} 
                type="application/pdf"
                className="w-full h-full min-h-[500px] border rounded"
                title={`Prescription for Order #${viewingPrescription.orderId}`}
              >
                <p>Unable to display PDF. <a href={viewingPrescription.url} download>Download</a> instead.</p>
              </object>
            ) : viewingPrescription.contentType.includes('image/') ? (
              <img 
                src={viewingPrescription.url} 
                alt={`Prescription for Order #${viewingPrescription.orderId}`}
                className="w-full h-auto max-h-[80vh] object-contain"
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <p>Unsupported file format</p>
                <a 
                  href={viewingPrescription.url} 
                  download={viewingPrescription.filename}
                  className="ml-2 text-blue-600 hover:underline"
                >
                  Download file
                </a>
              </div>
            )}
          </div>
          
          <div className="p-4 border-t">
            <button
              onClick={() => {
                window.URL.revokeObjectURL(viewingPrescription.url);
                setViewingPrescription(null);
              }}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderOrderDetailsModal = () => {
    if (!viewOrderDetails) return null;

    const order = viewOrderDetails;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-white p-4 border-b flex justify-between items-center">
            <h3 className="text-lg font-semibold">Order #{order.id} Details</h3>
            <button
              onClick={() => setViewOrderDetails(null)}
              className="text-gray-500 hover:text-gray-700"
            >
              <XCircle size={24} />
            </button>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-2">
                  ORDER INFORMATION
                </h4>
                <table className="w-full text-sm">
                  <tbody>
                    <tr>
                      <td className="py-2 text-gray-600">Order Medicine:</td>
                      <td className="py-2 font-medium">{order.id}</td>
                    </tr>
                    <tr>
                      <td className="py-2 text-gray-600">Date:</td>
                      <td className="py-2">{formatDate(order.created_at)}</td>
                    </tr>
                    <tr>
                      <td className="py-2 text-gray-600">Status:</td>
                      <td className="py-2">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            statusColors[order.payment_status] ||
                            "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {statusIcons[order.payment_status] || (
                            <AlertCircle size={16} className="mr-1" />
                          )}
                          {order.payment_status}
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2 text-gray-600">Payment Method:</td>
                      <td className="py-2">
                        {order.payment_method || "Not specified"}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-2">
                  CUSTOMER INFORMATION
                </h4>
                <table className="w-full text-sm">
                  <tbody>
                    <tr>
                      <td className="py-2 text-gray-600">Name:</td>
                      <td className="py-2 font-medium">
                        {order.shipping_name ||
                          order.user_name ||
                          "Not available"}
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2 text-gray-600">Email:</td>
                      <td className="py-2">
                        {order.email || order.user_email || "Not available"}
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2 text-gray-600">Phone:</td>
                      <td className="py-2">
                        {order.shipping_phone || "Not available"}
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2 text-gray-600">Address:</td>
                      <td className="py-2">
                        {order.shipping_address
                          ? `${order.shipping_address}, ${
                              order.shipping_city || ""
                            } ${order.shipping_state || ""} ${
                              order.shipping_zip || ""
                            }`
                          : "Not available"}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {order.prescription_file && (
              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <FileText size={24} className="text-blue-600 mr-3" />
                    <div>
                      <h4 className="font-medium text-blue-800">
                        Prescription Attached
                      </h4>
                      <p className="text-sm text-blue-600">
                        This order includes a prescription that requires
                        verification.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleViewPrescription(order.id)}
                      className="px-3 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center"
                    >
                      <File size={16} className="mr-2" />
                      View
                    </button>
                    <button
                      onClick={() => handleDownloadPrescription(order.id)}
                      className="px-3 py-1.5 bg-gray-100 text-gray-800 rounded hover:bg-gray-200 flex items-center"
                    >
                      <Download size={16} className="mr-2" />
                      Download
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-8">
              <h4 className="text-sm font-medium text-gray-500 mb-4">
                ORDER ITEMS
              </h4>
              <div className="border rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="py-3 px-4 text-left font-medium text-gray-500">
                        Product
                      </th>
                      <th className="py-3 px-4 text-right font-medium text-gray-500">
                        Price
                      </th>
                      <th className="py-3 px-4 text-right font-medium text-gray-500">
                        Quantity
                      </th>
                      <th className="py-3 px-4 text-right font-medium text-gray-500">
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                   {order.items && order.items.map((item, index) => (
  <tr key={index} className="hover:bg-gray-50">
    <td className="py-4 px-4">
      <div className="flex items-center">
        <img
          src={getImageUrl(item.product_image || item.product?.image)}
          alt={item.product_name || item.product?.name}
          className="w-10 h-10 rounded object-cover mr-3"
        />
        <span>{item.product_name || item.product?.name || "Unknown Product"}</span>
      </div>
    </td>
    <td className="py-4 px-4 text-right">
      Rs. {item.product_price || item.price || item.product?.price || 0}
    </td>
    <td className="py-4 px-4 text-right">
      {item.quantity}
    </td>
    <td className="py-4 px-4 text-right font-medium">
      Rs. {(item.product_price || item.price || item.product?.price || 0) * item.quantity}
    </td>
  </tr>
))}
                  </tbody>
                  <tfoot className="bg-gray-50">
                    <tr>
                      <td colSpan="3" className="py-3 px-4 text-right font-medium">
                        Subtotal
                      </td>
                      <td className="py-3 px-4 text-right font-medium">
                        Rs.{" "}
                        {order.items?.reduce(
                          (sum, item) => sum + item.product_price * item.quantity,
                          0
                        ) || 0}
                      </td>
                    </tr>
                    <tr>
                      <td colSpan="3" className="py-3 px-4 text-right font-medium">
                        Shipping
                      </td>
                      <td className="py-3 px-4 text-right font-medium">
                        Rs. {order.shipping_fee || 100}
                      </td>
                    </tr>
                    <tr className="bg-gray-100">
                      <td colSpan="3" className="py-3 px-4 text-right font-medium">
                        Total
                      </td>
                      <td className="py-3 px-4 text-right font-medium">
                        Rs. {getOrderTotal(order)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {order.payment_status !== "Completed" && order.payment_status !== "Failed" && (
              <div className="mt-8 flex justify-end space-x-4">
                {order.payment_status === "Pending" && (
                  <>
                    <button
                      onClick={() => {
                        setViewOrderDetails(null);
                        handleStatusUpdate(order.id, "Declined");
                      }}
                      className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors flex items-center"
                      disabled={processingOrderId === order.id}
                    >
                      <XCircle size={16} className="mr-2" />
                      Decline Order
                    </button>
                    <button
                      onClick={() => {
                        setViewOrderDetails(null);
                        handleStatusUpdate(order.id, "Accepted");
                      }}
                      className="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors flex items-center"
                      disabled={processingOrderId === order.id}
                    >
                      <CheckCircle size={16} className="mr-2" />
                      Accept Order
                    </button>
                  </>
                )}
                {order.payment_status === "Declined" && (
                  <button
                    onClick={() => {
                      setViewOrderDetails(null);
                      handleStatusUpdate(order.id, "Pending");
                    }}
                    className="px-4 py-2 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 transition-colors flex items-center"
                    disabled={processingOrderId === order.id}
                  >
                    <RefreshCw size={16} className="mr-2" />
                    Revert to Pending
                  </button>
                )}
                {order.payment_status === "Accepted" && (
                  <>
                    <button
                      onClick={() => {
                        setViewOrderDetails(null);
                        handleStatusUpdate(order.id, "Completed");
                      }}
                      className="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors flex items-center"
                      disabled={processingOrderId === order.id}
                    >
                      <CheckCircle size={16} className="mr-2" />
                      Mark as Completed
                    </button>
                    <button
                      onClick={() => {
                        setViewOrderDetails(null);
                        handleStatusUpdate(order.id, "Declined");
                      }}
                      className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors flex items-center"
                      disabled={processingOrderId === order.id}
                    >
                      <XCircle size={16} className="mr-2" />
                      Decline Order
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#55DD4A]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4 flex items-center">
        <AlertCircle className="mr-2" />
        <p>{error}</p>
        <button
          onClick={fetchOrders}
          className="ml-auto bg-red-100 text-red-800 px-3 py-1 rounded hover:bg-red-200 flex items-center"
        >
          <RefreshCw size={14} className="mr-1" /> Retry
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-xl font-semibold">Order Management</h2>
        <button
          onClick={fetchOrders}
          className="bg-[#004d40] text-white px-4 py-2 rounded-lg hover:bg-[#00695c] transition-colors flex items-center"
        >
          <RefreshCw size={16} className="mr-2" /> Refresh Orders
        </button>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <DollarSign size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-500">No orders found</p>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">#{order.id}</td>
                  <td className="px-6 py-4">
                    {order.shipping_name ||
                      order.user_name ||
                      "Unknown Customer"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {formatDate(order.created_at)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    Rs. {getOrderTotal(order)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        statusColors[order.payment_status] ||
                        "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {statusIcons[order.payment_status] || (
                        <AlertCircle size={16} className="mr-1" />
                      )}
                      {order.payment_status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setViewOrderDetails(order)}
                        className="text-blue-600 hover:text-blue-800 flex items-center"
                      >
                        <Eye size={16} className="mr-1" /> View
                      </button>

                      {order.prescription_file && (
                        <button
                          onClick={() => handleViewPrescription(order.id)}
                          className="text-blue-600 hover:text-blue-800 flex items-center"
                        >
                          <FileText size={16} className="mr-1" /> Rx
                        </button>
                      )}

                      {order.payment_status === "Pending" && (
                        <>
                          <button
                            onClick={() =>
                              handleStatusUpdate(order.id, "Accepted")
                            }
                            className="text-green-600 hover:text-green-800 flex items-center"
                            disabled={processingOrderId === order.id}
                          >
                            <CheckCircle size={16} className="mr-1" /> Accept
                          </button>
                          <button
                            onClick={() =>
                              handleStatusUpdate(order.id, "Declined")
                            }
                            className="text-red-600 hover:text-red-800 flex items-center"
                            disabled={processingOrderId === order.id}
                          >
                            <XCircle size={16} className="mr-1" /> Decline
                          </button>
                        </>
                      )}
                      {order.payment_status === "Declined" && (
                        <button
                          onClick={() =>
                            handleStatusUpdate(order.id, "Pending")
                          }
                          className="text-yellow-600 hover:text-yellow-800 flex items-center"
                          disabled={processingOrderId === order.id}
                        >
                          <RefreshCw size={16} className="mr-1" /> Revert
                        </button>
                      )}
                      {order.payment_status === "Accepted" && (
                        <button
                          onClick={() =>
                            handleStatusUpdate(order.id, "Completed")
                          }
                          className="text-green-600 hover:text-green-800 flex items-center"
                          disabled={processingOrderId === order.id}
                        >
                          <CheckCircle size={16} className="mr-1" /> Complete
                        </button>
                      )}

                      {processingOrderId === order.id && (
                        <span className="text-gray-500 flex items-center">
                          <RefreshCw size={16} className="mr-1 animate-spin" />{" "}
                          Processing...
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {renderOrderDetailsModal()}
      {renderPrescriptionViewer()}

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
};

export default OrderManagement;