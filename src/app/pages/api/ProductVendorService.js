// vendorService.js
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const getAuthHeaders = () => {
  const token = localStorage.getItem("authToken"); // 🔹 retrieve stored token
  return {
    "Content-Type": "application/json",
    Authorization: token ? `Bearer ${token}` : "", // 🔹 add token if available
  };
};

export const fetchVendors = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/admin/productVendor/vendors`, {
      headers: getAuthHeaders(),
    });

    const data = await res.json();
console.log(data);
    if (!res.ok || !data.success) {
      throw new Error(data.message || "Failed to fetch vendors");
    }
    console.log(data.data);
    return data.data;
  } catch (error) {
    console.log(error);
    console.error("❌ Error fetching vendors:", error);
    throw error;
  }
};

export const updateVendorAction = async (id, action) => {
  try {
    const res = await fetch(`${API_BASE_URL}/admin/api/serviceProvider/${id}/action`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify({ action }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to update vendor action");
    return data;
  } catch (error) {
    console.error("❌ Error updating vendor action:", error);
    throw error;
  }
};
