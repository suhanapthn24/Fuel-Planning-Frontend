import React, { useState, useEffect } from "react";

export default function AssignTrip({ onBack }) {
  const [formData, setFormData] = useState({
    trip_id: "",
    driver_id: "",
    driver_name: "",
    driver_username: "",
    driver_email: "",
    truck_id: "",
    depot_id: "",
    origin: "",
    destination: "",
    delivered_liters: "",
    eta: "",
    trip_status: "scheduled",
    start_time: "",
    end_time: "",
    route: "",
    waze_url: "",
  });

  const [drivers, setDrivers] = useState([]);
  const [trucks, setTrucks] = useState([]);
  const [depots, setDepots] = useState([]);

  useEffect(() => {
    fetchData("/drivers", setDrivers);
    fetchData("/trucks", setTrucks);
    fetchData("/depots", setDepots);
  }, []);

  useEffect(() => {
    const selectedDriver = drivers.find((d) => String(d.id) === formData.driver_id);
    if (selectedDriver) {
      setFormData((prev) => ({
        ...prev,
        driver_name: selectedDriver.name || "",
        driver_username: selectedDriver.username || "",
        driver_email: selectedDriver.email || "",
      }));
    }
  }, [formData.driver_id, drivers]);

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
      trip_id: formData.trip_id,
      driver_id: String(formData.driver_id),
      driver_name: formData.driver_name,
      username: formData.driver_username,
      email: formData.driver_email,
      truck_id: String(formData.truck_id),
      depot_id: String(formData.depot_id),
      origin: formData.origin,
      destination: formData.destination,
      route: [formData.origin, formData.destination], // simplified
      delivered_liters: parseFloat(formData.delivered_liters),
      trip_status: formData.trip_status,
      eta: parseFloat(formData.eta) / 60, // convert minutes to hours
      start_time: new Date(formData.start_time).toISOString(),
      end_time: new Date(formData.end_time).toISOString(),
      schedule: new Date(formData.start_time).toISOString(),
      waze_url: formData.waze_url,
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
        <Input label="Trip ID" name="trip_id" value={formData.trip_id} onChange={handleChange} required />

        <div>
          <label className="block mb-1 font-medium">Driver</label>
          <select name="driver_id" value={formData.driver_id} onChange={handleChange} className="w-full border px-4 py-2 rounded" required>
            <option value="">Select Driver</option>
            {drivers.map((d) => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>
        </div>

        <Input label="Driver Username" name="driver_username" value={formData.driver_username} onChange={handleChange} readOnly />
        <Input label="Driver Email" name="driver_email" value={formData.driver_email} onChange={handleChange} readOnly />
        <Input label="Driver Name" name="driver_name" value={formData.driver_name} onChange={handleChange} readOnly />

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

        <Input label="Origin" name="origin" value={formData.origin} onChange={handleChange} required />
        <Input label="Destination" name="destination" value={formData.destination} onChange={handleChange} required />
        <Input label="Delivered Liters" name="delivered_liters" type="number" value={formData.delivered_liters} onChange={handleChange} required />
        <Input label="ETA (minutes)" name="eta" type="number" value={formData.eta} onChange={handleChange} required />
        <Input label="Waze URL" name="waze_url" value={formData.waze_url} onChange={handleChange} />

        <div>
          <label className="block mb-1 font-medium">Trip Status</label>
          <select name="trip_status" value={formData.trip_status} onChange={handleChange} className="w-full border px-4 py-2 rounded" required>
            <option value="scheduled">Scheduled</option>
            <option value="active">Active</option>
            <option value="delayed">Delayed</option>
            <option value="complete">Complete</option>
          </select>
        </div>

        <Input label="Start Time" name="start_time" type="datetime-local" value={formData.start_time} onChange={handleChange} required />
        <Input label="End Time" name="end_time" type="datetime-local" value={formData.end_time} onChange={handleChange} required />

        <div className="md:col-span-2 text-right">
          <button type="submit" className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700">
            Assign Trip
          </button>
        </div>
      </form>
    </div>
  );
}

// Reusable input component
const Input = ({ label, name, type = "text", ...props }) => (
  <div>
    <label className="block mb-1 font-medium">{label}</label>
    <input type={type} name={name} className="w-full border px-4 py-2 rounded" {...props} />
  </div>
);
