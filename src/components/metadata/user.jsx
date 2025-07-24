import React, { useEffect, useState } from "react";
import Sidebar from "../Admin/sidebar";
import Navbar from "../Admin/navbar";
import { useNavigate } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";
const ROLE_OPTIONS = ["All", "Driver", "Station", "Depot", "Admin"];
const TABS = ["Pending", "All Users"];            // NEW

export default function UserManagement() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("Pending");   // NEW
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [approving, setApproving] = useState({});
  const [roleFilter, setRoleFilter] = useState("All");

  /* ─────────── access‑control check ─────────── */
  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "Admin") navigate("/dashboard");
  }, [navigate]);

  /* ─────────── fetch users when tab changes ─────────── */
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      navigate("/login");
      return;
    }

    setLoading(true);
    setError("");
    const endpoint =
      activeTab === "Pending" ? `${API_BASE}/pending-users` : `${API_BASE}/users`;

    (async () => {
      try {
        const res = await fetch(endpoint, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to load users");
        const data = await res.json();
        setUsers(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [activeTab, navigate]);

  /* ─────────── approve handler (pending only) ─────────── */
  const approve = async (userId) => {
    const token = localStorage.getItem("access_token");
    setApproving((a) => ({ ...a, [userId]: true }));
    try {
      const res = await fetch(`${API_BASE}/approve-user/${userId}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error((await res.json()).detail || "Failed");
      setUsers((u) => u.filter((usr) => usr.user_id !== userId));
    } catch (err) {
      alert(err.message);
    } finally {
      setApproving((a) => ({ ...a, [userId]: false }));
    }
  };

  /* ─────────── search + role filter ─────────── */
  const filteredUsers = users
    .filter(
      (u) =>
        u.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((u) => roleFilter === "All" || u.role === roleFilter);

  /* ─────────── helper to render status badge ─────────── */
  const renderStatus = (status) => (
    <span
      className={`px-3 py-1 rounded-full text-xs font-medium text-white ${
        status === "Active" ? "bg-green-500" : "bg-red-500"
      }`}
    >
      {status}
    </span>
  );

  /* ─────────── table body rows ─────────── */
  const tableRows = filteredUsers.map((u) => (
    <tr
      key={u.user_id}
      className="border-t text-sm text-gray-700 hover:bg-gray-50"
    >
      <td className="p-4 font-medium text-gray-800">{u.username}</td>
      <td className="p-4">{u.user_phone}</td>
      <td className="p-4">{u.role}</td>
      <td className="p-4">
        {activeTab === "Pending" ? (
          <button
            onClick={() => approve(u.user_id)}
            disabled={approving[u.user_id]}
            className="bg-green-600 hover:bg-green-700 text-white text-xs font-medium py-1.5 px-4 rounded disabled:opacity-50"
          >
            {approving[u.user_id] ? "Approving…" : "Approve"}
          </button>
        ) : (
          renderStatus(u.status || "Active")
        )}
      </td>
    </tr>
  ));

  /* ─────────── table / states ─────────── */
  const content = loading ? (
    <div className="flex h-full items-center justify-center text-lg font-semibold">
      Loading…
    </div>
  ) : error ? (
    <div className="flex h-full items-center justify-center text-red-600 text-lg font-semibold">
      {error}
    </div>
  ) : filteredUsers.length === 0 ? (
    <p className="text-gray-600">No users found.</p>
  ) : (
    <div className="bg-white rounded-xl shadow overflow-x-auto">
      <table className="min-w-full table-auto">
        <thead className="bg-gray-100 text-left text-sm text-gray-600">
          <tr>
            <th className="p-4 font-semibold">Name</th>
            <th className="p-4 font-semibold">Contact Details</th>
            <th className="p-4 font-semibold">Role</th>
            <th className="p-4 font-semibold">
              {activeTab === "Pending" ? "Action" : "Status"}
            </th>
          </tr>
        </thead>
        <tbody>{tableRows}</tbody>
      </table>
    </div>
  );

  /* ─────────── JSX ─────────── */
  return (
    <div className="h-screen flex flex-col">
      {/* top bar */}
      <div className="h-16 w-full bg-white shadow z-10">
        <Navbar />
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* sidebar */}
        <div className="w-64 bg-white shadow h-full overflow-y-auto">
          <Sidebar />
        </div>

        {/* main */}
        <main className="flex-1 overflow-y-auto p-8 bg-gray-100">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            User Management
          </h2>

          {/* tabs */}
          <div className="flex gap-2 mb-6">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-full font-medium text-sm transition-colors ${
                  activeTab === tab
                    ? "bg-red-600 text-white"
                    : "bg-black text-white"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* filters */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
            {/* search */}
            <input
              type="text"
              placeholder="Search By Name or Email"
              className="px-4 py-2 border rounded-full bg-white w-full sm:w-80"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {/* role dropdown */}
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-3 py-2 border rounded-full bg-white text-sm w-full sm:w-48"
            >
              {ROLE_OPTIONS.map((role) => (
                <option key={role} value={role}>
                  {role === "All" ? "All Roles" : role}
                </option>
              ))}
            </select>
          </div>

          {content}
        </main>
      </div>
    </div>
  );
}
