// src/api/serviceProvidersApi.js
import Joi from "joi";
import api from "./authApi"; // use the centralized axios instance


// src/validations/providerAction.validation.js


// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Fetch all service providers
// Fetch all service providers
export const fetchServiceProviders = async () => {
  try {
    const res = await api.get("/admin/api/serviceProvider/serviceproviders");
    return res.data.data || [];
  } catch (err) {
    throw new Error(err.response?.data?.message || err.message || "Failed to fetch service providers");
  }
};

// Update provider action
export const updateProviderAction = async (id, action, reason) => {
  try {
    const res = await api.patch(`/admin/api/serviceProvider/services/${id}/action`, {
      action,
      reason,
    });
    return res.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || err.message || "Failed to update provider action");
  }
};

// Joi validation schema
export const providerActionSchema = Joi.object({
  action: Joi.string()
  .valid("Approved", "Disapproved", "Suspended", "Pending")
  .required(),
  reason: Joi.string().allow("").max(200),
});
