import React, { useState } from "react";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";
const TRUCK_TYPES = ["Rigid", "Articulated"];

export default function AddTruckCard({ onSuccess }) {
  const [form, setForm] = useState({
    truck_id: "",
    registration_number: "",
    truck_type: "",
    compartments: "",
    total_capacity: "",
    compartment_size_1: "",
    compartment_size_2: "",
    compartment_size_3: "",
    compartment_size_4: "",
    compartment_size_5: "",
    available: true,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({
      ...f,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const required = [
      "truck_id",
      "registration_number",
      "truck_type",
      "compartments",
      "total_capacity",
      "compartment_size_1",
    ];
    if (required.some((k) => !form[k])) {
      setError("Please fill all required fields. Compartment 1 size cannot be empty.");
      return;
    }

    /* quick check: compartments count matches filled sizes */
    if (Number(form.compartments) < 1 || Number(form.compartments) > 5) {
      setError("Compartments must be between 1 and 5.");
      return;
    }
    setLoading(true); setError(null);
    try {
      const numericFields = [
        "compartments",
        "total_capacity",
        "compartment_size_1",
        "compartment_size_2",
        "compartment_size_3",
        "compartment_size_4",
        "compartment_size_5",
      ];
      const payload = {
        ...form,
        ...Object.fromEntries(
          numericFields.map((k) => [k, form[k] === "" ? null : Number(form[k])])
        ),
      };
      const res = await axios.post(`${API_BASE}/trucks/`, payload);
      if (res.status === 200 || res.status === 201) {
        alert("Truck added successfully!");
        onSuccess?.();
        setForm({
          truck_id: "",
          registration_number: "",
          truck_type: "",
          compartments: "",
          total_capacity: "",
          compartment_size_1: "",
          compartment_size_2: "",
          compartment_size_3: "",
          compartment_size_4: "",
          compartment_size_5: "",
          available: true,
        });
      } else setError("Failed to add truck.");
    } catch (err) {
      console.error(err);
      setError("Error while adding truck.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 max-w-xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">Add New Truck</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {[
          ["truck_id", "Truck ID *"],
          ["registration_number", "Registration Number *"],
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

        {/* Truck type */}
        <div>
          <label className="block font-medium mb-1">Truck Type *</label>
          <select
            name="truck_type"
            value={form.truck_type}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            required
          >
            <option value="">Select type</option>
            {TRUCK_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        {/* Numeric fields */}
        {[
          ["compartments", "Compartments (1‑5) *", "number", 1, 5, 1],
          ["total_capacity", "Total Capacity (L) *", "number", 0, null, "0.01"],
          ["compartment_size_1", "Compartment Size 1 (L) *", "number", 0, null, "0.01"],
          ["compartment_size_2", "Compartment Size 2 (L)", "number", 0, null, "0.01"],
          ["compartment_size_3", "Compartment Size 3 (L)", "number", 0, null, "0.01"],
          ["compartment_size_4", "Compartment Size 4 (L)", "number", 0, null, "0.01"],
          ["compartment_size_5", "Compartment Size 5 (L)", "number", 0, null, "0.01"],
        ].map(([name, label, type, min, max, step]) => (
          <div key={name}>
            <label className="block font-medium mb-1">{label}</label>
            <input
              name={name}
              type={type}
              min={min}
              max={max || undefined}
              step={step}
              value={form[name]}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required={name === "compartment_size_1"}
            />
          </div>
        ))}

        {/* Availability checkbox */}
        <div className="flex items-center space-x-2">
          <input
            name="available"
            type="checkbox"
            checked={form.available}
            onChange={handleChange}
            className="h-4 w-4"
          />
          <label className="font-medium">Available</label>
        </div>

        {error && <p className="text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
        >
          {loading ? "Saving..." : "Add Truck"}
        </button>
      </form>
    </div>
  );
}
