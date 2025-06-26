import React, { useEffect, useMemo, useState } from "react";


export function TripsTable() {
  const [trips, setTrips]   = useState([]);
  const [loading, setLoading] = useState(true);

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

  const sortedTrips = useMemo(() => {
    const sorted = [...trips];

    sorted.sort((a, b) => {
      const { key, direction } = sortConfig;

      // natural value extraction
      let valA = a[key] ?? "";
      let valB = b[key] ?? "";

      // normalise dates & strings
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

    return sorted;
  }, [trips, sortConfig]);

  const getStatusStyle = (status = "") => {
    switch (status.toLowerCase()) {
      case "complete":
        return "bg-green-500 text-white px-2 py-1 rounded-full text-sm";
      case "active":
        return "bg-red-500 text-white px-2 py-1 rounded-full text-sm";
      case "delayed":
        return "bg-yellow-400 text-black px-2 py-1 rounded-full text-sm";
      default:
        return "text-sm";
    }
  };

  const headCell = (label, key) => (
    <th
      className="px-4 py-3 cursor-pointer select-none"
      onClick={() => requestSort(key)}
    >
      {label}
      {/* arrow indicator */}
      {sortConfig.key === key && (
        <span className="ml-1 text-xs align-middle">
          {sortConfig.direction === "asc" ? "▲" : "▼"}
        </span>
      )}
    </th>
  );

  /* -------------------------------- render ------------------------------- */
  if (loading) return <div className="text-center py-4">Loading trips...</div>;

  return (
    <div className="overflow-x-auto bg-white rounded-xl shadow">
      <table className="min-w-full text-left border-collapse">
        <thead className="bg-gray-100 text-sm font-semibold">
          <tr>
            {headCell("Trip ID", "trip_id")}
            {headCell("Driver Name", "driver_name")}
            {headCell("Origin → Destination", "origin")} {/* sorts by origin */}
            {headCell("Status", "trip_status")}
            {headCell("ETA", "eta")}
            {headCell("Start Time/End Time", "start_time")}
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
                {trip.end_time
                  ? new Date(trip.end_time).toLocaleString()
                  : "N/A"}
              </td>
              <td className="px-4 py-3 space-x-2">
                <button className="text-blue-600 hover:underline">View</button>
                <button className="text-gray-600 hover:underline">Edit</button>
                {trip.trip_status?.toLowerCase() !== "complete" && (
                  <button className="text-red-500 hover:underline">
                    Cancel
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
