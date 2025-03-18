// src/pages/SearchProduct.jsx
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import Breadcrumbs from "../Components/BreadCrumbs";
import axios from "axios";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const SearchProduct = () => {
  const query = useQuery().get("query") || "";
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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

  return (
    <>
         <Navbar />
      <div className="bg-[#004D40] min-h-screen h-full relative overflow-hidden text-center pt-16 font-bold">
        <Breadcrumbs items={breadcrumbItems} />
        <hr className="mt-5 border-[#ADE1B0]" />
        <h1 className="text-[#55DD4A] text-2xl font-bold mb-4">Search Results</h1>
        {loading && <p>Loading...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {results.length === 0 && !loading ? (
          <p>No products found matching "{query}".</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {results.map((product) => (
              <div key={product.id} className="bg-white rounded shadow p-4">
                <img
                  src={
                    product.images.startsWith("http")
                      ? product.images
                      : `http://127.0.0.1:8000${product.images}`
                  }
                  alt={product.title}
                  className="w-full h-40 object-cover mb-2 rounded"
                />
                <h2 className="font-bold text-lg">{product.title}</h2>
                <p>{product.description}</p>
                <p className="font-semibold">Rs. {product.price}</p>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default SearchProduct;
