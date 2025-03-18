import React from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('order_id');
  const navigate = useNavigate();

  return (
    <>
      <Navbar />
      <div className="container mx-auto p-4 text-center">
        <h1 className="text-3xl font-bold mb-4">Payment Successful!</h1>
        {orderId ? (
          <p className="text-xl">Your order (ID: {orderId}) has been successfully placed.</p>
        ) : (
          <p className="text-xl">Your payment was successful, but no order ID was returned.</p>
        )}
        <button 
          onClick={() => navigate('/')}
          className="mt-6 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Go to Home
        </button>
      </div>
      <Footer />
    </>
  );
};

export default PaymentSuccess;
