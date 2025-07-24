import React, { useState, useEffect } from "react";
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
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 🔁 Fetch user_id from backend by identifier (email/username/phone)
  useEffect(() => {
    const identifier = localStorage.getItem("userEmail") || localStorage.getItem("username") || localStorage.getItem("phone");
    const token = localStorage.getItem("access_token");

    if (!identifier || !token) {
      setError("User not logged in or access token missing.");
      return;
    }

    const fetchUserId = async () => {
      try {
        const res = await axios.get(`${API_BASE}/users/${identifier}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: { identifier },
        });

        if (res.data && res.data.user_id) {
          setUserId(res.data.user_id);
        } else {
          setError("User not found.");
        }
      } catch (err) {
        console.error(err);
        if (err.response?.status === 401) {
          setError("Unauthorized. Please log in again.");
        } else {
          setError("Failed to fetch user details.");
        }
      }
    };

    fetchUserId();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({
      ...f,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  useEffect(() => {
    const count = Number(form.compartments);
    if (count >= 1 && count <= 5) {
      const updated = { ...form };
      for (let i = count + 1; i <= 5; i++) {
        updated[`compartment_size_${i}`] = "";
      }
      setForm(updated);
    }
  }, [form.compartments]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userId) {
      setError("User ID is missing.");
      return;
    }

    const required = [
      "truck_id",
      "registration_number",
      "truck_type",
      "compartments",
      "total_capacity",
      "compartment_size_1",
    ];

    if (required.some((k) => !form[k])) {
      setError("Please fill all required fields. Compartment 1 size is mandatory.");
      return;
    }

    const compartments = Number(form.compartments);
    if (compartments < 1 || compartments > 5) {
      setError("Compartments must be between 1 and 5.");
      return;
    }

    const compSizes = Array.from({ length: compartments }, (_, i) =>
      parseInt(form[`compartment_size_${i + 1}`]) || 0
    );
    const totalCompartmentSize = compSizes.reduce((a, b) => a + b, 0);
    if (totalCompartmentSize > parseFloat(form.total_capacity)) {
      setError("Sum of compartment sizes cannot exceed total capacity.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const payload = {
        truck_id: form.truck_id,
        registration_number: form.registration_number,
        truck_type: form.truck_type, // "Rigid" or "Articulated"
        compartments: parseInt(form.compartments),
        total_capacity: parseFloat(form.total_capacity),
        compartment_size_1: parseInt(form.compartment_size_1),
        compartment_size_2: form.compartment_size_2 ? parseInt(form.compartment_size_2) : undefined,
        compartment_size_3: form.compartment_size_3 ? parseInt(form.compartment_size_3) : undefined,
        compartment_size_4: form.compartment_size_4 ? parseInt(form.compartment_size_4) : undefined,
        compartment_size_5: form.compartment_size_5 ? parseInt(form.compartment_size_5) : undefined,
        available: form.available ?? true, // or false as per checkbox
      };

      for (let i = 1; i <= compartments; i++) {
        const value = form[`compartment_size_${i}`];
        if (value !== "") {
          payload[`compartment_size_${i}`] = parseInt(value);
        }
      }

      const token = localStorage.getItem("access_token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const res = await axios.post(`${API_BASE}/trucks/`, payload, { headers });

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
      } else {
        setError("Failed to add truck.");
      }
    } catch (err) {
      console.error(err);
      setError("Error while adding truck.");
    } finally {
      setLoading(false);
    }
  };

  const compartmentInputs = Array.from({ length: Number(form.compartments) || 0 }, (_, i) => {
    const index = i + 1;
    return (
      <div key={`compartment_size_${index}`}>
        <label className="block font-medium mb-1">
          Compartment Size {index} (L){index === 1 ? " *" : ""}
        </label>
        <input
          name={`compartment_size_${index}`}
          type="number"
          min="0"
          step="1"
          value={form[`compartment_size_${index}`]}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
          required={index === 1}
        />
      </div>
    );
  });

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

        <div>
          <label className="block font-medium mb-1">Compartments (1–5) *</label>
          <input
            name="compartments"
            type="number"
            min="1"
            max="5"
            step="1"
            value={form.compartments}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Total Capacity (L) *</label>
          <input
            name="total_capacity"
            type="number"
            min="0"
            step="0.01"
            value={form.total_capacity}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>

        {compartmentInputs}

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
