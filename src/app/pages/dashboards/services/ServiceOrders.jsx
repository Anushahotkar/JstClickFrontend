import React, { useState, useEffect } from 'react';
import { FaFilter, FaSearch, FaCheck, FaTimes, FaSpinner, FaClock, FaEllipsisH, FaExternalLinkAlt } from 'react-icons/fa';
import { Link, Navigate } from 'react-router-dom';

// Protected Route Component
const isAuthenticated = () => {
  // A real-world check would involve checking a JWT or session token.
  const token = localStorage.getItem('authToken');
  return !!token;
};

const ProtectedRoute = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/login" />;
};

// A conceptual data fetch function
const fetchServiceOrders = async () => {
  // In a real application, this would be an API call to your Node/Express/MongoDB backend
  // For this example, we'll use mock data.
  return [
    { id: '1', serviceName: 'Home cleaning', vendorName: 'Kiran Kumar', status: 'Upcoming', availedOn: '2022-02-15', completedOn: '2023-02-15' },
    { id: '2', serviceName: 'Car wash', vendorName: 'Kiran Kumar', status: 'Scheduled', availedOn: '2022-02-15', completedOn: '2023-02-15' },
    { id: '3', serviceName: 'Bike wash', vendorName: 'Kiran Kumar', status: 'Completed', availedOn: '2022-02-15', completedOn: '2023-02-15' },
    { id: '4', serviceName: 'Home salon', vendorName: 'Kiran Kumar', status: 'Cancelled', availedOn: '2022-02-15', completedOn: '2023-02-15' },
    { id: '5', serviceName: 'Car service', vendorName: 'Kiran Kumar', status: 'Ongoing', availedOn: '2022-02-15', completedOn: '2023-02-15' },
  ];
};

const ServiceOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getOrders = async () => {
      const fetchedOrders = await fetchServiceOrders();
      setOrders(fetchedOrders);
      setLoading(false);
    };
    getOrders();
  }, []);

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Upcoming':
        return 'bg-green-100 text-green-700 border-green-300';
      case 'Scheduled':
        return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'Completed':
        return 'bg-green-100 text-green-700 border-green-300';
      case 'Cancelled':
        return 'bg-red-100 text-red-700 border-red-300';
      case 'Ongoing':
        return 'bg-red-100 text-red-700 border-red-300';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Upcoming':
        return <FaClock className="inline-block mr-1" />;
      case 'Scheduled':
        return <FaSpinner className="inline-block mr-1 animate-spin" />;
      case 'Completed':
        return <FaCheck className="inline-block mr-1" />;
      case 'Cancelled':
        return <FaTimes className="inline-block mr-1" />;
      case 'Ongoing':
        return <FaExternalLinkAlt className="inline-block mr-1 animate-pulse" />;
      default:
        return null;
    }
  };

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
            <h1 className="text-xl md:text-2xl font-bold text-gray-800">Service Orders</h1>
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
                    Service Name
                  </th>
                  <th scope="col" className="px-4 md:px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Vendor Name
                  </th>
                  <th scope="col" className="px-4 md:px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-4 md:px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Availed On
                  </th>
                  <th scope="col" className="px-4 md:px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Completed On
                  </th>
                  <th scope="col" className="px-4 md:px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                  <th scope="col" className="px-4 md:px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    ...
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.serviceName}</td>
                    <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.vendorName}</td>
                    <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusStyle(order.status)}`}>
                        {getStatusIcon(order.status)}
                        {order.status}
                      </span>
                    </td>
                    <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.availedOn}</td>
                    <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.completedOn}</td>
                    <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button className="text-indigo-600 hover:text-indigo-900 transition-colors duration-200 font-semibold">
                        Assign
                      </button>
                    </td>
                    <td className="px-4 md:px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button className="text-gray-500 hover:text-gray-700 transition-colors duration-200">
                        <FaEllipsisH />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-4 md:p-6 border-t border-gray-200 flex justify-between items-center">
            <div className="text-sm text-gray-700">
              Showing <span className="font-semibold">1</span> to <span className="font-semibold">5</span> of <span className="font-semibold">10</span> results
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors duration-200">
                &lt;
              </button>
              <button className="p-2 w-8 h-8 rounded-lg bg-indigo-600 text-white font-semibold">1</button>
              <button className="p-2 w-8 h-8 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100">2</button>
              <button className="p-2 w-8 h-8 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100">3</button>
              <button className="p-2 w-8 h-8 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100">4</button>
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

export default ServiceOrders;