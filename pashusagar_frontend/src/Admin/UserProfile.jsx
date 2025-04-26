import { User } from "lucide-react";

const UserProfile = ({ user }) => {
  return (
    <div className="mt-4">
      <div className="flex flex-col md:flex-row items-start md:items-center">
        <div className="w-24 h-24 rounded-full bg-[#e0f2f1] flex items-center justify-center overflow-hidden mr-6 mb-4 md:mb-0">
          {user.profile_image ? (
            <img
              src={`http://127.0.0.1:8000${user.profile_image}`}
              alt="User profile"
              className="w-full h-full object-cover"
            />
          ) : (
            <User size={48} className="text-[#004d40]" />
          )}
        </div>
        <div>
          <h2 className="text-2xl font-semibold">{user.username || "User"}</h2>
          <p className="text-gray-500 capitalize">
            {user.role === 0 ? "Admin" : "User"}
          </p>
          <div className="mt-4 space-x-3">
            <button className="px-4 py-2 bg-[#004d40] text-white rounded-lg hover:bg-[#00695c] transition-colors">
              Edit Profile
            </button>
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors">
              Change Password
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;