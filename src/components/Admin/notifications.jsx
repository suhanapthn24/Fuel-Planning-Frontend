import React from "react";
import Sidebar from "./sidebar";
import Navbar from "./navbar";
import { AlertTriangle, Info, CheckCircle } from "lucide-react";

const notifications = [
  {
    id: 1,
    type: "warning",
    title: "Low Fuel Level",
    description: "Vehicle ID: 12345, Current Fuel:5%",
    timeAgo: "5 Mins Ago",
  },
  {
    id: 2,
    type: "warning",
    title: "Low Fuel Level",
    description: "Vehicle ID: 12345, Current Fuel:5%",
    timeAgo: "30 Mins Ago",
  },
  {
    id: 3,
    type: "error",
    title: "Route Deviation",
    description: "Vehicle ID: 12345, Current Fuel:5%",
    timeAgo: "1 Hours Ago",
  },
  {
    id: 4,
    type: "success",
    title: "Delivery Completed",
    description: "Trip ID: TRP-2023-001 To Stations 3",
    timeAgo: "4 Hours Ago",
  },
];

const getIcon = (type) => {
  switch (type) {
    case "warning":
      return <AlertTriangle className="text-red-500 w-5 h-5" />;
    case "error":
      return <Info className="text-red-500 w-5 h-5" />;
    case "success":
      return <CheckCircle className="text-green-500 w-5 h-5" />;
    default:
      return null;
  }
};

export default function Notifications() {
  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 fixed top-0 left-0 h-full z-10">
        <Sidebar />
      </div>

      {/* Main area */}
      <div className="flex-1 ml-64">
        {/* Navbar */}
        <div className="fixed top-0 left-64 right-0 z-10">
          <Navbar />
        </div>

        {/* Content */}
        <main className="mt-16 p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-800">Notifications</h2>
            <button className="text-red-500 text-sm hover:underline">
              Clear All
            </button>
          </div>

          {/* Filters */}
          <div className="flex gap-4 mb-6">
            <select className="p-2 border rounded">
              <option>All Type</option>
              <option>Warning</option>
              <option>Error</option>
              <option>Success</option>
            </select>
            <select className="p-2 border rounded">
              <option>All Dates</option>
            </select>
            <select className="p-2 border rounded">
              <option>All Status</option>
            </select>
          </div>

          {/* Notification Cards */}
          <div className="space-y-4">
            {notifications.map((note) => (
              <div
                key={note.id}
                className="bg-white p-4 rounded-xl shadow flex justify-between items-center"
              >
                <div className="flex items-start gap-3">
                  {getIcon(note.type)}
                  <div>
                    <h3 className="text-base font-semibold text-gray-800">
                      {note.title}
                    </h3>
                    <p className="text-sm text-gray-600">{note.description}</p>
                  </div>
                </div>
                <span className="text-sm text-gray-500 whitespace-nowrap">
                  {note.timeAgo}
                </span>
              </div>
            ))}
          </div>

          {/* Footer Action */}
          <div className="mt-6 text-right">
            <button className="text-sm text-gray-600 hover:underline">
              Mark All As Read
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}
