import { useState, useEffect } from "react";
import { FaStar, FaUserCircle} from "react-icons/fa";
import AssignVendorsModal from "./AssignVendorsModal";
import Spinner from "../dashboards/components/Spinner"; // import your custom spinner
import { fetchServiceProvidersByName
  ,assignVendorToBooking
 } from "../api/assignServiceProvidersApi"; // updated import
import {toast} from "react-hot-toast";

const getRatingStars = (rating) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;
  const stars = [];

  for (let i = 0; i < fullStars; i++)
    stars.push(<FaStar key={`full-${i}`} className="text-yellow-400" />);
  if (hasHalfStar)
    stars.push(
      <FaStar
        key="half"
        className="text-yellow-400"
        style={{ clipPath: "inset(0 50% 0 0)" }}
      />
    );
  while (stars.length < 5)
    stars.push(<FaStar key={`empty-${stars.length}`} className="text-gray-300" />);

  return stars;
};

const AssignServiceVendors = ({ isOpen, onClose, onAssign, serviceName,bookingId }) => {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen && serviceName) {
      const loadVendors = async () => {
        try {
          setLoading(true);
          const data = await fetchServiceProvidersByName(serviceName);
          setVendors(data);
        } catch (err) {
          console.error(err);

          toast.error("Failed to load service providers");
        } finally {
          setLoading(false);
        }
      };
      loadVendors();
    }
  }, [isOpen, serviceName]);

  
const handleAssign = async (vendor) => {
  try {
    setLoading(true);
    if (!bookingId) {
      console.log("booking Id",bookingId);
    toast.error("Booking ID is missing!");
    return;
  }
    await assignVendorToBooking(bookingId, vendor._id);
    toast.success("Vendor assigned successfully!");
    onAssign(vendor); // ✅ notify parent to refresh data
    onClose();

  } catch (err) {
    console.log(err);
    toast.error("Failed to assign vendor: " + (err.response?.data?.message || err.message));
  } finally {
    setLoading(false);
    onClose();
  }
};


  return (
    <AssignVendorsModal isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col gap-4">
        {loading ? (
            <div className="flex justify-center items-center py-10">
            <Spinner size="large" color="primary" />
          </div>
        ) : (
          <>
            {/* Table for tablet/desktop */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full divide-y divide-gray-200 min-w-[600px]">
                <thead className="bg-gray-50">
                  <tr>
                    {["Vendor Name", "Phone", "Rating", "Action"].map((th) => (
                      <th
                        key={th}
                        className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
                      >
                        {th}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {vendors.map((vendor) => (
                    <tr key={vendor._id || vendor.id} className="hover:bg-gray-50">
                      <td className="px-4 py-2 text-sm font-medium flex items-center gap-2">
                        <FaUserCircle className="text-xl text-gray-400" />
                        {vendor.name || vendor.vendorName}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-500">{vendor.phone}</td>
                      <td className="px-4 py-2 text-sm text-gray-500 flex gap-1">
                        {getRatingStars(vendor.rating || 0)}
                      </td>
                      <td className="px-4 py-2 text-sm">
                       <button
  onClick={() => handleAssign(vendor)}
  className="bg-blue-600 text-white px-3 py-1 rounded-md text-sm font-semibold hover:bg-blue-700 transition-colors w-full"
>
  Assign
</button>

                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Card view for mobile */}
            <div className="sm:hidden flex flex-col gap-3">
              {vendors.map((vendor) => (
                <div
                  key={vendor._id || vendor.id}
                  className="bg-gray-50 p-3 rounded-lg shadow flex flex-col gap-2"
                >
                  <div className="flex items-center gap-2 font-medium text-gray-900">
                    <FaUserCircle className="text-2xl text-gray-400" />
                    {vendor.name || vendor.vendorName}
                  </div>
                  <div className="text-gray-500 text-sm">Phone: {vendor.phone}</div>
                  <div className="flex gap-1">{getRatingStars(vendor.rating || 0)}</div>
                 <button
  onClick={() => handleAssign(vendor)} // instead of onAssign
  className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors mt-2"
>
  Assign
</button>

                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </AssignVendorsModal>
  );
};

export default AssignServiceVendors;
