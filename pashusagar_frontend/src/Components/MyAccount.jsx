import { useAuth0 } from "@auth0/auth0-react";
import Navbar from "../Components/Navbar";
import { Home, ChevronRight } from "lucide-react";

const MyAccount = () => {
  let username = localStorage.getItem("username");
  let email = localStorage.getItem("email");
  let phoneNumber = localStorage.getItem("phoneNumber");
  const { user, isAuthenticated } = useAuth0();
  
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
  
  const breadcrumbItems = [
    { label: "Home", path: "/" },
    { label: "My Account", path: "/myaccount" },
  ];

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-[#004d40] to-[#00695c] pt-16 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="container mx-auto">
            <EnhancedBreadcrumbs items={breadcrumbItems} />
          </div>
          
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md sm:max-w-lg md:max-w-xl mx-auto">
            <h1 className="text-2xl font-bold text-center text-[#00574B]">
              My Account
            </h1>
            <div className="space-y-4 mt-6">
              {isAuthenticated && (
                <div className="flex justify-center">
                  <img
                    className="border-2 border-red-400 rounded-full h-16 w-16 object-cover"
                    src={user?.picture}
                    alt="Profile"
                  />
                </div>
              )}
              <div className="flex justify-between">
                <span className="font-medium text-[#00574B]">
                  Username
                </span>
                <span>{user?.name || username}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-[#00574B]">
                  Email
                </span>
                <span>{user?.email || email}</span>
              </div>
              {phoneNumber && (
                <div className="flex justify-between">
                  <span className="font-medium text-[#00574B]">Phone Number</span>
                  <span>{phoneNumber}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MyAccount;