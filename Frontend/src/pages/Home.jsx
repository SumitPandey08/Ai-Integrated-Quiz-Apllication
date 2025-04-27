import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const Home = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userName, setUserName] = useState('Account');
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const checkAuthStatus = async () => {
            setIsLoading(true);
            const token = localStorage.getItem('token');

            console.log('Home: Checking auth status...');
            console.log('Home: Token from localStorage:', token);

            if (token) {
                try {
                    const decodedToken = jwtDecode(token);
                    const currentTime = Date.now() / 1000;

                    console.log('Home: Decoded token:', decodedToken);
                    console.log('Home: Current time:', currentTime);
                    console.log('Home: Token expiry:', decodedToken.exp);

                    if (decodedToken.exp > currentTime) {
                        setIsLoggedIn(true);
                        // Extract username (or your user identifier) from the token payload
                        setUserName(decodedToken.username || decodedToken.sub || 'User'); // Adjust based on your token's payload
                        console.log('Home: Token is valid. Setting isLoggedIn to:', true, 'and userName to:', userName);
                    } else {
                        localStorage.removeItem('token');
                        setIsLoggedIn(false);
                        setUserName('Account');
                        console.log('Home: Token expired. Clearing localStorage and setting logged out.');
                    }
                } catch (error) {
                    console.error('Home: Error decoding token:', error);
                    localStorage.removeItem('token');
                    setIsLoggedIn(false);
                    setUserName('Account');
                    console.log('Home: Error decoding token. Clearing localStorage and setting logged out.');
                }
            } else {
                setIsLoggedIn(false);
                setUserName('Account');
                console.log('Home: No token found. Setting logged out.');
            }
            setIsLoading(false);
            console.log('Home: Authentication check complete. isLoggedIn:', isLoggedIn, 'userName:', userName, 'isLoading:', isLoading);
        };

        checkAuthStatus();
    }, []);

    const handleStartQuiz = () => {
        if (isLoggedIn) {
            navigate('/quiz');
        } else {
            navigate('/login');
        }
    };

    return (
        <div
            className="min-h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center relative"
            style={{ backgroundImage: `url(https://i.pinimg.com/originals/88/3b/2a/883b2a6dad11501a861af208c9480c97.jpg)` }}
        >
            <div className="text-center p-12 max-w-3xl bg-black bg-opacity-80 rounded-2xl shadow-2xl relative z-10">
                {isLoading ? (
                    <p className="text-gray-300 italic">Checking session...</p>
                ) : isLoggedIn ? (
                    <h2 className="text-4xl text-white font-extrabold mb-6 tracking-wide">
                        Hello <span className="text-blue-400">{userName}</span>
                    </h2>
                ) : null}
                <h1 className="text-4xl font-extrabold mb-6 text-blue-400 tracking-wide">
                    Unlock Your Potential with AI Quizzes
                </h1>
                <p className="text-lg mb-4 text-gray-300 leading-relaxed">
                    Welcome to the <span className="text-blue-500 font-semibold">AI Integrated</span> Quiz Application.
                    Challenge yourself, learn new things, and boost your confidence.
                </p>
                <div className="mb-8">
                    <p className="italic text-xl text-gray-300 mb-2">
                        "Every quiz is a chance to learn, but more so, a chance to grow."
                    </p>
                    <p className="text-gray-300">- Educater</p>
                </div>
                <hr className="border-gray-700 mb-8" />
                <div className="space-y-4">
                    <p className="text-2xl font-semibold text-white">Create, Solve, and Conquer.</p>
                    <p className="text-xl text-gray-300">Ready to start your learning journey?</p>
                </div>
                {isLoggedIn ? (
                    <div className="mt-10 flex justify-center gap-6">
                        <button
                            onClick={handleStartQuiz}
                            className="text-white px-8 py-4 rounded-full shadow-md bg-blue-500 hover:bg-blue-600 transition-colors duration-300 text-lg font-semibold"
                        >
                            Start Quiz
                        </button>
                    </div>
                ) : (
                    <div className="mt-10 flex justify-center gap-6">
                        <Link to="/signup">
                            <button className="text-white px-8 py-4 rounded-full shadow-md bg-blue-500 hover:bg-blue-600 transition-colors duration-300 text-lg font-semibold">
                                Sign up
                            </button>
                        </Link>
                        <Link to="/login">
                            <button className="text-white px-8 py-4 rounded-full shadow-md bg-blue-500 hover:bg-blue-600 transition-colors duration-300 text-lg font-semibold">
                                Login
                            </button>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Home;