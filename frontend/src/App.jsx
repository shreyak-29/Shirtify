import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import Register from './pages/Register'; // Import other pages as needed
import ProductsPage from './pages/ProductPage';
import ImageUploadAndRemoveBg from './pages/RemoveBg';
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute'; // Import the PrivateRoute component
import LoginPage from './pages/Login';

const App = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <Routes>
            <Route path="/" element={<LoginPage />} /> {/* Login page is open to everyone */}
            <Route path="/register" element={<Register />} /> {/* Login page is open to everyone */}
            <Route
              path="/home"
              element={<PrivateRoute element={<HomePage />} />}
            />
            <Route
              path="/products"
              element={<PrivateRoute element={<ProductsPage />} />}
            />
            <Route
              path="/remove"
              element={<PrivateRoute element={<ImageUploadAndRemoveBg />} />}
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
