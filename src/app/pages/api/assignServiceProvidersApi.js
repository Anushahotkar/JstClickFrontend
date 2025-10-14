// src/api/assignServiceVendorsApi.js
import Joi from "joi";
import api from "./authApi";

// ✅ Define Joi schemas

// Schema for fetching service providers
const serviceNameSchema = Joi.string()
  .min(2)
  .max(100)
  .trim()
  .required()
  .messages({
    "string.base": "Service name must be a string",
    "string.empty": "Service name is required",
    "string.min": "Service name must be at least 2 characters long",
    "string.max": "Service name must be less than 100 characters",
    "any.required": "Service name is required",
  });

// Schema for assigning a vendor
const assignVendorSchema = Joi.object({
  bookingId: Joi.string()
    .trim()
    .required()
    .messages({
      "string.base": "Booking ID must be a string",
      "string.empty": "Booking ID is required",
      "any.required": "Booking ID is required",
    }),
  vendorId: Joi.string()
    .trim()
    .required()
    .messages({
      "string.base": "Vendor ID must be a string",
      "string.empty": "Vendor ID is required",
      "any.required": "Vendor ID is required",
    }),
});

// ✅ Fetch service providers by service name
export const fetchServiceProvidersByName = async (serviceName) => {
  // Validate input before sending request
  const { error } = serviceNameSchema.validate(serviceName);
  if (error) throw new Error(error.details[0].message);

  try {
    const encodedName = encodeURIComponent(serviceName);
    const res = await api.get(
      `/admin/api/serviceProvider/service-providers/by-name/${encodedName}`
    );
    return res.data.data || [];
  } catch (err) {
    throw new Error(
      err.response?.data?.message || err.message || "Failed to fetch service providers"
    );
  }
};

// ✅ Assign vendor to booking with validation
export const assignVendorToBooking = async (bookingId, vendorId) => {
  // Validate inputs
  const { error } = assignVendorSchema.validate({ bookingId, vendorId });
  if (error) throw new Error(error.details[0].message);

  try {
    const res = await api.post("/admin/api/serviceOrder/assign-vendor", {
      bookingId,
      vendorId,
    });

    return res.data;
  } catch (err) {
    throw new Error(
      err.response?.data?.message || err.message || "Failed to assign vendor"
    );
  }
};
