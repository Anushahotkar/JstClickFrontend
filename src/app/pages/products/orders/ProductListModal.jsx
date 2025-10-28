import { useEffect, useState } from "react";
import { getProductPosters
  ,assignVendorToOrder } from "../../api/productOrderApi"; // adjust path as needed
  import { toast } from "react-hot-toast"; // optional toast notifications

// ⭐ Helper function for star rating
const renderRating = (rating) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <span
        key={i}
        className={`text-base sm:text-lg ${i <= rating ? "text-yellow-400" : "text-gray-300"}`}
      >
        ★
      </span>
    );
  }
  return stars;
};

const ProductListModal = ({ onClose, productName, orderId  }) => {
  const [posters, setPosters] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🌀 Fetch posters dynamically based on product name
useEffect(() => {
  const fetchPosters = async () => {
    if (!productName) return;
    try {
       const token = localStorage.getItem("authToken");
        if (!token) {
          console.warn("⚠️ No auth token found.");
          return;
        }
      console.log("Fetching posters for:", productName);
      const res = await getProductPosters({ productName,token });
      // ✅ Properly extract array
      setPosters(Array.isArray(res?.data) ? res.data : []);
    } catch (err) {
      console.error("Failed to load product posters:", err);
      setPosters([]);
    } finally {
      setLoading(false);
    }
  };

  fetchPosters();
}, [productName]);

const handleAssignVendor = async (vendor) => {
  try {
    const token = localStorage.getItem("authToken");
    if (!token) return console.warn("No auth token found");

    const res = await assignVendorToOrder({
      orderId,
      vendorId: vendor._id,     // make sure backend returns `_id` in posters
      vendorType: vendor.userType,
      token,
    });

    if (res.success) {
      toast.success("Vendor assigned successfully!");
      onClose(); // close modal after success
    } else {
      toast.error(res.message || "Failed to assign vendor");
    }
  } catch (err) {
    toast.error(err.response?.data?.message || "Error assigning vendor");
  }
};


  return (
    // ✅ Backdrop with blur
    <div className="fixed inset-0 flex items-center justify-center bg-white/40 backdrop-blur-sm z-50 p-3 sm:p-6">
      {/* ✅ Modal Container */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-h-[90vh] overflow-y-auto sm:w-4/5 lg:max-w-3xl p-4 sm:p-6 border border-gray-100 transition-all">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-2xl"
          aria-label="Close"
        >
          &times;
        </button>

        {/* Header */}
        <h2 className="text-lg sm:text-2xl font-bold text-gray-800 mb-4">
          {productName ? `Vendors for ${productName}` : "Product Vendors"}
        </h2>

        {/* Loader */}
        {loading ? (
          <div className="flex justify-center items-center py-10 text-gray-500 text-sm sm:text-base">
            Loading vendors...
          </div>
        ) : posters.length === 0 ? (
          <div className="flex justify-center items-center py-10 text-gray-500 text-sm sm:text-base">
            No vendors available for this product.
          </div>
        ) : (
          <>
            {/* ✅ Desktop Table View */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr className="text-gray-600 text-xs sm:text-sm uppercase tracking-wider">
                    <th className="px-3 py-3 text-left font-semibold">Vendor Name</th>
                    <th className="px-3 py-3 text-left font-semibold">Phone</th>
                     <th className="px-3 py-3 text-left font-semibold">Unit</th>
                    <th className="px-3 py-3 text-left font-semibold">Value</th>
                    <th className="px-3 py-3 text-left font-semibold">Rating</th>
                    <th className="px-3 py-3 text-left font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {posters.map((vendor, index) => (
                    <tr key={vendor.id || index} className="hover:bg-gray-50 transition">
                      <td className="px-3 py-4 text-sm font-medium text-gray-900">
                        {vendor.name || "-"}
                      </td>
                      <td className="px-3 py-4 text-sm text-gray-600">
                        {vendor.phone || "-"}
                      </td>
                       <td className="px-3 py-4 text-sm text-gray-600">
                        {vendor.unit || "-"}
                      </td>
                      <td className="px-3 py-4 text-sm text-gray-600">
                        {vendor.dynamicUnitLabel || "-"}
                      </td>
                      <td className="px-3 py-4 text-sm">{renderRating(vendor.rating || 0)}</td>
                      <td className="px-3 py-4 text-sm">
                        <button 
                         onClick={() => handleAssignVendor(vendor)}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition font-medium text-sm">
                          Assign
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* ✅ Mobile Card View */}
            <div className="block sm:hidden space-y-3">
              {posters.map((vendor, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-200 bg-white"
                >
                  <h3 className="text-sm font-semibold text-gray-800 mb-1">
                    {vendor.name || "Unknown Vendor"}
                  </h3>
                 
                  <p className="text-xs text-gray-600 mb-1">
                     {vendor.phone || "N/A"}
                  </p>
                   <p className="text-xs text-gray-600 mb-1">
                   {vendor.unit || "-"}  {vendor.dynamicUnitLabel || "-"}
                  </p>
                  <div className="flex items-center mb-3">{renderRating(vendor.rating || 0)}</div>
                  <button 
                   onClick={() => handleAssignVendor(vendor)}
                  className="w-full py-2 bg-indigo-600 text-white rounded-md text-xs font-medium hover:bg-indigo-700"
                  >
                    Assign
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ProductListModal;
