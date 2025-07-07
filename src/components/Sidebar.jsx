import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FaHome, FaCalendarAlt, FaSignOutAlt, FaTooth } from "react-icons/fa";

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
<div className="w-64 h-screen fixed top-0 left-0 bg-gradient-to-b from-blue-800 to-blue-600 text-white p-6 shadow-xl overflow-y-auto z-50">
      <h2 className="text-3xl font-bold mb-8">Dental Center</h2>
      <ul className="space-y-5">
        <li>
          <Link to="/dashboard" className="flex items-center gap-3 hover:underline">
            <FaHome /> Dashboard
          </Link>
        </li>

        {user?.role === "Admin" && (
          <li>
            <Link to="/patients" className="flex items-center gap-3 hover:underline">
              <FaTooth /> Manage Patients
            </Link>
          </li>
        )}

        {/* Only Admin sees Calendar */}
        {user?.role === "Admin" && (
          <li>
            <Link to="/calendar" className="flex items-center gap-3 hover:underline">
              <FaCalendarAlt /> Calendar
            </Link>
          </li>
        )}

        <li>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 bg-red-500 hover:bg-red-600 text-white px-4 py-2 mt-4 rounded w-full justify-center"
          >
            <FaSignOutAlt /> Logout
          </button>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
