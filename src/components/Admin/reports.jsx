import React from "react";
import Sidebar from "./sidebar";
import Navbar from "./navbar";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// Sample data (from UI design)
const depotChartData = [
  { name: "Depot A", value: 75 },
  { name: "Depot B", value: 60 },
  { name: "Depot C", value: 80 },
];

const stationChartData = [
  { name: "Station 1", value: 90 },
  { name: "Station 2", value: 98 },
  { name: "Station 3", value: 85 },
];

export default function Reports() {
  return (
    <div>
      {/* Sidebar */}
      <div className="fixed top-0 left-0 w-64 h-full z-20">
        <Sidebar />
      </div>

      {/* Navbar */}
      <div className="fixed top-0 left-64 right-0 h-16 z-10">
        <Navbar />
      </div>

      {/* Main Content */}
      <div className="ml-64 mt-16 p-8 bg-gray-100 min-h-screen">
        <h2 className="text-3xl font-bold text-gray-800 mb-8">
          Utilization & Efficiency Reports
        </h2>

        {/* Overview Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <SummaryCard title="Average Buffer Time" value="15 Mins" />
          <SummaryCard title="On-Time Delivery%" value="95%" />
          <SummaryCard title="Load Vs Delivery (By Depot)" value="80%" />
          <SummaryCard title="Delivery Completion By Station" value="98%" />
        </div>

        {/* Report Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <ChartCard
            title="Load vs Delivery (By Depot)"
            value="80%"
            change="+5%"
          >
            <BarChart data={depotChartData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#EF4444" barSize={30} />
            </BarChart>
          </ChartCard>

          <ChartCard
            title="Delivery Completion by Station"
            value="98%"
            change="+2%"
          >
            <BarChart data={stationChartData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#10B981" barSize={30} />
            </BarChart>
          </ChartCard>
        </div>
      </div>
    </div>
  );
}

// SummaryCard Component
const SummaryCard = ({ title, value }) => (
  <div className="bg-white p-6 rounded-2xl shadow text-center">
    <p className="text-sm text-gray-500">{title}</p>
    <h3 className="text-2xl font-bold text-gray-800 mt-2">{value}</h3>
  </div>
);

// ChartCard Component
const ChartCard = ({ title, value, change, children }) => (
  <div className="bg-white p-6 rounded-2xl shadow hover:shadow-md transition-all duration-300">
    <div className="flex justify-between items-center mb-4">
      <div>
        <h3 className="text-lg font-semibold text-gray-700">{title}</h3>
        <p className="text-xs text-gray-500">Last 30 days</p>
      </div>
      <div className="text-right">
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        <span className="text-sm text-green-600 font-medium">{change}</span>
      </div>
    </div>
    <div className="h-56">
      <ResponsiveContainer width="100%" height="100%">
        {children}
      </ResponsiveContainer>
    </div>
  </div>
);
