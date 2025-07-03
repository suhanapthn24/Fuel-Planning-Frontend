import React, { useEffect, useMemo, useState } from "react";

export function TripsTable({ searchQuery, filters }) {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  const [viewingTrip, setViewingTrip] = useState(null); // trip info being viewed
  const [deliverySchedule, setDeliverySchedule] = useState(null);
  const [scheduleLoading, setScheduleLoading] = useState(false);
  const [scheduleError, setScheduleError] = useState(null);

  const [sortConfig, setSortConfig] = useState({
    key: "trip_id",
    direction: "asc",
  });

  useEffect(() => {
    fetch("http://127.0.0.1:8000/trips")
      .then((res) => {
        if (!res.ok) throw new Error("Network response was not ok");
        return res.json();
      })
      .then((data) => {
        setTrips(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching trips:", err);
        setLoading(false);
      });
  }, []);

  const requestSort = (key) => {
    setSortConfig((prev) =>
      prev.key === key
        ? { key, direction: prev.direction === "asc" ? "desc" : "asc" }
        : { key, direction: "asc" }
    );
  };

  const getStatusStyle = (status = "") => {
    switch (status.toLowerCase()) {
      case "complete":
        return "bg-green-500 text-white px-2 py-1 rounded-full text-sm";
      case "active":
        return "bg-amber-500 text-white px-2 py-1 rounded-full text-sm"; // amber for active
      case "delayed":
        return "bg-red-600 text-white px-2 py-1 rounded-full text-sm";
      case "scheduled":
        return "bg-yellow-400 text-black px-2 py-1 rounded-full text-sm";
      default:
        return "text-sm";
    }
  };

  const sortedTrips = useMemo(() => {
    let filtered = [...trips];

    // Search query filter
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter((trip) =>
        [trip.trip_id, trip.driver_name, trip.origin, trip.destination, trip.trip_status]
          .map((v) => String(v ?? "").toLowerCase())
          .some((val) => val.includes(q))
      );
    }

    // Dropdown filters
    if (filters.status) {
      filtered = filtered.filter(
        (trip) => (trip.trip_status || "").toLowerCase() === filters.status.toLowerCase()
      );
    }

    if (filters.driver) {
      filtered = filtered.filter(
        (trip) => (trip.driver_name || "").toLowerCase() === filters.driver.toLowerCase()
      );
    }

    if (filters.route) {
      filtered = filtered.filter(
        (trip) =>
          `${trip.origin} → ${trip.destination}`.toLowerCase() === filters.route.toLowerCase()
      );
    }

    // Sort
    filtered.sort((a, b) => {
      const { key, direction } = sortConfig;

      let valA = a[key] ?? "";
      let valB = b[key] ?? "";

      if (key.includes("time") && valA && valB) {
        valA = new Date(valA);
        valB = new Date(valB);
      } else {
        valA = typeof valA === "string" ? valA.toLowerCase() : valA;
        valB = typeof valB === "string" ? valB.toLowerCase() : valB;
      }

      if (valA < valB) return direction === "asc" ? -1 : 1;
      if (valA > valB) return direction === "asc" ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [trips, sortConfig, searchQuery, filters]);

  const viewDeliverySchedule = (trip) => {
    setViewingTrip(trip);
    setScheduleLoading(true);
    setScheduleError(null);
    setDeliverySchedule(null);

    fetch(`http://127.0.0.1:8000/delivery_schedule?trip_id=${trip.trip_id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch delivery schedule");
        return res.json();
      })
      .then((data) => {
        setDeliverySchedule(data);
        setScheduleLoading(false);
      })
      .catch((err) => {
        setScheduleError(err.message);
        setScheduleLoading(false);
      });
  };

  const handleCancelTrip = (trip) => {
    const confirmed = window.confirm(`Are you sure you want to cancel trip ${trip.trip_id}?`);
    if (!confirmed) return;

    const token = localStorage.getItem("token");
    fetch(`http://127.0.0.1:8000/trips/${trip.trip_id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({ trip_status: "cancelled" }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to cancel the trip");
        return res.json();
      })
      .then((updatedTrip) => {
        // Update local state
        setTrips((prev) =>
          prev.map((t) =>
            t.trip_id === updatedTrip.trip_id ? { ...t, trip_status: "cancelled" } : t
          )
        );
        alert(`Trip ${trip.trip_id} cancelled successfully.`);
      })
      .catch((err) => {
        console.error(err);
        alert(`Failed to cancel trip ${trip.trip_id}`);
      });
  };

  const closeModal = () => {
    setViewingTrip(null);
    setDeliverySchedule(null);
    setScheduleError(null);
  };

  if (loading) return <div className="text-center py-4">Loading trips...</div>;

  return (
    <div className="overflow-x-auto bg-white rounded-xl shadow">
      <table className="min-w-full text-left border-collapse">
        <thead className="bg-gray-100 text-sm font-semibold">
          <tr>
            <th
              className="px-4 py-3 cursor-pointer select-none"
              onClick={() => requestSort("trip_id")}
            >
              Trip ID
              {sortConfig.key === "trip_id" && (
                <span className="ml-1 text-xs align-middle">
                  {sortConfig.direction === "asc" ? "▲" : "▼"}
                </span>
              )}
            </th>
            <th
              className="px-4 py-3 cursor-pointer select-none"
              onClick={() => requestSort("driver_name")}
            >
              Driver Name
              {sortConfig.key === "driver_name" && (
                <span className="ml-1 text-xs align-middle">
                  {sortConfig.direction === "asc" ? "▲" : "▼"}
                </span>
              )}
            </th>
            <th
              className="px-4 py-3 cursor-pointer select-none"
              onClick={() => requestSort("origin")}
            >
              Origin → Destination
              {sortConfig.key === "origin" && (
                <span className="ml-1 text-xs align-middle">
                  {sortConfig.direction === "asc" ? "▲" : "▼"}
                </span>
              )}
            </th>
            <th
              className="px-4 py-3 cursor-pointer select-none"
              onClick={() => requestSort("trip_status")}
            >
              Status
              {sortConfig.key === "trip_status" && (
                <span className="ml-1 text-xs align-middle">
                  {sortConfig.direction === "asc" ? "▲" : "▼"}
                </span>
              )}
            </th>
            <th
              className="px-4 py-3 cursor-pointer select-none"
              onClick={() => requestSort("eta")}
            >
              ETA
              {sortConfig.key === "eta" && (
                <span className="ml-1 text-xs align-middle">
                  {sortConfig.direction === "asc" ? "▲" : "▼"}
                </span>
              )}
            </th>
            <th
              className="px-4 py-3 cursor-pointer select-none"
              onClick={() => requestSort("start_time")}
            >
              Start Time/End Time
              {sortConfig.key === "start_time" && (
                <span className="ml-1 text-xs align-middle">
                  {sortConfig.direction === "asc" ? "▲" : "▼"}
                </span>
              )}
            </th>
            <th className="px-4 py-3">Scheduled Time</th>
            <th className="px-4 py-3">Live Tracking</th>
            <th className="px-4 py-3">Action</th>
          </tr>
        </thead>

        <tbody className="text-sm">
          {sortedTrips.map((trip, idx) => (
            <tr key={idx} className="border-t">
              <td className="px-4 py-3">{trip.trip_id}</td>
              <td className="px-4 py-3">{trip.driver_name || "N/A"}</td>
              <td className="px-4 py-3">
                {trip.origin} → {trip.destination}
              </td>
              <td className="px-4 py-3">
                <span className={getStatusStyle(trip.trip_status)}>
                  {trip.trip_status}
                </span>
              </td>
              <td className="px-4 py-3">{trip.eta ?? "N/A"}</td>
              <td className="px-4 py-3">
                {trip.start_time
                  ? new Date(trip.start_time).toLocaleString()
                  : "N/A"}
                <br />
                {trip.end_time ? new Date(trip.end_time).toLocaleString() : "N/A"}
              </td>
              <td className="px-4 py-3">
                {trip.start_time
                  ? new Date(trip.schedule).toLocaleString()
                  : "N/A"}
              </td>
              <td className="px-4 py-3">
                <button
                  className="text-red-500 hover:underline"
                  onClick={() => window.open(`http://localhost:8000/tracking/${trip.trip_id}`, "_blank")}
                >
                  Track
                </button>
              </td>
              <td className="px-4 py-3 space-x-2">
                <button
                  className="text-blue-600 hover:underline"
                  onClick={() => viewDeliverySchedule(trip)}
                >
                  View
                </button>
                {/* <button className="text-gray-600 hover:underline">Edit</button> */}
                {trip.trip_status?.toLowerCase() !== "complete" && (
                <button
                  className="text-red-500 hover:underline"
                  onClick={() => handleCancelTrip(trip)}
                >
                  Cancel
                </button>
              )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal */}
      {viewingTrip && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-3xl w-full max-h-[80vh] overflow-y-auto p-6 relative">
            <button
              onClick={closeModal}
              className="absolute top-3 right-3 text-gray-600 hover:text-black text-xl font-bold"
            >
              &times;
            </button>

            <h3 className="text-xl font-semibold mb-4">
              Trip Details: {viewingTrip.trip_id}
            </h3>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <p><strong>Trip ID:</strong> {viewingTrip.trip_id}</p>
              <p><strong>Driver Name:</strong> {viewingTrip.driver_name}</p>
              <p><strong>Driver ID:</strong> {viewingTrip.driver_id}</p>
              <p><strong>Truck ID:</strong> {viewingTrip.truck_id}</p>
              <p><strong>Status:</strong> {viewingTrip.trip_status}</p>
              <p><strong>Depot ID:</strong> {viewingTrip.depot_id}</p>
              <p><strong>Origin:</strong> {viewingTrip.origin}</p>
              <p><strong>Destination:</strong> {viewingTrip.destination}</p>
              <p><strong>ETA:</strong> {viewingTrip.eta}</p>
              <p><strong>Scheduled Time: </strong>{new Date(viewingTrip.schedule).toLocaleString()}</p>
              <p><strong>Start Time:</strong> {viewingTrip.start_time ? new Date(viewingTrip.start_time).toLocaleString() : "N/A"}</p>
              <p><strong>End Time:</strong> {viewingTrip.end_time ? new Date(viewingTrip.end_time).toLocaleString() : "N/A"}</p>
              <p><strong>Delivered Liters:</strong> {viewingTrip.delivered_liters}</p>
              <div className="col-span-2">
                <strong>Route: </strong>
                <span className="break-words">{Array.isArray(viewingTrip.route) ? viewingTrip.route.join(" → ") : viewingTrip.route}</span>
              </div>
              <div className="col-span-2 text-right mt-2">
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 text-sm"
                  onClick={() => window.open("/tracking", "_blank")}
                >
                  Track Live
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
