import React from 'react';
import { MapPin, Clock, Mail } from 'lucide-react';

const Information = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h2 className="text-3xl font-bold text-[#004d40] mb-8 text-center">GET IN TOUCH</h2>
      <p className="text-center text-gray-600 mb-12">We're here to help you and your pets!</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Left Side - Contact Form */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <form 
            action="https://formspree.io/f/xgvkvlzy" 
            method="POST"
            className="space-y-6"
          >
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-[#004d40] mb-1">
                Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#004d40]"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[#004d40] mb-1">
                Email address *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#004d40]"
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-[#004d40] mb-1">
                Phone number *
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#004d40]"
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-[#004d40] mb-1">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows="4"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#004d40]"
              ></textarea>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="consent"
                name="consent"
                required
                className="h-4 w-4 text-[#004d40] focus:ring-[#004d40] border-gray-300 rounded"
              />
              <label htmlFor="consent" className="ml-2 block text-sm text-gray-700">
                Allow this website to store my submission so they can respond to my inquiry.
              </label>
            </div>

            <button
              type="submit"
              className="w-full py-3 px-6 bg-[#004d40] text-white rounded-md hover:bg-[#00695c] transition-colors focus:outline-none focus:ring-2 focus:ring-[#004d40] focus:ring-offset-2"
            >
              SUBMIT
            </button>
          </form>
        </div>

        {/* Right Side - Map and Info */}
        <div className="space-y-6">
          {/* Map */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden h-64">
            <iframe
              title="Clinic Location"
              width="100%"
              height="100%"
              frameBorder="0"
              scrolling="no"
              marginHeight="0"
              marginWidth="0"
              src="https://maps.google.com/maps?q=Kalanki,Kathmandu&output=embed"
              className="border-0"
            ></iframe>
          </div>

          {/* Contact Info */}
          <div className="bg-white rounded-lg shadow-lg p-6 space-y-4">
            <div className="flex items-start">
              <Mail className="h-5 w-5 text-[#004d40] mt-1 mr-3" />
              <div>
                <h3 className="font-medium text-[#004d40]">Email</h3>
                <p className="text-gray-600">gautampowen4002@gmail.com</p>
              </div>
            </div>

            <div className="flex items-start">
              <MapPin className="h-5 w-5 text-[#004d40] mt-1 mr-3" />
              <div>
                <h3 className="font-medium text-[#004d40]">Location</h3>
                <p className="text-gray-600">Kalanki, Kathmandu</p>
              </div>
            </div>

            <div className="flex items-start">
              <Clock className="h-5 w-5 text-[#004d40] mt-1 mr-3" />
              <div>
                <h3 className="font-medium text-[#004d40]">Opening Hours</h3>
                <div className="text-gray-600 space-y-1">
                  <p>Sunday - Friday: 9:00am – 6:00pm</p>
                  <p>Saturday: 11:00am – 6:00pm</p>
                
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Information;