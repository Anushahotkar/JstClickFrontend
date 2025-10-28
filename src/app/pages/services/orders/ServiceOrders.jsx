/* ServiceOrders.jsx */
import { useState, useEffect } from "react";
import {
  FaCheck,
  FaTimes,
  FaClock,
  FaExternalLinkAlt,
  FaUserPlus,
  FaSearch,
} from "react-icons/fa";
import { Navigate } from "react-router-dom";
import { fetchServiceOrders } from "../../api/serviceOrdersApi";
import Spinner from "../../dashboards/components/Spinner";
import AssignVendorsModal from "../AssignServiceVendors";
import { toast } from "react-hot-toast";

const isAuthenticated = () => !!localStorage.getItem("authToken");
const ProtectedRoute = ({ children }) => (isAuthenticated() ? children : <Navigate to="/login" />);

const ServiceOrders = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [assigning, setAssigning] = useState(false);

  const token = localStorage.getItem("authToken");

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const data = await fetchServiceOrders(token);
        setOrders(data);
        setFilteredOrders(data);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load service orders");
      } finally {
        setLoading(false);
      }
    };
    loadOrders();
  }, [token]);

useEffect(() => {
  const term = searchTerm.toLowerCase();

  const filtered = orders.filter((order) => {
    // Handle vendor name substitution for search
    const vendorDisplayName =
      order?.userType?.toLowerCase() === "admin" || /admin/i.test(order.vendorName)
        ? "jstcliq"
        : order.vendorName?.toLowerCase() || "";

    const fields = [
      order.serviceName?.toLowerCase() || "",
      order.username?.toLowerCase() || "",
      vendorDisplayName,
    ];

    return fields.some((field) => field.includes(term));
  });

  setFilteredOrders(filtered);
}, [searchTerm, orders]);


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
    if (order.status !== "Upcoming") return;
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const handleVendorAssign = async (vendor) => {
    try {
      setAssigning(true);
      setIsModalOpen(false);
      toast.success(`Vendor ${vendor.name || vendor.vendorName} assigned successfully!`);
      const updatedOrders = await fetchServiceOrders(token);
      setOrders(updatedOrders);
    } catch (err) {
      console.error("Failed to refresh orders:", err);
      toast.error("Failed to refresh service orders");
    } finally {
      setAssigning(false);
    }
  };

  const getVendorName = (vendorName) => {
    if (!vendorName || vendorName.trim() === "") return "Not Assigned";
    if (/admin/i.test(vendorName)) return "JstCliq";
    return vendorName;
  };

  const isAssigned = (order) => order.status === "Ongoing";

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner size="large" color="primary" />
      </div>
    );

  return (
    <ProtectedRoute>
      <div className="bg-gray-50 min-h-screen p-4 sm:p-6 font-sans">
        <div className="max-w-7xl mx-auto bg-white rounded-2xl overflow-hidden shadow">
          {/* Header + Search */}
          <div className="p-4 sm:p-6 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 flex items-center gap-2">
              <FaExternalLinkAlt className="text-indigo-600" /> Service Orders
            </h1>
            <div className="relative w-full sm:w-80">
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search by service, user, or vendor"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none text-sm"
              />
            </div>
          </div>

          {/* Empty State */}
          {filteredOrders.length === 0 ? (
            <div className="p-8 text-center text-gray-500 text-lg">
              No service orders found.
            </div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-100">
                    <tr>
                      {[
                        "Service Name",
                        "User Name",
                        "Vendor Name",
                        "Status",
                        "Availed On",
                        "Completed On",
                        "Action",
                      ].map((th) => (
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
                    {filteredOrders.map((order, idx) => (
                      <tr key={idx} className="hover:bg-gray-50 transition text-sm">
                        <td className="px-4 py-4 font-medium text-gray-900">{order.serviceName}</td>
                        <td className="px-4 py-4 text-gray-600">{order.username}</td>
                        <td className="px-4 py-4 text-gray-600">{getVendorName(order.vendorName)}</td>
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
                            disabled={isAssigned(order) || assigning || order.status !== "Upcoming"}
                            onClick={() => handleAssignClick(order)}
                            className={`flex items-center gap-2 px-3 py-2 rounded shadow-sm transition text-white ${
                              isAssigned(order)
                                ? "bg-gray-400 cursor-not-allowed"
                                : order.status === "Upcoming"
                                ? "bg-green-600 hover:bg-green-700"
                                : "bg-gray-300 cursor-not-allowed"
                            }`}
                          >
                            <FaUserPlus />
                            {isAssigned(order) ? "Assigned" : "Assign"}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Responsive Cards */}
              <div className="md:hidden p-4 space-y-4">
                {filteredOrders.map((order, idx) => (
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
                    <div className="text-gray-500 text-sm">
                      Vendor: {getVendorName(order.vendorName)}
                    </div>
                    <div className="text-gray-500 text-sm">
                      Availed On: {formatDate(order.availedOn)}
                    </div>
                    <div className="text-gray-500 text-sm">
                      Completed On: {formatDate(order.completedOn)}
                    </div>

                    <div className="mt-2">
                      <button
                        disabled={isAssigned(order) || assigning || order.status !== "Upcoming"}
                        onClick={() => handleAssignClick(order)}
                        className={`w-full flex items-center justify-center gap-2 px-3 py-2 rounded shadow-sm transition text-white ${
                          isAssigned(order)
                            ? "bg-gray-400 cursor-not-allowed"
                            : order.status === "Upcoming"
                            ? "bg-green-600 hover:bg-green-700"
                            : "bg-gray-300 cursor-not-allowed"
                        }`}
                      >
                        <FaUserPlus />
                        {isAssigned(order) ? "Assigned" : "Assign"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Assign Vendors Modal */}
        <AssignVendorsModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onAssign={handleVendorAssign}
          serviceName={selectedOrder?.serviceName}
          bookingId={selectedOrder?.bookingId}
        />
      </div>
    </ProtectedRoute>
  );
};

export default ServiceOrders;
