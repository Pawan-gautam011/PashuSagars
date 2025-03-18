import { useAuth0 } from "@auth0/auth0-react";
import Navbar from "../Components/Navbar";

const MyAccount = () => {
  let username = localStorage.getItem("username");
  let email = localStorage.getItem("email");
  let phoneNumber = localStorage.getItem("phoneNumber");
  const { user, isAuthenticated } = useAuth0();

  return (
    <>
      <Navbar />
      <div className="bg-gradient-to-b from-[#00574B] to-[#009366] flex justify-center items-center min-h-screen">
        <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md sm:max-w-lg md:max-w-xl mt-20 mb-20">
          <h1 className="text-2xl font-bold text-center text-[#00574B]">
            My Account
          </h1>
          <div className="space-y-4 mt-6">
            {isAuthenticated && (
              <img
                className="border-2 border-red-400 rounded-full h-16  w-16"
                src={user?.picture}
                alt=""
              />
            )}
            <div className="flex justify-between">
              <span className="font-medium text-[#00574B]">
                Username:{user?.name}
              </span>
              <span>{username}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-[#00574B]">
                Email:{user?.email}
              </span>
              <span>{email}</span>
            </div>
            <div className="flex justify-between">
              {/* <span className="font-medium text-[#00574B]">Phone Number:</span> */}
              {/* <span>{phoneNumber}</span> */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MyAccount;
