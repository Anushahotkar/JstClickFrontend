// src/api/servicesApi.js
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL.replace(/\/$/, "");


export const getAuthToken = () => localStorage.getItem("authToken");

// Fetch categories
export const fetchCategories = async () => {
  const token = getAuthToken();
  const res = await fetch(`${API_BASE_URL}/admin/api/category/service-categories`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to fetch categories");
  return res.json();
};

// Fetch services for a category
export const fetchCategoryServices = async (categoryId) => {
  const token = getAuthToken();
  if (!token) throw new Error("No auth token found");

  const res = await fetch(`${API_BASE_URL}/admin/api/services/service-categories/${categoryId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to fetch services: ${res.status} - ${text}`);
  }

  const servData = await res.json();
  return servData.data || [];
};



// Delete service
export const deleteService = async (serviceId) => {
  const token = getAuthToken();
  const res = await fetch(`${API_BASE_URL}/admin/services/${serviceId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to delete service");
  return res.json();
};

// Create a new service
// Create a new service
export const createService = async (serviceData) => {
  const token = getAuthToken();
  const res = await fetch(`${API_BASE_URL}/admin/api/services/services`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`, // no Content-Type header
    },
    body: serviceData, // send FormData directly
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to create service: ${res.status} - ${text}`);
  }

  return res.json();
};

// Update an existing service
export const updateService = async (serviceId, serviceData) => {
  const token = getAuthToken();
  const res = await fetch(`${API_BASE_URL}/admin/services/${serviceId}`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}` }, // FormData handles Content-Type
    body: serviceData,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to update service: ${res.status} - ${text}`);
  }

  const data = await res.json();
  return data.data || data.service;
};

// Fetch single category by ID
// servicesApi.js

export const fetchCategoryById = async (categoryId) => {
  const res = await fetchCategories(); // returns full API response
  const categories = res.data || [];   // extract the array from `data`
  const category = categories.find((c) => c._id === categoryId);
  if (!category) throw new Error("Category not found");
  return category;
};
