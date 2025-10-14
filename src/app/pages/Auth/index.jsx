// src/pages/AdminLogin.jsx
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Mail, Lock, Loader2 } from "lucide-react";
import JSTcliqBlue from "assets/JSTcliqBlue.jpeg";
import { useAuthContext } from "app/contexts/auth/context";
import { DASHBOARD_HOME_PATH } from "constants/app.constant.js";
import { setSession } from "utils/jwt";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuthContext();

  // Redirect after login
  

 const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError("");

  try {
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/admin/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ identifier: email, password }),
    });

    const data = await response.json();
    console.log("Login response:", data);

    if (response.ok && data.success && data.data?.accessToken) {
      // Save token
      localStorage.setItem("authToken", data.data.accessToken);
      setSession(data.data.accessToken);

      // Update auth context
      await login({
        accessToken: data.data.accessToken,
        user: data.data.user,
      });

      // Redirect immediately after login
      // Redirect after login
// Determine the correct redirect path
let redirectTo = DASHBOARD_HOME_PATH; // default fallback

if (
  location?.state?.from &&
  typeof location.state.from === "string" &&
  location.state.from.trim() !== "" &&
  location.state.from.toLowerCase() !== "null" &&
  location.state.from.toLowerCase()!=="undefined"
) {
  redirectTo = location.state.from;
}

console.log("Redirecting to:", redirectTo);
navigate(redirectTo, { replace: true });



    } else if (response.status === 401 || !data.success) {
      console.log("data "+JSON.stringify(data));
      setError(data.message || "Username or password is incorrect");
    } else {
      setError(data.message || "Login failed");
    }
  } catch (err) {
    console.error(err);
    setError("Server error. Please try again later.");
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="flex flex-col md:flex-row justify-center items-center min-h-screen bg-gradient-to-br from-[#e3f2fd] to-[#f0f4f8] p-6">
      {/* Logo Section */}
      <div className="text-center md:mr-20 mb-10 md:mb-0">
        <img
          src={JSTcliqBlue}
          alt="JSTcliq Logo"
          className="mx-auto w-60 sm:w-48 md:w-90 h-auto object-contain"
        />
      </div>

      {/* Login Card */}
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 md:p-10">
        <h2 className="text-[#233B9C] text-3xl font-bold mb-2 text-center">
          Admin Login
        </h2>
        <p className="text-[#555] text-center mb-6">Welcome Back 👋</p>

        {error && (
          <div className="bg-red-100 border border-red-300 text-red-700 p-3 rounded-md mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Email Input */}
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
            <input
              type="email"
              placeholder="Enter your Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#6590D0] transition"
            />
          </div>

          {/* Password Input */}
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
            <input
              type="password"
              placeholder="Enter your Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#6590D0] transition"
            />
          </div>

          {/* Form Options */}
          <div className="flex justify-between items-center text-sm text-gray-600">
            <label className="flex items-center">
              <input type="checkbox" className="mr-2 accent-[#233B9C]" />
              Remember Me
            </label>
            <a href="#" className="text-[#233B9C] hover:text-[#6590D0] transition">
              Forgot Password?
            </a>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="flex justify-center items-center bg-[#233B9C] text-white py-3 rounded-lg font-semibold text-lg hover:bg-[#1a2e78] transition disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? <Loader2 className="animate-spin" size={22} /> : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
