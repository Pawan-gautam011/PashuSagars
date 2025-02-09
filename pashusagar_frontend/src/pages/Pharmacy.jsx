import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { addToCart } from "../redux/cartSlice";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import Breadcrumbs from "../Components/BreadCrumbs";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Pharmacy = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const dispatch = useDispatch();

  const breadcrumbItems = [
    { label: "Home", path: "/" },
    { label: "Pharmacy", path: "/pharmacy" },
  ];

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/products/")
      .then((response) => {
        setProducts(response.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to fetch products.");
        setLoading(false);
      });
  }, []);

  const handleAddToCart = (product) => {
    const productToAdd = { ...product, quantity: 1 };
    dispatch(addToCart(productToAdd));
    setSelectedProduct(null);
    
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
        background: '#004D40',
        color: 'white'
      }
    });
  };

  return (
    <>
      <Navbar />
      <div className="bg-[#004D40] min-h-screen relative overflow-hidden text-center pt-16 font-bold">
        <Breadcrumbs items={breadcrumbItems} />
        <h2 className="text-[#55DD4A] text-6xl">Pharmacy</h2>
        <h1 className="uppercase mt-9 text-xl text-[#ADE1B0]">
          Explore the Pharmacy products you want for your animals.
        </h1>
        <hr className="mt-5 border-[#ADE1B0]" />

        <div className="container mx-auto px-4 py-10">
          {loading ? (
            <p className="text-white">Loading products...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <div
                  key={product.id}
                  onClick={() => setSelectedProduct(product)}
                  className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition duration-300 cursor-pointer"
                >
                  <img
                    src={product.images}
                    alt={product.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="text-lg font-bold text-gray-800">
                      {product.title}
                    </h3>
                    <p className="text-sm text-gray-600 mt-2">
                      {product.description}
                    </p>
                    <p className="text-sm text-gray-800 font-semibold mt-4">
                      Price: ${product.price}
                    </p>
                    <p className="text-sm text-gray-600">
                      Stock: {product.stock}
                    </p>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToCart(product);
                      }}
                      className="mt-4 bg-[#55DD4A] text-white px-4 py-2 rounded hover:bg-green-600 transition duration-300"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <Footer />

        {selectedProduct && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div
              className="absolute inset-0 bg-black opacity-50"
              onClick={() => setSelectedProduct(null)}
            ></div>
            <div className="bg-white rounded-lg p-6 z-10 max-w-lg w-full relative">
              <button
                onClick={() => setSelectedProduct(null)}
                className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
              >
                X
              </button>
              <img
                src={selectedProduct.images}
                alt={selectedProduct.title}
                className="w-full h-64 object-cover mb-4 rounded"
              />
              <h2 className="text-2xl font-bold mb-2">
                {selectedProduct.title}
              </h2>
              <p className="mb-2">{selectedProduct.description}</p>
              <p className="mb-2 font-semibold">
                Price: ${selectedProduct.price}
              </p>
              <p className="mb-4">Stock: {selectedProduct.stock}</p>
              <button
                onClick={() => handleAddToCart(selectedProduct)}
                className="bg-[#55DD4A] text-white px-4 py-2 rounded hover:bg-green-600 transition duration-300"
              >
                Add to Cart
              </button>
            </div>
          </div>
        )}
        <ToastContainer />
      </div>
    </>
  );
};

export default Pharmacy;