"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { Edit, Trash2, X } from "lucide-react"
import EditMedicineForm from "./EditMedicineForm"

const MedicineList = () => {
  const [medicines, setMedicines] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [editingMedicine, setEditingMedicine] = useState(null)

  useEffect(() => {
    fetchMedicines()
  }, [])

  const fetchMedicines = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/products/")
      setMedicines(response.data)
      setLoading(false)
    } catch (err) {
      console.error("Error fetching medicines:", err)
      setError("Failed to fetch medicines.")
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this medicine?")) {
      try {
        const response = await axios.delete(`http://127.0.0.1:8000/api/products/${id}/`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })

        if (response.status === 204) {
          setMedicines(medicines.filter((medicine) => medicine.id !== id))
          console.log("Medicine deleted successfully")
        } else {
          throw new Error(`Unexpected response status: ${response.status}`)
        }
      } catch (err) {
        console.error("Error deleting medicine:", err)
        if (err.response) {
          console.error("Error response data:", err.response.data)
          console.error("Error response status:", err.response.status)
          console.error("Error response headers:", err.response.headers)
          setError(
            `Failed to delete medicine. Server responded with: ${err.response.status} ${err.response.statusText}`,
          )
        } else if (err.request) {
          console.error("No response received:", err.request)
          setError("Failed to delete medicine. No response received from server.")
        } else {
          console.error("Error setting up request:", err.message)
          setError(`Failed to delete medicine. Error: ${err.message}`)
        }
      }
    }
  }

  const handleEdit = (medicine) => {
    setEditingMedicine(medicine)
  }

  const handleUpdate = async (updatedMedicine) => {
    try {
      const response = await axios.put(
        `http://127.0.0.1:8000/api/products/${updatedMedicine.get("id")}/`,
        updatedMedicine,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data",
          },
        },
      )

      if (response.status === 200) {
        setMedicines(medicines.map((med) => (med.id === response.data.id ? response.data : med)))
        setEditingMedicine(null)
        console.log("Medicine updated successfully")
      } else {
        throw new Error(`Unexpected response status: ${response.status}`)
      }
    } catch (err) {
      console.error("Error updating medicine:", err)
      setError(`Failed to update medicine. Error: ${err.message}`)
    }
  }

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-green-900"></div>
      </div>
    )
  if (error) return <div className="text-red-500 text-center text-xl mt-10">{error}</div>

  return (
    <div className="container mx-auto px-4 py-8 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">Medicine List</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {medicines.map((medicine) => (
          <div
            key={medicine.id}
            className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl"
          >
            <img
              src={medicine.images || "/placeholder.svg"}
              alt={medicine.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2 text-gray-800">{medicine.title}</h3>
              {/* Category section */}
              {medicine.category && (
                <p className="text-sm text-gray-600 mb-2">
                  Category: {medicine.category.name}
                </p>
              )}
              <p className="text-gray-600 mb-4 line-clamp-2">{medicine.description}</p>
              <div className="flex justify-between items-center mb-4">
                <p className="text-xl font-bold text-green-600">Rs. {medicine.price}</p>
                <p className="text-sm text-gray-500">Stock: {medicine.stock}</p>
              </div>
              <div className="flex justify-between">
                <button
                  onClick={() => handleEdit(medicine)}
                  className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300 flex items-center"
                >
                  <Edit size={18} className="mr-2" /> Edit
                </button>
                <button
                  onClick={() => handleDelete(medicine.id)}
                  className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition duration-300 flex items-center"
                >
                  <Trash2 size={18} className="mr-2" /> Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {editingMedicine && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-semibold text-gray-800">Edit Medicine</h3>
              <button onClick={() => setEditingMedicine(null)} className="text-gray-500 hover:text-gray-700">
                <X size={24} />
              </button>
            </div>
            {editingMedicine && (
              <EditMedicineForm
                medicine={editingMedicine}
                onUpdate={handleUpdate}
                onCancel={() => setEditingMedicine(null)}
              />
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default MedicineList
