// Profile.jsx
import React, { useEffect, useState } from 'react';
import useApi from '../components/useApi';
import { jwtDecode } from 'jwt-decode';
import { useLocation, useNavigate } from 'react-router-dom';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL; // Get the backend URL from env

const Profile = () => {
    const { data: profile, error: profileError, loading: profileLoading, fetchData: fetchProfile } = useApi();
    const [userId, setUserId] = useState('');
    const token = localStorage.getItem('token');
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                setUserId(decodedToken.id || decodedToken._id);
            } catch (error) {
                console.error('Error decoding token:', error);
            }
        }
    }, [token]);

    useEffect(() => {
        if (token && userId) {
            fetchProfile(`${BACKEND_URL}/api/user/profile/${userId}`, { // Use BACKEND_URL
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });
        }
    }, [token, fetchProfile, userId]);

    useEffect(() => {
        if (location.state?.shouldRefetch) {
            fetchProfile(`${BACKEND_URL}/api/user/profile/${userId}`, { // Use BACKEND_URL
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });
            navigate('/profile', { replace: true, state: {} });
        }
    }, [location.state?.shouldRefetch, fetchProfile, navigate, token, userId]);

    useEffect(() => {
        console.log("Profile Data in Profile Component:", profile);
        if (profile?.history) {
            console.log("Quiz History Data:", profile.history);
            profile.history.forEach(item => {
                console.log("History Item:", item);
            });
        }
    }, [profile]);

    if (profileLoading) return (
        <div className="min-h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center relative"
            style={{ backgroundImage: `url(https://i.pinimg.com/originals/88/3b/2a/883b/2a6dad11501a861af208c9480c97.jpg)` }}>
            <div className="text-center p-12 max-w-3xl bg-black bg-opacity-80 rounded-2xl shadow-2xl relative z-10 text-white">
                Loading Profile...
            </div>
        </div>
    );

    if (profileError) return (
        <div className="min-h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center relative"
            style={{ backgroundImage: `url(https://i.pinimg.com/originals/88/3b/2a/883b/2a6dad11501a861af208c9480c97.jpg)` }}>
            <div className="text-center p-12 max-w-3xl bg-black bg-opacity-80 rounded-2xl shadow-2xl relative z-10 text-white">
                Error: {profileError?.message || 'Failed to load profile data.'}
                {profileError?.data && <pre className="text-sm mt-2">{JSON.stringify(profileError.data, null, 2)}</pre>}
            </div>
        </div>
    );

    if (!profile) return (
        <div className="min-h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center relative"
            style={{ backgroundImage: `url(https://i.pinimg.com/originals/88/3b/2a/883b/2a6dad11501a861af208c9480c97.jpg)` }}>
            <div className="text-center p-12 max-w-3xl bg-black bg-opacity-80 rounded-2xl shadow-2xl relative z-10 text-white">
                No profile data available.
            </div>
        </div>
    );

    return (
        <div
            className="min-h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center relative"
            style={{ backgroundImage: `url(https://i.pinimg.com/originals/88/3b/2a/883b/2a6dad11501a861af208c9480c97.jpg)` }}
        >
            <div className="text-center p-12 max-w-3xl bg-black bg-opacity-80 rounded-2xl shadow-2xl relative z-10 text-white">
                <h2 className="text-4xl font-extrabold mb-6 tracking-wide text-blue-400">Your Profile</h2>
                <p className="text-lg mb-2">Name: <span className="text-blue-300">{profile?.name}</span></p>
                <p className="text-lg mb-2">Username: <span className="text-blue-300">{profile?.username}</span></p>
                <p className="text-lg mb-6">Email: <span className="text-blue-300">{profile?.email}</span></p>

                <h3 className="text-2xl font-semibold mb-4 text-green-400">Your Rating</h3>
                {profile?.rating && (
                    <div>
                        <p className="text-lg mb-2">Attempted Quizzes: <span className="text-green-300">{profile.rating.attemptedQuizzes}</span></p>
                        <p className="text-lg mb-2">Completed Quizzes: <span className="text-green-300">{profile.rating.completedQuizzes}</span></p>
                        <p className="text-lg mb-2">Overall Score: <span className="text-green-300">{profile.rating.overallScore?.toFixed(2) || 'N/A'}</span></p>
                        <p className="text-lg mb-6">Average Accuracy: <span className="text-green-300">{profile.rating.averageAccuracy?.toFixed(2) || 'N/A'}%</span></p>

                        {profile?.rating?.categoryScores && Object.keys(profile.rating.categoryScores).length > 0 && (
                            <div>
                                <h4 className="text-xl font-semibold mt-4 mb-2 text-yellow-400">Category Ratings</h4>
                                <ul className="list-none space-y-1">
                                    {Object.entries(profile.rating.categoryScores).map(([category, score]) => (
                                        <li key={category} className="text-yellow-300">
                                            {category}: {score?.toFixed(2) || 'N/A'}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                )}

                <h3 className="text-2xl font-semibold mt-8 mb-4 text-purple-400">Quiz History</h3>
                {profile?.history && profile.history.length > 0 ? (
                    <ul className="list-none space-y-4">
                        {profile.history.map(item => (
                            <li key={item._id} className="bg-gray-800 rounded-md p-4 shadow-md">
                                <p className="font-semibold text-lg text-purple-300">Quiz: {item.quizId?.title || 'Unknown'}</p>
                                <p className="text-gray-300">Category: {item.quizId?.category || 'N/A'}</p>
                                <p className="text-gray-300">Difficulty: {item.quizId?.difficulty || 'N/A'}</p>
                                <p className="text-gray-300">Score: {item.score} / {item.questions?.length || 'Unknown'}</p>
                                {/* You might want to calculate accuracy on the backend */}
                                {/* <p className="text-gray-300">Accuracy: {(item.score / item.questions?.length * 100)?.toFixed(2) || 'N/A'}%</p> */}
                                <p className="text-sm text-gray-500">
                                    Taken on: {item.attemptedAt ?
                                        `${new Date(item.attemptedAt).toLocaleDateString()} ${new Date(item.attemptedAt).toLocaleTimeString()}` :
                                        'Invalid Date'}
                                </p>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-400 italic">No quiz history available yet.</p>
                )}
            </div>
        </div>
    );
};

export default Profile;