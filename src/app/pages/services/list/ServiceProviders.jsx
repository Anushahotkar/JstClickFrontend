import { useState, useEffect } from "react";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaBan,
  FaStore,
  FaPaperPlane,
  FaSearch,
} from "react-icons/fa";
import {
  fetchServiceProviders,
  updateProviderAction,
  providerActionSchema,
} from "../../api/serviceProvidersApi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Spinner from "../../dashboards/components/Spinner";

const ServiceProviders = () => {
  const [providers, setProviders] = useState([]);
  const [filteredProviders, setFilteredProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const getProviders = async () => {
      try {
        const data = await fetchServiceProviders();
        setProviders(data);
        setFilteredProviders(data);
      } catch (err) {
        console.error(err);
        toast.error("❌ Error fetching providers: " + err.message);
      } finally {
        setLoading(false);
      }
    };
    getProviders();
  }, []);

  // 🔍 Filter providers on search
  useEffect(() => {
    const term = searchTerm.toLowerCase();
    const filtered = providers.filter((p) =>
      [p.name, p.serviceType, p.action]
        .filter(Boolean)
        .some((field) => field.toLowerCase().includes(term))
    );
    setFilteredProviders(filtered);
  }, [searchTerm, providers]);

  const getActionBgColor = (action) => {
    switch (action) {
      case "Approved":
        return "bg-green-100 text-green-800";
      case "Disapproved":
        return "bg-red-100 text-red-800";
      case "Suspended":
        return "bg-yellow-100 text-yellow-800";
      case "Pending":
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  const getActionIcon = (action) => {
    switch (action) {
      case "Approved":
        return <FaCheckCircle className="text-green-600" />;
      case "Disapproved":
        return <FaTimesCircle className="text-red-500" />;
      case "Suspended":
        return <FaBan className="text-yellow-600" />;
      default:
        return null;
    }
  };

  const handleActionChange = (e, id) => {
    const newAction = e.target.value;
    setProviders((prev) =>
      prev.map((p) => (p._id === id ? { ...p, action: newAction } : p))
    );
  };

  const handleReasonChange = (id, value) => {
    setProviders((prev) =>
      prev.map((p) => (p._id === id ? { ...p, reason: value } : p))
    );
  };

  const handleSubmit = async (id) => {
    const provider = providers.find((p) => p._id === id);
    const reason = provider.reason?.trim() || "Updated by admin";

    const { error } = providerActionSchema.validate({
      action: provider.action,
      reason,
    });
    if (error) {
      toast.error(error.details[0].message);
      return;
    }

    try {
      await updateProviderAction(id, provider.action, reason);
      toast.success("✅ Action and reason updated successfully");
    } catch (err) {
      toast.error("❌ Failed to update: " + err.message);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner size="large" color="primary" />
      </div>
    );

  return (
    <div className="bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen p-3 sm:p-6 md:p-8 font-sans text-gray-800">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Header + Search */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-blue-800 flex items-center gap-2">
          <FaStore className="text-blue-600" /> Service Providers
        </h1>

        <div className="relative w-full sm:w-80">
          <FaSearch className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, service, or action"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none text-sm"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
        {filteredProviders.length === 0 ? (
          <div className="p-8 text-center text-gray-500 text-lg">
            No service providers found.
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="min-w-full leading-normal">
                <thead>
                  <tr className="bg-blue-100 text-blue-800 uppercase text-sm font-semibold">
                    {["Name", "Service Type", "Cost", "Action", "Reason", "Submit"].map((col) => (
                      <th key={col} className="py-3 px-4 text-left whitespace-nowrap">
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredProviders.map((p, i) => (
                    <tr
                      key={p._id}
                      className={`border-b ${i % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-blue-50 transition`}
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          {p.profileImage && (
                            <img
                              src={p.profileImage}
                              alt={p.name}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                          )}
                          <span className="font-medium">{p.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">{p.serviceType}</td>
                      <td className="py-3 px-4 font-semibold whitespace-nowrap">₹{p.cost}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          {getActionIcon(p.action)}
                          <select
                            value={p.action}
                            onChange={(e) => handleActionChange(e, p._id)}
                            className={`p-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm ${getActionBgColor(
                              p.action
                            )}`}
                          >
                            <option value="Pending">Pending</option>
                            <option value="Approved">Approved</option>
                            <option value="Disapproved">Disapproved</option>
                            <option value="Suspended">Suspended</option>
                          </select>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <textarea
                          value={p.reason || ""}
                          rows={2}
                          placeholder="Provide reason"
                          onChange={(e) => handleReasonChange(p._id, e.target.value)}
                          className="w-full p-1 border border-gray-300 rounded-md text-sm resize-none focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                      </td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => handleSubmit(p._id)}
                          className="p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center justify-center"
                        >
                          <FaPaperPlane />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden p-4 space-y-4">
              {filteredProviders.map((p) => (
                <div
                  key={p._id}
                  className="bg-white p-4 rounded-xl shadow-md border border-gray-200 hover:shadow-lg transition"
                >
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2">
                      {p.profileImage && (
                        <img
                          src={p.profileImage}
                          alt={p.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      )}
                      <span className="font-semibold text-gray-800">{p.name}</span>
                    </div>
                    {getActionIcon(p.action)}
                  </div>

                  <p className="text-sm text-gray-600">Service: {p.serviceType}</p>
                  <p className="text-sm text-gray-600 font-semibold">Cost: ₹{p.cost}</p>

                  <div className="mt-3 space-y-2">
                    <select
                      value={p.action}
                      onChange={(e) => handleActionChange(e, p._id)}
                      className={`w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${getActionBgColor(
                        p.action
                      )}`}
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
                      className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />

                    <button
                      onClick={() => handleSubmit(p._id)}
                      className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition flex items-center justify-center gap-2 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <FaPaperPlane />
                      <span>Submit</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ServiceProviders;
