/* ServiceOrders.jsx */
import { useState, useEffect } from "react";
import { FaCheck, FaTimes, FaClock, FaExternalLinkAlt, FaUserPlus } from "react-icons/fa";
import { Navigate } from "react-router-dom";
import { fetchServiceOrders } from "../../api/serviceOrdersApi";
import Spinner from "../../dashboards/components/Spinner";
import AssignVendorsModal from "../AssignServiceVendors"; // import modal

const isAuthenticated = () => !!localStorage.getItem("authToken");
const ProtectedRoute = ({ children }) => (isAuthenticated() ? children : <Navigate to="/login" />);

const ServiceOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null); // For modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  const token = localStorage.getItem("authToken");

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const data = await fetchServiceOrders(token);
        setOrders(data);
      } catch (err) {
        console.error(err);
        alert("Failed to load service orders");
      } finally {
        setLoading(false);
      }
    };
    loadOrders();
  }, [token]);

  const getStatusStyle = (status) => {
    switch (status) {
      case "Upcoming":
        return "bg-green-100 text-green-700 border-green-300";
      case "Scheduled":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "Completed":
        return "bg-green-200 text-green-900 border-green-400";
      case "Cancelled":
        return "bg-red-100 text-red-700 border-red-300";
      case "Ongoing":
        return "bg-blue-100 text-blue-700 border-blue-300";
      default:
        return "bg-gray-100 text-gray-700 border-gray-300";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Upcoming":
        return <FaClock className="inline-block mr-1" />;
      case "Scheduled":
        return <FaClock className="inline-block mr-1 animate-pulse" />;
      case "Completed":
        return <FaCheck className="inline-block mr-1" />;
      case "Cancelled":
        return <FaTimes className="inline-block mr-1" />;
      case "Ongoing":
        return <FaExternalLinkAlt className="inline-block mr-1 animate-pulse" />;
      default:
        return null;
    }
  };

  const formatDate = (date) => (date ? new Date(date).toLocaleDateString() : "-");

  const handleAssignClick = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const handleVendorAssign = (vendor) => {
    console.log("Assigned vendor", vendor, "to order", selectedOrder);
    setIsModalOpen(false);
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner size="large" color="primary" />
      </div>
    );

  return (
    <ProtectedRoute>
      <div className="bg-gray-50 min-h-screen p-4 sm:p-8 font-sans">
        <div className="max-w-7xl mx-auto bg-white rounded-2xl overflow-hidden shadow">
          {/* Header */}
          <div className="p-4 sm:p-6 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 flex items-center gap-2">
              <FaExternalLinkAlt className="text-indigo-600" /> Service Orders
            </h1>
          </div>

          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  {["Service Name", "User Name", "Status", "Availed On", "Completed On", "Assign"].map((th) => (
                    <th
                      key={th}
                      className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                    >
                      {th}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {orders.map((order, idx) => (
                  <tr key={idx} className="hover:bg-gray-50 transition text-sm">
                    <td className="px-4 py-4 font-medium text-gray-900">{order.serviceName}</td>
                    <td className="px-4 py-4 text-gray-600">{order.username}</td>
                    <td className="px-4 py-4">
                      <span
                        className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border ${getStatusStyle(
                          order.status
                        )}`}
                      >
                        {getStatusIcon(order.status)}
                        {order.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-gray-600">{formatDate(order.availedOn)}</td>
                    <td className="px-4 py-4 text-gray-600">{formatDate(order.completedOn)}</td>
                    <td className="px-4 py-4">
                      <button
                        onClick={() => handleAssignClick(order)}
                        className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 shadow-sm transition"
                      >
                        <FaUserPlus /> Assign
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden p-4 space-y-4">
            {orders.map((order, idx) => (
              <div
                key={idx}
                className="bg-white shadow rounded-lg p-4 flex flex-col gap-2 border border-gray-200 hover:shadow-md transition"
              >
                <div className="flex justify-between items-center">
                  <h2 className="font-semibold text-gray-900">{order.serviceName}</h2>
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded-full border ${getStatusStyle(
                      order.status
                    )}`}
                  >
                    {getStatusIcon(order.status)}
                    {order.status}
                  </span>
                </div>
                <div className="text-gray-500 text-sm">User: {order.username}</div>
                <div className="text-gray-500 text-sm">Availed On: {formatDate(order.availedOn)}</div>
                <div className="text-gray-500 text-sm">Completed On: {formatDate(order.completedOn)}</div>
                <div className="mt-2">
                  <button
                    onClick={() => handleAssignClick(order)}
                    className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 shadow-sm transition"
                  >
                    <FaUserPlus /> Assign
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Assign Vendors Modal */}
        <AssignVendorsModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onAssign={handleVendorAssign}
        />
      </div>
    </ProtectedRoute>
  );
};

export default ServiceOrders;
