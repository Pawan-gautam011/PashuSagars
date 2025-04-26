import { useState, useEffect } from "react";
import axios from "axios";
import { X } from "lucide-react";

const BlogList = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [blogToEdit, setBlogToEdit] = useState(null);
  const token = localStorage.getItem("token");

  // Fetch blogs from API
  const fetchBlogs = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get("http://127.0.0.1:8000/api/blogs/", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBlogs(response.data || []);
    } catch (err) {
      console.error("Error fetching blogs:", err);
      setError("Failed to load blogs");
      setBlogs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this blog?")) return;
    try {
      await axios.delete(`http://127.0.0.1:8000/api/blogs/${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchBlogs(); // Refresh the list after deletion
    } catch (error) {
      console.error("Error deleting blog:", error);
      alert("Failed to delete blog. Please try again.");
    }
  };

  const openEditModal = (blog) => {
    setBlogToEdit({ ...blog, newImage: null });
    setShowEditModal(true);
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setBlogToEdit(null);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("title", blogToEdit.title);
      if (blogToEdit.newImage) {
        formData.append("image", blogToEdit.newImage);
      }
      formData.append("description", blogToEdit.description);
      formData.append("category_name", blogToEdit.category_name);
      formData.append("author", blogToEdit.author);
      
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
      closeEditModal();
      fetchBlogs(); // Refresh the list after editing
    } catch (error) {
      console.error("Error updating blog:", error);
      alert("Failed to update blog. Please try again.");
    }
  };

  const handleEditChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "newImage") {
      setBlogToEdit(prev => ({ ...prev, newImage: files[0] }));
    } else {
      setBlogToEdit(prev => ({ ...prev, [name]: value }));
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading blogs...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>;
  }

  if (blogs.length === 0) {
    return <div className="text-center py-8">No blogs found</div>;
  }

  return (
    <div className="overflow-x-auto py-4">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">Blog Management</h1>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Author</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {blogs.map((blog) => (
              <tr key={blog.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{blog.title}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <img
                    src={blog.image.startsWith('http') ? blog.image : `http://127.0.0.1:8000${blog.image}`}
                    alt={blog.title}
                    className="w-16 h-16 object-cover rounded"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/100';
                    }}
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{blog.category_name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{blog.author}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => openEditModal(blog)}
                    className="text-[#004d40] hover:text-[#00332c] mr-4"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(blog.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showEditModal && blogToEdit && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md relative">
            <button
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-800"
              onClick={closeEditModal}
            >
              <X size={20} />
            </button>
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">Edit Blog</h2>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  name="title"
                  value={blogToEdit.title}
                  onChange={handleEditChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#004d40]"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Replace Image (optional)
                </label>
                <input
                  type="file"
                  name="newImage"
                  onChange={handleEditChange}
                  className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-[#004d40]/10 file:text-[#004d40] hover:file:bg-[#004d40]/20"
                  accept="image/*"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  name="description"
                  value={blogToEdit.description}
                  onChange={handleEditChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#004d40]"
                  rows="4"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category Name</label>
                <input
                  type="text"
                  name="category_name"
                  value={blogToEdit.category_name}
                  onChange={handleEditChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#004d40]"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Author</label>
                <input
                  type="text"
                  name="author"
                  value={blogToEdit.author}
                  onChange={handleEditChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#004d40]"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full py-2 px-4 bg-[#004d40] text-white rounded-md hover:bg-[#00332c] transition-colors focus:outline-none focus:ring-2 focus:ring-[#004d40] focus:ring-offset-2"
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

export default BlogList;