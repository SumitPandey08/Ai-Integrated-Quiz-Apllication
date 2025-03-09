import React, { useEffect } from 'react';
import useApi from '../components/useApi'; // Import the custom hook

const Profile = () => {
  const { data: profile, error, loading, fetchData } = useApi();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchData('http://localhost:3210/api/user/profile', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
    }
  }, [fetchData]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!profile) return null; // Or a placeholder

  return (
    <div>
      <h2>Profile</h2>
      <p>Name: {profile.name}</p>
      <p>Username: {profile.username}</p>
      <p>Email: {profile.email}</p>
      {profile.avatar && <img src={profile.avatar} alt="Profile Avatar" style={{ maxWidth: '200px' }} />}
    </div>
  );
};

export default Profile;