import React, { useState, useEffect } from 'react';
import { FaStar, FaUserCircle, FaCheckCircle, FaSpinner, FaTimes } from 'react-icons/fa';
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
const fetchVendors = async () => {
  // This would be your actual API call to a Node/Express/MongoDB backend.
  // For this example, we'll use a hardcoded data set.
  return [
    { id: '1', vendorName: 'Mario Perez', phone: '9876543210', rating: 4.5 },
    { id: '2', vendorName: 'Antonio Diaz', phone: '9876543210', rating: 5 },
    { id: '3', vendorName: 'Elizabeth Bailey', phone: '9876543210', rating: 4 },
    { id: '4', vendorName: 'Clara Lopez', phone: '9876543210', rating: 3.5 },
  ];
};

const getRatingStars = (rating) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;
  const stars = [];
  
  for (let i = 0; i < fullStars; i++) {
    stars.push(<FaStar key={`full-${i}`} className="text-yellow-400" />);
  }
  if (hasHalfStar) {
    stars.push(<FaStar key="half" className="text-yellow-400" style={{ clipPath: 'inset(0 50% 0 0)' }} />);
  }
  while (stars.length < 5) {
    stars.push(<FaStar key={`empty-${stars.length}`} className="text-gray-300" />);
  }
  return stars;
};

const AssignVendorsModal = ({ isOpen, onClose, onAssign }) => {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      const getVendors = async () => {
        const fetchedVendors = await fetchVendors();
        setVendors(fetchedVendors);
        setLoading(false);
      };
      getVendors();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex justify-center items-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-lg mx-auto transform transition-all scale-100 opacity-100">
        <div className="flex justify-between items-center border-b pb-4 mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Assign Vendors</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 transition-colors">
            <FaTimes size={24} />
          </button>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center py-10 text-lg text-gray-600">
            <FaSpinner className="animate-spin mr-2" /> Loading Vendors...
          </div>
        ) : (
          <div className="overflow-y-auto max-h-96">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Vendor Name</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Phone</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Rating</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {vendors.map(vendor => (
                  <tr key={vendor.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900 flex items-center gap-2">
                      <FaUserCircle className="text-xl text-gray-400" />
                      {vendor.vendorName}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{vendor.phone}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        {getRatingStars(vendor.rating)}
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm">
                      <button 
                        onClick={() => onAssign(vendor)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                      >
                        Assign
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div className="mt-6 flex justify-end">
          <button 
            onClick={onClose}
            className="bg-gray-200 text-gray-800 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

// Parent component to demonstrate modal usage
const AssignServiceVendors = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAssign = (vendor) => {
    // Logic to handle assignment, e.g., send to backend
    console.log('Assigning vendor:', vendor);
    setIsModalOpen(false);
  };

  return (
    <ProtectedRoute>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-8">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-8">Service Orders</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-green-600 text-white px-8 py-4 rounded-full text-lg font-semibold shadow-lg hover:bg-green-700 transition-colors focus:outline-none focus:ring-4 focus:ring-green-500 focus:ring-opacity-50"
        >
          Open Assign Vendors
        </button>
      </div>
      <AssignVendorsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAssign={handleAssign}
      />
    </ProtectedRoute>
  );
};

export default AssignServiceVendors;