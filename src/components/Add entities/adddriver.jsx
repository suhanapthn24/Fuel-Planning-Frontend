import React, { useEffect, useState } from "react";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

export default function AddDriverCard({ onSuccess }) {
  const [form, setForm] = useState({
    driver_id: "",
    driver_name: "",
    designation: "",
    date_of_joining: "",
    tl_cost_center: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [emailId, setEmailId] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const identifier = localStorage.getItem("userEmail");
        const token = localStorage.getItem("access_token");

        const { data: userData } = await axios.get(`${API_BASE}/user/${identifier}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setEmailId(userData.email || "");
      } catch (err) {
        console.error("Error fetching user info:", err);
      }
    })();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const required = ["driver_id", "driver_name", "designation", "date_of_joining"];
    if (required.some((k) => !form[k])) {
      setError("Please fill all required fields.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("access_token");
      const payload = {
        ...form,
        email_id: emailId || undefined,
      };
      if (!payload.tl_cost_center) delete payload.tl_cost_center;

      const res = await axios.post(`${API_BASE}/drivers/`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 200 || res.status === 201) {
        alert("Driver added successfully!");
        onSuccess?.();
        setForm({
          driver_id: "",
          driver_name: "",
          designation: "",
          date_of_joining: "",
          tl_cost_center: "",
        });
      } else {
        setError("Failed to add driver.");
      }
    } catch (err) {
      console.error(err);
      setError("Error while adding driver.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 max-w-xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">Add New Driver</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {[
          ["driver_id", "Driver ID *"],
          ["driver_name", "Driver Name *"],
          ["designation", "Designation *"],
        ].map(([name, label]) => (
          <div key={name}>
            <label className="block font-medium mb-1">{label}</label>
            <input
              name={name}
              value={form[name]}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
        ))}

        <div>
          <label className="block font-medium mb-1">Date of Joining *</label>
          <input
            name="date_of_joining"
            type="date"
            value={form.date_of_joining}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-1">TL Cost Center (optional)</label>
          <input
            name="tl_cost_center"
            value={form.tl_cost_center}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        {error && <p className="text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
        >
          {loading ? "Saving..." : "Add Driver"}
        </button>
      </form>
    </div>
  );
}
