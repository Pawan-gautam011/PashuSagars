import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/cartSlice";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import Breadcrumbs from "../Components/BreadCrumbs";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const SearchProduct = () => {
  const query = useQuery().get("query") || "";
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const breadcrumbItems = [
    { label: "Home", path: "/" },
    { label: "Search", path: "/search" },
  ];

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/products/search/", {
          params: { q: query },
        });
        setResults(response.data);
      } catch (err) {
        console.error(err);
        setError("Error searching products.");
      } finally {
        setLoading(false);
      }
    };

    if (query) {
      fetchResults();
    } else {
      setResults([]);
    }
  }, [query]);

  const handleAddToCart = (e, product) => {
    e.stopPropagation();
    const productToAdd = {
      id: product.id,
      name: product.title,
      price: product.price,
      description: product.description,
      quantity: 1,
      images: product.images,
    };
    dispatch(addToCart(productToAdd));

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
  };

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#004D40] to-[#00695C]">
      <Navbar />
      <div className="pt-16 px-4 md:px-6 lg:px-8">
        <Breadcrumbs items={breadcrumbItems} />
        
        <div className="max-w-7xl mx-auto text-center py-12">
          <h2 className="text-[#55DD4A] text-4xl md:text-6xl font-bold animate-fade-in">
            Search Results
          </h2>
          <p className="mt-6 text-[#ADE1B0] text-lg md:text-xl max-w-3xl mx-auto">
            {query ? `Showing results for "${query}"` : "Enter a search term to find products"}
          </p>
          <div className="h-px bg-gradient-to-r from-transparent via-[#ADE1B0] to-transparent my-8" />
        </div>

        <div className="max-w-7xl mx-auto pb-16">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#55DD4A]" />
            </div>
          ) : error ? (
            <div className="text-red-400 text-center p-4 bg-red-900 bg-opacity-20 rounded-lg">
              {error}
            </div>
          ) : results.length === 0 ? (
            <div className="text-[#ADE1B0] text-center p-4 bg-[#004D40] bg-opacity-20 rounded-lg">
              No products found matching your search.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {results.map((product) => (
                <div
                  key={product.id}
                  onClick={() => handleProductClick(product.id)}
                  className="bg-white bg-opacity-95 rounded-xl shadow-xl hover:shadow-2xl"
                >
                  <div className="relative overflow-hidden rounded-t-xl cursor-pointer">
                    <img
                      src={product.images.startsWith("http")
                        ? product.images
                        : `http://127.0.0.1:8000${product.images}`
                      }
                      alt={product.title}
                      className="w-full h-56 object-cover"
                    />
                  </div>
                  <div className="p-6 cursor-pointer">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                      {product.title}
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                      {product.description}
                    </p>
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-lg font-semibold text-[#004D40]">
                        Rs. {product.price}
                      </span>
                      <span className="text-sm text-gray-500">
                        Stock: {product.stock}
                      </span>
                    </div>
                    <button
                      onClick={(e) => handleAddToCart(e, product)}
                      className="w-full bg-[#55DD4A] text-white py-3 px-4 rounded-lg font-medium 
                        transition-all duration-300 hover:bg-[#004D40] 
                        focus:outline-none focus:ring-2 focus:ring-[#55DD4A] focus:ring-opacity-50
                        transform hover:-translate-y-1"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <ToastContainer />
      <Footer />
    </div>
  );
};

export default SearchProduct;