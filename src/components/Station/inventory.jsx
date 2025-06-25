import React from "react";
import Sidebar from "./ssidebar";
import Navbar from "./snavbar";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";

const stockData = [
  { day: "Mon", level: 1000 },
  { day: "Tue", level: 3000 },
  { day: "Wed", level: 6000 },
  { day: "Thu", level: 8000 },
  { day: "Fri", level: 10000 },
];

export default function Inventory() {
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
          <h2 className="text-2xl font-semibold mb-6">Inventory</h2>

          {/* Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow p-4 text-center">
              <p className="text-gray-600 text-sm">Current Fuel Stock</p>
              <h3 className="text-xl font-bold">15,000L</h3>
            </div>

            <div className="bg-white rounded-lg shadow p-4 text-center">
              <p className="text-gray-600 text-sm">Tank Capacity</p>
              <h3 className="text-xl font-bold">20,000L</h3>
            </div>

            <div className="bg-white rounded-lg shadow p-4 text-center">
              <p className="text-gray-600 text-sm">Avg. Daily Usage</p>
              <h3 className="text-xl font-bold">2,500L</h3>
            </div>

            <div className="bg-white rounded-lg shadow p-4 text-center">
              <p className="text-gray-600 text-sm">Last Refill Date</p>
              <h3 className="text-xl font-bold">10 Jun</h3>
            </div>
          </div>

          {/* Chart */}
          <div className="bg-white rounded-lg shadow p-4 relative">
            <h3 className="text-lg font-semibold mb-4">Stock Level</h3>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={stockData}>
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="level"
                  stroke="#EF4444"
                  fill="#FEE2E2"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>

            <button className="absolute top-4 right-4 bg-red-500 hover:bg-red-600 text-white text-sm px-4 py-2 rounded-full shadow">
              Request Refill
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
