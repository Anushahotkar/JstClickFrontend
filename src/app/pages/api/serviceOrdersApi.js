import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

// Get all booked services
export const fetchServiceOrders = async (token) => {
  const res = await axios.get(`${API_BASE}/admin/api/serviceOrder`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data.data; // assuming your ApiResponse format
};

// Update status of a booked service
export const updateServiceOrderStatus = async (orderId, status, token) => {
  const res = await axios.patch(
    `${API_BASE}/serviceOrders/update-status`,
    { orderId, status },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data.data;
};
