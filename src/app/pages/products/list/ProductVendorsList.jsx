/* ProductVendorsList.jsx */
import { useEffect, useState } from "react";
import {
  FaRupeeSign,
  FaCheckCircle,
  FaBan,
  FaTimesCircle,
  FaStore,
} from "react-icons/fa";
import { fetchVendors, updateVendorAction } from "../../api/ProductVendorService";
import { vendorActionSchema } from "../../validation/vendorValidator";

const ProductVendorsList = () => {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});

  // 🔹 Fetch vendors
  useEffect(() => {
    const loadVendors = async () => {
      try {
        const response = await fetchVendors();
        setVendors(response);
      } catch (err) {
        setError(err.message);
        console.error("Failed to fetch vendors:", err);
      } finally {
        setLoading(false);
      }
    };
    loadVendors();
  }, []);

  // 🔹 Action Icons
  const getActionIcon = (action) => {
    switch (action) {
      case "Approve":
        return <FaCheckCircle className="text-green-600" />;
      case "Dis Approved":
        return <FaTimesCircle className="text-orange-500" />;
      case "Block":
        return <FaBan className="text-red-600" />;
      default:
        return null;
    }
  };

  // 🔹 Handle action change with Joi validation
  const handleActionChange = async (e, id) => {
    const newAction = e.target.value;
    const vendor = vendors.find((v) => v._id === id);

    const { error } = vendorActionSchema.validate(
      { action: newAction, reason: vendor.reason || "" },
      { abortEarly: false }
    );

    if (error) {
      const fieldErrors = {};
      error.details.forEach((d) => {
        fieldErrors[d.path[0]] = d.message;
      });
      setValidationErrors((prev) => ({ ...prev, [id]: fieldErrors }));
      return;
    }

    try {
      await updateVendorAction(id, newAction, vendor.reason || "");
      setVendors((prev) =>
        prev.map((v) => (v._id === id ? { ...v, action: newAction } : v))
      );
      setValidationErrors((prev) => ({ ...prev, [id]: {} }));
    } catch (err) {
      alert("❌ " + err.message);
    }
  };

  // 🔹 Loading & Error states
  if (loading)
    return <p className="text-center py-6 text-blue-600 font-semibold">⏳ Loading vendors...</p>;
  if (error)
    return <p className="text-center py-6 text-red-600 font-semibold">❌ {error}</p>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 sm:p-8 font-sans text-gray-800">
      {/* 🔹 Header */}
      <h1 className="text-3xl sm:text-4xl font-extrabold text-blue-800 mb-6 sm:mb-8 flex items-center gap-2">
        <FaStore className="text-blue-600" /> Product Sellers
      </h1>

      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
        {/* 🔹 Table for Desktop */}
        <div className="hidden md:block overflow-x-auto">
          <table className="min-w-full leading-normal">
            <thead>
              <tr className="bg-blue-100 text-blue-800 uppercase text-sm font-semibold">
                <th className="py-3 px-6 text-left">Vendor</th>
                <th className="py-3 px-6 text-left">Product Type</th>
                <th className="py-3 px-6 text-left">Cost</th>
                <th className="py-3 px-6 text-left">Action</th>
                <th className="py-3 px-6 text-left">Reason</th>
              </tr>
            </thead>
            <tbody>
              {vendors.map((vendor, index) => (
                <tr
                  key={vendor._id}
                  className={`border-b ${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50"
                  } hover:bg-blue-50 transition`}
                >
                  <td className="py-3 px-6 font-semibold text-gray-700">{vendor.shopName}</td>
                  <td className="py-3 px-6 text-gray-600">{vendor.productType}</td>
                  <td className="py-3 px-6 font-semibold flex items-center text-green-700">
                    <FaRupeeSign className="text-xs mr-1" />
                    {vendor.cost}
                  </td>
                  <td className="py-3 px-6">
                    <div className="flex items-center gap-2">
                      {getActionIcon(vendor.action)}
                      <select
                        value={vendor.action}
                        onChange={(e) => handleActionChange(e, vendor._id)}
                        className="p-1 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 text-sm"
                      >
                        <option value="Approve">Approve</option>
                        <option value="Dis Approved">Dis Approved</option>
                        <option value="Block">Block</option>
                        <option value="Pending">Pending</option>
                      </select>
                    </div>
                    {validationErrors[vendor._id]?.action && (
                      <p className="text-xs text-red-500 mt-1">
                        {validationErrors[vendor._id].action}
                      </p>
                    )}
                  </td>
                  <td className="py-3 px-6 text-gray-600">{vendor.reason}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 🔹 Mobile Cards */}
        <div className="md:hidden p-4 space-y-4">
          {vendors.map((vendor) => (
            <div
              key={vendor._id}
              className="bg-white p-4 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition"
            >
              <div className="grid grid-cols-2 gap-y-2 text-sm">
                <div className="font-semibold text-gray-700">Vendor</div>
                <div>{vendor.shopName}</div>
                <div className="font-semibold text-gray-700">Product</div>
                <div>{vendor.productType}</div>
                <div className="font-semibold text-gray-700">Cost</div>
                <div className="flex items-center font-semibold text-green-700">
                  <FaRupeeSign className="text-xs mr-1" />
                  {vendor.cost}
                </div>
                <div className="font-semibold text-gray-700">Action</div>
                <div className="flex items-center gap-2">
                  {getActionIcon(vendor.action)}
                  <select
                    value={vendor.action}
                    onChange={(e) => handleActionChange(e, vendor._id)}
                    className="p-1 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 text-sm"
                  >
                    <option value="Approve">Approve</option>
                    <option value="Dis Approved">Dis Approved</option>
                    <option value="Block">Block</option>
                    <option value="Pending">Pending</option>
                  </select>
                </div>
                <div className="font-semibold text-gray-700">Reason</div>
                <div>{vendor.reason}</div>
              </div>
              {validationErrors[vendor._id]?.action && (
                <p className="text-xs text-red-500 mt-2">
                  {validationErrors[vendor._id].action}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductVendorsList;
