import React from "react";
import Sidebar from "./ssidebar";
import Navbar from "./snavbar";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  ResponsiveContainer,
} from "recharts";
import {
  FaGasPump,
  FaTruck,
  FaClock,
  FaExclamationTriangle,
} from "react-icons/fa";

const deliveryStatusData = [
  { day: "Mon", volume: 500 },
  { day: "Tue", volume: 1500 },
  { day: "Wed", volume: 2700 },
  { day: "Thu", volume: 2300 },
  { day: "Fri", volume: 2800 },
  { day: "Sat", volume: 3100 },
  { day: "Sun", volume: 4700 },
];

const deliveriesReceivedData = [
  { day: "Mon", deliveries: 2 },
  { day: "Tue", deliveries: 2 },
  { day: "Wed", deliveries: 2 },
  { day: "Thu", deliveries: 4 },
  { day: "Fri", deliveries: 2 },
  { day: "Sat", deliveries: 3 },
  { day: "Sun", deliveries: 4 },
];

export default function StationDashboard() {
  return (
    <div className="h-screen">
      {/* Fixed Navbar on top */}
      <div className="fixed top-0 left-0 right-0 z-10">
        <Navbar />
      </div>

      {/* Sidebar and Content */}
      <div className="flex pt-16 h-full">
        {/* Fixed Sidebar */}
        <div className="fixed top-16 left-0 bottom-0 w-60 z-10">
          <Sidebar />
        </div>

        {/* Main content area */}
        <div className="ml-60 mt-4 px-6 w-full overflow-y-auto">
          <h2 className="text-2xl font-semibold mb-4">Dashboard</h2>

          {/* Top Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow p-4 flex items-center gap-4">
              <FaGasPump className="text-red-500 text-2xl" />
              <div>
                <p className="text-gray-600 text-sm">Fuel Stock Level</p>
                <h3 className="text-xl font-bold">15,000L</h3>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-4 flex items-center gap-4">
              <FaTruck className="text-blue-500 text-2xl" />
              <div>
                <p className="text-gray-600 text-sm">Today's Deliveries</p>
                <h3 className="text-xl font-bold">15</h3>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-4 flex items-center gap-4">
              <FaClock className="text-yellow-500 text-2xl" />
              <div>
                <p className="text-gray-600 text-sm">Pending Deliveries</p>
                <h3 className="text-xl font-bold">8</h3>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-4 flex items-center gap-4">
              <FaExclamationTriangle className="text-red-500 text-2xl" />
              <div>
                <p className="text-gray-600 text-sm">Exception Alerts</p>
                <h3 className="text-xl font-bold">3</h3>
              </div>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-lg shadow p-4">
              <h3 className="text-lg font-semibold mb-2">Delivery Status</h3>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={deliveryStatusData}>
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="volume"
                    stroke="#EF4444"
                    strokeWidth={3}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white rounded-lg shadow p-4">
              <h3 className="text-lg font-semibold mb-2">Deliveries Received</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={deliveriesReceivedData}>
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="deliveries" fill="#EF4444" barSize={30} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
