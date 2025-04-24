import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { FcGoogle } from "react-icons/fc";
import { Eye, EyeOff, Mail, Lock, AlertCircle, LogIn, ArrowRight, ShieldCheck } from "lucide-react";
import { toast } from "react-toastify";

// Import components
import Navbar from "./Navbar";
import Footer from "./Footer";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { loginWithRedirect } = useAuth0();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/auth/login/",
        {
          email,
          password,
        }
      );

      console.log("Login response:", response.data);

      const { access, username, email: userEmail, role, user_id } = response.data;

      if (role === undefined || role === null) {
        throw new Error("Role not found in the response.");
      }
      
      // Store user data in localStorage
      localStorage.setItem("token", access);
      localStorage.setItem("username", username);
      localStorage.setItem("email", userEmail);
      localStorage.setItem("role", role);
      localStorage.setItem("user_id", user_id);

      toast.success("Login successful!");
      
      // Redirect based on role
      if (role === 0) {
        navigate("/admin");
      } else if (role === 2) {
        navigate("/veterinarians");
      } else {
        navigate("/");
      }
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.detail ||
        err.response?.data?.message ||
        "Invalid email or password."
      );
      toast.error("Login failed. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    loginWithRedirect({
      connection: 'google-oauth2',
    });
  };

  return (
    <>
      <Navbar />
      
      <div className="min-h-screen bg-gradient-to-b from-[#004d40] to-[#00695c] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#55DD4A]/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#55DD4A]/10 rounded-full blur-3xl -ml-20 -mb-20"></div>
        
        <div className="w-full max-w-md relative z-10">
          {/* Login Card */}
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="p-8 sm:p-10">
              <div className="text-center mb-8">
                <div className="flex justify-center">
                  <div className="bg-[#55DD4A]/20 p-3 rounded-full mb-5">
                    <LogIn className="h-8 w-8 text-[#55DD4A]" />
                  </div>
                </div>
                <h1 className="text-3xl font-bold text-white">Welcome Back</h1>
                <p className="text-[#ADE1B0] mt-2">Sign in to your PashuSagar account</p>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-500/20 border border-red-300/30 rounded-lg p-3 mb-6 flex items-start">
                  <AlertCircle className="text-red-300 mr-2 flex-shrink-0 mt-0.5" size={18} />
                  <p className="text-white text-sm">{error}</p>
                </div>
              )}

              {/* Login Form */}
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-[#ADE1B0]" htmlFor="email">
                    Email Address
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      required
                      className="pl-10 w-full px-3 py-3 bg-white text-gray-800 border border-white/30 
                      rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 
                      focus:ring-[#55DD4A] focus:border-transparent"
                    />
                    <Mail className="absolute left-3 top-3.5 text-gray-500" size={18} />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between">
                    <label className="block text-sm font-medium text-[#ADE1B0]" htmlFor="password">
                      Password
                    </label>
                    <Link
                      to="/forgetpassword"
                      className="text-sm text-[#55DD4A] hover:text-white hover:underline"
                    >
                      Forgot password?
                    </Link>
                  </div>
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

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="remember"
                    name="remember"
                    className="h-4 w-4 text-[#55DD4A] bg-white border-gray-300 rounded focus:ring-[#55DD4A]"
                  />
                  <label htmlFor="remember" className="ml-2 block text-sm text-white">
                    Remember me
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full px-4 py-3 text-white font-medium rounded-lg shadow transition-colors 
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
                      Signing in...
                    </>
                  ) : (
                    <>
                      Sign in <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </button>
              </form>

              {/* Divider */}
              <div className="mt-8 flex items-center justify-between">
                <div className="w-full h-px bg-white/20"></div>
                <span className="px-3 text-white/60 text-sm">OR</span>
                <div className="w-full h-px bg-white/20"></div>
              </div>

              {/* Social Login */}
              <div className="mt-6">
                <button
                  onClick={handleGoogleLogin}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white
                  rounded-lg text-gray-700 hover:bg-gray-100 transition-colors focus:outline-none 
                  focus:ring-2 focus:ring-offset-2 focus:ring-[#55DD4A]"
                >
                  <FcGoogle size={20} />
                  <span className="font-medium">Sign in with Google</span>
                </button>
              </div>

              {/* Sign Up Link */}
              <div className="mt-8 text-center">
                <p className="text-white">
                  Don't have an account?{" "}
                  <Link to="/signup" className="text-[#55DD4A] font-medium hover:underline">
                    Sign up
                  </Link>
                </p>
              </div>
            </div>
          </div>
          
          {/* Security Note */}
          <div className="mt-6 text-center">
            <p className="text-white/70 text-sm flex items-center justify-center">
              <ShieldCheck className="h-4 w-4 mr-2" />
              Secure login. Your information is encrypted and protected.
            </p>
          </div>
        </div>
      </div>
      
      <Footer />
    </>
  );
};

export default Login;