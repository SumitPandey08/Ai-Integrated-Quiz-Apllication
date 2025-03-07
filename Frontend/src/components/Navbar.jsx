import React, { useState, useRef, useEffect } from 'react';
import image from '../assets/image.png';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser, FaSignOutAlt, FaSignInAlt, FaUserPlus, FaCog, FaBars } from 'react-icons/fa';

function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const isLoggedIn = localStorage.getItem('token');
  const userName = localStorage.getItem('userName');
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    navigate('/login');
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownRef]);

  return (
    <nav className="bg-black text-white shadow-md">
      <div className="container mx-auto py-3 flex justify-between items-center">
        <Link to="/">
          <img src={image} alt="Site Logo" className="h-16 w-auto object-contain sm:w-20" />
        </Link>

        <button
          onClick={toggleMobileMenu}
          className="sm:hidden text-2xl"
          aria-expanded={isMobileMenuOpen}
          aria-controls="mobile-menu"
        >
          <FaBars />
        </button>

        <div
          id="mobile-menu"
          className={`sm:hidden absolute top-full left-0 w-full bg-gray-800 rounded-md shadow-lg p-4 mt-1 ${
            isMobileMenuOpen ? 'block' : 'hidden'
          }`}
        >
          <ul className="flex flex-col space-y-3">
            <li><Link to="/" className="hover:text-blue-500 transition-colors duration-200 p-2">Home</Link></li>
            <li><Link to="/quiz" className="hover:text-blue-500 transition-colors duration-200 p-2">Quiz</Link></li>
            <li><Link to="/about" className="hover:text-blue-500 transition-colors duration-200 p-2">About</Link></li>
            <li><Link to="/contact" className="hover:text-blue-500 transition-colors duration-200 p-2">Contact</Link></li>
            {isLoggedIn ? (
              <>
                <li><Link to="/profile" className="flex items-center hover:bg-gray-700 rounded-md p-2">
                  <FaUser className="mr-2" /> Profile
                </Link></li>
                <li><Link to="/settings" className="flex items-center hover:bg-gray-700 rounded-md p-2">
                  <FaCog className="mr-2" /> Settings
                </Link></li>
                <li><button onClick={handleLogout} className="flex items-center hover:bg-gray-700 rounded-md p-2">
                  <FaSignOutAlt className="mr-2" /> Logout
                </button></li>
              </>
            ) : (
              <>
                <li><Link to="/login" className="flex items-center hover:bg-gray-700 rounded-md p-2">
                  <FaSignInAlt className="mr-2" /> Login
                </Link></li>
                <li><Link to="/signup" className="flex items-center hover:bg-gray-700 rounded-md p-2">
                  <FaUserPlus className="mr-2" /> Signup
                </Link></li>
              </>
            )}
          </ul>
        </div>

        <div className="hidden sm:flex space-x-6 text-lg">
          <Link to="/" className="hover:text-blue-500 transition-colors duration-200">Home</Link>
          <Link to="/quiz" className="hover:text-blue-500 transition-colors duration-200">Quiz</Link>
          <Link to="/about" className="hover:text-blue-500 transition-colors duration-200">About</Link>
          <Link to="/contact" className="hover:text-blue-500 transition-colors duration-200">Contact</Link>
        </div>

        <div className="relative hidden sm:block" ref={dropdownRef}>
          {isLoggedIn ? (
            <button onClick={toggleDropdown} className="flex items-center hover:text-gray-300 transition-colors duration-200">
              <FaUser className="mr-2" /> {userName}
            </button>
          ) : (
            <button onClick={toggleDropdown} className="flex items-center hover:text-gray-300 transition-colors duration-200">
              <FaUser className="mr-2" /> Account
            </button>
          )}

          <div className={`absolute top-full right-0 bg-gray-700 rounded-md shadow-lg p-2 mt-2 z-50 ${isDropdownOpen ? 'block' : 'hidden'}`}>
            {isLoggedIn ? (
              <ul className="flex flex-col space-y-2">
                <li><Link to="/profile" className="flex items-center hover:bg-gray-700 rounded-md p-2">
                  <FaUser className="mr-2" /> Profile
                </Link></li>
                <li><Link to="/settings" className="flex items-center hover:bg-gray-700 rounded-md p-2">
                  <FaCog className="mr-2" /> Settings
                </Link></li>
                <li><button onClick={handleLogout} className="flex items-center hover:bg-gray-700 rounded-md p-2">
                  <FaSignOutAlt className="mr-2" /> Logout
                </button></li>
              </ul>
            ) : (
              <ul className="flex flex-col space-y-2">
                <li><Link to="/login" className="flex items-center hover:bg-gray-700 rounded-md p-2">
                  <FaSignInAlt className="mr-2" /> Login
                </Link></li>
                <li><Link to="/signup" className="flex items-center hover:bg-gray-700 rounded-md p-2">
                  <FaUserPlus className="mr-2" /> Signup
                </Link></li>
              </ul>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;