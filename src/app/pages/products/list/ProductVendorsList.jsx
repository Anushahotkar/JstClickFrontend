/*productVendorsList.jsx*/

/*productVendorsList.jsx*/

/* ProductVendorsList.jsx */
import { useEffect, useState } from "react";
import {
  FaRupeeSign,
  FaCheckCircle,
  FaBan,
  FaTimesCircle,
  FaStore,
  FaPaperPlane,
} from "react-icons/fa";
import toast from "react-hot-toast";
import Spinner from "app/pages/dashboards/components/Spinner";
import { fetchVendors, updateVendorAction, vendorActionSchema } from "../../api/ProductVendorService";

const ProductVendorsList = () => {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [validationErrors, setValidationErrors] = useState({});
  const [saving, setSaving] = useState({});

  useEffect(() => {
    const loadVendors = async () => {
      try {
        const response = await fetchVendors();
        setVendors(Array.isArray(response) ? response : [response]);
      } catch (err) {
        console.log(err.message);
        toast.error(`Error fetching vendors: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };
    loadVendors();
  }, []);

  
  const getActionBgColor = (action) => {
    switch (action) {
      case "Approved": return "bg-green-100 text-green-800";
      case "Disapproved": return "bg-red-100 text-red-800";
      case "Block": return "bg-yellow-100 text-yellow-800";
    
      default: return "bg-blue-100 text-blue-800";
    }
  };

  const getActionIcon = (action) => {
    switch (action) {
      case "Approved":
        return <FaCheckCircle className="text-green-600" />;
      case "Disapproved":
        return <FaTimesCircle className="text-orange-500" />;
      case "Block":
        return <FaBan className="text-red-600" />;
      default:
        return null;
    }
  };

  const handleChange = (productId, field, value) => {
    setVendors((prev) =>
      prev.map((v) => (v.productId ===productId ? { ...v, [field]: value } : v))
    );
  };

  const handleSave = async (vendor) => {
    const { productId, action, reason } = vendor;

    const { error } = vendorActionSchema.validate({ action, reason }, { abortEarly: false });
    if (error) {
      console.log(validationErrors);
      const fieldErrors = {};
      error.details.forEach((d) => (fieldErrors[d.path[0]] = d.message));
      // console.log(error.details);
      setValidationErrors((prev) => ({ ...prev, [productId]: fieldErrors }));
      error.details.forEach((d) => toast.error(d.message));
      return;
    }

    try {
      setSaving((prev) => ({ ...prev, [productId]: true }));
      await updateVendorAction(productId, action, reason || "");
      toast.success("✅ Vendor action saved successfully!");
      setValidationErrors((prev) => ({ ...prev, [productId]: {} }));
    } catch (err) {
      console.log(err);
      toast.error(`❌ ${err.message}`);
    } finally {
      setSaving((prev) => ({ ...prev, [productId]: false }));
    }
  };

  if (loading) return <div className="flex justify-center items-center h-screen">
        <Spinner size="large" color="primary" />
      </div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 sm:p-8 font-sans text-gray-800">
      <h1 className="text-3xl sm:text-4xl font-extrabold text-blue-800 mb-6 sm:mb-8 flex items-center gap-2">
        <FaStore className="text-blue-600" /> Product Sellers
      </h1>

      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
       {/* Desktop Table */}
<div className="hidden md:block overflow-x-auto">
  <table className="min-w-full leading-normal">
    <thead>
      <tr className="bg-blue-100 text-blue-800 uppercase text-sm font-semibold">
        <th className="py-3 px-6 text-left">Vendor</th>
        <th className="py-3 px-6 text-left whitespace-nowrap">Product Type</th>
        <th className="py-3 px-6 text-left">Cost</th>
        <th className="py-3 px-6 text-left">Action</th>
        <th className="py-3 px-6 text-left">Reason</th>
        <th className="py-3 px-6 text-left">Save</th>
      </tr>
    </thead>
    <tbody>
      {vendors.map((vendor, index) => (
        <tr
          key={vendor.productId}
          className={`border-b ${index % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-blue-50 transition`}
        >
          <td className="py-3 px-6 font-semibold text-gray-700 whitespace-nowrap">{vendor.shopName}</td>
          <td className="py-3 px-6 text-gray-600 whitespace-nowrap">{vendor.productType}</td>
          <td className="py-3 px-6 font-semibold text-green-700">
  <div className="flex items-center">
    <FaRupeeSign className="text-xs mr-1 flex-shrink-0" />
    <span>{vendor.cost}</span>
  </div>
</td>

          <td className="py-3 px-6">
            <div className={`flex items-center gap-2 p-1 rounded`}>
              {getActionIcon(vendor.action)}
              <select
                value={vendor.action}
                onChange={(e) => handleChange(vendor.productId, "action", e.target.value)}
                className={`p-1 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 text-sm ${getActionBgColor(vendor.action)}`}
              >
                <option value="Approved">Approved</option>
                <option value="Disapproved">Disapproved</option>
                <option value="Block">Block</option>
                <option value="Dropdown">Dropdown</option>
              </select>
            </div>
          </td>
          <td className="py-3 px-6">
            <input
              type="text"
              value={vendor.reason || ""}
              onChange={(e) => handleChange(vendor.productId, "reason", e.target.value)}
              placeholder="Reason"
              className="p-1 border border-gray-300 rounded-md w-full text-sm"
            />
          </td>
          <td className="py-3 px-6">
            <button
              onClick={() => handleSave(vendor)}
              disabled={saving[vendor.productId]}
              className="flex items-center justify-center gap-1 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400"
            >
              <FaPaperPlane className="text-base" />
            </button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>


        {/* Mobile Cards */}
        <div className="md:hidden p-4 space-y-4">
          {vendors.map((vendor) => (
            <div key={vendor.productId} className="bg-white p-4 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition">
              <div className="flex flex-col gap-2">
                <div className="flex justify-between">
                  <span className="font-semibold text-gray-700">Vendor:</span>
                  <span>{vendor.shopName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-gray-700">Product:</span>
                  <span>{vendor.productType}</span>
                </div>
                <div className="flex justify-between items-center">
  <span className="font-semibold text-gray-700">Cost:</span>
  <span className="flex items-center gap-1 font-semibold text-green-700">
    <FaRupeeSign className="text-xs flex-shrink-0" />
    <span>{vendor.cost}</span>
  </span>
</div>

                <div className="flex flex-col gap-1">
                  <span className="font-semibold text-gray-700">Action:</span>
                   <div className={`flex items-center gap-2 p-1 rounded`}>
                    {getActionIcon(vendor.action)}
                    <select
                      value={vendor.action}
                      onChange={(e) => handleChange(vendor.productId, "action", e.target.value)}
                      className={`flex-1 p-1 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 text-sm min-w-[120px] ${getActionBgColor(vendor.action)}`}
                    >
                      <option value="Approved">Approved</option>
                      <option value="Disapproved">Disapproved</option>
                      <option value="Block">Block</option>
                      <option value="Dropdown">Dropdown</option>
                    </select>
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="font-semibold text-gray-700">Reason:</span>
                  <input
                    type="text"
                    value={vendor.reason || ""}
                    onChange={(e) => handleChange(vendor.productId, "reason", e.target.value)}
                    placeholder="Reason"
                    className="p-1 border border-gray-300 rounded-md w-full text-sm"
                  />
                </div>
                
                <button
                  onClick={() => handleSave(vendor)}
                  disabled={saving[vendor.productId]}
                  className="flex justify-center items-center gap-1 px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400 mt-2"
                >
                  

                  <FaPaperPlane />
                  <span className="text-sm">Submit</span>
                </button>
              
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductVendorsList;
