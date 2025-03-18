import { useState, useEffect } from "react"
import axios from "axios"
import { Upload, AlertTriangle } from "lucide-react"

const EditMedicineForm = ({ medicine, onUpdate, onCancel }) => {
  const [formData, setFormData] = useState({
    id: medicine?.id || "",
    title: medicine?.title || "",
    description: medicine?.description || "",
    price: medicine?.price || "",
    stock: medicine?.stock || "",
    images: medicine?.images || "",
    category: medicine?.category?.id || "",
  })
  const [imagePreview, setImagePreview] = useState(medicine?.images || "")
  const [newImage, setNewImage] = useState(null)
  const [errors, setErrors] = useState({})
  const [submitError, setSubmitError] = useState(null)
  const [categories, setCategories] = useState([])
  const [loadingCategories, setLoadingCategories] = useState(true)

  // Update formData when medicine prop changes
  useEffect(() => {
    if (medicine) {
      setFormData({
        id: medicine.id || "",
        title: medicine.title || "",
        description: medicine.description || "",
        price: medicine.price || "",
        stock: medicine.stock || "",
        images: medicine.images || "",
        category: medicine.category?.id || "",
      })
      setImagePreview(medicine.images || "")
    }
  }, [medicine])

  // Fetch available categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/categories/")
        setCategories(response.data)
      } catch (err) {
        console.error("Error fetching categories:", err)
      } finally {
        setLoadingCategories(false)
      }
    }
    fetchCategories()
  }, [])

  const validateForm = () => {
    const newErrors = {}

    if (!formData.title.trim()) {
      newErrors.title = "Title is required"
    }
    if (!formData.description.trim()) {
      newErrors.description = "Description is required"
    }
    if (!formData.price || Number.parseFloat(formData.price) <= 0) {
      newErrors.price = "Valid price is required"
    }
    if (!formData.stock || Number.parseInt(formData.stock) < 0) {
      newErrors.stock = "Valid stock quantity is required"
    }
    if (!formData.category) {
      newErrors.category = "Category is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Validate image size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          images: "Image must be smaller than 5MB",
        }))
        return
      }
      // Validate image type
      const validTypes = ["image/jpeg", "image/png", "image/gif"]
      if (!validTypes.includes(file.type)) {
        setErrors((prev) => ({
          ...prev,
          images: "Only JPEG, PNG, and GIF images are allowed",
        }))
        return
      }

      setNewImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitError(null)

    if (!validateForm()) {
      return
    }

    try {
      const updatedData = new FormData()
      Object.keys(formData).forEach((key) => {
        if (key !== "images") {
          updatedData.append(key, formData[key])
        }
      })

      if (newImage) {
        updatedData.append("images", newImage)
      }

      await onUpdate(updatedData)
    } catch (error) {
      console.error("Update failed:", error)
      setSubmitError(
        error.response?.data?.message ||
          "Failed to update medicine. Please try again."
      )
    }
  }

  if (!medicine) {
    return <div className="text-center py-4">Loading...</div>
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 overflow-hidden">
      {submitError && (
        <div
          className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded-md flex items-center"
          role="alert"
        >
          <AlertTriangle className="inline-block mr-2" />
          <span>{submitError}</span>
        </div>
      )}

      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Title
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 ${
            errors.title
              ? "border-red-300 focus:border-red-500 focus:ring-red-500"
              : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
          }`}
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-600">{errors.title}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Description
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={3}
          className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 ${
            errors.description
              ? "border-red-300 focus:border-red-500 focus:ring-red-500"
              : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
          }`}
        ></textarea>
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">{errors.description}</p>
        )}
      </div>

      <div className="flex gap-4">
        <div className="flex-1">
          <label
            htmlFor="price"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Price
          </label>
          <input
            type="number"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 ${
              errors.price
                ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            }`}
          />
          {errors.price && (
            <p className="mt-1 text-sm text-red-600">{errors.price}</p>
          )}
        </div>

        <div className="flex-1">
          <label
            htmlFor="stock"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Stock
          </label>
          <input
            type="number"
            id="stock"
            name="stock"
            value={formData.stock}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 ${
              errors.stock
                ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            }`}
          />
          {errors.stock && (
            <p className="mt-1 text-sm text-red-600">{errors.stock}</p>
          )}
        </div>
      </div>

      {/* Category Dropdown */}
      <div>
        <label
          htmlFor="category"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Category
        </label>
        {loadingCategories ? (
          <p>Loading categories...</p>
        ) : (
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 ${
              errors.category
                ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            }`}
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        )}
        {errors.category && (
          <p className="mt-1 text-sm text-red-600">{errors.category}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="image"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Product Image
        </label>
        <div className="mt-1 flex items-center">
          <span className="inline-block h-20 w-20 rounded-md overflow-hidden bg-gray-100">
            {imagePreview && (
              <img
                src={imagePreview || "/placeholder.svg"}
                alt="Preview"
                className="h-full w-full object-cover"
              />
            )}
          </span>
          <label
            htmlFor="image-upload"
            className="ml-5 bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer"
          >
            <Upload className="h-5 w-5 inline-block mr-2" />
            Change
          </label>
          <input
            id="image-upload"
            name="image-upload"
            type="file"
            className="sr-only"
            onChange={handleImageChange}
            accept="image/jpeg,image/png,image/gif"
          />
        </div>
        {errors.images && (
          <p className="mt-1 text-sm text-red-600">{errors.images}</p>
        )}
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Update
        </button>
      </div>
    </form>
  )
}

export default EditMedicineForm
