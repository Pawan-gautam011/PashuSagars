import React, { useState } from "react";
import axios from "axios";
import { NavLink, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, User, Phone, AlertCircle, CheckCircle, UserPlus, ArrowRight, ShieldCheck, HelpCircle } from "lucide-react";
import { toast } from "react-toastify";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";

const Signup = () => {
  const [username, setUsername] = useState(""); 
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState(""); 
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState(""); 
  const [success, setSuccess] = useState(""); 
  const [isLoading, setIsLoading] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [showUsernameHelp, setShowUsernameHelp] = useState(false);

  const navigate = useNavigate();

  const validateUsername = (username) => {
    const regex = /^[a-zA-Z0-9\s.,\-_@]+$/;
    return regex.test(username);
  };
  

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    if (!validateUsername(username)) {
      setError("Username contains invalid characters. Only letters, numbers, spaces, and . , - _ @ are allowed.");
      setIsLoading(false);
      return;
    }
  
    // Basic validation
    if (!username.trim()) {
      setError("Username is required.");
      setIsLoading(false);
      return;
    }
  
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setIsLoading(false);
      return;
    }
  
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      setIsLoading(false);
      return;
    }
  
    if (phoneNumber.length !== 10) {
      setError("Phone number must be 10 digits.");
      setIsLoading(false);
      return;
    }
  
    if (!agreeTerms) {
      setError("You must agree to our terms and conditions.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/auth/register/user/",
        {
          username, 
          email,
          phone_number: phoneNumber, 
          password,
          password2: confirmPassword,
          role: 1, 
        }
      );

      console.log(response.data);
      setSuccess("Registration successful! Redirecting to login...");
      toast.success("Account created successfully!");

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      console.error(err);
      if (err.response && err.response.data) {
        const messages = Object.values(err.response.data).flat();
        setError(messages.join(" "));
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
      toast.error("Registration failed. Please check your information.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      
      <div className="min-h-screen bg-gradient-to-b from-[#004d40] to-[#00695c] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#55DD4A]/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#55DD4A]/10 rounded-full blur-3xl -ml-20 -mb-20"></div>
        
        <div className="w-full max-w-lg relative z-10">
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl shadow-2xl overflow-hidden">
            <div className="p-8 sm:p-10">
              <div className="text-center mb-8">
                <div className="flex justify-center">
                  <div className="bg-[#55DD4A]/20 p-3 rounded-full mb-5">
                    <UserPlus className="h-8 w-8 text-[#55DD4A]" />
                  </div>
                </div>
                <h1 className="text-3xl font-bold text-white">Create Your Account</h1>
                <p className="text-[#ADE1B0] mt-2">Join PashuSagar to access our services</p>
              </div>
              
              {success && (
                <div className="bg-green-500/20 border border-green-300/30 rounded-lg p-4 mb-6 flex items-start">
                  <CheckCircle className="text-green-300 mr-2 flex-shrink-0 mt-0.5" size={18} />
                  <p className="text-white text-sm">{success}</p>
                </div>
              )}

              {error && (
                <div className="bg-red-500/20 border border-red-300/30 rounded-lg p-4 mb-6 flex items-start">
                  <AlertCircle className="text-red-300 mr-2 flex-shrink-0 mt-0.5" size={18} />
                  <p className="text-white text-sm">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <label className="block text-sm font-medium text-[#ADE1B0]" htmlFor="username">
                      Username
                    </label>
                    <button 
                      type="button" 
                      onClick={() => setShowUsernameHelp(!showUsernameHelp)}
                      className="text-white/70 hover:text-white"
                    >
                      <HelpCircle size={16} />
                    </button>
                  </div>
                  
                  <div className="relative">
                    <input
                      type="text"
                      id="username"
                      name="username"
                      value={username}
                      onChange={handleUsernameChange}
                      placeholder="Enter your username"
                      required
                      className="pl-10 w-full px-3 py-3 bg-white text-gray-800 border border-white/30 
                      rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 
                      focus:ring-[#55DD4A] focus:border-transparent"
                    />
                    <User className="absolute left-3 top-3.5 text-gray-500" size={18} />
                  </div>
                  
                    {showUsernameHelp && (
                      <div className="bg-white/10 p-3 rounded-lg mt-2 text-white/80 text-sm">
                        <p>Username can contain letters, numbers, spaces, and basic punctuation (. , - _ @)</p>
                      </div>
                    )}
                </div>

                <div className="space-y-1">
                  <label className="block text-sm font-medium text-[#ADE1B0]" htmlFor="email">
                    Email
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@example.com"
                      required
                      className="pl-10 w-full px-3 py-3 bg-white text-gray-800 border border-white/30 
                      rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 
                      focus:ring-[#55DD4A] focus:border-transparent"
                    />
                    <Mail className="absolute left-3 top-3.5 text-gray-500" size={18} />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-sm font-medium text-[#ADE1B0]" htmlFor="phoneNumber">
                    Phone Number
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      id="phoneNumber"
                      name="phoneNumber"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="1234567890"
                      pattern="[0-9]{10}"
                      title="Enter a valid 10-digit phone number"
                      required
                      className="pl-10 w-full px-3 py-3 bg-white text-gray-800 border border-white/30 
                      rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 
                      focus:ring-[#55DD4A] focus:border-transparent"
                    />
                    <Phone className="absolute left-3 top-3.5 text-gray-500" size={18} />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-[#ADE1B0]" htmlFor="password">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        id="password"
                        name="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                        className="pl-10 w-full px-3 py-3 bg-white text-gray-800 border border-white/30 
                        rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 
                        focus:ring-[#55DD4A] focus:border-transparent"
                      />
                      <Lock className="absolute left-3 top-3.5 text-gray-500" size={18} />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3.5 text-gray-500 hover:text-gray-700"
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-[#ADE1B0]" htmlFor="confirmPassword">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        id="confirmPassword"
                        name="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                        className="pl-10 w-full px-3 py-3 bg-white text-gray-800 border border-white/30 
                        rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 
                        focus:ring-[#55DD4A] focus:border-transparent"
                      />
                      <Lock className="absolute left-3 top-3.5 text-gray-500" size={18} />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-3.5 text-gray-500 hover:text-gray-700"
                      >
                        {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="flex items-center text-sm text-white">
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-[#55DD4A] bg-white border-gray-300 rounded focus:ring-[#55DD4A]"
                      required
                      checked={agreeTerms}
                      onChange={(e) => setAgreeTerms(e.target.checked)}
                    />
                    <span className="ml-2">
                      By creating an account, you agree to our
                      <NavLink
                        to="/terms"
                        className="text-[#55DD4A] hover:underline ml-1"
                      >
                        terms and conditions
                      </NavLink>
                      &nbsp;and
                      <NavLink
                        to="/privacy"
                        className="text-[#55DD4A] hover:underline ml-1"
                      >
                        privacy policy
                      </NavLink>
                      .
                    </span>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full px-4 py-3 text-white font-medium rounded-lg shadow mt-6
                  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#55DD4A] flex items-center justify-center ${
                    isLoading
                      ? "bg-[#55DD4A]/50 cursor-not-allowed"
                      : "bg-[#55DD4A] hover:bg-[#4BC940]"
                  }`}
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creating Account...
                    </>
                  ) : (
                    <>
                      Create Account <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </button>

                <div className="text-center mt-6">
                  <p className="text-white">
                    Already have an account?{" "}
                    <NavLink to="/login" className="text-[#55DD4A] font-medium hover:underline">
                      Sign in
                    </NavLink>
                  </p>
                </div>
              </form>
            </div>
          </div>
          
          <div className="mt-6 text-center">
            <p className="text-white/70 text-sm flex items-center justify-center">
              <ShieldCheck className="h-4 w-4 mr-2" />
              Your information is encrypted and protected.
            </p>
          </div>
        </div>
      </div>
      
      <Footer />
    </>
  );
};

export default Signup;