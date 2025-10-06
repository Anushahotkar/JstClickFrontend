/* ServiceProviders.jsx */
import { useState, useEffect } from "react";
import { FaStar, FaCheckCircle, FaTimesCircle, FaBan, FaStore } from "react-icons/fa";
import { fetchServiceProviders, updateProviderAction, providerActionSchema } from "../../api/serviceProvidersApi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Spinner from "../../dashboards/components/Spinner"; // adjust path

const ServiceProviders = () => {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getProviders = async () => {
      try {
        const data = await fetchServiceProviders();
        setProviders(data);
      } catch (err) {
        console.error(err);
        toast.error("❌ Error fetching providers: " + err.message);
      } finally {
        setLoading(false);
      }
    };
    getProviders();
  }, []);

  const getRatingStars = (rating) => (
    <div className="flex items-center gap-1">
      {[...Array(5)].map((_, i) => (
        <FaStar key={i} className={i < Math.round(rating || 0) ? "text-yellow-400" : "text-gray-300"} />
      ))}
    </div>
  );

  const getActionIcon = (action) => {
    switch (action) {
      case "Approved": return <FaCheckCircle className="text-green-600" />;
      case "Disapproved": return <FaTimesCircle className="text-red-500" />;
      case "Suspended": return <FaBan className="text-red-700" />;
      default: return null;
    }
  };

const handleActionChange = async (e, id) => {
    const newAction = e.target.value;
    const provider = providers.find((p) => p._id === id);

    // fallback reason if empty
    const reason = provider.reason?.trim() || "Updated by admin";

    const { error } = providerActionSchema.validate({ action: newAction, reason });
    if (error) {
      console.log(error);
      toast.error(error.details[0].message);
      return;
    }

    try {
      await updateProviderAction(id, newAction, reason);
      setProviders((prev) =>
        prev.map((p) => (p._id === id ? { ...p, action: newAction, reason } : p))
      );
      toast.success("✅ Action updated successfully");
    } catch (err) {
      console.log(err);
      toast.error("❌ Failed to update action: " + err.message);
    }
  };



  const handleReasonChange = (id, value) => {
    setProviders((prev) => prev.map((p) => (p._id === id ? { ...p, reason: value } : p)));
  };

  const handleReasonBlur = async (id) => {
    const provider = providers.find((p) => p._id === id);

    const { error } = providerActionSchema.validate({ action: provider.action, reason: provider.reason || "" });
    if (error) {
      console.log(error);
      toast.error(error.details[0].message);
      return;
    }

    try {
      await updateProviderAction(id, provider.action, provider.reason || "");
      toast.success("✅ Reason updated successfully");
    } catch (err) {
      console.log(err);
      toast.error("❌ Failed to update reason: " + err.message);
    }
  };

  if (loading) return <div className="flex justify-center items-center h-screen"><Spinner size="large" color="primary" /></div>;

  return (
    <div className="bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen p-4 sm:p-8 font-sans text-gray-800">
      <ToastContainer position="top-right" autoClose={3000} />
      <h1 className="text-3xl sm:text-4xl font-extrabold text-blue-800 mb-6 sm:mb-8 flex items-center gap-2">
        <FaStore className="text-blue-600" /> Service Providers
      </h1>

      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
       {/* Desktop Table */}
<div className="hidden md:block overflow-x-auto">
  <table className="min-w-full leading-normal">
    <thead>
      <tr className="bg-blue-100 text-blue-800 uppercase text-sm font-semibold">
        {["Name", "Service Type", "Cost", "Rating", "Action", "Reason"].map((col) => (
          <th key={col} className="py-3 px-2 sm:px-3 text-left whitespace-nowrap">{col}</th>
        ))}
      </tr>
    </thead>
    <tbody>
      {providers.map((p, index) => (
        <tr key={p._id} className={`border-b ${index % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-blue-50 transition`}>
         {/* Name */}
<td className="py-3 px-2 sm:px-3 flex items-center gap-2 max-w-[150px] break-words">
  {p.profileImage ? (
    <img src={p.profileImage} alt={p.name} className="w-10 h-10 rounded-full object-cover" />
  ) : (
    <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-200 text-gray-500 font-bold">
      {p.name?.charAt(0).toUpperCase() || "?"}
    </div>
  )}
  <span>{p.name}</span>
</td>

{/* Service Type */}
<td className="py-3 px-2 sm:px-3 max-w-[120px] break-words">{p.serviceType}</td>


          {/* Cost */}
          <td className="py-3 px-2 sm:px-3 font-semibold whitespace-nowrap">₹{p.cost}</td>

          {/* Rating */}
          <td className="py-3 px-2 sm:px-3 whitespace-nowrap">{getRatingStars(p.ratings?.length ? p.ratings.reduce((a,b)=>a+b,0)/p.ratings.length : 0)}</td>

          {/* Action */}
          <td className="py-3 px-2 sm:px-3 flex items-center gap-2">
            {getActionIcon(p.action)}
            <select
              value={p.action}
              onChange={(e) => handleActionChange(e, p._id)}
              className="p-1 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 text-sm"
            >
              <option value="Pending">Pending</option>
                      <option value="Approved">Approved</option>
                      <option value="Disapproved">Disapproved</option>
                      <option value="Suspended">Suspended</option>
            </select>
          </td>

          {/* Reason */}
          <td className="py-3 px-2 sm:px-3">
            <textarea
              value={p.reason || ""}
              rows={2}
              placeholder="Provide reason"
              onChange={(e) => handleReasonChange(p._id, e.target.value)}
              onBlur={() => handleReasonBlur(p._id)}
              className="w-full p-1 border border-gray-300 rounded-md text-sm resize-none"
            />
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>


        {/* Mobile Cards */}
        <div className="md:hidden p-4 space-y-4">
          {providers.map((p) => (
            <div key={p._id} className="bg-white p-4 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                  {p.profileImage ? (
                    <img src={p.profileImage} alt={p.name} className="w-8 h-8 rounded-full object-cover" />
                  ) : (
                    <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 text-gray-500 font-bold">
                      {p.name?.charAt(0).toUpperCase() || "?"}
                    </div>
                  )}
                  <span className="font-semibold">{p.name}</span>
                </div>
                <div className="flex items-center gap-2">{getActionIcon(p.action)}</div>
              </div>
              <p className="text-sm text-gray-600">Service: {p.serviceType}</p>
              <p className="text-sm text-gray-600 font-semibold">Cost: ₹{p.cost}</p>
              <div className="flex items-center gap-1 mt-1">{getRatingStars(p.ratings?.length ? p.ratings.reduce((a,b)=>a+b,0)/p.ratings.length : 0)}</div>
              <div className="mt-2 flex flex-col gap-2">
                <select
                  value={p.action}
                  onChange={(e) => handleActionChange(e, p._id)}
                  className="w-full px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                 <option value="Pending">Pending</option>
                      <option value="Approved">Approved</option>
                      <option value="Disapproved">Disapproved</option>
                      <option value="Suspended">Suspended</option>
                </select>
                <textarea
                  value={p.reason || ""}
                  rows={2}
                  placeholder="Provide reason"
                  onChange={(e) => handleReasonChange(p._id, e.target.value)}
                  onBlur={() => handleReasonBlur(p._id)}
                  className="w-full px-3 py-1 border border-gray-300 rounded-md text-sm resize-none"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ServiceProviders;
