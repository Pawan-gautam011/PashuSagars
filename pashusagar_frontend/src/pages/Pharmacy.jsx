import React, { useState, useEffect } from "react";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import Breadcrumbs from "../Components/BreadCrumbs";
import axios from "axios";

const Pharmacy = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
                  className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition duration-300"
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
                    <button className="mt-4 bg-[#55DD4A] text-white px-4 py-2 rounded hover:bg-green-600">
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <Footer />
      </div>
    </>
  );
};

export default Pharmacy;