import React from "react";
import Sidebar from "./sidebar";
import Navbar from "./navbar";

const notifications = [
  {
    id: 1,
    title: "Trip Completed",
    description: "Trip TRP-12345 has been successfully completed.",
    timestamp: "2025-06-10 10:15 AM",
  },
  {
    id: 2,
    title: "Fuel Level Warning",
    description: "Low fuel detected for TRP-67890.",
    timestamp: "2025-06-10 9:00 AM",
  },
  {
    id: 3,
    title: "New Exception Raised",
    description: "Unscheduled stop reported in TRP-24680.",
    timestamp: "2025-06-09 6:30 PM",
  },
  {
    id: 4,
    title: "Driver Reassigned",
    description: "Driver reassigned for TRP-13579.",
    timestamp: "2025-06-09 3:45 PM",
  },
];

export default function Notifications() {
  return (
    <div className="min-h-screen flex">
      {/* Sidebar fixed on the left */}
      <div className="fixed top-0 left-64 right-0 z-10">
        <Navbar />
      </div>

      {/* Main area: shifted right due to sidebar */}
      <div className="flex-1 ml-64">
        {/* Navbar fixed on top of main content */}
        <div className="w-64 fixed top-0 left-0 h-full z-10">
          <Sidebar />
        </div>

        {/* Content below navbar */}
        <main className="mt-16 p-6 bg-gray-100 min-h-screen">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Notifications</h2>

          <div className="space-y-4">
            {notifications.map((note) => (
              <div
                key={note.id}
                className="bg-white p-4 rounded-xl shadow hover:shadow-md transition"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      {note.title}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {note.description}
                    </p>
                  </div>
                  <span className="text-sm text-gray-500 whitespace-nowrap">
                    {note.timestamp}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
