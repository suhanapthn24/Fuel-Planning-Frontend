import React, { useState, useEffect } from "react";

export default function AssignTrip({ onBack }) {
  const [formData, setFormData] = useState({
    trip_id: "",
    driver_id: "",
    driver_name: "",
    truck_id: "",
    depot_id: "",
    origin: "",
    destination: "",
    delivered_liters: "",
    eta: "",
    trip_status: "",
    start_time: "",
    end_time: "",
    route: "",
  });

  const [drivers, setDrivers] = useState([]);
  const [trucks, setTrucks] = useState([]);
  const [depots, setDepots] = useState([]);

  useEffect(() => {
    fetchData("/drivers", setDrivers);
    fetchData("/trucks", setTrucks);
    fetchData("/depots", setDepots);
  }, []);

  const fetchData = async (endpoint, setter) => {
    try {
      const res = await fetch(`http://127.0.0.1:8000${endpoint}`);
      const data = await res.json();
      setter(data);
    } catch (err) {
      console.error(`Error loading ${endpoint}:`, err);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      driver_id: String(formData.driver_id),
      truck_id: String(formData.truck_id),
      depot_id: String(formData.depot_id),
      delivered_liters: parseFloat(formData.delivered_liters),
      eta: parseFloat(formData.eta),
      route: formData.route.split(",").map((s) => s.trim()),
      start_time: new Date(formData.start_time).toISOString(),
      end_time: new Date(formData.end_time).toISOString(),
    };

    try {
      const res = await fetch("http://127.0.0.1:8000/trips", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to assign trip");

      alert("Trip assigned successfully!");
      onBack();
    } catch (err) {
      console.error(err);
      alert("Error assigning trip");
    }
  };

  return (
    <div className="p-8 bg-white rounded-lg shadow-md w-full max-w-7xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Assign New Trip</h2>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">

        <div>
          <label className="block mb-1 font-medium">Trip ID</label>
          <input name="trip_id" value={formData.trip_id} onChange={handleChange} className="w-full border px-4 py-2 rounded" required />
        </div>

        <div>
          <label className="block mb-1 font-medium">Driver</label>
          <select name="driver_id" value={formData.driver_id} onChange={handleChange} className="w-full border px-4 py-2 rounded" required>
            <option value="">Select Driver</option>
            {drivers.map((d) => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1 font-medium">Driver Name</label>
          <input name="driver_name" value={formData.driver_name} onChange={handleChange} className="w-full border px-4 py-2 rounded" required />
        </div>

        <div>
          <label className="block mb-1 font-medium">Truck</label>
          <select name="truck_id" value={formData.truck_id} onChange={handleChange} className="w-full border px-4 py-2 rounded" required>
            <option value="">Select Truck</option>
            {trucks.map((t) => (
              <option key={t.id} value={t.id}>{t.number}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1 font-medium">Depot</label>
          <select name="depot_id" value={formData.depot_id} onChange={handleChange} className="w-full border px-4 py-2 rounded" required>
            <option value="">Select Depot</option>
            {depots.map((d) => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1 font-medium">Origin</label>
          <input name="origin" value={formData.origin} onChange={handleChange} className="w-full border px-4 py-2 rounded" required />
        </div>

        <div>
          <label className="block mb-1 font-medium">Destination</label>
          <input name="destination" value={formData.destination} onChange={handleChange} className="w-full border px-4 py-2 rounded" required />
        </div>

        <div>
          <label className="block mb-1 font-medium">Route (comma-separated)</label>
          <input name="route" value={formData.route} onChange={handleChange} placeholder="PointA, PointB, ..." className="w-full border px-4 py-2 rounded" required />
        </div>

        <div>
          <label className="block mb-1 font-medium">Delivered Liters</label>
          <input name="delivered_liters" type="number" value={formData.delivered_liters} onChange={handleChange} className="w-full border px-4 py-2 rounded" required />
        </div>

        <div>
          <label className="block mb-1 font-medium">ETA (minutes)</label>
          <input name="eta" type="number" value={formData.eta} onChange={handleChange} className="w-full border px-4 py-2 rounded" required />
        </div>

        <div>
          <label className="block mb-1 font-medium">Trip Status</label>
          <select name="trip_status" value={formData.trip_status} onChange={handleChange} className="w-full border px-4 py-2 rounded" required>
            <option value="">Select Status</option>
            <option value="scheduled">Scheduled</option>
            <option value="active">Active</option>
            <option value="delayed">Delayed</option>
            <option value="complete">Complete</option>
          </select>
        </div>

        <div>
          <label className="block mb-1 font-medium">Start Time</label>
          <input type="datetime-local" name="start_time" value={formData.start_time} onChange={handleChange} className="w-full border px-4 py-2 rounded" required />
        </div>

        <div>
          <label className="block mb-1 font-medium">End Time</label>
          <input type="datetime-local" name="end_time" value={formData.end_time} onChange={handleChange} className="w-full border px-4 py-2 rounded" required />
        </div>

        <div className="md:col-span-2 text-right">
          <button type="submit" className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700">
            Assign Trip
          </button>
        </div>
      </form>
    </div>
  );
}
