import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import LogoutButton from '../components/LogoutButton'; // Adjust the path as needed

const LogoutPage = () => {
  const navigate = useNavigate();

  const handleLogoutSuccess = () => {
    navigate('/'); // Redirect to home page after logout
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center relative"
      style={{ backgroundImage: `url(https://i.pinimg.com/originals/88/3b/2a/883b2a6dad11501a861af208c9480c97.jpg)` }}
    >
      <div className="text-center p-12 max-w-3xl bg-black bg-opacity-80 rounded-2xl shadow-2xl relative z-10">
        <h2 className="text-4xl font-extrabold mb-6 text-blue-400 tracking-wide">
          Confirm Logout
        </h2>
        <p className="text-lg mb-4 text-gray-300 leading-relaxed">
          Are you sure you want to log out?
        </p>

        <LogoutButton onLogout={handleLogoutSuccess} />

        <div className="mt-8">
          <Link to="/" className="text-blue-400 hover:underline">
            Go back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LogoutPage;