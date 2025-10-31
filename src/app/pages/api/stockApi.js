// src/api/categoryApi.js
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE_URL;// adjust if backend differs

// ✅ Fetch all service + product categories
export const fetchCategories = async (token) => {
  try {
    const res = await axios.get(`${API_BASE}/admin/stock/categories`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.data?.success) {
      return res.data.data; // { serviceCategories, productCategories }
    } else {
      throw new Error(res.data.message || "Failed to fetch categories");
    }
  } catch (err) {
    console.error("❌ Error fetching categories:", err);
    throw err;
  }
};


// Fetch category items based on ID and type
export const fetchCategoryItems = async (categoryId, type, token) => {
  try {
    const response = await axios.get(
      `${API_BASE}/admin/stock/category-items/${categoryId}`,
      {
        params: { type },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data?.data || [];
  } catch (error) {
    console.error("Error fetching stock items:", error);
    throw new Error(
      error.response?.data?.message || "Failed to fetch stock items"
    );
  }
};