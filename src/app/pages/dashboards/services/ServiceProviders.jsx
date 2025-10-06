import React, { useState, useEffect } from 'react';
import { FaStar, FaUserCircle, FaEllipsisH, FaCheckCircle, FaTimesCircle, FaBan } from 'react-icons/fa';
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
const fetchServiceProviders = async () => {
  // This would be your actual API call to a Node/Express/MongoDB backend.
  // For this example, we'll use a hardcoded data set.
  return [
    { id: '1', providerName: 'Username', typeOfService: 'General Repair', cost: 60, rating: 4, action: 'Approve', reason: 'Service Charge too high. Reduce to 30₹' },
    { id: '2', providerName: 'Username', typeOfService: 'Plumbing', cost: 30, rating: 5, action: 'Dis Approved', reason: 'Service Charge too high. Reduce to 30₹' },
    { id: '3', providerName: 'Username', typeOfService: 'Computer Repair', cost: 12, rating: 3.5, action: 'Suspend / Block', reason: 'Service Charge too high. Reduce to 30₹' },
    { id: '4', providerName: 'Username', typeOfService: 'A/c repair', cost: 41, rating: 4.5, action: 'Dropdown', reason: 'Service Charge too high. Reduce to 30₹' },
  ];
};

const ServiceProviders = () => {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getProviders = async () => {
      const fetchedProviders = await fetchServiceProviders();
      setProviders(fetchedProviders);
      setLoading(false);
    };
    getProviders();
  }, []);

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
            <h1 className="text-xl md:text-2xl font-bold text-gray-800">Service Providers</h1>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-4 md:px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Service Provider Name
                  </th>
                  <th scope="col" className="px-4 md:px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Type of Service
                  </th>
                  <th scope="col" className="px-4 md:px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Cost
                  </th>
                  <th scope="col" className="px-4 md:px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Previous Rating
                  </th>
                  <th scope="col" className="px-4 md:px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                  <th scope="col" className="px-4 md:px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Reason
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {providers.map((provider) => (
                  <tr key={provider.id} className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 flex items-center gap-2">
                      <FaUserCircle className="text-4xl text-gray-400" />
                      {provider.providerName}
                    </td>
                    <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm text-gray-500">{provider.typeOfService}</td>
                    <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm text-gray-500">₹{provider.cost}</td>
                    <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        {getRatingStars(provider.rating)}
                      </div>
                    </td>
                    <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm">
                      <select className="px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="Approve">Approve</option>
                        <option value="Dis Approved">Dis Approved</option>
                        <option value="Suspend / Block">Suspend / Block</option>
                        <option value="Dropdown">Dropdown</option>
                      </select>
                    </td>
                    <td className="px-4 md:px-6 py-4 whitespace-normal text-sm text-gray-500 max-w-xs">{provider.reason}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default ServiceProviders;