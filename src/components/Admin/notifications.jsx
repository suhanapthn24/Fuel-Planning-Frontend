import React, { useState, useEffect } from "react";
import Sidebar from "./sidebar";
import Navbar from "./navbar";
import { AlertTriangle, Info, CheckCircle } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";

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
  const [notifications, setNotifications] = useState([]);
  const [filterType, setFilterType] = useState("all");
  const [selectedDate, setSelectedDate] = useState(null);
  const [filterRead, setFilterRead] = useState("all");

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem("access_token");
        if (!token) {
          console.error("No access token found.");
          return;
        }

        const response = await axios.get("http://localhost:8000/audit/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const raw = response.data.notifications || response.data;

        const enriched = raw.map((entry) => {
          const parsedAfter = entry.after ? JSON.parse(entry.after) : null;
          const parsedBefore = entry.before ? JSON.parse(entry.before) : null;

          let title = `${entry.action} - ${entry.table_name}`;
          let description = "";

          if (entry.action === "Create" && parsedAfter) {
            description = `New entry created for ${parsedAfter.driver_name || parsedAfter.name || "unknown"} (ID: ${entry.row_id}) in ${entry.table_name}.`;
          } else if (entry.action === "Update" && parsedBefore && parsedAfter) {
            const changes = Object.keys(parsedAfter)
              .filter((key) => parsedBefore[key] !== parsedAfter[key])
              .map((key) => `${key}: "${parsedBefore[key]}" → "${parsedAfter[key]}"`)
              .join(", ");
            description = `Updated ${parsedAfter.driver_name || parsedAfter.name || "record"} — ${changes}`;
          } else if (entry.action === "Delete" && parsedBefore) {
            description = `Deleted entry for ${parsedBefore.driver_name || parsedBefore.name || "unknown"} (ID: ${entry.row_id})`;
          } else {
            description = `Audit log for ${entry.table_name} with action ${entry.action}`;
          }

          return {
            id: entry.audit_id,
            type: "success", // You can change logic here if some are errors/warnings
            title,
            description,
            timestamp: entry.timestamp,
            date: new Date(entry.timestamp),
            timeAgo: formatTimeAgo(entry.timestamp),
            read: false,
          };
        });

        setNotifications(enriched);
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
      }
    };

    fetchNotifications();
  }, []);

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const then = new Date(timestamp);
    const diffMs = now - then;

    const minutes = Math.floor(diffMs / (1000 * 60));
    const hours = Math.floor(diffMs / (1000 * 60 * 60));

    if (minutes < 60) return `${minutes} Mins Ago`;
    return `${hours} Hours Ago`;
  };

  const filteredNotifications = notifications.filter((note) => {
    const matchType = filterType === "all" || note.type === filterType;
    const matchDate =
      !selectedDate || note.date.toDateString() === selectedDate.toDateString();
    const matchRead =
      filterRead === "all" ||
      (filterRead === "read" && note.read) ||
      (filterRead === "unread" && !note.read);

    return matchType && matchDate && matchRead;
  });

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    // TODO: Optionally call backend PATCH /audit/mark-all-read
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
      <div className="w-64 fixed top-0 left-0 h-full z-10">
        <Sidebar />
      </div>

      <div className="flex-1 ml-64">
        <div className="fixed top-0 left-64 right-0 z-10">
          <Navbar />
        </div>

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
                  className={`bg-white p-4 rounded-xl shadow flex justify-between items-center transition ${
                    note.read ? "opacity-70" : "opacity-100"
                  }`}
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
