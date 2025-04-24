import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import axios from "axios";
import {
  ShoppingCart,
  Heart,
  Share2,
  ChevronLeft,
  Star,
  Shield,
  Truck,
  RefreshCw,
  Check,
  Info,
  Plus,
  Minus,
  Home,
  ChevronRight,
  AlertTriangle,
} from "lucide-react";
import { addToCart } from "../redux/cartSlice";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Import components
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import Breadcrumbs from "../Components/BreadCrumbs";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [activeTab, setActiveTab] = useState("description"); // description, details, reviews
  const [selectedImage, setSelectedImage] = useState(0);

  const breadcrumbItems = [
    { label: "Home", path: "/" },
    { label: "Pharmacy", path: "/pharmacy" },
    { label: "Product Details", path: `/product/${id}` },
  ];

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/api/products/${id}/`
        );
        setProduct(response.data);

        // Reset quantity to 1 when product changes
        setQuantity(1);

        // Fetch related products by category
        if (response.data.category) {
          fetchRelatedProducts(response.data.category, response.data.id);
        }
      } catch (err) {
        console.error("Error fetching product:", err);
        setError("Failed to load product details.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const fetchRelatedProducts = async (category, productId) => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/products/?category=${category}`
      );
      // Filter out the current product and limit to 4 products
      const filtered = response.data
        .filter((item) => item.id !== productId)
        .slice(0, 4);
      setRelatedProducts(filtered);
    } catch (err) {
      console.error("Error fetching related products:", err);
    }
  };

  const handleQuantityChange = (newQuantity) => {
    // Make sure quantity doesn't go below 1 or above stock
    if (newQuantity < 1) return;
    if (product && product.stock && newQuantity > product.stock) {
      toast.warning(`Sorry, only ${product.stock} items available in stock`);
      setQuantity(product.stock);
      return;
    }
    setQuantity(newQuantity);
  };

  const handleAddToCart = () => {
    if (!product) return;

    const productToAdd = {
      id: product.id,
      title: product.title,
      price: product.price,
      description: product.description,
      quantity: quantity,
      images: product.images,
      is_poisonous: product.is_poisonous,
    };

    dispatch(addToCart(productToAdd));

    // Show a warning toast if the product is poisonous
    if (product.is_poisonous) {
      toast.warning(
        `Warning: ${product.title} is potentially poisonous to animals. Use with veterinarian guidance only.`,
        {
          position: "bottom-right",
          autoClose: 5000, // Show this warning longer
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
          style: {
            background: "#FF9800",
            color: "white",
          },
        }
      );
    } else {
      // Regular success toast for non-poisonous products
      toast.success(
        `Added ${quantity} ${product.title}${quantity > 1 ? "s" : ""} to cart!`,
        {
          position: "bottom-right",
          autoClose: 2000,
        }
      );
    }
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate("/mycart");
  };

  // Helper function to render product rating stars
  const renderRating = (rating = 4) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<Star key={i} fill="#FFD700" color="#FFD700" size={18} />);
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(
          <span key={i} className="relative">
            <Star
              fill="#FFD700"
              color="#FFD700"
              size={18}
              className="absolute"
              style={{ clipPath: "inset(0 50% 0 0)" }}
            />
            <Star color="#FFD700" size={18} fill="none" />
          </span>
        );
      } else {
        stars.push(<Star key={i} color="#FFD700" size={18} fill="none" />);
      }
    }

    return <div className="flex">{stars}</div>;
  };

  // Generate product benefits
  const productBenefits = [
    {
      icon: <Shield className="text-blue-500" size={18} />,
      text: "100% Authentic Products",
    },
    {
      icon: <Truck className="text-green-500" size={18} />,
      text: "Fast Delivery",
    },
    {
      icon: <RefreshCw className="text-orange-500" size={18} />,
      text: "Easy Returns",
    },
  ];

  // Custom Breadcrumbs renderer with improved visibility
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
                  <span className="font-medium text-[#55DD4A]">
                    {item.label}
                  </span>
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

  // Loading state
  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-b from-[#004D40] to-[#00695C] pt-16 pb-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            {/* Enhanced Breadcrumbs */}
            <div className="container mx-auto">
              <EnhancedBreadcrumbs items={breadcrumbItems} />
            </div>
            <div className="flex justify-center items-center py-16">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#55DD4A]"></div>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  // Error state
  if (error || !product) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-b from-[#004D40] to-[#00695C] pt-16 pb-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            {/* Enhanced Breadcrumbs */}
            <div className="container mx-auto">
              <EnhancedBreadcrumbs items={breadcrumbItems} />
            </div>
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center max-w-xl mx-auto my-16">
              <h3 className="text-xl font-medium text-red-700 mb-2">
                {error || "Product not found"}
              </h3>
              <p className="text-red-600 mb-4">
                We couldn't find the product you're looking for.
              </p>
              <button
                onClick={() => navigate("/pharmacy")}
                className="px-6 py-2 bg-[#004D40] text-white rounded-lg hover:bg-[#00695c] transition-colors"
              >
                Return to Pharmacy
              </button>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-[#004D40] to-[#00695C] pt-16 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Enhanced Breadcrumbs */}
          <div className="container mx-auto">
            <EnhancedBreadcrumbs items={breadcrumbItems} />
          </div>

          {/* Product Details */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
              {/* Product Images */}
              <div>
                <div className="bg-gray-100 rounded-lg overflow-hidden h-80 flex items-center justify-center mb-4 relative">
                  <img
                    src={
                      product.images ||
                      "https://via.placeholder.com/400?text=No+Image"
                    }
                    alt={product.title}
                    className="max-w-full max-h-full object-contain"
                  />

                  {/* Poisonous badge overlay */}
                  {product.is_poisonous && (
                    <div className="absolute top-3 left-3 bg-amber-500 text-white px-3 py-1.5 rounded-md flex items-center">
                      <AlertTriangle size={16} className="mr-2" />
                      <span className="font-semibold">Caution Required</span>
                    </div>
                  )}
                </div>

                {/* Thumbnail Images - would use if there were multiple images */}
                {/* <div className="flex justify-center space-x-4">
                  {[...Array(4)].map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`w-16 h-16 rounded border-2 ${
                        selectedImage === index ? "border-[#55DD4A]" : "border-transparent"
                      }`}
                    >
                      <img
                        src={product.images || "https://via.placeholder.com/100"}
                        alt={`Thumbnail ${index + 1}`}
                        className="w-full h-full object-cover rounded"
                      />
                    </button>
                  ))}
                </div> */}
              </div>

              {/* Product Info */}
              <div className="flex flex-col">
                <div className="flex justify-between items-start">
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
                    {product.title}
                  </h1>

                  {/* Poisonous indicator badge */}
                  {product.is_poisonous && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                      <AlertTriangle size={12} className="mr-1" />
                      Potentially Harmful
                    </span>
                  )}
                </div>

                <div className="flex items-center space-x-4 mb-4">
                  <div className="flex items-center">
                    {renderRating(product.rating || 4)}
                    <span className="ml-2 text-gray-500 text-sm">
                      {product.rating_count ||
                        Math.floor(Math.random() * 50) + 10}{" "}
                      reviews
                    </span>
                  </div>

                  <div className="text-green-600 font-medium text-sm">
                    {product.stock > 0 ? "In Stock" : "Out of Stock"}
                  </div>
                </div>

                {/* Poisonous Warning Box */}
                {product.is_poisonous && (
                  <div className="mb-4 bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-md">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <AlertTriangle
                          className="h-5 w-5 text-amber-500"
                          aria-hidden="true"
                        />
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-amber-800">
                          Medication Safety Warning
                        </h3>
                        <div className="mt-2 text-sm text-amber-700">
                          <p>
                            This medicine is potentially poisonous to animals.
                            Only use under the strict guidance of a
                            veterinarian. Improper usage may cause serious
                            health complications or toxicity.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="mb-6">
                  <span className="text-2xl font-bold text-[#004D40]">
                    Rs.{" "}
                    {typeof product.price === "number"
                      ? product.price.toFixed(2)
                      : product.price}
                  </span>
                  {product.discount && (
                    <span className="ml-2 text-gray-500 line-through">
                      Rs.{" "}
                      {typeof product.price === "number"
                        ? (
                            product.price *
                            (1 + product.discount / 100)
                          ).toFixed(2)
                        : product.price}
                    </span>
                  )}
                  {product.discount && (
                    <span className="ml-2 text-sm font-medium px-2 py-0.5 bg-red-100 text-red-700 rounded">
                      {product.discount}% OFF
                    </span>
                  )}
                </div>

                {/* Stock information */}
                <div className="flex items-center space-x-2 mb-6">
                  <div
                    className={`h-3 w-3 rounded-full ${
                      product.stock > 10
                        ? "bg-green-500"
                        : product.stock > 0
                        ? "bg-yellow-500"
                        : "bg-red-500"
                    }`}
                  ></div>
                  <span className="text-sm text-gray-600">
                    {product.stock > 10
                      ? "In Stock"
                      : product.stock > 0
                      ? `Only ${product.stock} left`
                      : "Out of Stock"}
                  </span>
                </div>

                {/* Short Description */}
                <p className="text-gray-600 mb-6">{product.description}</p>

                {/* Quantity Selector */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quantity
                  </label>
                  <div className="flex items-center">
                    <button
                      onClick={() => handleQuantityChange(quantity - 1)}
                      className="p-2 border border-gray-300 rounded-l-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
                      disabled={quantity <= 1}
                    >
                      <Minus size={16} />
                    </button>
                    <input
                      type="number"
                      min="1"
                      max={product.stock}
                      value={quantity}
                      onChange={(e) =>
                        handleQuantityChange(parseInt(e.target.value))
                      }
                      className="w-16 text-center border-t border-b border-gray-300 py-2 focus:outline-none"
                    />
                    <button
                      onClick={() => handleQuantityChange(quantity + 1)}
                      className="p-2 border border-gray-300 rounded-r-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
                      disabled={product.stock <= quantity}
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 mb-6">
                  <button
                    onClick={handleAddToCart}
                    disabled={product.stock <= 0}
                    className={`flex-1 px-6 py-3 flex items-center justify-center gap-2 rounded-lg font-medium ${
                      product.stock > 0
                        ? product.is_poisonous
                          ? "bg-amber-500 text-white hover:bg-amber-600 transition-colors"
                          : "bg-[#004D40] text-white hover:bg-[#00695c] transition-colors"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    <ShoppingCart size={18} />
                    Add to Cart
                  </button>

                  <button
                    onClick={handleBuyNow}
                    disabled={product.stock <= 0}
                    className={`flex-1 px-6 py-3 rounded-lg font-medium ${
                      product.stock > 0
                        ? "bg-[#55DD4A] text-white hover:bg-[#45cc3a] transition-colors"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    Buy Now
                  </button>
                </div>

                {/* Product Benefits */}
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="font-medium text-gray-800 mb-2">
                    Product Benefits
                  </h3>
                  <ul className="space-y-2">
                    {productBenefits.map((benefit, index) => (
                      <li key={index} className="flex items-start">
                        <span className="mr-2 mt-0.5">{benefit.icon}</span>
                        <span className="text-gray-600">{benefit.text}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Tabs Section */}
            <div className="border-t border-gray-200">
              <div className="flex border-b border-gray-200">
                <button
                  onClick={() => setActiveTab("description")}
                  className={`px-6 py-3 text-sm font-medium ${
                    activeTab === "description"
                      ? "border-b-2 border-[#55DD4A] text-[#004D40]"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Description
                </button>
                <button
                  onClick={() => setActiveTab("details")}
                  className={`px-6 py-3 text-sm font-medium ${
                    activeTab === "details"
                      ? "border-b-2 border-[#55DD4A] text-[#004D40]"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Details
                </button>
                <button
                  onClick={() => setActiveTab("reviews")}
                  className={`px-6 py-3 text-sm font-medium ${
                    activeTab === "reviews"
                      ? "border-b-2 border-[#55DD4A] text-[#004D40]"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Reviews
                </button>
              </div>

              <div className="p-6">
                {activeTab === "description" && (
                  <div>
                    <h3 className="text-lg font-medium text-gray-800 mb-4">
                      Product Description
                    </h3>
                    <p className="text-gray-600 whitespace-pre-line">
                      {product.description ||
                        "No detailed description available for this product."}
                    </p>

                    {/* Additional poisonous information in description tab */}
                    {product.is_poisonous && (
                      <div className="mt-8 bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <h4 className="font-medium text-amber-700 flex items-center mb-2">
                          <AlertTriangle size={18} className="mr-2" />
                          Safety Information
                        </h4>
                        <p className="text-gray-700">
                          This medication contains compounds that can be toxic
                          to animals if improperly administered. Always follow
                          veterinarian instructions for dosage and
                          administration. Keep out of reach of children and
                          store in a secure location. Do not use if safety seal
                          is broken or missing.
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === "details" && (
                  <div>
                    <h3 className="text-lg font-medium text-gray-800 mb-4">
                      Product Details
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium text-gray-700 mb-2">
                          Specifications
                        </h4>
                        <ul className="space-y-2">
                          <li className="flex justify-between border-b border-gray-100 pb-2">
                            <span className="text-gray-500">Category</span>
                            <span className="font-medium capitalize">
                              {product.category || "General"}
                            </span>
                          </li>
                          <li className="flex justify-between border-b border-gray-100 pb-2">
                            <span className="text-gray-500">Stock</span>
                            <span className="font-medium">{product.stock}</span>
                          </li>
                          <li className="flex justify-between border-b border-gray-100 pb-2">
                            <span className="text-gray-500">SKU</span>
                            <span className="font-medium">
                              {product.sku || `PRD-${product.id}`}
                            </span>
                          </li>
                          <li className="flex justify-between border-b border-gray-100 pb-2">
                            <span className="text-gray-500">
                              Potentially Harmful
                            </span>
                            <span
                              className={`font-medium ${
                                product.is_poisonous
                                  ? "text-amber-600"
                                  : "text-green-600"
                              }`}
                            >
                              {product.is_poisonous
                                ? "Yes - Use with Caution"
                                : "No"}
                            </span>
                          </li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-700 mb-2">
                          Additional Information
                        </h4>
                        <p className="text-gray-600">
                          For more information about this product, please
                          contact our customer support team.
                        </p>

                        {/* Veterinarian approval note */}
                        {product.is_poisonous && (
                          <div className="mt-4 p-3 border border-amber-200 rounded-md bg-amber-50">
                            <p className="text-amber-800 text-sm">
                              <strong>
                                Veterinarian Prescription Required:
                              </strong>{" "}
                              This product should only be used under the
                              guidance and prescription of a licensed
                              veterinarian.
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "reviews" && (
                  <div>
                    <h3 className="text-lg font-medium text-gray-800 mb-4">
                      Customer Reviews
                    </h3>
                    <div className="flex items-center mb-6">
                      <div className="mr-4">
                        <div className="text-3xl font-bold text-gray-800">
                          {product.rating || "4.0"}
                        </div>
                        <div className="flex mt-1">
                          {renderRating(product.rating || 4)}
                        </div>
                        <div className="text-sm text-gray-500 mt-1">
                          Based on {product.rating_count || "42"} reviews
                        </div>
                      </div>
                      <div className="flex-1">
                        {/* Review distribution bars - mocked data */}
                        {[5, 4, 3, 2, 1].map((star) => (
                          <div key={star} className="flex items-center mb-1">
                            <div className="text-sm text-gray-500 w-6">
                              {star}
                            </div>
                            <Star
                              size={14}
                              className="mr-2 text-yellow-400"
                              fill="currentColor"
                            />
                            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-yellow-400 rounded-full"
                                style={{
                                  width: `${
                                    star === 5
                                      ? "70%"
                                      : star === 4
                                      ? "20%"
                                      : star === 3
                                      ? "5%"
                                      : star === 2
                                      ? "3%"
                                      : "2%"
                                  }`,
                                }}
                              ></div>
                            </div>
                            <div className="text-sm text-gray-500 ml-2 w-8">
                              {star === 5
                                ? "70%"
                                : star === 4
                                ? "20%"
                                : star === 3
                                ? "5%"
                                : star === 2
                                ? "3%"
                                : "2%"}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Sample Reviews - would be dynamic in a real implementation */}
                    <div className="border-t border-gray-200 pt-6">
                      <div className="mb-6">
                        <div className="flex items-center mb-2">
                          <div className="mr-3">
                            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 font-medium">
                              JS
                            </div>
                          </div>
                          <div>
                            <div className="font-medium text-gray-800">
                              John S.
                            </div>
                            <div className="text-sm text-gray-500">
                              Verified Buyer
                            </div>
                          </div>
                        </div>
                        <div className="flex mb-2">{renderRating(5)}</div>
                        <div className="text-sm text-gray-500 mb-2">
                          Posted 2 weeks ago
                        </div>
                        <p className="text-gray-700">
                          Great product! My pet responded very well to the
                          medication. Delivery was also quick and packaging was
                          secure.
                        </p>
                      </div>

                      <div className="mb-6">
                        <div className="flex items-center mb-2">
                          <div className="mr-3">
                            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 font-medium">
                              AR
                            </div>
                          </div>
                          <div>
                            <div className="font-medium text-gray-800">
                              Amanda R.
                            </div>
                            <div className="text-sm text-gray-500">
                              Verified Buyer
                            </div>
                          </div>
                        </div>
                        <div className="flex mb-2">{renderRating(4)}</div>
                        <div className="text-sm text-gray-500 mb-2">
                          Posted 1 month ago
                        </div>
                        <p className="text-gray-700">
                          The product works as expected. My only complaint is
                          that the dosage instructions could be clearer.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div className="mt-12">
              <h2 className="text-2xl font-bold text-[#55DD4A] mb-6">
                Related Products
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedProducts.map((relatedProduct) => (
                  <div
                    key={relatedProduct.id}
                    onClick={() => navigate(`/product/${relatedProduct.id}`)}
                    className="bg-white rounded-xl overflow-hidden shadow-sm transition-all duration-300 hover:shadow-lg cursor-pointer flex flex-col h-full"
                  >
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={
                          relatedProduct.images ||
                          "https://via.placeholder.com/300"
                        }
                        alt={relatedProduct.title}
                        className="w-full h-full object-cover"
                      />

                      {/* Show poisonous badge for related products too */}
                      {relatedProduct.is_poisonous && (
                        <div className="absolute top-2 left-2 bg-amber-500 text-white px-2 py-1 rounded-md flex items-center text-xs">
                          <AlertTriangle size={12} className="mr-1" />
                          Caution
                        </div>
                      )}
                    </div>

                    <div className="p-4 flex-grow flex flex-col">
                      <h3 className="text-lg font-semibold text-gray-800 mb-1 line-clamp-1">
                        {relatedProduct.title}
                      </h3>

                      <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-grow">
                        {relatedProduct.description}
                      </p>

                      {/* Poisonous warning tag for related products */}
                      {relatedProduct.is_poisonous && (
                        <div className="mb-2 text-xs bg-amber-50 border border-amber-200 rounded p-1 text-amber-700 flex items-center">
                          <AlertTriangle size={10} className="mr-1" />
                          <span>Use with veterinarian guidance</span>
                        </div>
                      )}

                      <div className="mt-auto">
                        <div className="text-[#004D40] font-bold">
                          Rs.{" "}
                          {typeof relatedProduct.price === "number"
                            ? relatedProduct.price.toFixed(2)
                            : relatedProduct.price}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ProductDetails;
