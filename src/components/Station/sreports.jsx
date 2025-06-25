import React from "react";
import Sidebar from "./ssidebar";
import Navbar from "./snavbar";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const deliveryStats = [
  { day: "Mon", deliveries: 2, volume: 2000 },
  { day: "Tue", deliveries: 3, volume: 2500 },
  { day: "Wed", deliveries: 2, volume: 3000 },
  { day: "Thu", deliveries: 4, volume: 3500 },
  { day: "Fri", deliveries: 3, volume: 4000 },
  { day: "Sat", deliveries: 2, volume: 2800 },
  { day: "Sun", deliveries: 1, volume: 2200 },
];

export default function StationReports() {
  return (
    <div className="h-screen">
      {/* Navbar */}
      <div className="fixed top-0 left-0 right-0 z-10">
        <Navbar />
      </div>

      {/* Sidebar and Content */}
      <div className="flex pt-16 h-full">
        {/* Sidebar */}
        <div className="fixed top-16 left-0 bottom-0 w-60 z-10">
          <Sidebar />
        </div>

        {/* Main Content */}
        <div className="ml-60 mt-4 px-6 w-full overflow-y-auto">
          <h2 className="text-2xl font-semibold mb-6">Reports</h2>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow p-4 text-center">
              <p className="text-gray-600 text-sm">Total Deliveries This Week</p>
              <h3 className="text-xl font-bold">17</h3>
            </div>

            <div className="bg-white rounded-lg shadow p-4 text-center">
              <p className="text-gray-600 text-sm">Total Volume Received</p>
              <h3 className="text-xl font-bold">20,000L</h3>
            </div>

            <div className="bg-white rounded-lg shadow p-4 text-center">
              <p className="text-gray-600 text-sm">Average Daily Usage</p>
              <h3 className="text-xl font-bold">2,850L</h3>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Deliveries Per Day */}
            <div className="bg-white rounded-lg shadow p-4">
              <h3 className="text-lg font-semibold mb-2">Deliveries Per Day</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={deliveryStats}>
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="deliveries" fill="#EF4444" barSize={30} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Volume Trend */}
            <div className="bg-white rounded-lg shadow p-4">
              <h3 className="text-lg font-semibold mb-2">Fuel Volume Trend</h3>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={deliveryStats}>
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="volume" stroke="#3B82F6" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
