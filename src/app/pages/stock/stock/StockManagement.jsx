// src/pages/StockManagement.jsx
import { useState, useEffect } from "react";
import { FaBoxOpen, FaSearch } from "react-icons/fa";
import { Navigate,useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { fetchCategories } from "../../api/stockApi";
import Spinner from "app/pages/dashboards/components/Spinner";


const isAuthenticated = () => !!localStorage.getItem("authToken");




const ProtectedRoute = ({ children }) =>
  isAuthenticated() ? children : <Navigate to="/login" />;

const StockManagement = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();


const handleCardClick = (cat) => {
  // const type = cat.type ;
  navigate(`/stock-management/stock/${cat._id}?type=${cat.type}`);
};

  useEffect(() => {
    const loadCategories = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) {
        toast.error("No authentication token found. Please log in again.");
        setLoading(false);
        return;
      }

      try {
        const data = await fetchCategories(token);
        const productCategories = (data?.productCategories || []).map(cat => ({
  ...cat,
  type: "product",
}));
const serviceCategories = (data?.serviceCategories || []).map(cat => ({
  ...cat,
  type: "service",
}));
        const allCategories = [
         ...productCategories, 
         ...serviceCategories
        ];
        setCategories(allCategories);
      } catch (error) {
        toast.error(error.toString());
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner size="large" color="primary" />
      </div>
    );

  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <ProtectedRoute>
      <div className="bg-gray-50 min-h-screen px-3 sm:px-6 lg:px-10 py-6 flex flex-col items-center">
        <div className="max-w-7xl w-full bg-white shadow-xl rounded-2xl p-5 sm:p-8 md:p-10">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4 sm:gap-6">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-800 flex items-center text-center sm:text-left">
              <FaBoxOpen className="mr-2 sm:mr-3 text-indigo-600" />
              Stock Management
            </h1>

            <div className="relative w-full sm:w-72 md:w-80">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm sm:text-base"
              />
            </div>
          </div>

          <div
            className="
              grid 
              grid-cols-1
              xs:grid-cols-2
              sm:grid-cols-2
              md:grid-cols-3
              lg:grid-cols-4
              xl:grid-cols-4
              gap-4 sm:gap-6 md:gap-8
            "
          >
            {filteredCategories.length > 0 ? (
              filteredCategories.map((cat) => (
                <div
                  key={cat._id}
                   onClick={() => handleCardClick(cat)}
                  className="
                    bg-gray-100 rounded-xl shadow-md 
                    hover:shadow-lg transition-all duration-300 
                    p-4 sm:p-6 flex flex-col items-center justify-center hover:scale-105
                    min-h-[200px] sm:min-h-[220px] md:min-h-[240px]
                    text-center
                  "
                >
                  {cat.image ? (
                    <img
                      src={cat.image}
                      alt={cat.name}
                      className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 object-cover rounded-full mb-4 border border-gray-300"
                    />
                  ) : (
                    <FaBoxOpen className="text-5xl text-gray-400 mb-4" />
                  )}

                  <h3 className="text-base sm:text-lg md:text-xl font-semibold text-gray-800 break-words whitespace-normal">
                    {cat.name}
                  </h3>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center text-gray-500 font-medium">
                {searchQuery
                  ? "No categories match your search."
                  : "No categories found."}
              </div>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default StockManagement;
