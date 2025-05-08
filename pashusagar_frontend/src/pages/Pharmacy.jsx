import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addToCart } from "../redux/cartSlice";
import { fetchMedicines } from "../redux/medicineSlice";
import { 
  ShoppingCart, 
  Search, 
  Filter, 
  ChevronDown, 
  Star, 
  Truck, 
  Clock, 
  ShieldCheck,
  Home,
  ChevronRight,
  AlertTriangle
} from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";


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

const Pharmacy = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items: products, status, error } = useSelector((state) => state.medicines);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [priceRange, setPriceRange] = useState({ min: 0, max: 10000 });
  const [sortOption, setSortOption] = useState("featured");
  const [showFilters, setShowFilters] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [poisonousFilter, setPoisonousFilter] = useState("all"); // 'all', 'only-poisonous', 'non-poisonous'
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);

  const breadcrumbItems = [
    { label: "Home", path: "/" },
    { label: "Pharmacy", path: "/pharmacy" },
  ];

  // Fetch medicines when component mounts
  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchMedicines());
    }
  }, [status, dispatch]);

  // Extract categories and set filtered products
  useEffect(() => {
    if (products?.length > 0) {
      // Extract unique categories
      const uniqueCategories = [...new Set(products.map(product => 
        product.category?.name || product.category || "Uncategorized"))];
      setCategories(["all", ...uniqueCategories]);
      
      // Apply filters
      applyFilters();
      
      // Mark initial load complete
      if (!initialLoadComplete) {
        setInitialLoadComplete(true);
      }
    } else if (status === "succeeded" && products?.length === 0) {
      // If products array is empty but loading succeeded, show empty state
      setFilteredProducts([]);
      setInitialLoadComplete(true);
    }
  }, [products, searchTerm, priceRange, sortOption, selectedCategory, poisonousFilter, status, initialLoadComplete]);

  const applyFilters = () => {
    if (!products || products.length === 0) return;
    
    let result = [...products];
    
    // Apply search filter
    if (searchTerm) {
      result = result.filter(product => 
        product.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply category filter
    if (selectedCategory && selectedCategory !== "all") {
      result = result.filter(product => 
        product.category === selectedCategory || 
        product.category?.name === selectedCategory
      );
    }
    
    // Apply price range filter
    result = result.filter(product => 
      product.price >= priceRange.min && product.price <= priceRange.max
    );
    
    // Apply poisonous filter
    if (poisonousFilter === "only-poisonous") {
      result = result.filter(product => product.is_poisonous === true);
    } else if (poisonousFilter === "non-poisonous") {
      result = result.filter(product => product.is_poisonous !== true);
    }
    
    // Apply sorting
    switch (sortOption) {
      case "price-low":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        result.sort((a, b) => b.price - a.price);
        break;
      case "popular":
        result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case "newest":
        result.sort((a, b) => {
          const dateA = a.created_at ? new Date(a.created_at) : new Date(0);
          const dateB = b.created_at ? new Date(b.created_at) : new Date(0);
          return dateB - dateA;
        });
        break;
      default:
        // Default "featured" sorting - no change to order
        break;
    }
    
    setFilteredProducts(result);
  };

  const handlePriceChange = (type, value) => {
    setPriceRange(prev => ({
      ...prev,
      [type]: parseInt(value) || 0
    }));
  };

  const handleAddToCart = (e, product) => {
    e.stopPropagation();
    
    const productToAdd = {
      id: product.id,
      title: product.title,
      price: product.price,
      description: product.description,
      quantity: 1,
      images: product.images,
      is_poisonous: product.is_poisonous // Pass the poisonous status to cart
    };
    
    dispatch(addToCart(productToAdd));

    // Show a warning toast if the product is poisonous
    if (product.is_poisonous) {
      toast.warning(`Warning: ${product.title} is potentially poisonous to animals. Use with veterinarian guidance only.`, {
        position: "top-right",
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
      });
    } else {
      // Regular success toast for non-poisonous products
      toast.success(`${product.title} added to cart!`, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        style: {
          background: "#004D40",
          color: "white",
        },
      });
    }
  };

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  const resetFilters = () => {
    setSearchTerm("");
    setPriceRange({ min: 0, max: 10000 });
    setSortOption("featured");
    setSelectedCategory("all");
    setPoisonousFilter("all");
  };

  // Render product rating stars
  const renderRating = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating || 0);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<Star key={i} fill="#FFD700" color="#FFD700" size={16} />);
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(
          <span key={i} className="relative">
            <Star fill="#FFD700" color="#FFD700" size={16} className="absolute" style={{ clipPath: 'inset(0 50% 0 0)' }} />
            <Star color="#FFD700" size={16} fill="none" />
          </span>
        );
      } else {
        stars.push(<Star key={i} color="#FFD700" size={16} fill="none" />);
      }
    }
    
    return <div className="flex">{stars}</div>;
  };

  // Helper function to check if products are actually loading or just empty
  const isLoading = status === "loading" || (status === "idle" && !initialLoadComplete);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-[#004D40] to-[#00695C] pt-16 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">

          {/* Enhanced Breadcrumbs */}
          <div className="container mx-auto">
            <EnhancedBreadcrumbs items={breadcrumbItems} />
          </div>
          
          {/* Hero Section */}
          {/* <div className="max-w-7xl mx-auto text-center py-8 md:py-12"> */}
            {/* <h1 className="text-[#55DD4A] text-4xl md:text-5xl font-bold mb-4 animate-fade-in">
              Veterinary Pharmacy
            </h1>
            <p className="mt-3 text-xl text-[#ADE1B0] max-w-3xl mx-auto">
              Explore quality medications and supplements for your animals' health and wellbeing.
            </p> */}
            
            {/* Key Benefits */}
            {/* <div className="flex flex-wrap justify-center gap-6 mt-8">
              <div className="flex items-center bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                <Truck size={18} className="text-[#55DD4A] mr-2" />
                <span className="text-sm text-white">Fast Delivery</span>
              </div>
              <div className="flex items-center bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                <ShieldCheck size={18} className="text-[#55DD4A] mr-2" />
                <span className="text-sm text-white">Quality Assured</span>
              </div>
              <div className="flex items-center bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                <Clock size={18} className="text-[#55DD4A] mr-2" />
                <span className="text-sm text-white">24/7 Support</span>
              </div>
            </div> */}
            {/* <h1 className="text-[#55DD4A] text-2xl md:text-2xl font-bold  animate-fade-in">
              Veterinary Pharmacy
            </h1> */}
            
            {/* <div className="h-px bg-gradient-to-r from-transparent via-[#ADE1B0] to-transparent my-8" />
          </div> */}

          <div className="max-w-7xl mx-auto pb-16">
            {/* Search and Filter Bar */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-2 mb-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-grow">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search products..."
                    className="w-full pl-10 pr-4 py-3 rounded-lg bg-white/10 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-[#55DD4A] focus:border-transparent"
                  />
                  <Search className="absolute left-3 top-3.5 text-white/60" size={18} />
                </div>
                
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="flex items-center gap-2 px-4 py-3 bg-white/10 border border-white/30 rounded-lg hover:bg-white/20 text-white transition-colors"
                  >
                    <Filter size={18} />
                    <span>Filters</span>
                    <ChevronDown size={16} className={`transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                  </button>
                  
                  <select
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value)}
                    className="px-4 py-3 bg-white/10 border border-white/30 text-white rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-[#55DD4A] focus:border-transparent cursor-pointer"
                  >
                    <option value="featured">Featured</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="popular">Most Popular</option>
                    <option value="newest">Newest</option>
                  </select>
                </div>
              </div>
              
              {/* Expanded Filters */}
              {showFilters && (
                <div className="mt-4 pt-4 border-t border-white/20">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Categories */}
                    <div>
                      <h3 className="font-medium text-[#ADE1B0] mb-2">Categories</h3>
                      <div className="space-y-2">
                        {categories.map((category) => (
                          <label key={category} className="flex items-center cursor-pointer">
                            <input
                              type="radio"
                              name="category"
                              checked={selectedCategory === category}
                              onChange={() => setSelectedCategory(category)}
                              className="w-4 h-4 text-[#55DD4A] focus:ring-[#55DD4A] cursor-pointer"
                            />
                            <span className="ml-2 text-white capitalize">
                              {category === "all" ? "All Categories" : category}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                    
                    {/* Price Range */}
                    <div>
                      <h3 className="font-medium text-[#ADE1B0] mb-2">Price Range</h3>
                      <div className="flex flex-col space-y-4">
                        <div className="flex items-center">
                          <span className="text-white mr-2">Min:</span>
                          <input
                            type="number"
                            min="0"
                            max={priceRange.max}
                            value={priceRange.min}
                            onChange={(e) => handlePriceChange('min', e.target.value)}
                            className="w-full px-3 py-2 bg-white/10 border border-white/30 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-[#55DD4A]"
                          />
                        </div>
                        <div className="flex items-center">
                          <span className="text-white mr-2">Max:</span>
                          <input
                            type="number"
                            min={priceRange.min}
                            value={priceRange.max}
                            onChange={(e) => handlePriceChange('max', e.target.value)}
                            className="w-full px-3 py-2 bg-white/10 border border-white/30 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-[#55DD4A]"
                          />
                        </div>
                      </div>
                    </div>
                    
                    {/* Poisonous Filter */}
                    <div>
                      <h3 className="font-medium text-[#ADE1B0] mb-2">Medication Safety</h3>
                      <div className="space-y-2">
                        <label className="flex items-center cursor-pointer">
                          <input
                            type="radio"
                            name="poisonousFilter"
                            checked={poisonousFilter === "all"}
                            onChange={() => setPoisonousFilter("all")}
                            className="w-4 h-4 text-[#55DD4A] focus:ring-[#55DD4A] cursor-pointer"
                          />
                          <span className="ml-2 text-white">All Medications</span>
                        </label>
                        <label className="flex items-center cursor-pointer">
                          <input
                            type="radio"
                            name="poisonousFilter"
                            checked={poisonousFilter === "non-poisonous"}
                            onChange={() => setPoisonousFilter("non-poisonous")}
                            className="w-4 h-4 text-[#55DD4A] focus:ring-[#55DD4A] cursor-pointer"
                          />
                          <span className="ml-2 text-white">Safe Medications Only</span>
                        </label>
                        <label className="flex items-center cursor-pointer">
                          <input
                            type="radio"
                            name="poisonousFilter"
                            checked={poisonousFilter === "only-poisonous"}
                            onChange={() => setPoisonousFilter("only-poisonous")}
                            className="w-4 h-4 text-[#55DD4A] focus:ring-[#55DD4A] cursor-pointer"
                          />
                          <span className="ml-2 text-white">
                            <span className="flex items-center">
                              Prescription Required
                              <AlertTriangle size={14} className="ml-1 text-amber-400" />
                            </span>
                          </span>
                        </label>
                      </div>
                    </div>
                    
                    {/* Reset Filters */}
                    <div className="flex items-end md:col-span-3">
                      <button
                        onClick={resetFilters}
                        className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
                      >
                        Reset Filters
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Product Grid Section */}
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#55DD4A]"></div>
              </div>
            ) : status === "failed" ? (
              <div className="text-white bg-red-500/20 border border-red-400/40 p-4 rounded-lg text-center">
                <p>{error || "Failed to load products. Please try again later."}</p>
                <button 
                  onClick={() => dispatch(fetchMedicines())}
                  className="mt-2 px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                >
                  Retry
                </button>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-8 text-center">
                <h3 className="text-xl font-medium text-[#ADE1B0] mb-2">No products found</h3>
                <p className="text-white/70 mb-4">
                  Try adjusting your filters or search term.
                </p>
                <button
                  onClick={resetFilters}
                  className="px-6 py-2 bg-[#55DD4A] text-white rounded-lg hover:bg-[#4BC940] transition-colors"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden shadow-lg 
                    hover:transform hover:scale-[1.02] transition-all duration-300 flex flex-col"
                    onClick={() => handleProductClick(product.id)}
                  >
                    <div className="relative h-48 overflow-hidden cursor-pointer">
                      <div className="absolute inset-0 bg-gradient-to-t from-[#003D30]/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-10"></div>
                      <img
                        src={product.images || "/placeholder.svg"}
                        alt={product.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      
                      {/* Poisonous badge */}
                      {product.is_poisonous && (
                        <div className="absolute top-2 left-2 bg-amber-500 text-white px-2 py-1 rounded-md flex items-center text-xs font-bold">
                          <AlertTriangle size={12} className="mr-1" />
                          Caution
                        </div>
                      )}
                      
                      {product.discount && (
                        <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                          {product.discount}% OFF
                        </div>
                      )}
                    </div>
                    
                    <div className="p-5 flex flex-col flex-grow justify-between">
                      <div>
                        <div className="mb-2 flex">
                          {product.rating && renderRating(product.rating)}
                        </div>
                        
                        <h3 className="text-[#ADE1B0] font-semibold text-lg line-clamp-1">
                          {product.title}
                        </h3>
                        
                        <p className="text-white/70 text-sm line-clamp-2 mt-1">
                          {product.description}
                        </p>
                        
                        {/* Poisonous warning message */}
                        {product.is_poisonous && (
                          <div className="mt-2 text-xs bg-amber-500/20 border border-amber-500/30 rounded p-1.5 text-amber-300 flex items-start">
                            <AlertTriangle size={12} className="mr-1 mt-0.5 flex-shrink-0" />
                            <span>Potentially poisonous to animals. Use with veterinarian guidance only.</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex justify-between items-center mt-4">
                        <div className="text-xl font-bold text-[#55DD4A]">
                          Rs. {typeof product.price === 'number' ? product.price.toFixed(2) : product.price}
                        </div>
                        
                        <div className="text-sm text-white/70">
                          Stock: {product.stock}
                        </div>
                      </div>
                      
                      <button
                        onClick={(e) => handleAddToCart(e, product)}
                        className={`mt-4 w-full py-2 rounded-lg font-medium flex items-center justify-center gap-2 ${
                          product.stock > 0 
                            ? product.is_poisonous
                              ? "bg-amber-500 text-white hover:bg-amber-600"
                              : "bg-[#55DD4A] text-white hover:bg-[#4BC940]"
                            : "bg-white/20 text-white/50 cursor-not-allowed"
                        } transition-colors`}
                        disabled={product.stock <= 0}
                      >
                        <ShoppingCart size={18} />
                        {product.stock > 0 ? "Add to Cart" : "Out of Stock"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <ToastContainer />
      <Footer />
    </>
  );
};

export default Pharmacy;