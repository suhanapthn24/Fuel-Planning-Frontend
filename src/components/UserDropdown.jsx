import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function UserDropdown({ showDropdown, setShowDropdown }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      setError(null);

      try {
        const email = localStorage.getItem("email");
        const token = localStorage.getItem("access_token");

        if (!email || !token) {
          setUser(null);
          setLoading(false);
          return;
        }

        const res = await fetch(`http://localhost:8000/users/${encodeURIComponent(email)}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
        });

        if (!res.ok) throw new Error("Failed to fetch user data");

        const data = await res.json();
        setUser(data);
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError("Could not load user data.");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    if (showDropdown) {
      fetchUser();
    } else {
      setUser(null);
      setError(null);
      setLoading(false);
    }
  }, [showDropdown]);

  if (!showDropdown) return null;

  return (
    <div className="absolute top-12 right-0 w-64 bg-red-600 text-white rounded shadow-lg z-50">
      <div className="p-4 border-b border-red-500">
        {loading ? (
          <div>Loading...</div>
        ) : error ? (
          <div className="text-yellow-200">{error}</div>
        ) : user ? (
          <>
            <div className="font-semibold text-lg">{user.role || "Admin"}</div>
            <div className="text-sm">{user.email}</div>
            <div className="text-sm">{user.user_phone || "N/A"}</div>
          </>
        ) : (
          <div>No user data</div>
        )}
      </div>

      <button
        onClick={() => {
          navigate("/profile");
          setShowDropdown(false);
        }}
        className="w-full text-left px-4 py-2 hover:bg-red-500"
      >
        👤 My Profile
      </button>

      <button
        onClick={() => {
          localStorage.removeItem("access_token");
          localStorage.removeItem("email");
          // Add any other cleanup needed on logout
          navigate("/login");
        }}
        className="w-full text-left px-4 py-2 hover:bg-red-500"
      >
        🔓 Logout
      </button>
    </div>
  );
}
