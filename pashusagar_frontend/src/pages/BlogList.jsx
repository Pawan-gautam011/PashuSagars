import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MoveRight, Clock, CalendarDays, Home, ChevronRight } from "lucide-react";
import Navbar from "../Components/Navbar";

const BlogList = () => {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // Enhanced Breadcrumbs component matching SingleBlog.jsx
    const EnhancedBreadcrumbs = ({ items }) => {
        return (
            <nav className="bg-white/10 backdrop-blur-sm rounded-lg p-3 mb-6">
                <ol className="flex flex-wrap items-center">
                    {items.map((item, index) => {
                        const isLast = index === items.length - 1;
                        return (
                            <li key={index} className="flex items-center">
                                {index === 0 && <Home size={16} className="text-white mr-2" />}
                                
                                {isLast ? (
                                    <span className="font-medium text-[#55DD4A]">{item.label}</span>
                                ) : (
                                    <>
                                        <Link 
                                            to={item.path} 
                                            className="text-white hover:text-[#ADE1B0] transition-colors"
                                        >
                                            {item.label}
                                        </Link>
                                        <ChevronRight size={16} className="mx-2 text-white/60" />
                                    </>
                                )}
                            </li>
                        );
                    })}
                </ol>
            </nav>
        );
    };

    const breadcrumbItems = [
        { label: "Home", path: "/" },
        { label: "Blogs", path: "/blogs" },
    ];

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const response = await fetch("http://127.0.0.1:8000/api/blogs/");
                if (!response.ok) throw new Error('Failed to fetch blogs');
                const data = await response.json();
                setBlogs(data);
            } catch (err) {
                console.error("Error fetching blogs:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchBlogs();
    }, []);

    if (loading) return (
        <div className="min-h-screen bg-gradient-to-b from-[#004d40] to-[#00695c] flex items-center justify-center">
            <div className="animate-pulse text-[#ADE1B0] text-lg">Loading articles...</div>
        </div>
    );

    if (error) return (
        <div className="min-h-screen bg-gradient-to-b from-[#004d40] to-[#00695c] flex items-center justify-center">
            <div className="text-red-300 text-lg">{error}</div>
            <button 
                onClick={() => window.location.reload()} 
                className="mt-4 px-6 py-2 bg-[#55DD4A] text-white rounded-lg hover:bg-[#4BC940] transition-colors"
            >
                Retry
            </button>
        </div>
    );

    if (blogs.length === 0) return (
        <div className="min-h-screen bg-gradient-to-b from-[#004d40] to-[#00695c] flex flex-col items-center justify-center">
            <h2 className="text-2xl text-[#ADE1B0] mb-4">No articles found</h2>
            <p className="text-white/80 mb-6">Check back later for new pet care content</p>
            <Link 
                to="/" 
                className="inline-flex items-center px-6 py-3 bg-[#55DD4A] text-white rounded-lg hover:bg-[#4BC940] transition-colors"
            >
                Return Home
            </Link>
        </div>
    );

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gradient-to-b from-[#004d40] to-[#00695c] pt-16 pb-16">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Use the enhanced breadcrumbs */}
                    <EnhancedBreadcrumbs items={breadcrumbItems} />
                    
                    {/* Main content container matching SingleBlog style */}
                    <div className="bg-white rounded-lg shadow-lg p-6 md:p-8 w-full mx-auto">
                        <div className="text-center mb-12">
                            <span className="inline-block px-4 py-1 bg-[#ADE1B0]/20 text-[#004D40] rounded-full text-sm font-medium mb-4">
                                Pet Care Resources
                            </span>
                            <h1 className="text-3xl md:text-4xl font-bold text-[#00574B] mb-4">
                                Latest Blog Articles
                            </h1>
                            <p className="text-[#00574B]/80 max-w-2xl mx-auto">
                                Expert advice and tips for keeping your pets happy and healthy
                            </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            {blogs.map((blog) => (
                                <div 
                                    key={blog.id} 
                                    className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow border border-[#ADE1B0]/30"
                                >
                                    <div className="h-48 overflow-hidden">
                                        <img 
                                            src={blog.image} 
                                            alt={blog.title} 
                                            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                                        />
                                    </div>
                                    <div className="p-6">
                                        <div className="flex items-center gap-2 mb-3">
                                            <span className="px-2 py-1 bg-[#ADE1B0]/20 text-[#004D40] text-xs font-medium rounded">
                                                {blog.category_name}
                                            </span>
                                            <span className="text-gray-400 text-sm">•</span>
                                            <div className="flex items-center text-gray-500 text-sm">
                                                <Clock className="mr-1" size={14} />
                                                <span>5 min read</span>
                                            </div>
                                        </div>
                                        
                                        <h3 className="text-xl font-bold text-[#00574B] mb-3">{blog.title}</h3>
                                        <p className="text-[#00574B]/90 mb-4 line-clamp-2">
                                            {blog.description.substring(0, 100)}...
                                        </p>
                                        
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center text-sm text-gray-500">
                                                <CalendarDays className="mr-1" size={14} />
                                                <span>{new Date().toLocaleDateString()}</span>
                                            </div>
                                            <Link
                                                to={`/singleblog/${blog.id}`}
                                                className="inline-flex items-center text-[#004D40] font-medium hover:text-[#55DD4A] transition-colors"
                                            >
                                                Read <MoveRight className="ml-1" size={16} />
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default BlogList;