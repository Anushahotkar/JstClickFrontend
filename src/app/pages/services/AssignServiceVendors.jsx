import { useState, useEffect } from "react";
import { FaStar, FaUserCircle, FaSpinner } from "react-icons/fa";
import AssignVendorsModal from "./AssignVendorsModal";

// Mock API Call
const fetchVendors = async () => [
  { id: "1", vendorName: "Mario Perez", phone: "9876543210", rating: 4.5 },
  { id: "2", vendorName: "Antonio Diaz", phone: "9876543210", rating: 5 },
  { id: "3", vendorName: "Elizabeth Bailey", phone: "9876543210", rating: 4 },
  { id: "4", vendorName: "Clara Lopez", phone: "9876543210", rating: 3.5 },
];

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

const AssignServiceVendors = ({ isOpen, onClose, onAssign }) => {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      const loadVendors = async () => {
        const data = await fetchVendors();
        setVendors(data);
        setLoading(false);
      };
      loadVendors();
    }
  }, [isOpen]);

  return (
    <AssignVendorsModal isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col gap-4">
        {loading ? (
          <div className="flex justify-center items-center py-10 text-lg text-gray-600">
            <FaSpinner className="animate-spin mr-2" /> Loading Vendors...
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
                    <tr key={vendor.id} className="hover:bg-gray-50">
                      <td className="px-4 py-2 text-sm font-medium flex items-center gap-2">
                        <FaUserCircle className="text-xl text-gray-400" />
                        {vendor.vendorName}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-500">{vendor.phone}</td>
                      <td className="px-4 py-2 text-sm text-gray-500 flex gap-1">
                        {getRatingStars(vendor.rating)}
                      </td>
                      <td className="px-4 py-2 text-sm">
                        <button
                          onClick={() => onAssign(vendor)}
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
                  key={vendor.id}
                  className="bg-gray-50 p-3 rounded-lg shadow flex flex-col gap-2"
                >
                  <div className="flex items-center gap-2 font-medium text-gray-900">
                    <FaUserCircle className="text-2xl text-gray-400" />
                    {vendor.vendorName}
                  </div>
                  <div className="text-gray-500 text-sm">Phone: {vendor.phone}</div>
                  <div className="flex gap-1">{getRatingStars(vendor.rating)}</div>
                  <button
                    onClick={() => onAssign(vendor)}
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
