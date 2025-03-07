import React from 'react';
import { useNavigate } from 'react-router-dom';

const LogoutButton = ({ onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/user/logout`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        if (onLogout) {
          onLogout();
        }
        console.log('Logout successful');
        navigate('/login'); // Redirect to login
      } else {
        console.error('Logout failed:', response.statusText);
        alert('Logout failed. Please try again.'); // User feedback
      }
    } catch (error) {
      console.error('Logout error:', error);
      alert('An error occurred during logout. Please check your network connection.'); // User feedback
    }
  };

  return <button onClick={handleLogout}>Logout</button>;
};

export default LogoutButton;