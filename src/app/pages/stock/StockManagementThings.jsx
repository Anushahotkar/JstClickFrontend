import { useState, useEffect } from "react";
import { FaSearch, FaPlus, FaArrowLeft } from "react-icons/fa";
import { Navigate, useParams, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { fetchCategoryItems } from "../api/stockApi";
import Spinner from "../dashboards/components/Spinner";

const isAuthenticated = () => !!localStorage.getItem("authToken");

const ProtectedRoute = ({ children }) =>
  isAuthenticated() ? children : <Navigate to="/login" />;

const getStatusStyles = (status) => {
  switch (status?.toLowerCase()) {
    case "available":
    case "in stock":
      return "bg-green-100 text-green-700";
    case "out of stock":
      return "bg-red-100 text-red-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

const getWageTypeStyles = (wageType) => {
  switch (wageType?.toLowerCase()) {
    case "hourly":
      return "bg-blue-100 text-blue-700";
    case "daily":
      return "bg-green-100 text-green-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

const StockManagementThings = () => {
  const { categoryId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const type = queryParams.get("type");

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const getItems = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) {
        toast.error("Authentication required. Please log in again.");
        setLoading(false);
        return;
      }

      try {
        const data = await fetchCategoryItems(categoryId, type, token);
        setItems(data);
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (categoryId && type) getItems();
  }, [categoryId, type]);

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleBack = () => navigate("/stock-management/stock");

  const getStockInfo = (item) => {
    const parts = [];
    if (item.quantity) parts.push(`${item.quantity} pcs`);
    if (item.weight) parts.push(`${item.weight} kg`);
    if (item.volume) parts.push(`${item.volume} liters`);
    return parts.length ? parts.join(", ") : "—";
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner size="large" color="primary" />
      </div>
    );

  return (
    <ProtectedRoute>
      <div className="bg-gray-50 min-h-screen p-3 sm:p-6 md:p-8 font-sans">
        <div className="mx-auto bg-white shadow-xl rounded-xl overflow-hidden w-full max-w-7xl transition-all">
          
          {/* HEADER */}
          <div className="p-4 sm:p-6 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-3 flex-wrap">
            <h1 className="text-lg sm:text-2xl font-bold text-gray-800 text-center sm:text-left w-full sm:w-auto">
              {type === "service" ? "Service Stock" : "Product Stock"}
            </h1>

            <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
              <button
                onClick={handleBack}
                className="flex items-center justify-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-full hover:bg-gray-200 transition-colors w-full sm:w-auto"
              >
                <FaArrowLeft className="text-gray-600" />
                <span className="text-sm sm:text-base font-medium">Back</span>
              </button>

              <div className="relative w-full sm:w-64">
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>

              <button className="bg-blue-600 text-white px-4 py-2 rounded-full font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center w-full sm:w-auto">
                <FaPlus className="mr-2" />
                <span className="hidden sm:inline">Manage Stocks</span>
                <span className="sm:hidden">Manage Stocks</span>
              </button>
            </div>
          </div>

          {/* TABLE VIEW (Desktop) */}
          <div className="p-2 sm:p-6">
            <div className="hidden md:block overflow-x-auto rounded-lg border border-gray-200">
              <table className="min-w-full divide-y divide-gray-200 text-sm sm:text-base">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-gray-600 uppercase whitespace-nowrap">ID</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-600 uppercase">Name</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-600 uppercase">Category</th>
                    {type === "product" && (
                      <>
                        <th className="px-4 py-3 text-left font-semibold text-gray-600 uppercase">Status</th>
                        <th className="px-4 py-3 text-left font-semibold text-gray-600 uppercase">Stock Info</th>
                      </>
                    )}
                    {type === "service" && (
                      <th className="px-4 py-3 text-left font-semibold text-gray-600 uppercase">Wage Type</th>
                    )}
                    <th className="px-4 py-3 text-left font-semibold text-gray-600 uppercase">Vendor</th>
                  </tr>
                </thead>

                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredItems.length > 0 ? (
                    filteredItems.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50 transition-colors duration-150">
                        <td className="px-4 py-4 text-xs sm:text-sm break-words">{item.id}</td>
                        <td className="px-4 py-4">{item.name}</td>
                        <td className="px-4 py-4">{item.category}</td>

                        {type === "product" && (
                          <>
                            <td className="px-4 py-4">
                              <span
                                className={`px-3 py-1 inline-flex text-xs sm:text-sm font-semibold rounded-full ${getStatusStyles(item.status)}`}
                              >
                                {item.status || "N/A"}
                              </span>
                            </td>
                            <td className="px-4 py-4">{getStockInfo(item)}</td>
                          </>
                        )}

                        {type === "service" && (
                          <td className="px-4 py-4">
                            <span
                              className={`px-3 py-1 inline-flex text-xs sm:text-sm font-semibold rounded-full ${getWageTypeStyles(item.wageType)}`}
                            >
                              {item.wageType || "—"}
                            </span>
                          </td>
                        )}

                        <td className="px-4 py-4">
                          {(item.userType?.toLowerCase() === "admin" && "JstCliq") ||
                            item.vendorName ||
                            "—"}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="text-center text-gray-500 py-6">
                        No items match your search.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* CARD VIEW (Mobile + Tablet) */}
            <div className="md:hidden grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              {filteredItems.length > 0 ? (
                filteredItems.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white shadow rounded-lg p-4 border border-gray-200 hover:shadow-md transition duration-200"
                  >
                    <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
                    <p className="text-sm text-gray-500 mt-1">Category: {item.category}</p>

                    {type === "product" && (
                      <>
                        <p className="text-sm text-gray-600 mt-1">
                          Status:{" "}
                          <span
                            className={`ml-2 px-2 py-1 rounded-full text-xs font-semibold ${getStatusStyles(item.status)}`}
                          >
                            {item.status || "N/A"}
                          </span>
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          Stock: {getStockInfo(item)}
                        </p>
                      </>
                    )}

                    {type === "service" && (
                      <p className="text-sm text-gray-600 mt-1">
                        Wage Type:{" "}
                        <span
                          className={`ml-2 px-2 py-1 rounded-full text-xs font-semibold ${getWageTypeStyles(item.wageType)}`}
                        >
                          {item.wageType || "—"}
                        </span>
                      </p>
                    )}

                    <p className="text-sm text-gray-600 mt-1">
                      Vendor:{" "}
                      {(item.userType?.toLowerCase() === "admin" && "JstCliq") ||
                        item.vendorName ||
                        "—"}
                    </p>

                    <p className="text-xs text-gray-400 mt-2 break-words">
                      <span className="font-medium text-gray-500">ID:</span> {item.id}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500 py-6">No items match your search.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default StockManagementThings;
