import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import Breadcrumbs from "../Components/BreadCrumbs";

const AddMedicine = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [productImage, setProductImage] = useState(null);
  const [category, setCategory] = useState(""); // Selected category id
  const [categories, setCategories] = useState([]); // List of available categories
  const [message, setMessage] = useState("");

  const breadcrumbItems = [
    { label: "Home", path: "/veterinarian" },
    { label: "Add Product", path: "/add-product" },
  ];

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/categories/");
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setProductImage(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("stock", stock);
    formData.append("category", category);
    if (productImage) {
      formData.append("images", productImage);
    }

    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      };
      await axios.post("http://127.0.0.1:8000/api/products/", formData, config);
      setMessage("Product added successfully!");
      setTitle("");
      setDescription("");
      setPrice("");
      setStock("");
      setProductImage(null);
      setCategory("");
    } catch (error) {
      console.error("Error adding product:", error);
      setMessage("Error adding product. Please try again.");
    }
  };

  return (
    <>
      <Navbar />
      <div className="bg-gray-900 min-h-screen relative overflow-hidden text-center pt-16 font-sans">
        <Breadcrumbs items={breadcrumbItems} />
        <h2 className="text-green-400 text-5xl font-bold tracking-wide">Add Product</h2>
        <h1 className="uppercase mt-4 text-xl text-gray-300 tracking-wider">
          Add a new product to the pharmacy.
        </h1>
        <hr className="mt-5 border-green-400 mx-auto w-24" />
        <div className="container mx-auto px-4 py-10">
          {message && (
            <div className="mb-4 text-lg text-center text-green-500">
              {message}
            </div>
          )}
          <form
            onSubmit={handleSubmit}
            className="max-w-lg mx-auto bg-gray-800 p-8 rounded-lg shadow-2xl"
          >
            {/* Product Name */}
            <div className="mb-4">
              <label htmlFor="title" className="block text-gray-300 text-sm font-medium mb-2">
                Product Name
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-3 border border-gray-600 bg-gray-700 text-white rounded focus:outline-none focus:border-green-400 transition duration-300"
                placeholder="Enter product name"
                required
              />
            </div>
            {/* Description */}
            <div className="mb-4">
              <label htmlFor="description" className="block text-gray-300 text-sm font-medium mb-2">
                Description
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-3 border border-gray-600 bg-gray-700 text-white rounded focus:outline-none focus:border-green-400 transition duration-300"
                placeholder="Enter product description"
                rows="4"
                required
              />
            </div>
            {/* Price */}
            <div className="mb-4">
              <label htmlFor="price" className="block text-gray-300 text-sm font-medium mb-2">
                Price
              </label>
              <input
                type="number"
                id="price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full p-3 border border-gray-600 bg-gray-700 text-white rounded focus:outline-none focus:border-green-400 transition duration-300"
                placeholder="Enter product price"
                required
              />
            </div>
            {/* Stock */}
            <div className="mb-4">
              <label htmlFor="stock" className="block text-gray-300 text-sm font-medium mb-2">
                Stock
              </label>
              <input
                type="number"
                id="stock"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                className="w-full p-3 border border-gray-600 bg-gray-700 text-white rounded focus:outline-none focus:border-green-400 transition duration-300"
                placeholder="Enter stock quantity"
                required
              />
            </div>
            {/* Category Dropdown */}
            <div className="mb-4">
              <label htmlFor="category" className="block text-gray-300 text-sm font-medium mb-2">
                Category
              </label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-3 border border-gray-600 bg-gray-700 text-white rounded focus:outline-none focus:border-green-400 transition duration-300"
                required
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
            {/* Product Image */}
            <div className="mb-4">
              <label htmlFor="productImage" className="block text-gray-300 text-sm font-medium mb-2">
                Product Image
              </label>
              <input
                type="file"
                id="productImage"
                onChange={handleImageChange}
                className="w-full p-3 border border-gray-600 bg-gray-700 text-white rounded focus:outline-none focus:border-green-400 transition duration-300"
                required
              />
            </div>
            <button
              type="submit"
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-medium transition duration-300 w-full"
            >
              Add Product
            </button>
          </form>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default AddMedicine;