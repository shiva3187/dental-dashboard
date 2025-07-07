// src/components/Header.jsx
import { useAuth } from "../context/AuthContext";

const Header = () => {
  const { user } = useAuth();
  return (
    <header className="bg-white shadow p-4 flex justify-between items-center sticky top-0 z-50">
      <h1 className="text-2xl font-bold text-blue-700">Dental Dashboard</h1>
      <span className="text-gray-600 font-medium">Logged in as: {user?.email}</span>
    </header>
  );
};

export default Header;
