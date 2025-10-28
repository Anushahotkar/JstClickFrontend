// src/api/servicesApi.js
// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL.replace(/\/$/, "");
import api from "./authApi";
import Joi from "joi";

export const serviceSchema = Joi.object({
  name: Joi.string().required().messages({
    "string.empty": `"name" is required`,
  }),
  description: Joi.string().allow(""),
  cost: Joi.number().required().messages({
    "number.base": `"cost" must be a number`,
    "any.required": `"cost" is required`,
  }),
  category: Joi.string().required().messages({
    "string.empty": `"category" is required`,
  }),
   wageType: Joi.string().required().messages({
    "string.empty": `"wageType" is required`,
  }),
 user: Joi.string().optional(),
userType: Joi.string().optional(),

  image: Joi.any()
  .custom((file, helpers) => {
    if (!file) return file;
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/avif", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      return helpers.error("any.invalid");
    }
    return file;
  })
  .allow(null)
  .messages({
    "any.invalid": `"image" must be a valid image file`,
  }),

});


export const getAuthToken = () => localStorage.getItem("authToken");

// Fetch categories
// Fetch all service categories
export const fetchCategories = async () => {
  try {
    const res = await api.get("/admin/api/category/service-categories");
    return res.data; // backend should return { data: [...] }
  } catch (err) {
    throw new Error(err.response?.data?.message || "Failed to fetch categories");
  }
};

// Fetch services for a category
// Fetch services for a specific category
export const fetchCategoryServices = async (categoryId) => {
  try {
    const res = await api.get(`/admin/api/services/service-categories/${categoryId}`);
    return res.data.data || [];
  } catch (err) {
    throw new Error(err.response?.data?.message || `Failed to fetch services`);
  }
};



// Delete service
// Delete a service
export const deleteService = async (serviceId) => {
  try {
    const res = await api.delete(`/admin/services/${serviceId}`);
    return res.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || "Failed to delete service");
  }
};

// Create a new service
// Create a new service
export const createService = async (serviceData) => {

    const res = await api.post("/admin/api/services/services", serviceData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data.data;
  
};

// Update an existing service
export const updateService = async (serviceId, serviceData) => {

    const res = await api.put(`/admin/services/${serviceId}`, serviceData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data.data || res.data.service;
  
};

// Fetch single category by ID
// servicesApi.js



// Fetch a single service by ID
export const fetchServiceById = async (serviceId) => {
  try {
    const res = await api.get(`/admin/api/services/service/${serviceId}`);
    return res.data.data; // assuming backend returns { data: { ...service } }
  } catch (err) {
    throw new Error(err.response?.data?.message || "Service not found");
  }
};

