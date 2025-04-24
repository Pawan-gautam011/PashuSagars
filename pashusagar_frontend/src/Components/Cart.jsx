import { useState, useEffect } from 'react';
import { Trash2, X, Check, AlertTriangle, FileText, Home, ChevronRight, Plus, Minus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { hydrateCart, removeFromCart, updateQuantity, clearCart } from '../redux/cartSlice';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import Navbar from './Navbar';
import Footer from './Footer';

const Cart = () => {
  const navigate = useNavigate();
  const cartItems = useSelector((state) => state.cart.items);
  const dispatch = useDispatch();

  const [shippingName, setShippingName] = useState('');
  const [shippingPhone, setShippingPhone] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [shippingCity, setShippingCity] = useState('');
  const [shippingState, setShippingState] = useState('');
  const [shippingZip, setShippingZip] = useState('');
  const [shippingEmail, setShippingEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [prescriptionFile, setPrescriptionFile] = useState(null);
  const [prescriptionFileName, setPrescriptionFileName] = useState('');
  const [prescriptionRequired, setPrescriptionRequired] = useState(false);
  const [prescriptionError, setPrescriptionError] = useState('');
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [error, setError] = useState('');
  const [loadingPayment, setLoadingPayment] = useState(false);
  const [stockLevels, setStockLevels] = useState({});
  const [productCategories, setProductCategories] = useState({});
  const [hasPoisonousMedicine, setHasPoisonousMedicine] = useState(false);
  const SHIPPING_COST = 100;
  // Email validation function
  const validateEmail = (email) => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };

  // Handle prescription file upload
  const handlePrescriptionUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const validTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/gif'];
      if (!validTypes.includes(file.type)) {
        toast.error('Please upload a PDF or image file (JPEG, PNG, GIF)');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size should be less than 5MB');
        return;
      }
      
      setPrescriptionFile(file);
      setPrescriptionFileName(file.name);
      setPrescriptionError('');
      toast.success('Prescription file uploaded successfully');
    }
  };

  // Load saved cart from localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        if (parsedCart.items && parsedCart.items.length > 0) {
          dispatch(hydrateCart(parsedCart.items));
        }
      } catch (err) {
        console.error('Error parsing cart from localStorage:', err);
      }
    }
    
    // Load user info from localStorage for pre-filling the form
    const username = localStorage.getItem('username');
    const email = localStorage.getItem('email');
    
    if (username) setShippingName(username);
    if (email) setShippingEmail(email);
  }, [dispatch]);

  // Fetch product details, stock levels, and check for prescription requirements
  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const productIds = cartItems.map(item => item.id);
        const promises = productIds.map(id =>
          axios.get(`http://127.0.0.1:8000/api/products/${id}/`)
        );
        const responses = await Promise.all(promises);
        
        const stocks = {};
        const categories = {};
        let requiresPrescription = false;
        let containsPoisonousMedicine = false;
        
        responses.forEach(response => {
          const product = response.data;
          stocks[product.id] = product.stock;
          categories[product.id] = product.category?.name || '';
          
          // Check for medicines that require prescription
          const categoryName = (product.category?.name || '').toLowerCase();
          const productTitle = (product.title || '').toLowerCase();
          
          if (
            categoryName.includes('medication') || 
            categoryName.includes('medicine') ||
            productTitle.includes('medication') ||
            productTitle.includes('medicine')
          ) {
            requiresPrescription = true;
          }
          
          if (product.is_poisonous) {
            containsPoisonousMedicine = true;
            requiresPrescription = true;
          }
        });
        
        setStockLevels(stocks);
        setProductCategories(categories);
        setPrescriptionRequired(requiresPrescription);
        setHasPoisonousMedicine(containsPoisonousMedicine);
        
        // Adjust quantities if they exceed available stock
        cartItems.forEach(item => {
          if (item.quantity > stocks[item.id]) {
            dispatch(updateQuantity({ 
              id: item.id, 
              quantity: stocks[item.id] || 1
            }));
            toast.warning(
              `Quantity for ${item.title} adjusted to available stock of ${stocks[item.id]}`
            );
          }
        });
      } catch (error) {
        console.error('Error fetching product details:', error);
        toast.error('Error loading product information. Please refresh the page.');
      }
    };

    if (cartItems?.length > 0) {
      fetchProductDetails();
    } else {
      setPrescriptionRequired(false);
      setHasPoisonousMedicine(false);
    }
  }, [cartItems, dispatch]);

  // Calculate cart total
  const calculateSubtotal = () => {
    return cartItems?.reduce((total, item) => total + (item.price * item.quantity), 0) || 0;
  };
  const calculateTotal = () => {
    return calculateSubtotal() + SHIPPING_COST;
  };

  // Handle quantity update
  const handleUpdateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return;

    const availableStock = stockLevels[id];
    if (availableStock === undefined) {
      toast.error("Unable to verify stock level. Please try again.");
      return;
    }

    if (newQuantity > availableStock) {
      toast.error(`Only ${availableStock} items available in stock`);
      dispatch(updateQuantity({ id, quantity: availableStock }));
      return;
    }

    dispatch(updateQuantity({ id, quantity: newQuantity }));
  };

  // Remove item from cart
  const handleRemoveItem = (id) => {
    dispatch(removeFromCart(id));
    toast.info('Item removed from cart');
  };

  // Validate the form before proceeding
  const validateForm = () => {
    setError("");
    setEmailError("");
    setPrescriptionError("");
    
    let isValid = true;
    
    // Check if cart is empty
    if (!cartItems || cartItems.length === 0) {
      setError("Your cart is empty");
      return false;
    }
    
    // Validate stock levels
    const stockValidation = cartItems.every(item => {
      const availableStock = stockLevels[item.id];
      if (item.quantity > availableStock) {
        setError(`Not enough stock for ${item.title}. Available: ${availableStock}`);
        isValid = false;
        return false;
      }
      return true;
    });
    
    if (!stockValidation) return false;

    // Check payment method
    if (!paymentMethod) {
      setError("Please select a payment method (Khalti or Cash on Delivery)");
      isValid = false;
    }

    // Basic shipping validation
    if (!shippingName || !shippingPhone || !shippingAddress) {
      setError("Please fill out all required shipping fields (name, phone, address).");
      isValid = false;
    }
    
    // Email validation
    if (!shippingEmail) {
      setEmailError("Please provide an email address to receive your receipt");
      isValid = false;
    } else if (!validateEmail(shippingEmail)) {
      setEmailError("Please enter a valid email address");
      isValid = false;
    }
    
    // Prescription validation (only if required)
    if (hasPoisonousMedicine && !prescriptionFile) {
      setPrescriptionError("A prescription is required for potentially harmful medications");
      isValid = false;
    }
    
    return isValid;
  };

  // Initial purchase handler
  const handlePurchase = () => {
    if (validateForm()) {
      setShowConfirmDialog(true);
    }
  };

  const handleConfirmOrder = async () => {
    setLoadingPayment(true);
    setError("");
    
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("You need to be logged in to complete this purchase");
        setLoadingPayment(false);
        setShowConfirmDialog(false);
        navigate('/login');
        return;
      }
  
      // Create a proper FormData object
      const formData = new FormData();
      
      // Add all shipping information
      formData.append('payment_method', paymentMethod);
      formData.append('shipping_name', shippingName);
      formData.append('shipping_phone', shippingPhone);
      formData.append('shipping_address', shippingAddress);
      formData.append('shipping_email', shippingEmail);  // Add email to form data
      
      if (shippingCity) formData.append('shipping_city', shippingCity);
      if (shippingState) formData.append('shipping_state', shippingState);
      if (shippingZip) formData.append('shipping_zip', shippingZip);
      
      if (prescriptionFile) {
        formData.append('prescription_file', prescriptionFile);
      }
  
      // Add cart items as JSON string
      const itemsData = cartItems.map(item => ({
        product: item.id,
        quantity: item.quantity,
        price: item.price
      }));
      formData.append('items', JSON.stringify(itemsData));
  
      const response = await axios.post(
        "http://127.0.0.1:8000/api/initiate-payment/",
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
            // Remove the custom header
          }
        }
      );
      
      if (response.data.status === 'error') {
        throw new Error(response.data.message || 'Payment failed');
      }
  
      if (paymentMethod === 'Khalti' && response.data.payment_url) {
        window.location.href = response.data.payment_url;
      } else if (paymentMethod === 'Cash on Delivery') {
        toast.success("Order placed successfully with Cash on Delivery!");
        dispatch(clearCart());
        setShowConfirmDialog(false);
        setLoadingPayment(false);
        
        if (response.data.order_id) {
          navigate(`/payment-success?order_id=${response.data.order_id}`);
        } else {
          navigate('/payment-success');
        }
      }
    } catch (err) {
      console.error("Payment error:", err);
      
      let errorMessage = "Failed to process order. Please try again.";
      
      if (err.response) {
        if (err.response.data?.detail) {
          errorMessage = err.response.data.detail;
        } else if (err.response.data?.message) {
          errorMessage = err.response.data.message;
        } else if (typeof err.response.data === 'object') {
          errorMessage = Object.entries(err.response.data)
            .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(', ') : value}`)
            .join('. ');
        }
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      setLoadingPayment(false);
      setShowConfirmDialog(false);
    }
  };
  // Helper to get full image URL
  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return '/placeholder.svg';
    
    if (imageUrl.startsWith('http')) {
      return imageUrl;
    }
    return `http://127.0.0.1:8000${imageUrl}`;
  };

  // Helper to check if a product is a medication
  const isMedication = (item) => {
    const category = productCategories[item.id]?.toLowerCase() || '';
    const title = (item.title || '').toLowerCase();
    
    return category.includes('medication') || 
           category.includes('medicine') ||
           title.includes('medication') ||
           title.includes('medicine');
  };

  // Enhanced breadcrumb component
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
    { label: "Cart", path: "/cart" },
  ];

  return (
    <>
      <Navbar/>
      <div className="min-h-screen bg-gradient-to-b from-[#004d40] to-[#00695c] pt-16 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="container mx-auto">
            <EnhancedBreadcrumbs items={breadcrumbItems} />
          </div>
          
          <div className="text-center mb-8">
            <h2 className="text-[#55DD4A] text-4xl md:text-5xl lg:text-6xl font-bold">Your Shopping Cart</h2>
            <h1 className="mt-4 text-lg md:text-xl text-[#ADE1B0]">
              Review your items and complete your purchase
            </h1>
            <div className="mt-4 h-px bg-gradient-to-r from-transparent via-[#ADE1B0] to-transparent" />
          </div>

          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

              {/* Left Section: Cart Items */}
              <div className="lg:col-span-2">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 mb-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-white text-lg font-medium">Items in Cart ({cartItems?.length || 0})</h3>
                    {cartItems?.length > 0 && (
                      <button 
                        onClick={() => dispatch(clearCart())}
                        className="text-[#ADE1B0] hover:text-white text-sm flex items-center gap-1"
                      >
                        <Trash2 size={14} />
                        <span>Clear Cart</span>
                      </button>
                    )}
                  </div>
                </div>

                {cartItems?.length === 0 ? (
                  <div className="bg-white rounded-lg shadow-lg p-8 text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <p className="text-gray-700 text-lg mb-4">Your cart is empty</p>
                    <button 
                      onClick={() => navigate('/pharmacy')}
                      className="px-6 py-2 bg-[#004D40] text-white rounded-lg hover:bg-[#00695c] transition-colors"
                    >
                      Continue Shopping
                    </button>
                  </div>
                ) : (
                  <>
                    {/* Poisonous Medicines Warning */}
                    {hasPoisonousMedicine && (
                      <div className="bg-amber-50 border-l-4 border-amber-500 p-4 mb-4 rounded-r-md">
                        <div className="flex">
                          <div className="flex-shrink-0">
                            <AlertTriangle className="h-5 w-5 text-amber-500" />
                          </div>
                          <div className="ml-3">
                            <h3 className="text-sm font-medium text-amber-800">Prescription Required</h3>
                            <div className="mt-2 text-sm text-amber-700">
                              <p>Your cart contains medicines that are potentially harmful to animals. A valid veterinary prescription is required for these items. Please upload your prescription in the checkout form.</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  
                    {cartItems?.map((item) => (
                      <div key={item.id} className="bg-white rounded-lg shadow-lg mb-4 overflow-hidden">
                        <div className="p-4">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                            <div className="relative">
                              <img
                                src={getImageUrl(item.images)}
                                alt={item.title}
                                className="w-24 h-24 object-cover rounded-lg"
                              />
                              {item.is_poisonous && (
                                <div className="absolute top-0 left-0 bg-amber-500 text-white px-1.5 py-0.5 rounded-br-md rounded-tl-md text-xs font-medium flex items-center">
                                  <AlertTriangle size={10} className="mr-1" />
                                  Caution
                                </div>
                              )}
                            </div>
                            
                            <div className="flex-1">
                              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
                                <div>
                                  <h3 className="font-bold text-lg text-gray-800 flex items-center gap-2">
                                    {item.title}
                                    {item.is_poisonous && (
                                      <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                                        <AlertTriangle size={10} className="mr-1" />
                                        Prescription Required
                                      </span>
                                    )}
                                    {isMedication(item) && !item.is_poisonous && (
                                      <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                        <FileText size={10} className="mr-1" />
                                        Medication
                                      </span>
                                    )}
                                  </h3>
                                  <p className="text-gray-600 text-sm line-clamp-2 mt-1">{item.description}</p>
                                </div>
                                <div className="text-right mt-2 sm:mt-0">
                                  <p className="font-bold text-lg">
                                    Rs. {item.price * item.quantity}
                                  </p>
                                  <p className="text-sm text-gray-500">
                                    Rs. {item.price} each
                                  </p>
                                </div>
                              </div>

                              <div className="flex flex-wrap items-center gap-4 mt-3 justify-between">
                                <div className="flex items-center">
                                  <button
                                    onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                                    className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-l-md bg-gray-50 hover:bg-gray-100"
                                    disabled={item.quantity <= 1}
                                  >
                                    <Minus size={16} className={item.quantity <= 1 ? "text-gray-300" : "text-gray-600"} />
                                  </button>
                                  <input
                                    type="text"
                                    value={item.quantity}
                                    readOnly
                                    className="w-12 h-8 border-t border-b border-gray-300 text-center text-gray-800"
                                  />
                                  <button
                                    onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                                    className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-r-md bg-gray-50 hover:bg-gray-100"
                                    disabled={item.quantity >= stockLevels[item.id]}
                                  >
                                    <Plus size={16} className={item.quantity >= stockLevels[item.id] ? "text-gray-300" : "text-gray-600"} />
                                  </button>
                                </div>

                                <div className="flex items-center gap-4">
                                  <p className="text-xs text-gray-500">
                                    In Stock: {stockLevels[item.id] ?? 'Loading...'}
                                  </p>
                                  <button
                                    onClick={() => handleRemoveItem(item.id)}
                                    className="text-red-500 hover:text-red-700 transition-colors"
                                  >
                                    <Trash2 size={18} />
                                  </button>
                                </div>
                              </div>
                              
                              {/* Poisonous warning in cart item */}
                              {item.is_poisonous && (
                                <div className="mt-3 text-xs bg-amber-50 border border-amber-200 rounded-md p-2 text-amber-700 flex items-start">
                                  <AlertTriangle size={12} className="mr-1 mt-0.5 flex-shrink-0" />
                                  <span>
                                    This medication is potentially harmful to animals. Only use under veterinary supervision.
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </>
                )}
              </div>

              {/* Right Section: Order Summary + Shipping Form */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-lg shadow-lg overflow-hidden sticky top-20">
                  {/* Order Summary Section */}
                  <div className="p-6 bg-[#004d40] text-white">
                    <h2 className="text-xl font-bold mb-4">Order Summary</h2>
                    <div className="space-y-2 text-[#ADE1B0]/90">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>Rs. {calculateSubtotal().toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Delivery</span>
                      <span>Rs. {SHIPPING_COST.toFixed(2)}</span>
                    </div>
                    <div className="border-t border-[#ADE1B0]/20 pt-2 mt-2">
                      <div className="flex justify-between font-bold text-lg text-white">
                        <span>Total</span>
                        <span>Rs. {calculateTotal().toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                  </div>

                  {/* Shipping Form */}
                  <div className="p-6 bg-white border-t border-gray-200">
                    <h3 className="font-medium text-gray-800 mb-4">Shipping Information</h3>
                    
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="shippingName" className="block text-sm font-medium text-gray-700 mb-1">
                            Full Name *
                          </label>
                          <input
                            type="text"
                            id="shippingName"
                            placeholder="Full Name"
                            value={shippingName}
                            onChange={(e) => setShippingName(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#55DD4A] focus:border-[#55DD4A] focus:outline-none"
                            required
                          />
                        </div>
                        <div>
                          <label htmlFor="shippingPhone" className="block text-sm font-medium text-gray-700 mb-1">
                            Phone Number *
                          </label>
                          <input
                            type="text"
                            id="shippingPhone"
                            placeholder="Phone"
                            value={shippingPhone}
                            onChange={(e) => setShippingPhone(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#55DD4A] focus:border-[#55DD4A] focus:outline-none"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="shippingEmail" className="block text-sm font-medium text-gray-700 mb-1">
                          Email (for receipt) *
                        </label>
                        <input
                          type="email"
                          id="shippingEmail"
                          value={shippingEmail}
                          onChange={(e) => {
                            setShippingEmail(e.target.value);
                            setEmailError('');
                          }}
                          className={`w-full px-4 py-2 border rounded-md shadow-sm focus:ring-[#55DD4A] focus:border-[#55DD4A] focus:outline-none ${
                            emailError ? 'border-red-500 bg-red-50' : 'border-gray-300'
                          }`}
                          placeholder="email@example.com"
                          required
                        />
                        {emailError && (
                          <p className="mt-1 text-sm text-red-500 flex items-center">
                            <AlertTriangle size={12} className="mr-1" />
                            {emailError}
                          </p>
                        )}
                      </div>

                      <div>
                        <label htmlFor="shippingAddress" className="block text-sm font-medium text-gray-700 mb-1"></label>
                        <textarea
                          id="shippingAddress"
                          rows="2"
                          placeholder="Street Address"
                          value={shippingAddress}
                          onChange={(e) => setShippingAddress(e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#55DD4A] focus:border-[#55DD4A] focus:outline-none"
                          required
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="shippingCity" className="block text-sm font-medium text-gray-700 mb-1">
                            City
                          </label>
                          <input
                            type="text"
                            id="shippingCity"
                            placeholder="City"
                            value={shippingCity}
                            onChange={(e) => setShippingCity(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#55DD4A] focus:border-[#55DD4A] focus:outline-none"
                          />
                        </div>
                        <div>
                          <label htmlFor="shippingState" className="block text-sm font-medium text-gray-700 mb-1">
                            State/Province
                          </label>
                          <input
                            type="text"
                            id="shippingState"
                            placeholder="State"
                            value={shippingState}
                            onChange={(e) => setShippingState(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#55DD4A] focus:border-[#55DD4A] focus:outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="shippingZip" className="block text-sm font-medium text-gray-700 mb-1">
                          ZIP / Postal Code
                        </label>
                        <input
                          type="text"
                          id="shippingZip"
                          placeholder="ZIP Code"
                          value={shippingZip}
                          onChange={(e) => setShippingZip(e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#55DD4A] focus:border-[#55DD4A] focus:outline-none"
                        />
                      </div>
                      
                      {/* Prescription Upload - Only show if poisonous medicines are in cart */}
                      {hasPoisonousMedicine && (
                        <div className="mt-4">
                          <div className="bg-amber-50 rounded-lg border border-amber-200 p-4">
                            <label className="flex items-center text-sm font-medium text-amber-800 mb-2">
                              <AlertTriangle size={16} className="mr-2 text-amber-500" />
                              Prescription Upload (Required) *
                            </label>
                            <div className="flex items-center">
                              <label 
                                className={`flex-1 flex items-center justify-center px-4 py-2 border ${
                                  prescriptionError ? 'border-red-500 bg-red-50' : 'border-amber-300 bg-white'
                                } rounded-md shadow-sm text-sm font-medium text-amber-800 hover:bg-amber-50 cursor-pointer transition-colors`}
                              >
                                {prescriptionFileName ? (
                                  <span className="flex items-center">
                                    <FileText size={16} className="mr-2 text-amber-500" />
                                    {prescriptionFileName}
                                  </span>
                                ) : (
                                  <span>Upload veterinary prescription</span>
                                )}
                                <input
                                  type="file"
                                  className="sr-only"
                                  accept=".pdf,.jpg,.jpeg,.png,.gif"
                                  onChange={handlePrescriptionUpload}
                                />
                              </label>
                              {prescriptionFileName && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setPrescriptionFile(null);
                                    setPrescriptionFileName('');
                                    setPrescriptionError('A prescription is required for medication orders');
                                  }}
                                  className="ml-2 p-2 text-amber-700 hover:bg-amber-100 rounded-full transition-colors"
                                  title="Remove file"
                                >
                                  <X size={16} />
                                </button>
                              )}
                            </div>
                            {prescriptionError && (
                              <p className="mt-2 text-sm text-red-500 flex items-center">
                                <AlertTriangle size={12} className="mr-1" />
                                {prescriptionError}
                              </p>
                            )}
                            <p className="mt-2 text-xs text-amber-700">
                              Upload a prescription from your veterinarian for the medications marked as "Prescription Required". 
                              Accept formats: PDF, JPEG, PNG (max 5MB)
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Payment Method Selection */}
                      <div className="mt-6">
                        <h3 className="font-medium text-gray-800 mb-4">Payment Method</h3>

                        {/* Khalti Option */}
                        <div className="mb-3">
                          <label
                            className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors
                              ${paymentMethod === 'Khalti' 
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-gray-200 hover:border-blue-300'
                              }`}
                          >
                            <input
                              type="radio"
                              name="payment"
                              value="Khalti"
                              checked={paymentMethod === 'Khalti'}
                              onChange={(e) => setPaymentMethod(e.target.value)}
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                            />
                            <div className="ml-3">
                              <span className="block text-sm font-medium text-gray-700">
                                Pay with Khalti
                              </span>
                              <span className="block text-xs text-gray-500">
                                Secure online payment
                              </span>
                            </div>
                           
                          </label>
                        </div>

                        {/* Cash on Delivery Option */}
                        <div>
                          <label
                            className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors
                              ${paymentMethod === 'Cash on Delivery'
                                ? 'border-green-500 bg-green-50'
                                : 'border-gray-200 hover:border-green-300'
                              }`}
                          >
                            <input
                              type="radio"
                              name="payment"
                              value="Cash on Delivery"
                              checked={paymentMethod === 'Cash on Delivery'}
                              onChange={(e) => setPaymentMethod(e.target.value)}
                              className="h-4 w-4 text-green-600 focus:ring-green-500"
                            />
                            <div className="ml-3">
                              <span className="block text-sm font-medium text-gray-700">
                                Cash on Delivery
                              </span>
                              <span className="block text-xs text-gray-500">
                                Pay when you receive your order
                              </span>
                            </div>
                          </label>
                        </div>
                      </div>

                      {/* Error message display */}
                      {error && (
                        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                          <p className="text-sm text-red-600 flex items-center">
                            <AlertTriangle size={16} className="mr-2 flex-shrink-0" />
                            {error}
                          </p>
                        </div>
                      )}

                      {/* Complete Order Button */}
                      <button
                        onClick={handlePurchase}
                        disabled={cartItems?.length === 0}
                        className={`w-full mt-6 py-3 rounded-lg font-medium flex items-center justify-center gap-2 
                          ${cartItems?.length === 0
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            : 'bg-[#55DD4A] text-white hover:bg-[#45cc3a] transition-colors shadow-md'
                          }`}
                      >
                        {paymentMethod === 'Khalti'
                          ? 'Proceed to Payment'
                          : 'Complete Order'
                        }
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Confirm Order Dialog */}
            {showConfirmDialog && (
  <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50">
    <div className="bg-white rounded-lg max-w-2xl w-full p-6 shadow-2xl">
      {!loadingPayment ? (
        <div className="flex flex-col md:flex-row gap-6">
          {/* Left Column - Order Summary */}
          <div className="md:w-1/2">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-[#004d40]">Confirm Your Order</h2>
              <p className="text-gray-600 mt-2">
                Please review your order details before finalizing.
              </p>
            </div>

            <div className="border rounded-lg p-4 mb-4">
              <h3 className="font-medium text-gray-700 mb-3">Order Summary</h3>
              <div className="space-y-2">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between items-center text-sm">
                    <div className="flex items-center">
                      <span className="font-medium">{item.title}</span>
                      <span className="mx-2 text-gray-500">×</span>
                      <span>{item.quantity}</span>
                    </div>
                    <span className="font-medium">
                      Rs. {(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
              
              <div className="border-t mt-3 pt-3 space-y-1">
  <div className="flex justify-between">
    <span>Subtotal</span>
    <span>Rs. {calculateSubtotal().toFixed(2)}</span>
  </div>
  <div className="flex justify-between">
    <span>Delivery</span>
    <span>Rs. {SHIPPING_COST.toFixed(2)}</span>
  </div>
  <div className="flex justify-between font-bold text-lg pt-2">
    <span>Total</span>
    <span className="text-[#004d40]">
      Rs. {calculateTotal().toFixed(2)}
    </span>
  </div>
</div>
            </div>
          </div>

          {/* Right Column - Shipping Info */}
          <div className="md:w-1/2">
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <h3 className="font-medium text-gray-700 mb-2">Shipping Information</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="block text-gray-500">Name:</span>
                  <span className="font-medium">{shippingName}</span>
                </div>
                <div>
                  <span className="block text-gray-500">Phone:</span>
                  <span className="font-medium">{shippingPhone}</span>
                </div>
                <div className="col-span-2">
                  <span className="block text-gray-500">Email:</span>
                  <span className="font-medium">{shippingEmail}</span>
                </div>
                <div className="col-span-2">
                  <span className="block text-gray-500">Address:</span>
                  <span className="font-medium">
                    {shippingAddress}
                    {shippingCity && `, ${shippingCity}`}
                    {shippingState && `, ${shippingState}`}
                    {shippingZip && ` ${shippingZip}`}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <h3 className="font-medium text-gray-700 mb-2">Payment Method</h3>
              <p className="font-medium">
                {paymentMethod === 'Khalti' 
                  ? 'Khalti Payment Gateway' 
                  : 'Cash on Delivery'
                }
              </p>
            </div>

            {prescriptionFileName && (
              <div className="flex items-center bg-green-50 p-3 rounded-lg border border-green-200 mb-4">
                <Check size={18} className="text-green-500 mr-2" />
                <div>
                  <span className="block font-medium text-green-800">Prescription Attached</span>
                  <span className="text-sm text-green-700">{prescriptionFileName}</span>
                </div>
              </div>
            )}

            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setShowConfirmDialog(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmOrder}
                className="px-6 py-2 bg-[#55DD4A] text-white rounded-lg hover:bg-[#45cc3a] transition-colors shadow-md"
              >
                Confirm Order
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-10">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#55DD4A] mx-auto mb-6"></div>
          <p className="text-xl font-medium text-gray-700 mb-2">
            {paymentMethod === 'Khalti' ? 'Redirecting to Payment' : 'Processing Order'}
          </p>
          <p className="text-gray-500">Please do not close this window...</p>
        </div>
      )}
    </div>
  </div>
)}
          </div>
        </div>
      </div>
      <Footer/>
      <ToastContainer position="top-right" autoClose={hasPoisonousMedicine ? 5000 : 3000} />
    </>
  );
};

export default Cart;