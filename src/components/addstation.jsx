import React, { useState, useEffect } from "react";
import axios from "axios";

export default function AddStationCard({ onSuccess }) {
  const [form, setForm] = useState({
    station_id: "",
    station_name: "",
    capacity: "",
    operational_window: "",
    station_address: "",
    fuel_types_required: "",
    depot_id: "",
    critical_level: "",
    dry_stock_level: "",
    estimated_delivery_duration: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // When station_address changes, fetch lat/lng
  useEffect(() => {
    const fetchLatLng = async () => {
      if (!form.station_address) return;

      try {
        const encodedAddress = encodeURIComponent(form.station_address);
        const apiKey = "YOUR_GOOGLE_MAPS_API_KEY";
        const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&key=${apiKey}`;

        const res = await axios.get(url);
        const location = res.data.results?.[0]?.geometry?.location;

        if (location) {
          setForm((f) => ({
            ...f,
            station_latitude: location.lat,
            station_longitude: location.lng,
          }));
          setError(null);
        } else {
          setError("Could not find coordinates for this address.");
        }
      } catch (err) {
        setError("Error fetching location data.");
      }
    };

    // Debounce the API call by 500ms to avoid too many calls while typing
    const timeoutId = setTimeout(fetchLatLng, 500);
    return () => clearTimeout(timeoutId);
  }, [form.station_address]);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;

    // For fuel_types_required, allow comma-separated strings which we convert to array
    if (name === "fuel_types_required") {
      setForm((f) => ({
        ...f,
        [name]: value,
      }));
    } else {
      setForm((f) => ({
        ...f,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields simply
    if (
      !form.station_id ||
      !form.station_name ||
      !form.capacity ||
      !form.operational_window ||
      !form.station_address ||
      !form.depot_id ||
      !form.critical_level ||
      !form.dry_stock_level ||
      !form.estimated_delivery_duration
    ) {
      setError("Please fill in all required fields and valid address.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Prepare payload with fuel_types_required as array
      const payload = {
        ...form,
        capacity: Number(form.capacity),
        critical_level: parseFloat(form.critical_level),
        dry_stock_level: parseFloat(form.dry_stock_level),
        estimated_delivery_duration: parseFloat(form.estimated_delivery_duration),
        fuel_types_required: form.fuel_types_required
          ? form.fuel_types_required.split(",").map((s) => s.trim())
          : [],
      };

      const res = await axios.post("http://127.0.0.1:8000/stations/", payload);
      if (res.status === 200 || res.status === 201) {
        if (onSuccess) onSuccess();
        alert("Station added successfully!");
        setForm({
          station_id: "",
          station_name: "",
          capacity: "",
          operational_window: "",
          station_address: "",
          fuel_types_required: "",
          depot_id: "",
          critical_level: "",
          dry_stock_level: "",
          estimated_delivery_duration: "",
        });
      } else {
        setError("Failed to add station.");
      }
    } catch (err) {
      console.error(err);
      setError("Error while adding station.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 max-w-xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">Add New Station</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Station ID */}
        <div>
          <label className="block font-medium mb-1">Station ID *</label>
          <input
            name="station_id"
            value={form.station_id}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>

        {/* Station Name */}
        <div>
          <label className="block font-medium mb-1">Station Name *</label>
          <input
            name="station_name"
            value={form.station_name}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>

        {/* Capacity */}
        <div>
          <label className="block font-medium mb-1">Capacity *</label>
          <input
            name="capacity"
            type="number"
            min="0"
            value={form.capacity}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>

        {/* Operational Window */}
        <div>
          <label className="block font-medium mb-1">Operational Window *</label>
          <input
            name="operational_window"
            value={form.operational_window}
            onChange={handleChange}
            placeholder="e.g. 6:00 AM - 10:00 PM"
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>

        {/* Address */}
        <div>
          <label className="block font-medium mb-1">Station Address *</label>
          <input
            name="station_address"
            value={form.station_address}
            onChange={handleChange}
            placeholder="Full station address"
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>

        {/* Fuel Types Required */}
        <div>
          <label className="block font-medium mb-1">
            Fuel Types Required (comma separated)
          </label>
          <input
            name="fuel_types_required"
            value={form.fuel_types_required}
            onChange={handleChange}
            placeholder="e.g. diesel, petrol"
            className="w-full border rounded px-3 py-2"
          />
        </div>

        {/* Depot ID */}
        <div>
          <label className="block font-medium mb-1">Depot ID *</label>
          <input
            name="depot_id"
            value={form.depot_id}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>

        {/* Critical Level */}
        <div>
          <label className="block font-medium mb-1">Critical Level *</label>
          <input
            name="critical_level"
            type="number"
            step="0.01"
            min="0"
            value={form.critical_level}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>

        {/* Dry Stock Level */}
        <div>
          <label className="block font-medium mb-1">Dry Stock Level *</label>
          <input
            name="dry_stock_level"
            type="number"
            step="0.01"
            min="0"
            value={form.dry_stock_level}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>

        {/* Estimated Delivery Duration */}
        <div>
          <label className="block font-medium mb-1">Estimated Delivery Duration (hours) *</label>
          <input
            name="estimated_delivery_duration"
            type="number"
            step="0.01"
            min="0"
            value={form.estimated_delivery_duration}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>

        {/* Submit Button */}
        <div>
          {error && <p className="text-red-600 mb-2">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
          >
            {loading ? "Saving..." : "Add Station"}
          </button>
        </div>
      </form>
    </div>
  );
}
