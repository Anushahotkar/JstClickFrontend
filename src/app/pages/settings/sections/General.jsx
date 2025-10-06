import { useState, useEffect, useRef } from "react";
import {
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  HomeIcon,
} from "@heroicons/react/24/outline";

// Default user avatar SVG
const DefaultAvatar = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-full w-full text-gray-400"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 
      10 10 10 10-4.48 10-10S17.52 2 12 2zm0 
      3c1.38 0 2.5 1.12 2.5 2.5S13.38 10 
      12 10 9.5 8.88 9.5 7.5 10.62 5 
      12 5zm0 14.5c-2.73 0-5.26-1.55-6.61-4.04.03-1.63 
      2.15-2.96 6.61-2.96 4.46 0 6.58 1.33 
      6.61 2.96-1.35 2.49-3.88 4.04-6.61 4.04z" />
  </svg>
);

const General = () => {
  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobileNumber: "",
    address: "",
    avatar: null,
  });

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef(null);
useEffect(() => {
  const fetchProfile = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("authToken");
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/admin/profile`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch profile data.");

      const result = await response.json();

      // Map API fields to your state
      const apiData = result.data;
      setProfile({
        firstName: apiData.firstName || "",
        lastName: apiData.lastName || "",
        email: apiData.email || "",
        mobileNumber: apiData.phone || "", // map phone -> mobileNumber
        address: apiData.address || "",
        avatar: null, // if your API returns avatar, replace here
      });
    } catch (err) {
      console.error("Error fetching profile:", err);
    } finally {
      setLoading(false);
    }
  };

  fetchProfile();
}, []);




  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvatarUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile((prev) => ({ ...prev, avatar: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const response = await fetch("/api/profile/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });
      if (!response.ok) throw new Error("Failed to save changes.");
      alert("✅ Profile updated successfully!");
    } catch (err) {
      console.error("Save error:", err);
      alert("❌ Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 text-center text-gray-500 animate-pulse">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen p-6 md:p-10">
      <h1 className="text-2xl font-semibold mb-8 text-gray-800">My Profile</h1>

      {/* Avatar */}
      <div className="flex justify-center mb-10">
        <div className="relative group">
          <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-gray-200 shadow-md">
            {profile.avatar ? (
              <img
                src={profile.avatar}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <DefaultAvatar />
            )}
          </div>
          <button
            type="button"
            onClick={() => fileInputRef.current.click()}
            className="absolute bottom-2 right-2 p-2 rounded-full bg-blue-500 text-white shadow-lg 
                       hover:bg-blue-600 transition-transform transform hover:scale-105"
          >
            ✏️
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleAvatarUpload}
            className="hidden"
            accept="image/*"
          />
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSave} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* First Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              First Name
            </label>
            <div className="relative mt-1">
              <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                name="firstName"
                value={profile.firstName}
                onChange={handleChange}
                placeholder="John"
                className="pl-10 h-12 block w-full rounded-lg border border-gray-300 shadow-sm 
                           focus:border-blue-500 focus:ring focus:ring-blue-200"
              />
            </div>
          </div>
          {/* Last Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Last Name
            </label>
            <div className="relative mt-1">
              <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                name="lastName"
                value={profile.lastName}
                onChange={handleChange}
                placeholder="Doe"
                className="pl-10 h-12 block w-full rounded-lg border border-gray-300 shadow-sm 
                           focus:border-blue-500 focus:ring focus:ring-blue-200"
              />
            </div>
          </div>
          {/* Email */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <div className="relative mt-1">
              <EnvelopeIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="email"
                name="email"
                value={profile.email}
                onChange={handleChange}
                placeholder="john@gmail.com"
                className="pl-10 h-12 block w-full rounded-lg border border-gray-300 shadow-sm 
                           focus:border-blue-500 focus:ring focus:ring-blue-200"
              />
            </div>
          </div>
          {/* Mobile */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">
              Mobile Number
            </label>
            <div className="relative mt-1">
              <PhoneIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="tel"
                name="mobileNumber"
                value={profile.mobileNumber}
                onChange={handleChange}
                placeholder="9876543210"
                className="pl-10 h-12 block w-full rounded-lg border border-gray-300 shadow-sm 
                           focus:border-blue-500 focus:ring focus:ring-blue-200"
              />
            </div>
          </div>
          {/* Address */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">
              Address
            </label>
            <div className="relative mt-1">
              <HomeIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                name="address"
                value={profile.address}
                onChange={handleChange}
                placeholder="123 Main Street"
                className="pl-10 h-12 block w-full rounded-lg border border-gray-300 shadow-sm 
                           focus:border-blue-500 focus:ring focus:ring-blue-200"
              />
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-8">
          <button
            type="button"
            className="px-6 py-2 h-12 border border-gray-300 rounded-lg text-gray-700 
                       hover:bg-gray-100 transition-colors w-full sm:w-auto"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2 h-12 rounded-lg text-white bg-blue-500 
                       hover:bg-blue-600 transition-colors disabled:opacity-50 w-full sm:w-auto"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default General;
