import React, { useState, useEffect } from 'react';
import { FaFilter, FaSearch, FaPlus, FaSpinner, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
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
const fetchStockItems = async () => {
  // This would be your actual API call to a Node/Express/MongoDB backend.
  // For this example, we'll use a hardcoded data set.
  return [
    { id: 90, name: 'Mango', category: 'Fruits', status: 'In Stock', quantity: '28kg', vendorName: 'JSTCLIQ' },
    { id: 28, name: 'Apple', category: 'Fruits', status: 'Out of Stock', quantity: '2kg', vendorName: 'Hanuman Fruits' },
    { id: 2, name: 'Banana', category: 'Fruits', status: 'In Stock', quantity: '8kg', vendorName: 'SR SHOP' },
    { id: 77, name: 'Watermelon', category: 'Fruits', status: 'Out Of Stock', quantity: '82kg', vendorName: 'Jstcliq' },
  ];
};

const getStatusStyles = (status) => {
  switch (status) {
    case 'In Stock':
      return 'bg-green-100 text-green-700';
    case 'Out of Stock':
      return 'bg-red-100 text-red-700';
    default:
      return 'bg-gray-100 text-gray-700';
  }
};

const StockManagementThings = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getItems = async () => {
      const fetchedItems = await fetchStockItems();
      setItems(fetchedItems);
      setLoading(false);
    };
    getItems();
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
      <div className="bg-gray-50 min-h-screen p-4 md:p-8 font-sans">
        <div className="max-w-7xl mx-auto bg-white shadow-xl rounded-lg overflow-hidden">
          <div className="p-4 md:p-6 border-b border-gray-200 flex justify-between items-center flex-wrap gap-4">
            <h1 className="text-xl md:text-2xl font-bold text-gray-800">Stock Management - Fruits</h1>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative w-full sm:w-64">
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:border-blue-500"
                />
              </div>
              <button className="p-3 border border-gray-300 rounded-full hover:bg-gray-100 transition-colors duration-200 text-gray-600">
                <FaFilter />
              </button>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-full font-semibold hover:bg-blue-700 transition-colors hidden sm:flex items-center">
                <FaPlus className="mr-2" />
                Manage Stocks
              </button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-4 md:px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Product ID</th>
                  <th scope="col" className="px-4 md:px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Product Name</th>
                  <th scope="col" className="px-4 md:px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Product Category</th>
                  <th scope="col" className="px-4 md:px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  <th scope="col" className="px-4 md:px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Qty available</th>
                  <th scope="col" className="px-4 md:px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Vendor Name</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {items.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.id}</td>
                    <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.name}</td>
                    <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.category}</td>
                    <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusStyles(item.status)}`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.quantity}</td>
                    <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.vendorName}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-4 md:p-6 border-t border-gray-200 flex justify-between items-center">
            <div className="text-sm text-gray-700">
              Showing <span className="font-semibold">1</span> to <span className="font-semibold">4</span> of <span className="font-semibold">11</span> results
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors duration-200">
                <FaChevronLeft />
              </button>
              <button className="p-2 w-8 h-8 rounded-lg bg-blue-600 text-white font-semibold">1</button>
              <button className="p-2 w-8 h-8 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100">2</button>
              <button className="p-2 w-8 h-8 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100">3</button>
              <button className="p-2 w-8 h-8 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100">4</button>
              <span className="text-gray-400">...</span>
              <button className="p-2 w-8 h-8 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100">11</button>
              <button className="p-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors duration-200">
                <FaChevronRight />
              </button>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default StockManagementThings;