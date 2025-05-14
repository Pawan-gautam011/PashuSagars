import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { clearCart } from '../redux/cartSlice';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';
import { CheckCircle } from 'lucide-react';

const PaymentSuccess = () => {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('order_id');
  const navigate = useNavigate();

  // ✅ Clear the cart when landing on this page
  useEffect(() => {
    dispatch(clearCart());
  }, [dispatch]);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-[#004d40] to-[#00695c] flex flex-col justify-center items-center text-white text-center px-4">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 md:p-12 shadow-2xl max-w-md w-full">
          <CheckCircle size={64} className="text-[#55DD4A] mx-auto mb-6" />
          <h1 className="text-4xl font-bold text-[#55DD4A] mb-4">Payment Successful!</h1>
          {orderId ? (
            <p className="text-lg text-[#ADE1B0] mb-6">
              Your order <span className="font-bold text-white">#{orderId}</span> has been successfully placed.
            </p>
          ) : (
            <p className="text-lg text-[#ADE1B0] mb-6">
              Your payment was successful, but no order ID was returned.
            </p>
          )}
          <button 
            onClick={() => navigate('/')}
            className="w-full bg-[#55DD4A] hover:bg-[#45cc3a] text-white font-semibold py-3 px-6 rounded-xl shadow-md transition-all"
          >
            Go to Home
          </button>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default PaymentSuccess;
