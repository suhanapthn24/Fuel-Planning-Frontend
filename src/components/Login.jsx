import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assests/taj-logo.png";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ email: "", password: "", role: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  /* ────────────────────────────────────────────────────────────
     Map each role to its dashboard route
  ──────────────────────────────────────────────────────────── */
  const DASHBOARD_ROUTES = {
    Admin: "/dashboard",
    Station: "/station",
    Depot: "/depot-dashboard",
    Driver: "/driver-dashboard",
  };

  const handleChange = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleLogin = async () => {
    const { email, password, role } = form;

    if (!email || !password || !role) {
      alert("Please fill in all fields, including role.");
      return;
    }

    setLoading(true);
    try {
      const body = new URLSearchParams({ username: email, password });

      const res = await fetch("http://127.0.0.1:8000/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body,
      });

      if (!res.ok) throw new Error((await res.json()).detail);

      const data = await res.json();

      /* Store what you need */
      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("userEmail", email);
      localStorage.setItem("role", role);

      /* Redirect to the correct dashboard */
      const target = DASHBOARD_ROUTES[role];
      if (!target) {
        alert("Unknown role; cannot find a dashboard.");
        return;
      }
      navigate(target);
    } catch (err) {
      alert(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 relative">
      {/* Background Map */}
      <div className="absolute inset-0">
        <iframe
          src="https://www.google.com/maps/embed/v1/view?key=AIzaSyA26SLopuCcY_MNgtC9vIk4KffEmEaDhDI&center=18.5204,73.8567&zoom=10&maptype=roadmap"
          className="w-full h-full object-cover pointer-events-none brightness-75 opacity-100 blur-sm"
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Dynamic Google Map"
        ></iframe>
        <div className="absolute inset-0 bg-white bg-opacity-30 backdrop-blur-sm"></div>
      </div>

      {/* Centered Login Card */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
        <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md">
          {/* Logo */}
          <div className="flex justify-center mb-4">
            <img src={logo} alt="Taj Gasoline" className="h-16" />
          </div>
          <h1 className="text-center font-bold text-lg mb-6">Log in</h1>

          {/* Inputs */}
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Phone number, user name, or email address"
              value={form.email}
              onChange={handleChange("email")}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-400"
            />

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Your password"
                value={form.password}
                onChange={handleChange("password")}
                className="w-full px-4 py-2 border rounded-md pr-12 focus:outline-none focus:ring-2 focus:ring-red-400"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-500"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>

            <select
              value={form.role}
              onChange={handleChange("role")}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-400"
            >
              <option value="">Role</option>
              <option value="Admin">Admin</option>
              <option value="Station">Station</option>
              <option value="Depot">Depot</option>
              <option value="Driver">Driver</option>
            </select>
          </div>

          {/* Login Button */}
          <button
            className="mt-6 w-full bg-red-600 text-white py-2 rounded-full hover:bg-red-700 transition disabled:opacity-50"
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Log in"}
          </button>

          {/* Forgot Password */}
          <button
            className="mt-6 w-full text-black py-2"
            onClick={() => navigate("/forgetpassword")}
          >
            Forget Password
          </button>
        </div>
      </div>
    </div>
  );
}
