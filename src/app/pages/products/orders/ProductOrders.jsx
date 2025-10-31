/*productOrders.jsx*/

/* productOrders.jsx */
import { useState, useEffect } from "react";
import {
  FaCheck,
  FaTruck,
  FaTimes,
  FaClock,
  FaSearch,
  FaUserPlus,
} from "react-icons/fa";
import { Navigate } from "react-router-dom";
import { fetchProductOrders } from "../../api/productOrderApi";
import Spinner from "app/pages/dashboards/components/Spinner";
import ProductListModal from "./productListModal";

const isAuthenticated = () => !!localStorage.getItem("authToken");

const ProtectedRoute = ({ children }) =>
  isAuthenticated() ? children : <Navigate to="/login" />;

const ProductOrders = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProductName, setSelectedProductName] = useState("");
  const [selectedOrderId, setSelectedOrderId] = useState("");

  // ✅ Fetch product orders
  const fetchOrders = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const fetchedOrders = await fetchProductOrders(token);
      setOrders(fetchedOrders);
      setFilteredOrders(fetchedOrders);
    } catch (err) {
      console.error("Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // ✅ Search Filter
  useEffect(() => {
    const term = searchTerm.toLowerCase();
    const filtered = orders.filter((order) => {
      const vendorDisplayName =
        order?.vendorType?.toLowerCase() === "admin"
          ? "jstcliq"
          : order.vendorName
          ? order.vendorName.toLowerCase()
          : "";
      return (
        vendorDisplayName.includes(term) ||
        order.userName?.toLowerCase()?.includes(term) ||
        order.productName?.toLowerCase()?.includes(term) ||
        order.status?.toLowerCase()?.includes(term)
      );
    });
    setFilteredOrders(filtered);
  }, [searchTerm, orders]);

  // ✅ Status Styles & Icons
  const getStatusStyles = (status) => {
    switch (status) {
      case "Delivered":
        return "bg-green-100 text-green-700";
      case "Upcoming":
        return "bg-blue-100 text-blue-700";
      case "Out for Delivery":
        return "bg-yellow-100 text-yellow-700";
      case "Not Delivered":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Delivered":
        return <FaCheck className="inline-block mr-1" />;
      case "Upcoming":
        return <FaClock className="inline-block mr-1" />;
      case "Out for Delivery":
        return <FaTruck className="inline-block mr-1" />;
      case "Not Delivered":
        return <FaTimes className="inline-block mr-1" />;
      default:
        return null;
    }
  };

  const handleAssign = (orderId, productName) => {
    setSelectedOrderId(orderId);
    setSelectedProductName(productName);
    setIsModalOpen(true);
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner size="large" color="primary" />
      </div>
    );

  return (
    <ProtectedRoute>
      <div className="bg-gray-50 min-h-screen p-4 sm:p-6 md:p-8 font-sans">
        <div className="max-w-7xl mx-auto bg-white shadow-lg rounded-2xl overflow-hidden">
          {/* Header */}
          <div className="p-4 sm:p-6 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
              Product Orders
            </h1>
            <div className="relative w-full sm:w-80">
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search orders..."
                className="w-full border border-gray-300 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* ✅ Responsive Table (Tablet & Desktop) */}
          <div className="hidden sm:block overflow-x-auto px-2 sm:px-4 md:px-6">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-100 sticky top-0">
                <tr>
                  {[
                    "User",
                    "Vendor",
                    "Product",
                    "Qty",
                    "Cost",
                    "Ordered",
                    "Completed",
                    "Status",
                    "Action",
                  ].map((heading) => (
                    <th
                      key={heading}
                      className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap"
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {filteredOrders.length > 0 ? (
                  filteredOrders.map((order) => {
                    const vendorName =
                      order.vendorName ||
                      (order.vendorType?.toLowerCase() === "admin"
                        ? "JstCliq"
                        : null);
                    const isAssigned = Boolean(vendorName);

                    return (
                      <tr
                        key={order.id}
                        className="hover:bg-gray-50 transition duration-150"
                      >
                        <td className="px-2 py-3 font-medium text-gray-800 whitespace-nowrap">
                          {order.userName || "-"}
                        </td>
                        <td className="px-2 py-3 text-gray-700 whitespace-nowrap">
                          {vendorName || "—"}
                        </td>
                        <td className="px-2 py-3 text-gray-600 max-w-[160px] truncate">
                          {order.productName}
                        </td>
                        <td className="px-2 py-3 text-gray-600">
                          {order.quantity}
                        </td>
                        <td className="px-2 py-3 text-gray-600">
                          ₹{order.cost}
                        </td>
                        <td className="px-2 py-3 text-gray-600 whitespace-nowrap">
                          {new Date(order.orderedOn).toLocaleDateString("en-GB")}
                        </td>
                        <td className="px-2 py-3 text-gray-600 whitespace-nowrap">
                          {order.completedOn
                            ? new Date(order.completedOn).toLocaleDateString(
                                "en-GB"
                              )
                            : "-"}
                        </td>
                        <td className="px-2 py-3">
                          <span
                            className={`px-2 py-1 inline-flex items-center text-xs font-semibold rounded-full ${getStatusStyles(
                              order.status
                            )}`}
                          >
                            {getStatusIcon(order.status)}
                            {order.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <button
                            onClick={() =>
                              handleAssign(order.id, order.productName)
                            }
                            disabled={isAssigned}
                            className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs transition ${
                              isAssigned
                                ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                                : "bg-indigo-600 text-white hover:bg-indigo-700"
                            }`}
                          >
                            <FaUserPlus />
                            <span className="hidden md:inline">
                              {isAssigned ? "Assigned" : "Assign"}
                            </span>
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td
                      colSpan="9"
                      className="text-center py-6 text-gray-500 text-sm"
                    >
                      No product orders found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* ✅ Mobile View (Cards) */}
          <div className="block sm:hidden p-3 sm:p-4 space-y-4">
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => {
                const vendorName =
                  order.vendorName ||
                  (order.vendorType?.toLowerCase() === "admin"
                    ? "JstCliq"
                    : null);
                const isAssigned = Boolean(vendorName);

                return (
                  <div
                    key={order.id}
                    className="bg-white p-4 rounded-2xl shadow-md border border-gray-200 hover:shadow-lg transition-all duration-300"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <h2 className="font-semibold text-gray-900 text-base leading-tight w-2/3 break-words">
                        {order.productName}
                      </h2>
                      <span
                        className={`px-2 py-1 rounded-full text-[10px] sm:text-xs font-semibold flex items-center gap-1 ${getStatusStyles(
                          order.status
                        )}`}
                      >
                        {getStatusIcon(order.status)}
                        {order.status}
                      </span>
                    </div>

                    <div className="flex flex-col gap-y-2 text-xs sm:text-sm text-gray-700">
                      <p>
                        <strong>User:</strong> {order.userName}
                      </p>
                      <p>
                        <strong>Vendor:</strong> {vendorName || "—"}
                      </p>
                      <p>
                        <strong>Qty:</strong> {order.quantity}
                      </p>
                      <p>
                        <strong>Cost:</strong> ₹{order.cost}
                      </p>
                      <p>
                        <strong>Ordered:</strong>{" "}
                        {new Date(order.orderedOn).toLocaleDateString("en-GB")}
                      </p>
                      <p>
                        <strong>Completed:</strong>{" "}
                        {order.completedOn
                          ? new Date(order.completedOn).toLocaleDateString(
                              "en-GB"
                            )
                          : "—"}
                      </p>
                    </div>

                    <button
                      onClick={() =>
                        handleAssign(order.id, order.productName)
                      }
                      disabled={isAssigned}
                      className={`mt-4 w-full py-2 rounded-full flex items-center justify-center gap-2 text-xs sm:text-sm font-medium transition-colors ${
                        isAssigned
                          ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                          : "bg-indigo-600 text-white hover:bg-indigo-700"
                      }`}
                    >
                      <FaUserPlus />
                      {isAssigned ? "Assigned" : "Assign"}
                    </button>
                  </div>
                );
              })
            ) : (
              <p className="text-center text-gray-500 text-sm">
                No product orders found.
              </p>
            )}
          </div>
        </div>

        {/* ✅ Product List Modal */}
        {isModalOpen && (
          <ProductListModal
            onClose={() => {
              setIsModalOpen(false);
              fetchOrders(); // refresh after closing
            }}
            orderId={selectedOrderId}
            productName={selectedProductName}
          />
        )}
      </div>
    </ProtectedRoute>
  );
};

export default ProductOrders;
