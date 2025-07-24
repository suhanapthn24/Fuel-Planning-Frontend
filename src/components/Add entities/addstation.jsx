import React, { useState, useEffect } from "react";
import axios from "axios";

export default function AddStationCard({ onSuccess }) {
  const [form, setForm] = useState({
    erp_code: "",
    site_name: "",
    address: "",
    latitude: "",
    longitude: "",
    supply_depot: "",
    tank_no: "",
    product: "",
    capacity: "",
    monthly_avg_sales: "",
    deadstock: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Geocoding
  useEffect(() => {
    const fetchLatLng = async () => {
      if (!form.address) return;

      try {
        const encodedAddress = encodeURIComponent(form.address);
        const apiKey = "YOUR_GOOGLE_MAPS_API_KEY";
        const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&key=${apiKey}`;

        const res = await axios.get(url);
        const location = res.data.results?.[0]?.geometry?.location;

        if (location) {
          setForm((f) => ({
            ...f,
            latitude: location.lat,
            longitude: location.lng,
          }));
          setError(null);
        } else {
          setError("Could not find coordinates for this address.");
        }
      } catch (err) {
        setError("Error fetching location data.");
      }
    };

    const timeoutId = setTimeout(fetchLatLng, 500);
    return () => clearTimeout(timeoutId);
  }, [form.address]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const requiredFields = [
      "erp_code",
      "site_name",
      "address",
      "latitude",
      "longitude",
      "supply_depot",
      "product",
      "capacity",
      "monthly_avg_sales",
      "deadstock",
    ];

    for (const field of requiredFields) {
      if (!form[field]) {
        setError("Please fill in all required fields.");
        return;
      }
    }

    const payload = {
      ...form,
      capacity: parseInt(form.capacity),
      monthly_avg_sales: parseFloat(form.monthly_avg_sales),
      deadstock: parseFloat(form.deadstock),
      latitude: parseFloat(form.latitude),
      longitude: parseFloat(form.longitude),
    };

    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem("token");
      const res = await axios.post("http://127.0.0.1:8000/stations/", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 200 || res.status === 201) {
        alert("Station added successfully!");
        if (onSuccess) onSuccess();
        setForm({
          erp_code: "",
          site_name: "",
          address: "",
          latitude: "",
          longitude: "",
          supply_depot: "",
          tank_no: "",
          product: "",
          capacity: "",
          monthly_avg_sales: "",
          deadstock: "",
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
        {[
          { name: "erp_code", label: "ERP Code *" },
          { name: "site_name", label: "Site Name *" },
          { name: "address", label: "Address *" },
          { name: "supply_depot", label: "Supply Depot *" },
          { name: "tank_no", label: "Tank No (optional)" },
          { name: "product", label: "Product *" },
          { name: "capacity", label: "Capacity *", type: "number" },
          { name: "monthly_avg_sales", label: "Monthly Avg Sales *", type: "number", step: "0.01" },
          { name: "deadstock", label: "Deadstock *", type: "number", step: "0.01" },
        ].map((field) => (
          <div key={field.name}>
            <label className="block font-medium mb-1">{field.label}</label>
            <input
              name={field.name}
              value={form[field.name]}
              onChange={handleChange}
              type={field.type || "text"}
              step={field.step}
              className="w-full border rounded px-3 py-2"
              required={field.label.includes("*")}
            />
          </div>
        ))}

        {/* Lat/Lng (hidden or optional display) */}
        <div className="text-sm text-gray-500">
          Latitude: {form.latitude || "N/A"} <br />
          Longitude: {form.longitude || "N/A"}
        </div>

        {error && <p className="text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
        >
          {loading ? "Saving..." : "Add Station"}
        </button>
      </form>
    </div>
  );
}
