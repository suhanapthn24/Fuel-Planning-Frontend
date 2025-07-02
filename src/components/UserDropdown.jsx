import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function UserDropdown({ showDropdown, setShowDropdown }) {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("http://localhost:8000/users/{email}", {
          credentials: "include", // or use Authorization header
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (!res.ok) throw new Error("Failed to fetch user data");
        const data = await res.json();
        setUser(data);
      } catch (err) {
        console.error("Error fetching user data:", err);
      }
    };

    if (showDropdown) {
      fetchUser();
    }
  }, [showDropdown]);

  if (!showDropdown || !user) return null;

  return (
    <div className="absolute top-12 right-0 w-64 bg-red-600 text-white rounded shadow-lg z-50">
      <div className="p-4 border-b border-red-500">
        <div className="font-semibold text-lg">{user.role || "Station Admin"}</div>
        <div className="text-sm">{user.email}</div>
      </div>
      <div className="p-4 border-b border-red-500">
        {/* <div className="text-sm font-semibold">Organizations</div>
        <div className="text-sm mt-1">🏢 {user.organization_name}</div>
        <div className="text-xs">{user.organization_code}</div> */}
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
          localStorage.removeItem("token"); // or handle logout API
          navigate("/login");
        }}
        className="w-full text-left px-4 py-2 hover:bg-red-500"
      >
        🔓 Logout
      </button>
    </div>
  );
}
