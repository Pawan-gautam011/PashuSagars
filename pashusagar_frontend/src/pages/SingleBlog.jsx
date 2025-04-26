import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { MoveRight, Clock, User, CalendarDays, ArrowLeft, Home, ChevronRight } from "lucide-react";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";

const SingleBlog = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [relatedBlogs, setRelatedBlogs] = useState([]);

  // Enhanced Breadcrumbs component matching MyAccount.jsx
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
    { label: "Article", path: `/singleblog/${id}` },
  ];

  useEffect(() => {
    const fetchBlogData = async () => {
      try {
        setLoading(true);
        
        // Fetch the main blog post
        const blogResponse = await fetch(`http://127.0.0.1:8000/api/blogs/${id}/`);
        if (!blogResponse.ok) throw new Error('Failed to fetch blog post');
        const blogData = await blogResponse.json();
        setBlog(blogData);
        
        // Fetch related blogs (same category)
        const relatedResponse = await fetch(`http://127.0.0.1:8000/api/blogs/?category_name=${blogData.category_name}`);
        if (relatedResponse.ok) {
          const relatedData = await relatedResponse.json();
          setRelatedBlogs(relatedData.filter(b => b.id !== blogData.id).slice(0, 3));
        }
        
      } catch (err) {
        console.error("Error fetching blog:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogData();
  }, [id]);

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-b from-[#004d40] to-[#00695c] flex items-center justify-center">
      <div className="animate-pulse text-[#ADE1B0] text-lg">Loading article...</div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-gradient-to-b from-[#004d40] to-[#00695c] flex items-center justify-center">
      <div className="text-red-300 text-lg">{error}</div>
    </div>
  );

  if (!blog) return (
    <div className="min-h-screen bg-gradient-to-b from-[#004d40] to-[#00695c] flex items-center justify-center">
      <div className="text-white/80 text-lg">Blog post not found</div>
    </div>
  );

  return (
    <>
      <Navbar />
      
      {/* Updated background to match MyAccount.jsx */}
      <div className="min-h-screen bg-gradient-to-b from-[#004d40] to-[#00695c] pt-16 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Use the enhanced breadcrumbs */}
          <EnhancedBreadcrumbs items={breadcrumbItems} />

          {/* Main Content Container - matching MyAccount card style */}
          <div className="bg-white rounded-lg shadow-lg p-6 md:p-8 w-full mx-auto">
            {/* Back button */}
            <Link 
              to="/blogs" 
              className="flex items-center text-[#004D40] hover:text-[#55DD4A] mb-6 transition-colors"
            >
              <ArrowLeft size={18} className="mr-2" />
              Back to all articles
            </Link>

            {/* Article Header */}
            <div className="mb-10">
              <span className="inline-block px-3 py-1 bg-[#ADE1B0]/20 text-[#004D40] rounded-full text-sm font-medium mb-4">
                {blog.category_name}
              </span>
              <h1 className="text-3xl md:text-4xl font-bold text-[#00574B] mb-4 leading-tight">
                {blog.title}
              </h1>
              
              <div className="flex flex-wrap items-center gap-4 text-[#00574B]/80 mb-6">
                <div className="flex items-center">
                  <User size={16} className="mr-2" />
                  <span>{blog.author || "Anonymous"}</span>
                </div>
                <div className="flex items-center">
                  <CalendarDays size={16} className="mr-2" />
                  <span>Published on {new Date().toLocaleDateString()}</span>
                </div>
                <div className="flex items-center">
                  <Clock size={16} className="mr-2" />
                  <span>5 min read</span>
                </div>
              </div>
            </div>

            {/* Featured Image */}
            <div className="mb-12 rounded-xl overflow-hidden shadow-lg">
              <img 
                src={blog.image} 
                alt={blog.title} 
                className="w-full h-auto max-h-[500px] object-cover"
              />
            </div>

            {/* Article Content */}
            <article className="prose prose-lg max-w-none mb-16">
              <div dangerouslySetInnerHTML={{ __html: blog.description }} />
              
              {/* Example content */}
              <h2 className="text-2xl font-bold text-[#00574B] mt-12 mb-4">Understanding Your Pet's Needs</h2>
              <p className="text-[#00574B]/90 mb-6">
                Proper pet care begins with understanding your animal's specific requirements. 
                Different breeds and species have varying needs when it comes to diet, exercise, 
                and medical attention.
              </p>
              
              <h3 className="text-xl font-semibold text-[#00574B] mt-8 mb-3">Nutrition Essentials</h3>
              <p className="text-[#00574B]/90 mb-6">
                A balanced diet is crucial for your pet's health. Consult with our veterinarians 
                to create a customized nutrition plan that considers your pet's age, weight, 
                and any special health conditions.
              </p>
              
              <div className="bg-[#f7fbfa] p-6 rounded-xl border border-[#ADE1B0] my-8">
                <h4 className="font-bold text-[#004D40] mb-3">Expert Tip</h4>
                <p className="text-[#00574B]/90">
                  Regular check-ups can help detect potential health issues early. 
                  We recommend annual wellness exams for adult pets and bi-annual visits for seniors.
                </p>
              </div>
            </article>

            {/* Related Articles */}
            {relatedBlogs.length > 0 && (
              <div className="mt-20">
                <h2 className="text-2xl md:text-3xl font-bold text-[#00574B] mb-8">Related Articles</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {relatedBlogs.map((relatedBlog) => (
                    <div key={relatedBlog.id} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow border border-[#ADE1B0]/30">
                      <img 
                        src={relatedBlog.image} 
                        alt={relatedBlog.title} 
                        className="w-full h-48 object-cover"
                      />
                      <div className="p-6">
                        <span className="inline-block px-2 py-1 bg-[#ADE1B0]/20 text-[#004D40] rounded-full text-xs font-medium mb-2">
                          {relatedBlog.category_name}
                        </span>
                        <h3 className="text-xl font-bold mb-3 text-[#00574B]">{relatedBlog.title}</h3>
                        <Link
                          to={`/singleblog/${relatedBlog.id}`}
                          className="inline-flex items-center text-[#004D40] font-medium hover:text-[#55DD4A] transition-colors"
                        >
                          Read more <MoveRight className="ml-2" size={16} />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* CTA Section */}
            <div className="bg-gradient-to-r from-[#004d40] to-[#00695c] rounded-2xl p-8 md:p-12 mt-20 text-center">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Need personalized advice for your pet?</h2>
              <p className="text-[#ADE1B0] mb-8 max-w-2xl mx-auto">
                Our veterinarians are ready to help with any questions about your pet's health and wellness.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link 
                  to="/online-consultation" 
                  className="px-6 py-3 bg-white text-[#004D40] rounded-lg font-medium hover:bg-gray-100 transition-colors"
                >
                  Book a Consultation
                </Link>
                <Link 
                  to="/pharmacy" 
                  className="px-6 py-3 border-2 border-white text-white rounded-lg font-medium hover:bg-white/10 transition-colors"
                >
                  Visit Our Pharmacy
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </>
  );
};

export default SingleBlog;