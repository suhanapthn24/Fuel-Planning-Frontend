import React, { useState } from "react";
import Sidebar from "./sidebar";
import Navbar from "./navbar";
import { AlertTriangle, Info, CheckCircle } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

// Sample notifications with actual dates for filtering
const initialNotifications = [
  {
    id: 1,
    type: "warning",
    title: "Exception raised",
    description: "Low Fuel level",
    timeAgo: "30 Mins Ago",
    date: new Date("2025-07-01T10:30:00"),
    read: false,
  },
  {
    id: 2,
    type: "error",
    title: "Route Deviation",
    description: "Vehicle ID: 12345, Current Fuel:5%",
    timeAgo: "1 Hours Ago",
    date: new Date("2025-07-01T09:00:00"),
    read: true,
  },
  {
    id: 3,
    type: "success",
    title: "Delivery Completed",
    description: "Trip ID: TRP-2023-001 To Stations 3",
    timeAgo: "4 Hours Ago",
    date: new Date("2025-06-30T18:00:00"),
    read: false,
  },
];

const getIcon = (type) => {
  switch (type) {
    case "warning":
      return <AlertTriangle className="text-yellow-500 w-5 h-5" />;
    case "error":
      return <Info className="text-red-500 w-5 h-5" />;
    case "success":
      return <CheckCircle className="text-green-500 w-5 h-5" />;
    default:
      return null;
  }
};

export default function Notifications() {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [filterType, setFilterType] = useState("all");
  const [selectedDate, setSelectedDate] = useState(null);
  const [filterRead, setFilterRead] = useState("all");

  const filteredNotifications = notifications.filter((note) => {
    const matchType = filterType === "all" || note.type === filterType;
    const matchDate =
      !selectedDate || (note.date && note.date.toDateString() === selectedDate.toDateString());
    const matchRead =
      filterRead === "all" ||
      (filterRead === "read" && note.read) ||
      (filterRead === "unread" && !note.read);

    return matchType && matchDate && matchRead;
  });

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 fixed top-0 left-0 h-full z-10">
        <Sidebar />
      </div>

      {/* Main */}
      <div className="flex-1 ml-64">
        {/* Navbar */}
        <div className="fixed top-0 left-64 right-0 z-10">
          <Navbar />
        </div>

        {/* Content */}
        <main className="mt-16 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Notifications</h2>
            <button
              onClick={markAllRead}
              className="text-red-500 text-sm hover:underline"
              aria-label="Mark all notifications as read"
            >
              Mark All As Read
            </button>
          </div>

          {/* Filters */}
          <div className="flex gap-4 mb-6 flex-wrap items-center">
            <select
              className="p-2 border rounded bg-white text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-400"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              aria-label="Filter notifications by type"
            >
              <option value="all">All Types</option>
              <option value="warning">Warning</option>
              <option value="error">Error</option>
              <option value="success">Success</option>
            </select>

            <DatePicker
              selected={selectedDate}
              onChange={(date) => setSelectedDate(date)}
              placeholderText="Select Date"
              className="p-2 border rounded bg-white text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-400"
              dateFormat="yyyy-MM-dd"
              isClearable
              aria-label="Filter notifications by date"
            />

            <select
              className="p-2 border rounded bg-white text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-400"
              value={filterRead}
              onChange={(e) => setFilterRead(e.target.value)}
              aria-label="Filter notifications by read status"
            >
              <option value="all">All Status</option>
              <option value="read">Read</option>
              <option value="unread">Unread</option>
            </select>
          </div>

          {/* Notification Cards */}
          <div className="space-y-4">
            {filteredNotifications.length > 0 ? (
              filteredNotifications.map((note) => (
                <div
                  key={note.id}
                  className={`bg-white p-4 rounded-xl shadow flex justify-between items-center transition
                  ${note.read ? "opacity-70" : "opacity-100"}`}
                >
                  <div className="flex items-start gap-3">
                    {getIcon(note.type)}
                    <div>
                      <h3 className="text-base font-semibold text-gray-800">{note.title}</h3>
                      <p className="text-sm text-gray-600">{note.description}</p>
                    </div>
                  </div>
                  <span className="text-sm text-gray-500 whitespace-nowrap">{note.timeAgo}</span>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm">No notifications found.</p>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
