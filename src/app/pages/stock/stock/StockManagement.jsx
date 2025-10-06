import  { useState, useEffect } from 'react';
import { FaSpinner, FaPlus, FaBoxOpen } from 'react-icons/fa';
import { Navigate } from 'react-router-dom';

// Protected Route Component
const isAuthenticated = () => {
  // A real-world check would involve checking a JWT or session token.
  const token = localStorage.getItem('authToken');
  return !!token;
};

const ProtectedRoute = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/login" />;
};

// Mock API Call
const fetchCategories = async () => {
  // This would be your actual API call to a Node/Express/MongoDB backend.
  // For this example, we'll use a hardcoded data set.
  return [
    'Fruits', 'Vegetables', 'Groceries', 'Medical', 'Leafy', 'Dairy',
    'Snacks', 'Drinks', 'Toiletaries', 'Kitchen Essentials', 'Confectionary',
    'Beauty', 'Home Essentials', 'Facecare'
  ];
};

const StockManagement = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getCategories = async () => {
      const fetchedCategories = await fetchCategories();
      setCategories(fetchedCategories);
      setLoading(false);
    };
    getCategories();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-2xl font-semibold text-gray-700">
        <FaSpinner className="animate-spin mr-2" /> Loading...
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="bg-gray-50 min-h-screen p-4 md:p-8 font-sans flex flex-col items-center">
        <div className="max-w-6xl w-full mx-auto bg-white shadow-xl rounded-lg p-6 md:p-10 text-center">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800 flex items-center">
              <FaBoxOpen className="mr-3 text-blue-500" />
              Stock Management
            </h1>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
            {categories.map((category, index) => (
              <div 
                key={index} 
                className="bg-gray-100 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-6 flex flex-col items-center justify-center cursor-pointer transform hover:scale-105"
              >
                <div className="text-xl font-semibold text-gray-700 text-center">
                  {category}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10">
            <button className="bg-blue-600 text-white px-8 py-3 rounded-full text-lg font-semibold shadow-md hover:bg-blue-700 transition-colors duration-300 flex items-center justify-center mx-auto">
              <FaPlus className="mr-2" />
              Create New Category
            </button>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default StockManagement;