import React, { useEffect, useState } from "react";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";
const LICENSE_TYPES = [
  "commercial",
  "heavy_vehicle",
  "light_vehicle",
  "trailer",
  "tanker",
  "other",
];

export default function AddDriverCard({ onSuccess }) {
  const [trucks, setTrucks] = useState([]);
  const [form, setForm] = useState({
    driver_id: "",
    driver_name: "",
    license_number: "",
    license_type: "",
    driver_phone: "",
    truck_id: "",          // optional – can be empty if not yet assigned
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /* ───────────── fetch available trucks for dropdown ───────────── */
  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get(`${API_BASE}/trucks/`);
        setTrucks(data);
      } catch (err) {
        console.error(err);
      }
    })();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const required = ["driver_id", "driver_name", "license_number", "license_type", "driver_phone"];
    if (required.some((k) => !form[k])) {
      setError("Please fill all required fields.");
      return;
    }
    setLoading(true); setError(null);
    try {
      const res = await axios.post(`${API_BASE}/drivers/`, form);
      if (res.status === 200 || res.status === 201) {
        alert("Driver added successfully!");
        onSuccess?.();
        setForm({
          driver_id: "",
          driver_name: "",
          license_number: "",
          license_type: "",
          driver_phone: "",
          truck_id: "",
        });
      } else setError("Failed to add driver.");
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
          ["license_number", "License Number *"],
          ["driver_phone", "Phone *"],
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

        {/* License type select */}
        <div>
          <label className="block font-medium mb-1">License Type *</label>
          <select
            name="license_type"
            value={form.license_type}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            required
          >
            <option value="">Select type</option>
            {LICENSE_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        {/* Truck dropdown – optional */}
        <div>
          <label className="block font-medium mb-1">Assign Truck (optional)</label>
          <select
            name="truck_id"
            value={form.truck_id}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          >
            <option value="">— None —</option>
            {trucks.map((t) => (
              <option key={t.truck_id} value={t.truck_id}>
                {t.truck_id} — {t.registration_number}
              </option>
            ))}
          </select>
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
