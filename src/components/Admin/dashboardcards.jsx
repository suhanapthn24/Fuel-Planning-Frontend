// dashboardcards.jsx
import React from "react";

export default function DashboardCards({ counts = {} }) {
  const data = [
    { label: "Active Trips",     count: counts.activeTrips      ?? 0 },
    { label: "Delayed Trips",    count: counts.delayedTrips     ?? 0 },
    { label: "Buffer Alerts",    count: counts.bufferAlerts     ?? 0 },
    { label: "Exception Alerts", count: counts.totalExceptions  ?? 0 },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      {data.map(({ label, count }, i) => (
        <div
          key={i}
          className="bg-white p-4 rounded-md shadow border text-center hover:shadow-lg transition"
        >
          <p className="font-medium text-gray-600">{label}</p>
          <p className="text-3xl font-extrabold text-gray-800">{count}</p>
        </div>
      ))}
    </div>
  );
}
