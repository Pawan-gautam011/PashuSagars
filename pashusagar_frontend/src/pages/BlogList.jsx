import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../Components/Navbar";
import Breadcrumbs from "../Components/BreadCrumbs";

const BlogList = () => {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const breadcrumbItems = [
    { label: "Home", path: "/" },
    { label: "blogs", path: "/blogs" },
  ];

    useEffect(() => {
        fetch("http://127.0.0.1:8000/api/blogs/")
            .then((response) => response.json())
            .then((data) => {
                setBlogs(data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching blogs:", error);
                setLoading(false);
            });
    }, []);

    if (loading) return <p className="text-center text-lg">Loading...</p>;

    return (
        <>
        <Navbar />
      <div className="bg-[#004D40] min-h-screen relative overflow-hidden text-center pt-16 font-bold">
        <Breadcrumbs items={breadcrumbItems} />
        <div className="container mx-auto px-4 py-8">
            <h2 className="text-3xl font-bold text-center mb-8">Latest Blogs</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {blogs.map((blog) => (
                    <div key={blog.id} className="bg-white shadow-lg rounded-lg overflow-hidden">
                        <img src={blog.image} alt={blog.title} className="w-full h-48 object-cover" />
                        <div className="p-4">
                            <h3 className="text-xl font-semibold">{blog.title}</h3>
                            <p className="text-gray-600 text-sm mb-2">{blog.category_name} | By {blog.author}</p>
                            <p className="text-gray-700">{blog.description.substring(0, 100)}...</p>
                            <Link
                                to={`/singleblog/${blog.id}`}
                                className="block mt-3 text-blue-500 font-semibold hover:underline"
                            >
                                Read More →
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
        </div>
        </>
        
    );
};

export default BlogList;
