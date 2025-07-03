import React, { useEffect, useState } from "react";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";
const GOOGLE_API_KEY = "YOUR_GOOGLE_MAPS_API_KEY";  

export default function AddDepotCard({ onSuccess }) {
  const [form, setForm] = useState({
    depot_id: "",
    depot_name: "",
    depot_address: "",
    fuel_types_available: "",
    bay_available: "",
    depot_latitude: "",
    depot_longitude: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /* ───────────── Fetch lat/lng whenever depot_address changes ─────────── */
  useEffect(() => {
    if (!form.depot_address) return;
    const timeoutId = setTimeout(async () => {
      try {
        const url =
          `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
            form.depot_address
          )}&key=${GOOGLE_API_KEY}`;
        const { data } = await axios.get(url);
        const loc = data.results?.[0]?.geometry?.location;
        if (loc) {
          setForm((f) => ({ ...f, depot_latitude: loc.lat, depot_longitude: loc.lng }));
          setError(null);
        } else setError("Could not find coordinates for this address.");
      } catch (err) {
        setError("Error fetching location data.");
      }
    }, 500);              // debounce
    return () => clearTimeout(timeoutId);
  }, [form.depot_address]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    /* rudimentary required‑field check */
    const required = [
      "depot_id",
      "depot_name",
      "depot_address",
      "fuel_types_available",
      "bay_available",
      "depot_latitude",
      "depot_longitude",
    ];
    if (required.some((k) => !form[k])) {
      setError("Please fill in all required fields and wait for geocoding.");
      return;
    }
    setLoading(true); setError(null);
    try {
      const payload = {
        ...form,
        fuel_types_available: form.fuel_types_available
          .split(",")
          .map((s) => s.trim()),
      };
      const res = await axios.post(`${API_BASE}/depots/`, payload);
      if (res.status === 200 || res.status === 201) {
        alert("Depot added successfully!");
        onSuccess?.();
        setForm({
          depot_id: "",
          depot_name: "",
          depot_address: "",
          fuel_types_available: "",
          bay_available: "",
          depot_latitude: "",
          depot_longitude: "",
        });
      } else setError("Failed to add depot.");
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
          ["depot_address", "Depot Address *"],
          ["fuel_types_available", "Fuel Types Available (comma separated) *"],
          ["bay_available", "Bay Available *"],
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
