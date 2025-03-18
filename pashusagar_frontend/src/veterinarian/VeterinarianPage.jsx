import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../Components/Navbar";
import { 
  Menu, 
  X, 
  PlusCircle, 
  List, 
  CalendarDays, 
  LayoutDashboard, 
  BookOpen, 
  Edit3 
} from "lucide-react";
import AddMedicine from "./AddMedicine";
import MedicineList from "./MedicineList";
import Appointments from "./Appointments";

// Blog Component that displays blog entries in a table format with Edit/Delete actions
const Blog = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [blogToEdit, setBlogToEdit] = useState(null);
  const token = localStorage.getItem("token");

  // Fetch blogs from API
  const fetchBlogs = () => {
    axios
      .get("http://127.0.0.1:8000/api/blogs/") // Adjust API endpoint as needed
      .then((response) => {
        setBlogs(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching blogs:", error);
        setError("Error fetching blogs");
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  // Handle Delete Blog
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this blog?")) return;
    try {
      await axios.delete(`http://127.0.0.1:8000/api/blogs/${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Remove deleted blog from state
      setBlogs(blogs.filter((blog) => blog.id !== id));
    } catch (error) {
      console.error("Error deleting blog:", error);
      alert("Failed to delete blog. Please try again.");
    }
  };

  // Open edit modal and prefill blogToEdit
  const openEditModal = (blog) => {
    setBlogToEdit(blog);
    setShowEditModal(true);
  };

  // Close the edit modal
  const closeEditModal = () => {
    setShowEditModal(false);
    setBlogToEdit(null);
  };

  // Handle update submission in the modal
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", blogToEdit.title);
    // Only append image if a new one is selected
    if (blogToEdit.newImage) {
      formData.append("image", blogToEdit.newImage);
    }
    formData.append("description", blogToEdit.description);
    formData.append("category_name", blogToEdit.category_name);
    formData.append("author", blogToEdit.author);
    try {
      await axios.put(
        `http://127.0.0.1:8000/api/blogs/${blogToEdit.id}/`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setShowEditModal(false);
      setBlogToEdit(null);
      // Refresh blogs list
      fetchBlogs();
    } catch (error) {
      console.error("Error updating blog:", error);
      alert("Failed to update blog. Please try again.");
    }
  };

  // Handle changes in the edit modal fields
  const handleEditChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "newImage") {
      setBlogToEdit({ ...blogToEdit, newImage: files[0] });
    } else {
      setBlogToEdit({ ...blogToEdit, [name]: value });
    }
  };

  if (loading) return <p className="text-center py-8">Loading...</p>;
  if (error) return <p className="text-center py-8">{error}</p>;

  return (
    <div className="overflow-x-auto py-8">
      <h1 className="text-3xl font-semibold text-gray-800 mb-4 text-center">
        Blog List
      </h1>
      <table className="min-w-full bg-white border">
        <thead>
          <tr>
            <th className="px-6 py-3 border-b text-left">ID</th>
            <th className="px-6 py-3 border-b text-left">Title</th>
            <th className="px-6 py-3 border-b text-left">Image</th>
            <th className="px-6 py-3 border-b text-left">Description</th>
            <th className="px-6 py-3 border-b text-left">Category</th>
            <th className="px-6 py-3 border-b text-left">Author</th>
            <th className="px-6 py-3 border-b text-left">Slug</th>
            <th className="px-6 py-3 border-b text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {blogs.map((blog) => (
            <tr key={blog.id} className="hover:bg-gray-100">
              <td className="px-6 py-4 border-b">{blog.id}</td>
              <td className="px-6 py-4 border-b">{blog.title}</td>
              <td className="px-6 py-4 border-b">
                <img
                  src={blog.image}
                  alt={blog.title}
                  className="w-16 h-16 object-cover"
                />
              </td>
              <td className="px-6 py-4 border-b">{blog.description}</td>
              <td className="px-6 py-4 border-b">{blog.category_name}</td>
              <td className="px-6 py-4 border-b">{blog.author}</td>
              <td className="px-6 py-4 border-b">{blog.slug}</td>
              <td className="px-6 py-4 border-b space-x-2">
                <button
                  onClick={() => openEditModal(blog)}
                  className="text-blue-500 hover:underline"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(blog.id)}
                  className="text-red-500 hover:underline"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Edit Modal */}
      {showEditModal && blogToEdit && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded w-full max-w-md relative">
            <button
              className="absolute top-2 right-2 text-gray-600"
              onClick={closeEditModal}
            >
              <X size={20} />
            </button>
            <h2 className="text-2xl font-semibold mb-4">Edit Blog</h2>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-700">Title</label>
                <input
                  type="text"
                  name="title"
                  value={blogToEdit.title}
                  onChange={handleEditChange}
                  className="w-full mt-1 p-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700">
                  Replace Image (optional)
                </label>
                <input
                  type="file"
                  name="newImage"
                  onChange={handleEditChange}
                  className="w-full mt-1"
                  accept="image/*"
                />
              </div>
              <div>
                <label className="block text-gray-700">Description</label>
                <textarea
                  name="description"
                  value={blogToEdit.description}
                  onChange={handleEditChange}
                  className="w-full mt-1 p-2 border rounded"
                  rows="4"
                  required
                ></textarea>
              </div>
              <div>
                <label className="block text-gray-700">Category Name</label>
                <input
                  type="text"
                  name="category_name"
                  value={blogToEdit.category_name}
                  onChange={handleEditChange}
                  className="w-full mt-1 p-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700">Author</label>
                <input
                  type="text"
                  name="author"
                  value={blogToEdit.author}
                  onChange={handleEditChange}
                  className="w-full mt-1 p-2 border rounded"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                Update Blog
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// Updated AddBlog Component with Authentication and Form
const AddBlog = () => {
  const [title, setTitle] = useState("");
  const [image, setImage] = useState(null);
  const [description, setDescription] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const [author, setAuthor] = useState("");
  const [message, setMessage] = useState("");
  const token = localStorage.getItem("token");

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Create a FormData object to handle file uploads
    const formData = new FormData();
    formData.append("title", title);
    formData.append("image", image);
    formData.append("description", description);
    formData.append("category_name", categoryName);
    formData.append("author", author);
    // slug is auto-generated on the backend

    try {
      await axios.post("http://127.0.0.1:8000/api/blogs/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`, // or "Token ${token}" based on your backend
        },
      });
      setMessage("Blog added successfully!");
      // Clear the form fields
      setTitle("");
      setImage(null);
      setDescription("");
      setCategoryName("");
      setAuthor("");
    } catch (error) {
      console.error("Error adding blog:", error);
      setMessage("Failed to add blog. Please try again.");
    }
  };

  return (
    <div className="max-w-lg mx-auto py-8">
      <h1 className="text-3xl font-semibold text-gray-800 mb-4">Add Blog</h1>
      {message && <div className="mb-4 text-center">{message}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full mt-1 p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700">Image</label>
          <input
            type="file"
            onChange={(e) => setImage(e.target.files[0])}
            className="w-full mt-1"
            accept="image/*"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full mt-1 p-2 border rounded"
            rows="4"
            required
          ></textarea>
        </div>
        <div>
          <label className="block text-gray-700">Category Name</label>
          <input
            type="text"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            className="w-full mt-1 p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700">Author</label>
          <input
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            className="w-full mt-1 p-2 border rounded"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full py-2 px-4 bg-[#004d40] text-white rounded hover:bg-[#00332c] transition-colors"
        >
          Add Blog
        </button>
      </form>
    </div>
  );
};

// ✅ Default Dashboard Content with API Data
const DefaultContent = ({ setActiveTab }) => {
  const [dashboardStats, setDashboardStats] = useState({
    total_products: 0,
    pending_appointments: 0,
    unread_messages: 0,
  });

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/dashboard-stats/") // Adjust API endpoint as needed
      .then((response) => {
        setDashboardStats(response.data);
      })
      .catch((error) => {
        console.error("Error fetching dashboard stats:", error);
      });
  }, []);

  return (
    <div className="text-center py-8">
      <h1 className="text-3xl font-semibold text-gray-800 mb-4">
        Welcome to Your Veterinary Dashboard
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        <div
          className="bg-gradient-to-br from-[#004d40] to-[#00695c] p-6 rounded-lg text-white cursor-pointer hover:opacity-80"
          onClick={() => setActiveTab("medicineList")}
        >
          <h3 className="text-xl font-semibold mb-2">Medicine Updates</h3>
          <p className="text-3xl font-bold">{dashboardStats.total_products}</p>
          <p className="text-sm mt-2">Low stock items</p>
        </div>
        <div
          className="bg-gradient-to-br from-[#004d40] to-[#00695c] p-6 rounded-lg text-white cursor-pointer hover:opacity-80"
          onClick={() => setActiveTab("appointments")}
        >
          <h3 className="text-xl font-semibold mb-2">Pending Appointments</h3>
          <p className="text-3xl font-bold">{dashboardStats.pending_appointments}</p>
          <p className="text-sm mt-2">Appointments in pending</p>
        </div>
        <div
          className="bg-gradient-to-br from-[#004d40] to-[#00695c] p-6 rounded-lg text-white cursor-pointer hover:opacity-80"
          onClick={() => setActiveTab("appointments")}
        >
          <h3 className="text-xl font-semibold mb-2">Message Requests</h3>
          <p className="text-3xl font-bold">{dashboardStats.unread_messages}</p>
          <p className="text-sm mt-2">Unread messages</p>
        </div>
      </div>
    </div>
  );
};

const VeterinarianPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("default");
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleDashboardClick = () => {
    navigate("/veterinarians", { replace: true });
  };

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <DefaultContent setActiveTab={setActiveTab} />;
      case "addMedicine":
        return <AddMedicine />;
      case "medicineList":
        return <MedicineList />;
      case "appointments":
        return <Appointments />;
      case "blog":
        return <Blog />;
      case "addBlog":
        return <AddBlog />;
      default:
        return <DefaultContent setActiveTab={setActiveTab} />;
    }
  };

  return (
    <div className="flex flex-col h-screen">

      <div className="flex flex-1 overflow-hidden">
        <button
          onClick={toggleSidebar}
          className="lg:hidden fixed top-20 left-4 z-50 p-2 rounded-lg bg-[#004d40] text-white"
        >
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <aside
          className={`bg-gradient-to-b from-[#004d40] to-[#00695c] text-white w-64 fixed lg:static h-[calc(100vh-64px)] overflow-y-auto transition-transform duration-300 ease-in-out z-40 ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          }`}
        >
          <div className="sticky  top-0 p-6">
            <div
              onClick={handleDashboardClick}
              className="flex items-center text-2xl font-semibold mb-6 transition-colors cursor-pointer"
            >
              Vet Dashboard
            </div>


            <div className="flex flex-col items-center mb-8">
              <div className="relative mb-4">
                <img
                  src={user?.avatar || "/default-avatar.png"}
                  alt="User avatar"
                  className="w-16 h-16 rounded-full border-2 border-white"
                />
              </div>
              <h2 className="text-xl font-semibold text-center mb-1">
                {user?.name || "Veterinarian User"}
              </h2>
              <p className="text-sm text-gray-200 text-center">
                {user?.email || "vet@example.com"}
              </p>
            </div>

            <ul className="space-y-3">
              <li>
                <button
                  onClick={() => {
                    setActiveTab("dashboard");
                    setIsSidebarOpen(false);
                  }}
                  className={`flex items-center p-3 rounded-lg transition-colors duration-200 w-full group ${
                    activeTab === "dashboard"
                      ? "bg-[#55DD4A] text-white"
                      : "hover:bg-[#55DD4A] hover:text-white"
                  }`}
                >
                  <LayoutDashboard
                    size={20}
                    className="mr-2 group-hover:scale-110 transition-transform"
                  />
                  <span className="ml-2">Vet Dashboard</span>
                </button>
              </li>

              

              <li>
                <button
                  onClick={() => {
                    setActiveTab("addMedicine");
                    setIsSidebarOpen(false);
                  }}
                  className={`flex items-center p-3 rounded-lg transition-colors duration-200 w-full group ${
                    activeTab === "addMedicine"
                      ? "bg-[#55DD4A] text-white"
                      : "hover:bg-[#55DD4A] hover:text-white"
                  }`}
                >
                  <PlusCircle className="mr-2 group-hover:scale-110 transition-transform" />
                  <span className="ml-2">Add Medicine</span>
                </button>
              </li>

              <li>
                <button
                  onClick={() => {
                    setActiveTab("medicineList");
                    setIsSidebarOpen(false);
                  }}
                  className={`flex items-center p-3 rounded-lg transition-colors duration-200 w-full group ${
                    activeTab === "medicineList"
                      ? "bg-[#55DD4A] text-white"
                      : "hover:bg-[#55DD4A] hover:text-white"
                  }`}
                >
                  <List className="mr-2 group-hover:scale-110 transition-transform" />
                  <span className="ml-2">Medicine List</span>
                </button>
              </li>

              <li>
                <button
                  onClick={() => {
                    setActiveTab("appointments");
                    setIsSidebarOpen(false);
                  }}
                  className={`flex items-center p-3 rounded-lg transition-colors duration-200 w-full group ${
                    activeTab === "appointments"
                      ? "bg-[#55DD4A] text-white"
                      : "hover:bg-[#55DD4A] hover:text-white"
                  }`}
                >
                  <CalendarDays className="mr-2 group-hover:scale-110 transition-transform" />
                  <span className="ml-2">Appointments</span>
                </button>
              </li>

              <li>
                <button
                  onClick={() => {
                    setActiveTab("blog");
                    setIsSidebarOpen(false);
                  }}
                  className={`flex items-center p-3 rounded-lg transition-colors duration-200 w-full group ${
                    activeTab === "blog"
                      ? "bg-[#55DD4A] text-white"
                      : "hover:bg-[#55DD4A] hover:text-white"
                  }`}
                >
                  <BookOpen className="mr-2 group-hover:scale-110 transition-transform" />
                  <span className="ml-2">Blog</span>
                </button>
              </li>

              <li>
                <button
                  onClick={() => {
                    setActiveTab("addBlog");
                    setIsSidebarOpen(false);
                  }}
                  className={`flex items-center p-3 rounded-lg transition-colors duration-200 w-full group ${
                    activeTab === "addBlog"
                      ? "bg-[#55DD4A] text-white"
                      : "hover:bg-[#55DD4A] hover:text-white"
                  }`}
                >
                  <Edit3 className="mr-2 group-hover:scale-110 transition-transform" />
                  <span className="ml-2">Add Blog</span>
                </button>
              </li>
            </ul>
          </div>
        </aside>

        <main className="flex-1 overflow-y-auto bg-gray-100 p-4 lg:p-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default VeterinarianPage;
