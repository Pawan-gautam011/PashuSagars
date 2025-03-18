import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addToCart } from "../redux/cartSlice";
import { fetchMedicines } from "../redux/medicineSlice";
import Navbar from "../Components/Navbar";
import Breadcrumbs from "../Components/BreadCrumbs";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Pharmacy = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items: products, status, error } = useSelector((state) => state.medicines);

  const breadcrumbItems = [
    { label: "Home", path: "/" },
    { label: "Pharmacy", path: "/pharmacy" },
  ];

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchMedicines());
    }
  }, [status, dispatch]);

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
            Pharmacy
          </h2>
          <p className="mt-6 text-[#ADE1B0] text-lg md:text-xl max-w-3xl mx-auto">
            Explore the Pharmacy products you want for your animals.
          </p>
          <div className="h-px bg-gradient-to-r from-transparent via-[#ADE1B0] to-transparent my-8" />
        </div>

        <div className="max-w-7xl mx-auto pb-16">
          {status === "loading" ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#55DD4A]" />
            </div>
          ) : status === "failed" ? (
            <div className="text-red-400 text-center p-4 bg-red-900 bg-opacity-20 rounded-lg">
              {error}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((product) => (
                <div
                  key={product.id}
                  onClick={() => handleProductClick(product.id)}
                  className="bg-white bg-opacity-95 rounded-xl shadow-xl  hover:shadow-2xl"
                >
                  <div className="relative overflow-hidden rounded-t-xl cursor-pointer">
                    <img
                      src={product.images || "/placeholder.svg"}
                      alt={product.title}
                      className="w-full h-56 object-cover "
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
    </div>
  );
};

export default Pharmacy;