import  { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../Components/Navbar";
import Breadcrumbs from "../Components/BreadCrumbs";

const SingleBlog = () => {
    const { id } = useParams(); 
    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);

    const breadcrumbItems = [
    { label: "Home", path: "/" },
    { label: "Blogs", path: "/blog" },
    { label: "Single Blog", path: `/singleblog/${id}` },
  ];

    useEffect(() => {
        fetch(`http://127.0.0.1:8000/api/blogs/${id}/`) 
            .then((response) => response.json())
            .then((data) => {
                setBlog(data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching blog:", error);
                setLoading(false);
            });
    }, [id]);

    if (loading) return <p className="text-center text-lg">Loading...</p>;
    if (!blog) return <p className="text-center text-lg text-red-500">Blog not found</p>;

    return (
        <>
        <Navbar />
      <div className="bg-[#004D40] min-h-screen relative overflow-hidden text-center pt-16 font-bold">
        <Breadcrumbs items={breadcrumbItems} />
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
                <img src={blog.image} alt={blog.title} className="w-full h-64 object-cover" />
                <div className="p-6">
                    <h1 className="text-3xl font-bold">{blog.title}</h1>
                    <p className="text-gray-600 text-sm mb-4">{blog.category_name} | By {blog.author}</p>
                    <p className="text-gray-700">{blog.description}</p>
                </div>
            </div>
        </div>
        </div>
        </>
         
        
    );
};

export default SingleBlog;
