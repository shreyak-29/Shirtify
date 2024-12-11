import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Navbar = () => {
    const navigate = useNavigate();
    const [userInfo, setUserInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const backendUrl = import.meta.env.VITE_BACKEND_URL; 

    
    const handleLogout = () => {
        localStorage.clear();
        navigate('/');
    };

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const userId = localStorage.getItem('userID');
                if (!userId) {
                    setLoading(false);
                    return;
                }

                const response = await axios.get(`${backendUrl}/v1/auth/user/${userId}`);
                setUserInfo(response.data);
            } catch (err) {
                setError('Failed to fetch user info');
            } finally {
                setLoading(false);
            }
        };

        fetchUserInfo();
    }, []);

    return (
        <nav className="bg-white shadow-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex">
                        <div className="flex-shrink-0 flex items-center">
                            <Link
                                to="/home"
                                className="text-xl font-bold text-blue-600 hover:text-blue-700 transition-colors"
                            >
                                TS
                            </Link>
                        </div>

                        <div className="hidden md:ml-6 md:flex md:space-x-4">
                            <Link
                                to="/home"
                                className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors"
                            >
                                Home
                            </Link>

                            {userInfo?.isAdmin && (
                                <Link
                                    to="/products"
                                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors"
                                >
                                    Products
                                </Link>
                            )}

                            <Link
                                to="/remove"
                                className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors"
                            >
                                Remove Background
                            </Link>
                        </div>
                    </div>

                    {/* User section */}
                    <div className="hidden md:flex items-center space-x-4">
                        {loading ? (
                            <div className="flex items-center">
                                <svg className="animate-spin h-5 w-5 text-blue-600 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                <span className="text-sm text-gray-600">Loading...</span>
                            </div>
                        ) : error ? (
                            <span className="text-sm text-red-600">{error}</span>
                        ) : userInfo && (
                            <div className="flex items-center space-x-10">
                                <div className="flex flex-col">
                                    <span className="text-sm text-gray-600">Welcome,</span>
                                    <span className="text-sm font-medium text-gray-900">{userInfo.fullName}</span>
                                </div>

                            </div>
                        )}
                                <button
                                    onClick={handleLogout}
                                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                                >
                                    Logout
                                </button>
                    </div>

                    <div className="flex items-center md:hidden">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
                        >
                            <span className="sr-only">Open main menu</span>
                            <svg
                                className={`${isMenuOpen ? 'hidden' : 'block'} h-6 w-6`}
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                            <svg
                                className={`${isMenuOpen ? 'block' : 'hidden'} h-6 w-6`}
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            <div className={`${isMenuOpen ? 'block' : 'hidden'} md:hidden`}>
                <div className="px-2 pt-2 pb-3 space-y-1">
                    <Link
                        to="/home"
                        className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                    >
                        Home
                    </Link>

                    {userInfo?.isAdmin && (
                        <Link
                            to="/products"
                            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                        >
                            Products
                        </Link>
                    )}

                    <Link
                        to="/remove"
                        className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                    >
                        Remove Background
                    </Link>

                    {userInfo && (
                        <div className="px-3 py-2">
                            <div className="text-sm text-gray-600">Welcome, {userInfo.fullName}</div>
                            <button
                                onClick={handleLogout}
                                className="mt-2 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;