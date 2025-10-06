import React, { useState, useEffect } from 'react';
import { FaFilter, FaSearch, FaCheck, FaTruck, FaTimes, FaClock, FaEllipsisH } from 'react-icons/fa';
import { Navigate } from 'react-router-dom';

// Protected Route Component
const isAuthenticated = () => {
  // In a real application, this should check for a valid JWT or session token.
  const token = localStorage.getItem('authToken');
  return !!token;
};

const ProtectedRoute = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/login" />;
};

// Mock API Call
const fetchProductOrders = async () => {
  // This would be your actual API call to a Node/Express/MongoDB backend.
  // For this example, we'll use a hardcoded data set.
  return [
    { id: '1', vendorName: 'S R SHOP', productName: 'Lemon', quantity: '5kg', cost: 700, orderedOn: 'Feb 15, 2022', status: 'Delivered' },
    { id: '2', vendorName: 'S R SHOP', productName: 'Mango', quantity: '5kg', cost: 700, orderedOn: 'Feb 15, 2022', status: 'Upcoming' },
    { id: '3', vendorName: 'S R SHOP', productName: 'Muskmelon', quantity: '5kg', cost: 700, orderedOn: 'Feb 15, 2022', status: 'Out for Delivery' },
    { id: '4', vendorName: 'S R SHOP', productName: 'Honey', quantity: '5kg', cost: 700, orderedOn: 'Feb 15, 2022', status: 'Not Delivered' },
  ];
};

const ProductOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getOrders = async () => {
      const fetchedOrders = await fetchProductOrders();
      setOrders(fetchedOrders);
      setLoading(false);
    };
    getOrders();
  }, []);

  const getStatusStyles = (status) => {
    switch (status) {
      case 'Delivered':
        return 'bg-green-100 text-green-700';
      case 'Upcoming':
        return 'bg-blue-100 text-blue-700';
      case 'Out for Delivery':
        return 'bg-yellow-100 text-yellow-700';
      case 'Not Delivered':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Delivered':
        return <FaCheck className="inline-block mr-1" />;
      case 'Upcoming':
        return <FaClock className="inline-block mr-1" />;
      case 'Out for Delivery':
        return <FaTruck className="inline-block mr-1" />;
      case 'Not Delivered':
        return <FaTimes className="inline-block mr-1" />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-2xl font-semibold text-gray-700">
        <svg className="animate-spin -ml-1 mr-3 h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Loading...
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="bg-gray-50 min-h-screen p-4 md:p-8 font-sans">
        <div className="max-w-7xl mx-auto bg-white shadow-xl rounded-lg overflow-hidden">
          <div className="p-4 md:p-6 border-b border-gray-200 flex justify-between items-center flex-wrap gap-4">
            <h1 className="text-xl md:text-2xl font-bold text-gray-800">Product Orders</h1>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative w-full sm:w-auto">
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full sm:w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:border-blue-500"
                />
              </div>
              <button className="p-3 border border-gray-300 rounded-full hover:bg-gray-100 transition-colors duration-200 text-gray-600">
                <FaFilter />
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-4 md:px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Vendor Name
                  </th>
                  <th scope="col" className="px-4 md:px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Product Name
                  </th>
                  <th scope="col" className="px-4 md:px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Quantity
                  </th>
                  <th scope="col" className="px-4 md:px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Cost
                  </th>
                  <th scope="col" className="px-4 md:px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Ordered On
                  </th>
                  <th scope="col" className="px-4 md:px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.vendorName}</td>
                    <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.productName}</td>
                    <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.quantity}</td>
                    <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm text-gray-500">₹ {order.cost}</td>
                    <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.orderedOn}</td>
                    <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusStyles(order.status)}`}>
                        {getStatusIcon(order.status)}
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-4 md:p-6 border-t border-gray-200 flex justify-between items-center">
            <div className="text-sm text-gray-700">
              Showing <span className="font-semibold">1</span> to <span className="font-semibold">4</span> of <span className="font-semibold">10</span> results
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors duration-200">
                &lt;
              </button>
              <button className="p-2 w-8 h-8 rounded-lg bg-blue-600 text-white font-semibold">1</button>
              <button className="p-2 w-8 h-8 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100">2</button>
              <button className="p-2 w-8 h-8 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100">3</button>
              <span className="text-gray-400">...</span>
              <button className="p-2 w-8 h-8 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100">10</button>
              <button className="p-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors duration-200">
                &gt;
              </button>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default ProductOrders;