import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import axios from "axios";
import { addToCart } from "../redux/cartSlice";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import Breadcrumbs from "../Components/BreadCrumbs";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [quantity, setQuantity] = useState(1);
  const dispatch = useDispatch();

  const breadcrumbItems = [
    { label: "Home", path: "/" },
    { label: "Pharmacy", path: "/pharmacy" },
    { label: "Product Details", path: `/product/${id}` },
  ];

  useEffect(() => {
    axios
      .get(`http://127.0.0.1:8000/api/products/${id}/`)
      .then((response) => {
        setProduct(response.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to fetch product details.");
        setLoading(false);
      });
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      const productToAdd = { ...product, quantity };
      dispatch(addToCart(productToAdd));
      
      toast.success(`${quantity} ${product.title}${quantity > 1 ? 's' : ''} added to cart!`, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        style: {
          background: '#004D40',
          color: 'white'
        }
      });
    }
  };

  return (
    <>
      <Navbar />
      <div className="bg-[#004D40] min-h-screen relative overflow-hidden text-center pt-16 font-bold">
        <Breadcrumbs items={breadcrumbItems} />
        <div className="container mx-auto px-4 py-10">
          {loading ? (
            <p className="text-white">Loading product details...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : product ? (
            <div className="bg-white rounded-lg shadow-lg p-6 max-w-4xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <img
                    src={product.images}
                    alt={product.title}
                    className="w-full h-96 object-cover rounded-lg"
                  />
                  <div className="flex justify-center space-x-4">
                    {/* Additional product images could go here */}
                  </div>
                </div>
                
                <div className="text-left space-y-6">
                  <h1 className="text-3xl font-bold text-gray-800">{product.title}</h1>
                  <p className="text-gray-600">{product.description}</p>
                  
                  <div className="space-y-4">
                    <p className="text-2xl font-bold text-gray-800">
                      ${product.price}
                    </p>
                    <p className="text-gray-600">
                      Stock Available: {product.stock}
                    </p>
                    
                    <div className="flex items-center space-x-4">
                      <label className="text-gray-700 ">Quantity:</label>
                      <select
                        value={quantity}
                        onChange={(e) => setQuantity(Number(e.target.value))}
                        className="border rounded-md cursor-pointer px-3 py-2"
                      >
                        {[...Array(Math.min(10, product.stock))].map((_, i) => (
                          <option key={i + 1} value={i + 1}>
                            {i + 1}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <button
                      onClick={handleAddToCart}
                      disabled={!product.stock}
                      className={`w-full py-3 rounded-lg transition duration-300 ${
                        product.stock
                          ? "bg-[#55DD4A] hover:bg-green-600 text-white"
                          : "bg-gray-300 cursor-not-allowed text-gray-500"
                      }`}
                    >
                      {product.stock ? "Add to Cart" : "Out of Stock"}
                    </button>
                  </div>
                  
                  <div className="border-t pt-6 mt-6">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Product Details</h2>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-white">Product not found.</p>
          )}
        </div>
        <ToastContainer />
      </div>
    </>
  );
};

export default ProductDetails;