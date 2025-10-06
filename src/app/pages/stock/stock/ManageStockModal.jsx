import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { MdClose, MdAdd, MdRemove } from 'react-icons/md';
import { FaSpinner } from 'react-icons/fa';

// Protected Route Component
const isAuthenticated = () => {
  // In a real application, this should check for a valid JWT or session token.
  const token = localStorage.getItem('authToken');
  return !!token;
};

const ProtectedRoute = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/login" />;
};

// Mock API Call for form data
const fetchFormData = async () => {
  // This would be your actual API call to a Node/Express/MongoDB backend.
  return {
    categories: ['Fruits', 'Vegetables', 'Groceries', 'Medical'],
    statuses: ['In Stock', 'Out of Stock', 'Upcoming']
  };
};

const ManageStockModal = ({ isOpen, onClose, onFormSubmit }) => {
  const [formData, setFormData] = useState({
    productCategory: '',
    productName: '',
    productId: '',
    status: '',
    vendorName: '',
    quantity: 0
  });
  const [dataLoading, setDataLoading] = useState(true);
  const [apiData, setApiData] = useState({});

  useEffect(() => {
    const getFormData = async () => {
      setDataLoading(true);
      const data = await fetchFormData();
      setApiData(data);
      setDataLoading(false);
    };
    if (isOpen) {
      getFormData();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleQuantityChange = (change) => {
    setFormData(prev => ({
      ...prev,
      quantity: Math.max(0, prev.quantity + change)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onFormSubmit(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-75 p-4">
      <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-lg mx-auto">
        <div className="flex justify-between items-center border-b pb-4 mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Manage Stocks</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 transition-colors">
            <MdClose size={28} />
          </button>
        </div>

        {dataLoading ? (
          <div className="flex justify-center items-center py-10 text-lg text-gray-600">
            <FaSpinner className="animate-spin mr-2" /> Loading form data...
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="productCategory" className="block text-sm font-medium text-gray-700 mb-1">Product Category</label>
              <select
                id="productCategory"
                name="productCategory"
                value={formData.productCategory}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-colors"
                required
              >
                <option value="">Select a category</option>
                {apiData.categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="productName" className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
              <input
                type="text"
                id="productName"
                name="productName"
                value={formData.productName}
                onChange={handleChange}
                placeholder="Enter the name of the product"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-colors"
                required
              />
            </div>
            <div>
              <label htmlFor="productId" className="block text-sm font-medium text-gray-700 mb-1">Product ID</label>
              <input
                type="text"
                id="productId"
                name="productId"
                value={formData.productId}
                onChange={handleChange}
                placeholder="Enter the Product ID"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-colors"
                required
              />
            </div>
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">Select Status</label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-colors"
                required
              >
                <option value="">Select a status</option>
                {apiData.statuses.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="vendorName" className="block text-sm font-medium text-gray-700 mb-1">Vendor Name</label>
              <input
                type="text"
                id="vendorName"
                name="vendorName"
                value={formData.vendorName}
                onChange={handleChange}
                placeholder="Enter the Vendor Name"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-colors"
                required
              />
            </div>
            <div>
              <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">Enter Quantity to add in grams</label>
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => handleQuantityChange(-10)}
                  className="bg-gray-200 text-gray-800 p-2 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  <MdRemove size={24} />
                </button>
                <input
                  type="number"
                  id="quantity"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  className="flex-grow text-center px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  min="0"
                  required
                />
                <button
                  type="button"
                  onClick={() => handleQuantityChange(10)}
                  className="bg-gray-200 text-gray-800 p-2 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  <MdAdd size={24} />
                </button>
              </div>
            </div>
            <div className="pt-4">
              <button
                type="submit"
                className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold shadow-md hover:bg-blue-700 transition-colors"
              >
                Submit
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

// Parent component to demonstrate modal usage
const ManageStockPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleFormSubmit = (data) => {
    // This is where you would send the data to your backend API.
    console.log('Form submitted with data:', data);
  };

  return (
    <ProtectedRoute>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-8">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-8">Stock Management Dashboard</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-8 py-4 rounded-full text-lg font-semibold shadow-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50"
        >
          Open Manage Stock Form
        </button>
      </div>
      <ManageStockModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onFormSubmit={handleFormSubmit}
      />
    </ProtectedRoute>
  );
};

export default ManageStockPage;