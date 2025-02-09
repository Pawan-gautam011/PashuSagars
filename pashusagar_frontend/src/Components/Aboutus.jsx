import React from 'react'
import { PawPrint, Stethoscope, CalendarCheck, HeartPulse } from "lucide-react";
import about from "../assets/about1.jpg";
import about2 from "../assets/about4.png";
const Aboutus = () => {



  const offerData = [
    {
      id: 1,
      icon: <PawPrint />,
      title: "Veterinary Pharmacy",
      description:
        "Access a wide range of veterinary medicines and supplements for your animals, delivered to your doorstep with ease.",
    },
    {
      id: 2,
      icon: <Stethoscope />,
      title: "Online Consultations",
      description:
        "Consult with expert veterinarians through our platform and get reliable advice for your pet's health anytime, anywhere.",
    },
    {
      id: 3,
      icon: <CalendarCheck />,
      title: "Appointment Scheduling",
      description:
        "Easily book appointments with veterinary professionals using our seamless and user-friendly scheduling feature.",
    },
    {
      id: 4,
      icon: <HeartPulse />,
      title: "Comprehensive Care",
      description:
        "From routine check-ups to emergency care, trust Pashusagar to provide holistic and expert veterinary services.",
    },
  ];


  return (
    <>

     
        <div className="bg-[#004D40] h-auto relative overflow-hidden text-center pt-16 font-bold text-wrap">
         
          <h2 className="text-[#55DD4A] text-6xl">About Us</h2>
          <h1 className="uppercase mt-9 text-xl text-[#ADE1B0]">
            Because your pet deserves the best
          </h1>
          <hr className="mt-5 border-[#ADE1B0]" />

          {/* Section 1 */}
          <div className="flex justify-between items-center mt-12 gap-8 text-[#ffffff] flex-col-reverse md:flex-row px-8">
            <div className="flex-1">
              <p className="text-lg leading-relaxed font-medium">
                Welcome to <span className="text-[#55DD4A] font-bold">PashuSagar</span>, where love meets expertise.
                We are dedicated to providing exceptional veterinary services, comprehensive pharmacy solutions, and seamless online consultations.
                Our mission is simple: to ensure the health and happiness of every pet, because they’re family too.
              </p>
              <p className="font-bold text-2xl mt-6 text-[#ADE1B0]">
                Who We Are
              </p>
              <p className="mt-4 leading-relaxed font-medium">
                At <span className="text-[#55DD4A] font-bold">PashuSagar</span>, we pride ourselves on being a trusted partner in your animal’s journey.
                Whether you’re seeking expert medical advice, top-quality products, or a friendly consultation, our experienced team is here to help.
                Every service we offer is tailored to meet your animals unique needs.
              </p>
            </div>
            <div className="flex-1 w-60 h-96 mb-20  object-cover ">
              <img src={about2} alt="About Us" className="object-" />
            </div>
          </div>

          {/* Section 2 */}
          <div className="bg-slate-100 p-6 rounded-lg mt-12 mx-8">
            <h2 className="text-2xl font-medium text-[#004D40] mb-6">
              What We Offer
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {offerData.map((offer) => (
                <div key={offer.id} className="p-4 border rounded-lg shadow-sm bg-white hover:shadow-md transition-shadow duration-300">
                  <div className="flex items-center mb-2">
                    <span className="text-3xl mr-3 text-[#55DD4A]">{offer.icon}</span>
                    <h3 className="font-medium text-[#004D40]">{offer.title}</h3>
                  </div>
                  <p className="text-[#333333] leading-relaxed">{offer.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-between items-center mt-12 flex-col md:flex-row mb-20 px-8">
            <div className="flex-1">
              <img src={about} alt="Why Choose Us" className="rounded-lg shadow-lg object-cover w-full h-auto" />
            </div>
            <div className="flex-1 md:ml-12 mt-8 md:mt-0">
              <p className="font-bold text-2xl text-[#ADE1B0]">
                Why Choose Us?
              </p>
              <p className="mt-4 leading-relaxed  text-[#ffffff] font-medium">
                At <span className="text-[#55DD4A] font-bold">PashuSagar</span>, we bring convenience, trust, and care under one roof.
                Whether you need urgent medical advice, premium pet supplies, or just a helping hand, we are here to ensure that you and your pet have the best experience.
              </p>
              <p className="font-bold mt-8 text-2xl text-[#ADE1B0]">
                Let’s Make a Difference
              </p>
              <p className="mt-4 leading-relaxed  text-[#ffffff] font-medium">
                Join us in our journey to revolutionize pet care. Together, we can make your animals health and happiness our shared mission.
              </p>
            </div>
          </div>
        </div>
    </>
  )
}

export default Aboutus
