import React, { useState, useEffect, useRef } from "react";
import { Link, NavLink } from "react-router-dom";
import { 
  PawPrint, 
  MoveRight, 
  ShoppingBag, 
  Video, 
  Calendar, 
  ChevronRight, 
  ChevronLeft, 
  Star,
  ArrowRight,
  Clock,
  CalendarDays
} from "lucide-react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Import assets (these should be your actual imports)
import heroImg from "../assets/heroImg.png";
import Ecommerce from "../assets/Ecommerce.png";
import OnlineConsulation from "../assets/OnlineCounselling.png";
import Appointment from "../assets/Booking.png";
import fourStar from "../assets/4star.png";
import fiveStar from "../assets/5star.png";
import icon1 from "../assets/icon6.jpg";
import icon2 from "../assets/icon2.jpg";
import icon3 from "../assets/icon3.jpg";
import icon4 from "../assets/icon4.jpg";
import icon5 from "../assets/icon5.jpg";
import icon6 from "../assets/icon2.jpg";

// Import components
import Aboutus from "../Components/Aboutus";
import FAQS from "../Components/FAQS";

const UserPage = () => {
  const [activeFeature, setActiveFeature] = useState(0);
  const [blogs, setBlogs] = useState([]);
  const [loadingBlogs, setLoadingBlogs] = useState(false);
  const [blogError, setBlogError] = useState(null);
  const [showAllBlogs, setShowAllBlogs] = useState(false)
  const sliderRef = useRef(null);


  useEffect(() => {
    const fetchBlogs = async () => {
      setLoadingBlogs(true);
      try {
        const response = await fetch("http://127.0.0.1:8000/api/blogs/");
        if (!response.ok) {
          throw new Error('Failed to fetch blogs');
        }
        const data = await response.json();
        setBlogs(data);
      } catch (error) {
        console.error("Error fetching blogs:", error);
        setBlogError(error.message);
      } finally {
        setLoadingBlogs(false);
      }
    };

    fetchBlogs();
  }, []);

  // Features for the services section
  const features = [
    {
      id: 0,
      title: "Shop for Medicines",
      description: "Access a wide range of veterinary medications, supplements, and health products for your pets. Get doorstep delivery with secure payment options.",
      icon: <ShoppingBag className="text-teal-600" size={32} />,
      color: "bg-teal-50 border-teal-200",
      path: "/pharmacy",
    },
    {
      id: 1,
      title: "Online Consultation",
      description: "Connect with expert veterinarians through video calls and chat. Get professional advice and prescriptions without leaving your home.",
      icon: <Video className="text-purple-600" size={32} />,
      color: "bg-purple-50 border-purple-200",
      path: "/online-consultation",
    },
    {
      id: 2,
      title: "Appointment Booking",
      description: "Schedule in-person visits with our qualified veterinarians. Choose your preferred time slot and get instant confirmation.",
      icon: <Calendar className="text-emerald-600" size={32} />,
      color: "bg-emerald-50 border-emerald-200",
      path: "/online-booking",
    },
  ];

  const services = [
    {
      title: "Pharmacy",
      description:
        "Get all the medicines and supplements for your animals at one place.",
      icon: Ecommerce,
      path: "/pharmacy",
    },
    {
      title: "Online Consultation",
      description:
        "Consult with our expert veterinarians to get the best advice for your pet.",
      icon: OnlineConsulation,
      path: "/online-consultation",
    },
    {
      title: "Online Booking",
      description: "Book an appointment with our expert veterinarians.",
      icon: Appointment,
      path: "/online-booking",
    },
  ];

  const testimonials = [
    {
      name: "Pawan G",
      review: "Great service and very professional staff. Highly recommend!",
      icon: icon1,
      star: fiveStar,
    },
    {
      name: "John D",
      review: "The best veterinary services I have ever experienced.",
      icon: icon2,
      star: fiveStar,
    },
    {
      name: "Jane S",
      review: "Very caring and knowledgeable veterinarians.",
      icon: icon3,
      star: fourStar,
    },
    {
      name: "Alice B",
      review: "Excellent service and friendly staff.",
      icon: icon4,
      star: fiveStar,
    },
    {
      name: "Michael T",
      review: "Highly satisfied with the consultation and services.",
      icon: icon5,
      star: fourStar,
    },
    {
      name: "Emily R",
      review: "Great experience, my pet is very happy.",
      icon: icon6,
      star: fiveStar,
    },
  ];

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    centerMode: false,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          centerMode: false,
        },
      },
    ],
    appendDots: (dots) => (
      <div className="mt-6">
        <ul className="flex justify-center gap-2">{dots}</ul>
      </div>
    ),
    customPaging: () => (
      <div className="w-2 h-2 bg-gray-300 rounded-full hover:bg-[#55DD4A]"></div>
    ),
  };

  // Function to change the active feature
  const nextFeature = () => {
    setActiveFeature((prev) => (prev === features.length - 1 ? 0 : prev + 1));
  };

  const prevFeature = () => {
    setActiveFeature((prev) => (prev === 0 ? features.length - 1 : prev - 1));
  };

  // Auto-scroll for features
  useEffect(() => {
    const interval = setInterval(() => {
      nextFeature();
    }, 7000);
    return () => clearInterval(interval);
  }, []);

  const renderBlogSection = () => (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <span className="text-[#55DD4A] font-medium text-sm uppercase tracking-wider">Latest News</span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mt-2 mb-4">
            Pet Care Blog
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Stay updated with the latest pet care tips and news
          </p>
        </div>

        {loadingBlogs ? (
          <div className="text-center py-12">
            <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-[#ADE1B0] border-t-transparent"></div>
            <p className="mt-4 text-[#004D40]">Loading articles...</p>
          </div>
        ) : blogError ? (
          <div className="text-center py-12">
            <p className="text-red-500 mb-4">{blogError}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="px-6 py-2 bg-[#55DD4A] text-white rounded-lg hover:bg-[#4BC940] transition-colors"
            >
              Retry
            </button>
          </div>
        ) : blogs.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-xl text-[#004D40] mb-2">No articles found</h3>
            <p className="text-gray-600 mb-4">Check back later for new pet care content</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {(showAllBlogs ? blogs : blogs.slice(0, 3)).map((blog) => (
                <div 
                  key={blog.id} 
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
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
                      <span className="px-2 py-1 bg-[#55DD4A]/10 text-[#55DD4A] text-xs font-medium rounded">
                        {blog.category_name}
                      </span>
                      <span className="text-gray-400 text-sm">•</span>
                      <div className="flex items-center text-gray-500 text-sm">
                        <Clock className="mr-1" size={14} />
                        <span>5 min read</span>
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-800 mb-3">{blog.title}</h3>
                    <p className="text-gray-600 mb-4 line-clamp-2">
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

            <div className="text-center mt-10">
              <button 
                onClick={() => setShowAllBlogs(!showAllBlogs)}
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-[#004D40] hover:bg-[#00695c] transition-colors"
              >
                {showAllBlogs ? 'Show Less' : 'View All Blog Posts'}
              </button>
            </div>
          </>
        )}
      </div>
    </section>
  );



  return (
    <>
      {/* Hero Section - Modern Design */}
      <section className="min-h-[85vh] bg-gradient-to-br from-[#004d40] via-[#00796b] to-[#009688] relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 pointer-events-none">
          {Array(15)
            .fill(null)
            .map((_, index) => (
              <PawPrint
                key={index}
                className="absolute text-white/10"
                style={{
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  opacity: 0.1 + Math.random() * 0.2,
                  transform: `rotate(${Math.random() * 360}deg) scale(${0.5 + Math.random() * 1.5})`,
                  animation: `float ${5 + Math.random() * 10}s ease-in-out ${Math.random() * 5}s infinite`,
                }}
                size={24 + Math.random() * 48}
              />
            ))}
        </div>

        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            <div className="lg:w-1/2 text-center lg:text-left">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight mb-6">
                <span className="text-[#ADE1B0] block mb-3">From Pharmacy to Consultation,</span>
                <span className="text-white">All in One Place</span>
              </h1>
              
              <p className="text-white/90 text-lg md:text-xl font-light max-w-xl mx-auto lg:mx-0 mb-10 leading-relaxed">
                Simplify your pet care journey with our comprehensive veterinary platform. Expert care for your animals, just a click away.
              </p>
              
              <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                <NavLink to="/pharmacy" className="px-6 py-3 bg-[#55DD4A] text-white rounded-full font-medium flex items-center gap-2 transform transition duration-300 hover:bg-[#4BC940] hover:scale-105 hover:shadow-lg">
                  Get Started
                  <MoveRight size={18} />
                </NavLink>
                
                <NavLink to="/online-consultation" className="px-6 py-3 border-2 border-white/30 text-white rounded-full font-medium transition duration-300 hover:bg-white/10 hover:border-white/60">
                  Learn More
                </NavLink>
              </div>
            </div>
            
            <div className="lg:w-1/2 relative mt-12 lg:mt-0">
              <div className="absolute inset-0 bg-gradient-to-br from-[#004d40]/50 to-transparent rounded-full filter blur-xl"></div>
              <img
                src={heroImg}
                alt="Veterinary Care"
                className="relative z-10 w-full max-w-lg mx-auto animate-float"
              />
            </div>
          </div>
        </div>
        
        {/* Wave Separator */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 120" className="w-full">
            <path 
              fill="#FFFFFF" 
              fillOpacity="1" 
              d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"
            ></path>
          </svg>
        </div>
      </section>

      {/* Core Services Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <span className="text-[#55DD4A] font-medium text-sm uppercase tracking-wider">Our Core Pillars</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mt-2 mb-4">
              Comprehensive Pet Care Solutions
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover how our platform can help you provide the best care for your pets through our three core services.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className={`rounded-xl border p-6 shadow-sm transition duration-300 hover:shadow-md ${feature.color}`}
              >
                <div className="flex flex-col h-full">
                  <div className="mb-4">
                    {feature.icon}
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-800 mb-3">{feature.title}</h3>
                  
                  <p className="text-gray-600 mb-6 flex-grow">{feature.description}</p>
                  
                  <NavLink 
                    to={feature.path}
                    className="inline-flex items-center text-[#004D40] font-medium hover:text-[#55DD4A] transition-colors"
                  >
                    Learn more <ArrowRight size={16} className="ml-2" />
                  </NavLink>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Visual Blocks */}
      <section className="py-16 bg-gradient-to-b from-[#f7f7f7] to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <span className="text-[#55DD4A] font-medium text-sm uppercase tracking-wider">What We Offer</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mt-2 mb-4">
              Our Services
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Enjoy the core services that we provide to our customers
            </p>
            <div className="h-1 w-24 bg-[#55DD4A] mx-auto mt-6 rounded-full"></div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-10">
            {services.map((service, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-lg p-8 text-center transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1"
              >
                <img
                  src={service.icon}
                  alt={service.title}
                  className="h-16 md:h-20 mx-auto mb-6"
                />
                <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-3">
                  {service.title}
                </h3>
                <p className="text-gray-600 mb-6">
                  {service.description}
                </p>
                <NavLink 
                  to={service.path}
                  className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-[#f8f8f8] text-[#004D40] font-medium border border-gray-200 hover:bg-[#55DD4A] hover:text-white hover:border-transparent transition-all duration-300"
                >
                  Explore <MoveRight className="ml-2" size={18} />
                </NavLink>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 md:py-24 bg-[#f7fbfa]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <span className="text-[#55DD4A] font-medium text-sm uppercase tracking-wider">Testimonials</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mt-2 mb-4">
              What Our Clients Say
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover what pet owners have to say about our services
            </p>
            <div className="h-1 w-24 bg-[#55DD4A] mx-auto mt-6 rounded-full"></div>
          </div>

          <div className="max-w-6xl mx-auto px-8">
            <Slider ref={sliderRef} {...settings}>
              {testimonials.map((testimonial, index) => (
                <div key={index} className="px-3 py-5">
                  <div className="bg-white rounded-xl p-6 shadow-sm transition-all duration-300 hover:shadow-md h-full flex flex-col">
                    <div className="flex justify-center mb-4">
                      <img
                        src={testimonial.icon}
                        alt={testimonial.name}
                        className="w-16 h-16 rounded-full object-cover border-2 border-[#55DD4A]"
                      />
                    </div>
                    
                    <div className="mb-4 flex justify-center">
                      <img src={testimonial.star} alt="Rating" className="h-5" />
                    </div>
                    
                    <p className="text-gray-700 text-center italic mb-6 flex-grow">
                      "{testimonial.review}"
                    </p>
                    
                    <h4 className="font-bold text-center text-gray-800">
                      {testimonial.name}
                    </h4>
                  </div>
                </div>
              ))}
            </Slider>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 md:py-16 bg-gradient-to-r from-[#004d40] to-[#00695c] text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-6 rounded-lg bg-white/10 backdrop-blur-sm transform transition-transform duration-300 hover:scale-105">
              <h3 className="text-4xl md:text-5xl font-bold mb-2">2,500+</h3>
              <p className="text-[#ADE1B0] font-medium">Happy Pets</p>
            </div>
            
            <div className="text-center p-6 rounded-lg bg-white/10 backdrop-blur-sm transform transition-transform duration-300 hover:scale-105">
              <h3 className="text-4xl md:text-5xl font-bold mb-2">15+</h3>
              <p className="text-[#ADE1B0] font-medium">Expert Veterinarians</p>
            </div>
            
            <div className="text-center p-6 rounded-lg bg-white/10 backdrop-blur-sm transform transition-transform duration-300 hover:scale-105">
              <h3 className="text-4xl md:text-5xl font-bold mb-2">350+</h3>
              <p className="text-[#ADE1B0] font-medium">Products Available</p>
            </div>
            
            <div className="text-center p-6 rounded-lg bg-white/10 backdrop-blur-sm transform transition-transform duration-300 hover:scale-105">
              <h3 className="text-4xl md:text-5xl font-bold mb-2">24/7</h3>
              <p className="text-[#ADE1B0] font-medium">Customer Support</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-br from-[#004d40] to-[#00695c] rounded-2xl overflow-hidden shadow-xl">
            <div className="relative p-8 md:p-12">
              {/* Background patterns */}
              <div className="absolute top-0 right-0 w-64 h-64 opacity-10">
                <PawPrint size={200} className="text-white" />
              </div>
              
              <div className="relative z-10 text-center max-w-3xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to care for your pet?</h2>
                <p className="text-lg text-[#ADE1B0] mb-8">
                  Join thousands of pet owners who trust our services for their animal healthcare needs.
                </p>
                
                <div className="flex flex-wrap gap-4 justify-center">
               
                  
                  <NavLink to="/contact" className="px-8 py-3 border-2 border-white text-white rounded-lg font-medium transition-all duration-300 hover:bg-white/10">
                    Contact Us
                  </NavLink>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

{/* 
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <span className="text-[#55DD4A] font-medium text-sm uppercase tracking-wider">Latest News</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mt-2 mb-4">
              Pet Care Blog
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Stay updated with the latest pet care tips and news
            </p>
          </div>

          {loadingBlogs ? (
            <p className="text-center">Loading blogs...</p>
          ) : blogError ? (
            <p className="text-center text-red-500">{blogError}</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogs.slice(0, 3).map((blog) => (
                <div key={blog.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  <img 
                    src={blog.image} 
                    alt={blog.title} 
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2">{blog.title}</h3>
                    <p className="text-gray-600 text-sm mb-3">
                      {blog.category_name} • {blog.author}
                    </p>
                    <p className="text-gray-700 mb-4">
                      {blog.description.substring(0, 100)}...
                    </p>
                    <a 
                      href={`/singleblog/${blog.id}`}
                      className="text-[#004D40] font-medium hover:text-[#55DD4A] transition-colors inline-flex items-center"
                    >
                      Read more <MoveRight className="ml-2" size={16} />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="text-center mt-10">
            <a 
              href="/blogs" 
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-[#004D40] hover:bg-[#00695c]"
            >
              View All Blog Posts
            </a>
          </div>
        </div>
      </section> */}
{renderBlogSection()}

      {/* About Us and FAQs - Using existing components */}
      {/* <Aboutus />
      <FAQS /> */}
    </>
  );
};

export default UserPage;