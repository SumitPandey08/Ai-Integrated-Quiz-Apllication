import React, { useEffect, useState } from 'react'; // Import useState
import useApi from '../components/useApi';

const Profile = () => {
  const { data: profile, error, loading, fetchData } = useApi();
  const [token, setToken] = useState(localStorage.getItem('token')); // Add state for token

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    setToken(storedToken); // Update token state

    if (storedToken) {
      console.log('Profile: Token found in localStorage:', storedToken);
      fetchData('http://localhost:3210/api/user/profile', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${storedToken}`,
        },
      });
    } else {
      console.log('Profile: No token found in localStorage.');
    }
  }, [fetchData]);

  useEffect(() => {
    console.log('Profile: Loading state:', loading);
  }, [loading]);

  useEffect(() => {
    console.log('Profile: Error state:', error);
  }, [error]);

  useEffect(() => {
    console.log('Profile: Profile data state:', profile);
  }, [profile]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error?.message}</div>;
  if (!profile) return null;

  return (
    <div>
      <h2>Profile</h2>
      <p>Name: {profile.name}</p>
      <p>Username: {profile.username}</p>
      <p>Email: {profile.email}</p>
      {/* {profile.avatar && <img src={profile.avatar} alt="Profile Avatar" style={{ maxWidth: '200px' }} />} */}
    </div>
  );
};

export default Profile;