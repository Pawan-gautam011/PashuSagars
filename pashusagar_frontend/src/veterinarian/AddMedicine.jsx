import React, { useState, useEffect } from "react";
import axios from "axios";
import { Upload, IndianRupee, Package, ListPlus, FileText } from "lucide-react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AddMedicine = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [productImage, setProductImage] = useState(null);
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/categories/");
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
        toast.error("Failed to load categories");
      }
    };
    fetchCategories();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setProductImage(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
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
      toast.success("Medicine added successfully!");
      setTitle("");
      setDescription("");
      setPrice("");
      setStock("");
      setProductImage(null);
      setCategory("");
      setImagePreview(null);
    } catch (error) {
      console.error("Error adding product:", error);
      toast.error("Failed to add medicine. Please try again.");
    }
  };

  return (
    <div className="bg-gradient-to-b from-[#00574B] to-[#009366] min-h-screen flex justify-center items-center p-4">
      <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-[#00574B] mb-6">Add Medicine</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium text-gray-700">
              Medicine Name
            </label>
            <div className="relative">
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter medicine name"
                className="w-full p-3 border border-gray-300 rounded-lg pl-10 focus:outline-none focus:ring-2 focus:ring-[#009366]"
                required
              />
              <FileText className="absolute left-3 top-3 text-gray-400" size={20} />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium text-gray-700">
              Description
            </label>
            <div className="relative">
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter description"
                className="w-full p-3 border border-gray-300 rounded-lg pl-10 focus:outline-none focus:ring-2 focus:ring-[#009366]"
                required
                rows={4}
              ></textarea>
              <ListPlus className="absolute left-3 top-3 text-gray-400" size={20} />
            </div>
          </div>

          <div className="flex space-x-4">
            <div className="flex-1 space-y-2">
              <label htmlFor="price" className="text-sm font-medium text-gray-700">
                Price (Rs.)
              </label>
              <div className="relative">
                <input
                  type="number"
                  id="price"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="Price"
                  className="w-full p-3 border border-gray-300 rounded-lg pl-10 focus:outline-none focus:ring-2 focus:ring-[#009366]"
                  required
                />
                <IndianRupee className="absolute left-3 top-3 text-gray-400" size={20} />
              </div>
            </div>
            <div className="flex-1 space-y-2">
              <label htmlFor="stock" className="text-sm font-medium text-gray-700">
                Stock
              </label>
              <div className="relative">
                <input
                  type="number"
                  id="stock"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  placeholder="Stock"
                  className="w-full p-3 border border-gray-300 rounded-lg pl-10 focus:outline-none focus:ring-2 focus:ring-[#009366]"
                  required
                />
                <Package className="absolute left-3 top-3 text-gray-400" size={20} />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="category" className="text-sm font-medium text-gray-700">
              Category
            </label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009366]"
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

          <div className="space-y-2">
            <label htmlFor="image" className="text-sm font-medium text-gray-700">
              Product Image
            </label>
            <div className="relative">
              <input type="file" id="image" onChange={handleImageChange} className="hidden" accept="image/*" required />
              <label
                htmlFor="image"
                className="w-full p-3 border border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-50"
              >
                <Upload className="mr-2" size={20} />
                {productImage ? "Change Image" : "Upload Image"}
              </label>
            </div>
            {imagePreview && (
              <div className="mt-2">
                <img src={imagePreview} alt="Preview" className="max-w-full h-auto rounded-lg" />
              </div>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-[#009366] text-white p-3 rounded-lg hover:bg-[#00574B] transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#009366]"
          >
            Add Medicine
          </button>
        </form>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </div>
  );
};

export default AddMedicine;