// vendorService.js

// productApi.js
import Joi from "joi";
import axios from "axios";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const getAuthHeaders = () => {
  const token = localStorage.getItem("authToken"); // 🔹 retrieve stored token
  return {
    "Content-Type": "application/json",
    Authorization: token ? `Bearer ${token}` : "", // 🔹 add token if available
  };
};

export const vendorActionSchema = Joi.object({
  action: Joi.string()
    .valid("Approved", "Disapproved", "Block", "Dropdown")
    .required()
    .messages({
      "any.required": "Action is required",
      "any.only": "Invalid action selected",
    }),
  reason: Joi.string()
    .max(200)
    
    .required()
    .messages({
      "any.required": "Reason is required",
      "string.max": "Reason must be at most 200 characters",
    }),
});

export const fetchVendors = async () => {
  const { data } = await axios.get(`${API_BASE_URL}/admin/productVendor/vendors`, {
    headers: getAuthHeaders(),
  });
  if (!data.success) throw new Error(data.message || "Failed to fetch vendors");
  return data.data;
};

export const updateVendorAction = async (id, action, reason) => {
  const payload = { action, reason };
  const { data } = await axios.post(
    `${API_BASE_URL}/admin/productVendor/action/${id}`,
    payload,
    { headers: getAuthHeaders() }
  );
  if (!data.success) throw new Error(data.message || "Failed to update vendor action");
  return data;
};
