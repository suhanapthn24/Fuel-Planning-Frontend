import React from "react";

export function TripsTable() {
  const trips = [
    {
      id: "TRP-2023-001",
      driver: "Sophia Clark",
      route: "Depot A → Depot B",
      status: "Completed",
      eta: "N/A",
      start: "2023-11-15 08:00",
      end: "2023-11-15 12:00",
    },
    {
      id: "TRP-2023-002",
      driver: "Ethan Miller",
      route: "Depot B → Depot C",
      status: "Active",
      eta: "2023-11-16 14:30",
      start: "2023-11-15 08:00",
      end: "N/A",
    },
    {
      id: "TRP-2023-003",
      driver: "Olivia Davis",
      route: "Depot C → Depot A",
      status: "Delayed",
      eta: "2023-11-17 16:00",
      start: "2023-11-15 09:00",
      end: "2023-11-18 15:00",
    },
    {
      id: "TRP-2023-004",
      driver: "Liam Wilson",
      route: "Depot A → Depot C",
      status: "Completed",
      eta: "N/A",
      start: "2023-11-15 09:00",
      end: "N/A",
    },
    {
      id: "TRP-2023-004",
      driver: "Liam Wilson",
      route: "Depot A → Depot C",
      status: "Active",
      eta: "N/A",
      start: "2023-11-15 09:00",
      end: "N/A",
    },
  ];

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
              <td className="px-4 py-3">{trip.eta}</td>
              <td className="px-4 py-3">
                {trip.start}
                <br />
                {trip.end}
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
