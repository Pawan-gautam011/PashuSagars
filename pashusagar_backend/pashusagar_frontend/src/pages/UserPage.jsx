import React from "react";
import { PawPrint, MoveRight } from "lucide-react";
import Slider from "react-slick";
import heroImg from "../assets/heroImg.png";
import Ecommerce from "../assets/Ecommerce.png";
import OnlineConsulation from "../assets/OnlineCounselling.png";
import Appointment from "../assets/Booking.png";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import icon1 from "../assets/icon6.jpg";
import icon2 from "../assets/icon2.jpg";
import icon3 from "../assets/icon3.jpg";
import icon4 from "../assets/icon4.jpg";
import icon5 from "../assets/icon5.jpg";
import icon6 from "../assets/icon2.jpg";
import fourStar from "../assets/4star.png";
import fiveStar from "../assets/5star.png";
import Aboutus from "../Components/Aboutus";
import FAQS from "../Components/FAQS";
import { NavLink } from "react-router";

const UserPage = () => {
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
    centerMode: true,
    centerPadding: "0",
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
    appendDots: (dots) => (
      <div className="mt-10">
        <ul className="flex justify-center">{dots}</ul>
      </div>
    ),
  };

  return (
    <>
      <div className="bg-gradient-to-b from-[#00574B] to-[#009366] h-auto relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          {Array(7)
            .fill(null)
            .map((_, index) => (
              <PawPrint
                key={index}
                className="text-[#F3EDE4] absolute animate-fall"
                style={{
                  top: `-${Math.random() * 100}px`,
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 1}s`,
                }}
              />
            ))}
        </div>
        <div className="text-white text-center pt-16 font-bold capitalize text-wrap">
          <h1 className="text-[#ADE1B0] tracking-tight text-[3rem] sm:text-[4rem] uppercase ">
            From Pharmacy to Consultation,
          </h1>
          <h2 className="font-bold text-[#55DD4A] tracking-tight text-[5rem] uppercase -mt-5">
            All in One Place
          </h2>
        </div>

        <p className="text-white font-medium text-center px-8 mt-6 text-lg sm:text-xl md:text-2xl leading-relaxed max-w-3xl mx-auto">
          Simplify supplier payments and streamline inventory management. Access
          tools to improve <strong>veterinary</strong> services and grow your
          business. Focus on caring for animals—we’ll handle the rest.
        </p>

        <div className="flex justify-center items-center mt-10">
          <button className="relative mb-20 flex items-center gap-x-2 border p-3 rounded-2xl text-[#F3EDE4] overflow-hidden group">
            <span className="absolute inset-0 bg-[#55DD4A] scale-x-0 origin-right transition-transform duration-300 group-hover:scale-x-100 z-0"></span>
            <NavLink to="/" className="relative z-10 flex items-center gap-x-2">
              Explore{" "}
              <MoveRight className="transition-transform duration-300 transform group-hover:translate-x-2" />
            </NavLink>
          </button>
        </div>

        <img
          src={heroImg}
          alt=""
          className="h-[30rem] w-[35rem] -mt-[35rem] mx-auto opacity-20 mb-20"
        />
      </div>

      {/* Services Section */}
      <div className="bg-gradient-to-b from-[#00796B] to-[#009688] h-auto relative overflow-hidden text-center pt-16 font-bold text-wrap">
        <h2 className="text-[#55DD4A] text-4xl md:text-6xl">Our Services</h2>
        <h1 className="uppercase mt-6 md:mt-9 text-lg md:text-xl text-[#ADE1B0] font-bold px-4">
          Enjoy the Core Services that we Provide to Our Customers
        </h1>
        <hr className="mt-4 md:mt-5 border-t-2 border-[#ADE1B0] w-full mx-auto" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-12 md:mt-16 px-4 mb-20">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-lg p-6 text-center cursor-pointer hover:shadow-2xl h-auto flex flex-col items-center"
            >
              <img
                src={service.icon}
                alt={service.title}
                className="h-16 md:h-20 mx-auto mb-4"
              />
              <h3 className="text-xl md:text-2xl font-bold mb-2">
                {service.title}
              </h3>
              <p className="text-sm md:text-base text-gray-700">
                {service.description}
              </p>
              <button className="relative mt-7 flex items-center  border p-3 rounded-2xl text-black overflow-hidden group">
                <span className="absolute inset-0 bg-[#55DD4A] scale-x-0 origin-right transition-transform duration-300 group-hover:scale-x-100 z-0"></span>
                <NavLink to={service.path} className="relative z-10 flex items-center gap-x-4">
                Explore{" "}
                <MoveRight className="transition-transform duration-300 transform group-hover:translate-x-2" />
              </NavLink>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Testinomials */}

      <div className="bg-[#00574B] h-auto relative overflow-hidden text-center pt-16 font-bold text-wrap">
        <h2 className="text-[#55DD4A] text-6xl">Testimonials</h2>
        <h1 className="uppercase mt-9 text-xl text-[#ADE1B0]">
          Our Hospital Impacts on their own Words
        </h1>
        <hr className="mt-5 border-[#ADE1B0]" />

        <Slider {...settings} className="mt-16 mb-20 px-4">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="px-4">
              <div className="bg-white rounded-lg shadow-lg p-6 text-center h-80 flex flex-col justify-between">
                <div>
                  <img
                    src={testimonial.icon}
                    alt={testimonial.name}
                    className="h-20 w-20 mx-auto mb-4 rounded-full object-cover"
                  />
                  <h3 className="text-2xl font-bold mb-2">
                    {testimonial.name}
                  </h3>
                  <p className="text-gray-700">{testimonial.review}</p>
                </div>
                <img
                  src={testimonial.star}
                  alt="rating"
                  className="h-8 mx-auto mt-4"
                />
              </div>
            </div>
          ))}
        </Slider>
      </div>
      <Aboutus />
      <FAQS/>
      






    </>
  );
};

export default UserPage;
