import React from 'react';
import { Navigate } from 'react-router-dom';

// Private Route Component
const PrivateRoute = ({ element }) => {
    const userId = localStorage.getItem('userID'); 
    if (!userId) {
        return <Navigate to="/" replace />;
    }

    return element; 
};

export default PrivateRoute;
