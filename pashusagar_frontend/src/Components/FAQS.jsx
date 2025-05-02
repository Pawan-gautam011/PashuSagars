import React, { useState } from "react";
import { Plus,Minus, Home, ChevronRight } from 'lucide-react';
import Navbar from "./Navbar";

const FAQS = () => {

    const [activeIndex, setActiveIndex] = useState(false);

  const faqs = [
    {
      question: "What services does Pashusagar provide?",
      answer: "Pashusagar offers pharmacy services, online consultations, and online appointment bookings for veterinary care.",
    },
    {
      question: "How can I book an appointment?",
      answer: "You can book an appointment through our online booking system, accessible on the platform’s homepage.",
    },
    {
      question: "Are the veterinarians qualified?",
      answer: "Yes, all our veterinarians are certified professionals with years of experience in animal healthcare.",
    },
    {
      question: "Can I consult for emergency cases?",
      answer: "Yes, our platform offers online consultations for urgent cases. Please contact us immediately in such situations.",
    },
    {
      question: "Do you deliver medicines?",
      answer: "Yes, we provide a delivery service for medicines and supplements ordered through our pharmacy section.",
    },
  ];

  const toggleFAQ = (index) => {
    setActiveIndex(index === activeIndex ? false : index);
  };

  const breadcrumbItems = [
    { label: "Home", path: "/" },
    { label: "FAQ", path: "/faq" },
  ];


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
                    <a 
                      href={item.path} 
                      className="text-white hover:text-[#ADE1B0] transition-colors"
                    >
                      {item.label}
                    </a>
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

  return (
    <>
  
     <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-[#004D40] to-[#00695C] pt-16 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="container mx-auto">
            <EnhancedBreadcrumbs items={breadcrumbItems} />
          </div>
        <h2 className="text-[#55DD4A] text-6xl text-center">FAQs</h2>
        <h1 className="uppercase mt-9 text-center text-xl text-[#ADE1B0]">
        Frequently Asked Questions
        </h1>
        <hr className="mt-5  border-[#ADE1B0]" />

      <div className="mt-10 space-y-6 max-w-4xl mx-auto mb-20 px-8 sm:px-0">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-lg p-6 cursor-pointer"
            onClick={() => toggleFAQ(index)}
          >
            <div className="flex justify-between items-center">
              <h4 className="text-lg md:text-xl font-bold text-[#00574B]">
                {faq.question}
              </h4>
              <button className="text-[#55DD4A] text-2xl font-bold">
                {activeIndex === index ? <Minus /> :<Plus />                }
              </button>
            </div>
            {activeIndex === index && (
              <p className="mt-4 text-gray-700 text-sm md:text-base">
                {faq.answer}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
    </div>

    </>
  )
}

export default FAQS;