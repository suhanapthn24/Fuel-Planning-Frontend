import React, { useEffect, useState } from "react";

export function TripsTable() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:8000/api/trips") // Replace with your actual backend URL
      .then((response) => {
        if (!response.ok) throw new Error("Network response was not ok");
        return response.json();
      })
      .then((data) => {
        setTrips(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching trips:", error);
        setLoading(false);
      });
  }, []);

  const getStatusStyle = (status) => {
    switch (status) {
      case "Completed":
        return "bg-green-500 text-white px-2 py-1 rounded-full text-sm";
      case "Active":
        return "bg-red-500 text-white px-2 py-1 rounded-full text-sm";
      case "Delayed":
        return "bg-yellow-400 text-black px-2 py-1 rounded-full text-sm";
      default:
        return "text-sm";
    }
  };

  if (loading) return <div className="text-center py-4">Loading trips...</div>;

  return (
    <div className="overflow-x-auto bg-white rounded-xl shadow">
      <table className="min-w-full text-left border-collapse">
        <thead className="bg-gray-100 text-sm font-semibold">
          <tr>
            <th className="px-4 py-3">Trip ID</th>
            <th className="px-4 py-3">Driver Name</th>
            <th className="px-4 py-3">Origin → Destination</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">ETA</th>
            <th className="px-4 py-3">Start Time/End Time</th>
            <th className="px-4 py-3">Action</th>
          </tr>
        </thead>
        <tbody className="text-sm">
          {trips.map((trip, index) => (
            <tr key={index} className="border-t">
              <td className="px-4 py-3">{trip.id}</td>
              <td className="px-4 py-3">{trip.driver}</td>
              <td className="px-4 py-3">{trip.route}</td>
              <td className="px-4 py-3">
                <span className={getStatusStyle(trip.status)}>{trip.status}</span>
              </td>
              <td className="px-4 py-3">{trip.eta || "N/A"}</td>
              <td className="px-4 py-3">
                {trip.start}
                <br />
                {trip.end || "N/A"}
              </td>
              <td className="px-4 py-3 space-x-2">
                <button className="text-blue-600 hover:underline">View</button>
                <button className="text-gray-600 hover:underline">Edit</button>
                {trip.status !== "Completed" && (
                  <button className="text-red-500 hover:underline">Cancel</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
