import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const SignUp = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/user/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, username, password }),
      });

      const result = await response.json();

      if (response.ok) {
        setMessage('Sign-up successful!');
        setIsError(false);
        navigate('/'); // Redirect to home or login
      } else {
        if (result.errors && result.errors.length > 0) {
          setMessage(result.errors[0].msg);
        } else {
          setMessage(result.msg || 'Sign-up failed.');
        }
        setIsError(true);
      }
    } catch (error) {
      setMessage('An error occurred during sign-up.');
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-screen flex flex-col items-center justify-center bg-gray-900">
      <div className="bg-gray-800 p-10 rounded-2xl shadow-2xl w-full max-w-md">
        <h2 className="text-3xl font-bold mb-8 text-blue-400 text-center">Sign Up</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-300">Full Name</label>
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 border border-gray-700 rounded-lg bg-gray-700 text-white focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-300">Email</label>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-gray-700 rounded-lg bg-gray-700 text-white focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-300">Username</label>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-3 border border-gray-700 rounded-lg bg-gray-700 text-white focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-300">Password</label>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-gray-700 rounded-lg bg-gray-700 text-white focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full bg-blue-500 text-white p-3 rounded-full font-semibold hover:bg-blue-600 transition duration-200 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isLoading ? 'Signing Up...' : 'Sign Up'}
          </button>
          {message && (
            <p
              className={`mt-4 text-center ${
                isError ? 'text-red-500' : 'text-green-500'
              }`}
            >
              {message}
            </p>
          )}
        </form>
        <div className="mt-4 text-center">
          <Link to="/" className="text-blue-500 hover:underline">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignUp;