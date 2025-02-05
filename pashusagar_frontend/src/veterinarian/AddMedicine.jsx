import React, { useState } from "react";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import Breadcrumbs from "../Components/BreadCrumbs";

const AddMedicine = () => {
  const [productName, setProductName] = useState("");
  const [description, setDescription] = useState("");
  const [originalPrice, setOriginalPrice] = useState("");
  const [discountPrice, setDiscountPrice] = useState("");
  const [stock, setStock] = useState("");
  const [productImage, setProductImage] = useState(null);

  const breadcrumbItems = [
    { label: "Home", path: "/veterinarian" },
    { label: "Add Product", path: "/add-product" },
  ];

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setProductImage(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("productName", productName);
    formData.append("description", description);
    formData.append("originalPrice", originalPrice);
    formData.append("discountPrice", discountPrice);
    formData.append("stock", stock);
    formData.append("productImage", productImage);

    console.log("Form Data:", {
      productName,
      description,
      originalPrice,
      discountPrice,
      stock,
      productImage,
    });

    // Example: Send formData to an API using axios
    // axios.post("http://127.0.0.1:8000/api/products/", formData)
    //   .then((response) => console.log("Product added:", response.data))
    //   .catch((error) => console.error("Error adding product:", error));
  };

  return (
    <>
      <Navbar />
      <div className="bg-[#004D40] min-h-screen relative overflow-hidden text-center pt-16 font-bold">
        <Breadcrumbs items={breadcrumbItems} />
        <h2 className="text-[#55DD4A] text-6xl">Add Product</h2>
        <h1 className="uppercase mt-9 text-xl text-[#ADE1B0]">
          Add a new product to the pharmacy.
        </h1>
        <hr className="mt-5 border-[#ADE1B0]" />

        <div className="container mx-auto px-4 py-10">
          <form onSubmit={handleSubmit} className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-lg">
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="productName">
                Product Name
              </label>
              <input
                type="text"
                id="productName"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                className="w-full p-2 border rounded"
                placeholder="Enter product name"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
                Description
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-2 border rounded"
                placeholder="Enter product description"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="originalPrice">
                Original Price
              </label>
              <input
                type="number"
                id="originalPrice"
                value={originalPrice}
                onChange={(e) => setOriginalPrice(e.target.value)}
                className="w-full p-2 border rounded"
                placeholder="Enter original price"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="discountPrice">
                Discount Price
              </label>
              <input
                type="number"
                id="discountPrice"
                value={discountPrice}
                onChange={(e) => setDiscountPrice(e.target.value)}
                className="w-full p-2 border rounded"
                placeholder="Enter discount price"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="stock">
                Stock
              </label>
              <input
                type="number"
                id="stock"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                className="w-full p-2 border rounded"
                placeholder="Enter stock quantity"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="productImage">
                Product Image
              </label>
              <input
                type="file"
                id="productImage"
                onChange={handleImageChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>

            <button
              type="submit"
              className="bg-[#55DD4A] text-white px-4 py-2 rounded hover:bg-green-600 w-full"
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