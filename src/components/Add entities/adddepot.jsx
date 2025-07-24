import React, { useEffect, useState } from "react";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";
const GOOGLE_API_KEY = "AIzaSyA26SLopuCcY_MNgtC9vIk4KffEmEaDhDI&center=18.5204,73.8567";

export default function AddDepotCard({ onSuccess }) {
  const [form, setForm] = useState({
    depot_id: "",
    depot_name: "",
    depot_code: "",
    tank: "",
    product: "",
    capacity: "",
    bay_1: "inactive",
    bay_2: "inactive",
    bay_3: "inactive",
    bay_4: "inactive",
    bay_5: "inactive",
    admin: "",
    opening_hours: "",
    depot_address: "",
    latitude: "",
    longitude: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!form.depot_address) return;
    const timeoutId = setTimeout(async () => {
      try {
        const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
          form.depot_address
        )}&key=${GOOGLE_API_KEY}`;
        const { data } = await axios.get(url);
        const loc = data.results?.[0]?.geometry?.location;
        if (loc) {
          setForm((f) => ({ ...f, latitude: loc.lat, longitude: loc.lng }));
          setError(null);
        } else {
          setError("Could not find coordinates for this address.");
        }
      } catch (err) {
        setError("Error fetching location data.");
      }
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [form.depot_address]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const requiredFields = [
      "depot_id",
      "depot_name",
      "depot_code",
      "depot_address",
      "latitude",
      "longitude",
      "bay_1",
      "bay_2",
      "bay_3",
      "bay_4",
      "bay_5",
    ];

    if (requiredFields.some((k) => !form[k])) {
      setError("Please fill all required fields and wait for geolocation.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("access_token");
      const res = await axios.post(`${API_BASE}/depots/`, form, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 200 || res.status === 201) {
        alert("Depot added successfully!");
        onSuccess?.();
        setForm({
          depot_id: "",
          depot_name: "",
          depot_code: "",
          tank: "",
          product: "",
          capacity: "",
          bay_1: "inactive",
          bay_2: "inactive",
          bay_3: "inactive",
          bay_4: "inactive",
          bay_5: "inactive",
          admin: "",
          opening_hours: "",
          depot_address: "",
          latitude: "",
          longitude: "",
        });
      } else {
        setError("Failed to add depot.");
      }
    } catch (err) {
      console.error(err);
      setError("Error while adding depot.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 max-w-xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">Add New Depot</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {[
          ["depot_id", "Depot ID *"],
          ["depot_name", "Depot Name *"],
          ["depot_code", "Depot Code *"],
          ["tank", "Tank"],
          ["product", "Product"],
          ["capacity", "Capacity"],
          ["admin", "Admin"],
          ["opening_hours", "Opening Hours"],
          ["depot_address", "Depot Address *"],
        ].map(([name, label]) => (
          <div key={name}>
            <label className="block font-medium mb-1">{label}</label>
            <input
              name={name}
              value={form[name]}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required={label.includes("*")}
            />
          </div>
        ))}

        <div className="grid grid-cols-2 gap-4">
          {[1, 2, 3, 4, 5].map((num) => (
            <div key={`bay_${num}`}>
              <label className="block font-medium mb-1">Bay {num} *</label>
              <select
                name={`bay_${num}`}
                value={form[`bay_${num}`]}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
                required
              >
                <option value="inactive">Inactive</option>
                <option value="active">Active</option>
              </select>
            </div>
          ))}
        </div>

        {error && <p className="text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
        >
          {loading ? "Saving..." : "Add Depot"}
        </button>
      </form>
    </div>
  );
}
