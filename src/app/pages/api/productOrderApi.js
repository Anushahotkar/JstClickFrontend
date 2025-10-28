import Joi from 'joi';
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE_URL;


const token = localStorage.getItem("authToken"); // ✅ fetch token
    if (!token) throw new Error("No token found");

// Schema for creating a product order
export const orderSchema = Joi.object({
  vendorName: Joi.string().min(2).max(50).required(),
  productName: Joi.string().min(2).max(50).required(),
  quantity: Joi.string().required(),
  cost: Joi.number().min(0).required(),
  orderedOn: Joi.date().required(),
  status: Joi.string().valid('Delivered', 'Upcoming', 'Out for Delivery', 'Not Delivered').required(),
});

// Function to validate order
export const validateOrder = (order) => {
  const { error } = orderSchema.validate(order, { abortEarly: false });
  if (error) return error.details.map((detail) => detail.message);
  return null;
};



export const fetchProductOrders = async (token) => {
  try {
    const res = await axios.get((`${API_BASE}/admin/api/productOrder/orders`),{
       headers: { Authorization: `Bearer ${token}` },
    });
      return res.data.data || [];
  } catch (err) {
    console.error('Error fetching orders:', err);
    return [];
  }
};

// ✅ Fetch product posters dynamically by product name
export const getProductPosters = async ({ productName,token }) => {
  try {
    if (!productName) throw new Error("Product name is required");
    if (!token) throw new Error("Token missing");

    const response = await axios.post(
      `${API_BASE}/admin/api/productOrder/product-poster`,
      { productName }, // backend expects this in the body
      { 
        headers: {
          Authorization: `Bearer ${token}`, // ✅ include JWT
          "Content-Type": "application/json",
        },
        withCredentials: true, 
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error fetching product posters:", error);
    throw error;
  }
};



// ✅ Assign vendor to a specific product order
export const assignVendorToOrder = async ({ orderId, vendorId, vendorType, token }) => {
  try {
    if (!orderId || !vendorId) throw new Error("Missing orderId or vendorId");
    if (!token) throw new Error("Missing auth token");

    const response = await axios.patch(
      `${API_BASE}/admin/api/productOrder/orders/${orderId}/assign-vendor`,
      { vendorId, vendorType },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    );

    return response.data;
  } catch (error) {
    console.error("❌ Error assigning vendor:", error.response?.data || error.message);
    throw error;
  }
};



