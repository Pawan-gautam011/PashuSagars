import React, { useState } from 'react';
import Breadcrumbs from './BreadCrumbs';
import Navbar from './Navbar';
import { Calendar, Package2 } from 'lucide-react';
import medicine1 from "../../src/assets/medicine1.jpg";
import medicine2 from "../../src/assets/cute-animals-group-white-background.jpg";
import medicine3 from "../../src/assets/medicine1.jpg";

const History = () => {
  const [activeTab, setActiveTab] = useState(null);
  
  const breadcrumbItems = [
    { label: "Home", path: "/" },
    { label: "History", path: "/history" },
  ];

  const sampleMedicines = [
    {
      id: 1,
      name: "Amoxicillin",
      quantity: 30,
      price: 450,
      date: "2024-02-01",
      status: "Delivered",
      image: medicine1
    },
    {
      id: 2,
      name: "Paracetamol",
      quantity: 20,
      price: 12.50,
      date: "2024-01-28",
      status: "out of stock",
      image: medicine2
    },
    {
      id: 3,
      name: "Vitamin C",
      quantity: 60,
      price: 24.99,
      date: "2024-01-15",
      status: "Delivered",
      image: medicine3
    }
  ];

  const sampleAppointments = [
    {
      id: 1,
      doctor: "Dr. Sarah Wilson",
      date: "2024-02-05",
      time: "10:00 AM",
      status: "Completed",
      type: "Regular Checkup",
      Reason:"My dog has been sick for a long time"
    },
    {
      id: 2,
      doctor: "Dr. Michael Brown",
      date: "2024-01-20",
      time: "2:30 PM",
      status: "Pending",
      type: "Emergency",
   
      Reason:"My dog has been sick for a long time"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#004D40] to-[#00695C]">
      <Navbar />
      <div className="container mx-auto px-4 pt-16 pb-20">
        <Breadcrumbs items={breadcrumbItems} />
        
        <div className="text-center mb-12">
          <h2 className="text-[#55DD4A] text-5xl font-bold mb-4">History</h2>
          <p className="text-[#ADE1B0] text-xl uppercase">
            Check Your History with the platform
          </p>
          <hr className="w-full mt-5 border-[#ADE1B0]" />
        </div>
         

        <div className="flex flex-col md:flex-row justify-center gap-4 mb-8">
          <button
            onClick={() => setActiveTab('pharmacy')}
            className={`flex items-center gap-3 px-8 py-4 rounded-lg font-semibold transition-all duration-300 ${
              activeTab === 'pharmacy'
                ? 'bg-[#55DD4A] text-white transform scale-105'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            <Package2 size={24} />
            Pharmacy History
          </button>
          
          <button
            onClick={() => setActiveTab('appointment')}
            className={`flex items-center gap-3 px-8 py-4 rounded-lg font-semibold transition-all duration-300 ${
              activeTab === 'appointment'
                ? 'bg-[#55DD4A] text-white transform scale-105'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            <Calendar size={24} />
            Appointment History
          </button>
        </div>

        {activeTab === 'pharmacy' && (
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 text-white">
            <h3 className="text-2xl font-bold mb-6">Pharmacy History</h3>
            <div className="grid gap-4">
              {sampleMedicines.map((medicine) => (
                <div key={medicine.id} className="bg-white/5 rounded-lg p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <img
                      src={medicine.image}
                      alt={medicine.name}
                      className="w-20 h-20 rounded-lg object-cover"
                    />
                    <div>
                      <h4 className="font-semibold text-lg">{medicine.name}</h4>
                      <p className="text-[#ADE1B0]">Quantity: {medicine.quantity}</p>
                      <p className="text-sm text-gray-300">Purchased on {medicine.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold">Rs. {medicine.price}</p>
                    <span className={`inline-block px-3 py-1 mt-7 rounded-full text-sm ${
                        medicine.status === "Delivered" ? "bg-green-600 text-green-300" : "bg-red-500/20 text-red-300"
                        }`}>
                        {medicine.status}
                        </span>
                    
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'appointment' && (
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 text-white">
            <h3 className="text-2xl font-bold mb-6">Appointment History</h3>
            <div className="grid gap-4">
              {sampleAppointments.map((appointment) => (
                <div key={appointment.id} className="bg-white/5 rounded-lg p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div>
                      <h4 className="font-semibold text-lg">{appointment.doctor}</h4>
                      <p className="text-[#ADE1B0]">{appointment.type}</p>
                      <p className="text-sm text-gray-300">
                        {appointment.date} at {appointment.time}
                      </p>
                        <p className="text-sm text-gray-300">
                            Reason: {appointment.Reason} </p>
                    </div>
                  </div>
                  <span className="inline-block px-3 py-1 bg-green-600 text-green-300 rounded-full">
                    {appointment.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {!activeTab && (
          <div className="text-center text-white/60 mt-12">
            <p className="text-xl">Select a category above to view your history</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default History;