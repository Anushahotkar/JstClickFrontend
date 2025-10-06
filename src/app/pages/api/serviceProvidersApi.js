// src/api/serviceProvidersApi.js
import Joi from "joi";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Fetch all service providers
export const fetchServiceProviders = async () => {
  const token = localStorage.getItem("authToken");
  const res = await fetch(`${API_BASE_URL}/admin/api/serviceProvider/serviceproviders`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to fetch service providers");
  return data.data;
};

// Update provider action
export const updateProviderAction = async (id, action) => {
  const token = localStorage.getItem("authToken");
  const res = await fetch(`${API_BASE_URL}/admin/api/serviceProvider/services/${id}/action`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ action }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to update action");
  return data;
};

// Joi validation schema
export const providerActionSchema = Joi.object({
  action: Joi.string().valid("Approved", "Disapproved", "Suspended", "Pending").required(),
  reason: Joi.string().allow("").max(200),
});
