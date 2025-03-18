"use client"

import { useState, useEffect } from "react"
import axios from "axios"

const UsersList = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  // Fetch users from API on component mount
  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await axios.get("http://127.0.0.1:8000/api/auth/users/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      setUsers(response.data)
      setLoading(false)
    } catch (err) {
      console.error("Error fetching users:", err)
      setError("Failed to fetch users.")
      setLoading(false)
    }
  }

  // Toggle the status between Active and Inactive for a given user
  const handleStatusToggle = (id) => {
    const updateUser = (userList) =>
      userList.map((user) =>
        user.id === id
          ? { ...user, status: user.status === "Active" ? "Inactive" : "Active" }
          : user
      )
    const updatedUsers = updateUser(users)
    setUsers(updatedUsers)
  }

  // Remove a user from the list by id
  const handleRemoveUser = (id) => {
    const removeUser = (userList) => userList.filter((user) => user.id !== id)
    const updatedUsers = removeUser(users)
    setUsers(updatedUsers)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-green-900"></div>
      </div>
    )
  }

  if (error) {
    return <div className="text-red-500 text-center text-xl mt-10">{error}</div>
  }

  // Group users by role
  const admins = users.filter(user => user.role === 0)
  const regularUsers = users.filter(user => user.role === 1)
  const veterinarians = users.filter(user => user.role === 2)

  // Helper function to render a table for a given group
  const renderUserTable = (title, userList) => (
    <div className="mb-8">
      <h3 className="text-2xl font-bold mb-4">{title}</h3>
      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="w-full">
          <thead className="bg-[#004d40] text-white">
            <tr>
              <th className="p-2 sm:p-3 text-left text-xs sm:text-sm">Name</th>
              <th className="p-2 sm:p-3 text-left text-xs sm:text-sm">Email</th>
              <th className="p-2 sm:p-3 text-left text-xs sm:text-sm">Status</th>
              <th className="p-2 sm:p-3 text-center text-xs sm:text-sm">Actions</th>
            </tr>
          </thead>
          <tbody>
            {userList.map((user) => (
              <tr key={user.id} className="border-b hover:bg-gray-100">
                <td className="p-2 sm:p-3 text-xs sm:text-sm">{user.name}</td>
                <td className="p-2 sm:p-3 text-xs sm:text-sm">{user.email}</td>
                <td className="p-2 sm:p-3">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      user.status === "Active"
                        ? "bg-green-200 text-green-800"
                        : "bg-red-200 text-red-800"
                    }`}
                  >
                    {user.status}
                  </span>
                </td>
                <td className="p-2 sm:p-3 text-center">
                  <button
                    onClick={() => handleStatusToggle(user.id)}
                    className="bg-[#55DD4A] text-white px-2 py-1 rounded text-xs sm:text-sm hover:bg-green-600 transition-colors mr-1 sm:mr-2"
                  >
                    {user.status === "Active" ? "Deactivate" : "Activate"}
                  </button>
                  <button
                    onClick={() => handleRemoveUser(user.id)}
                    className="bg-red-500 text-white px-2 py-1 rounded text-xs sm:text-sm hover:bg-red-600 transition-colors"
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto">
      <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold mb-6 text-center">
        Users Management
      </h2>
      {admins.length > 0 && renderUserTable("Admin List", admins)}
      {veterinarians.length > 0 && renderUserTable("Veterinarian List", veterinarians)}
      {regularUsers.length > 0 && renderUserTable("User List", regularUsers)}
    </div>
  )
}

export default UsersList
