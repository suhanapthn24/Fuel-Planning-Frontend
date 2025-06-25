import React from "react";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, BarChart, Bar, ResponsiveContainer,
} from "recharts";

const bufferData = [
  { day: "Mon", value: 10 },
  { day: "Tue", value: 14 },
  { day: "Wed", value: 12 },
  { day: "Thu", value: 8 },
  { day: "Fri", value: 3 },
  { day: "Sat", value: 13 },
  { day: "Sun", value: 9 },
];

const deliveriesData = [
  { week: "Week 1", value: 65 },
  { week: "Week 2", value: 95 },
  { week: "Week 3", value: 95 },
  { week: "Week 4", value: 55 },
];

const tripsByDriver = [
  { name: "Driver C", value: 5 },
  { name: "Driver B", value: 3 },
  { name: "Driver A", value: 2 },
];

const depotDelivery = [
  { name: "Depot Z", value: 3 },
  { name: "Depot Y", value: 2 },
];

const tripsByStation = [
    {name: "Station 1", value: 5},
    {name: "Station 1", value: 3},
    {name: "Station 1", value: 2},
];

export default function DashboardAnalytics() {
  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-semibold">Performance Metrics</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Avg. Buffer Time */}
        <div className="bg-white p-4 rounded-md shadow">
          <h3 className="font-semibold">Avg. Buffer Time</h3>
          <p className="text-2xl font-bold">15 <span className="text-sm font-semibold text-green-600">Min</span></p>
          <p className="text-sm text-gray-500">Last 7 Days <span className="text-green-600">+10%</span></p>
          <ResponsiveContainer width="100%" height={150}>
            <LineChart data={bufferData}>
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#EF4444" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* On-Time Deliveries */}
        <div className="bg-white p-4 rounded-md shadow">
          <h3 className="font-semibold">On-Time Deliveries</h3>
          <p className="text-2xl font-bold">95%</p>
          <p className="text-sm text-gray-500">Last 30 Days <span className="text-red-500">-5%</span></p>
          <ResponsiveContainer width="100%" height={150}>
            <BarChart data={deliveriesData}>
              <XAxis dataKey="week" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#EF4444" barSize={30} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Trips By Driver */}
        <div className="bg-white p-4 rounded-md shadow">
          <h3 className="font-semibold">Trips By Driver</h3>
          <p className="text-2xl font-bold">10</p>
          <p className="text-sm text-gray-500">Last 7 Days <span className="text-green-600">+5%</span></p>
          <ResponsiveContainer width="100%" height={150}>
            <BarChart data={tripsByDriver} layout="vertical">
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" />
              <Tooltip />
              <Bar dataKey="value" fill="#EF4444" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* On-Time Deliveries by Depot */}
        <div className="bg-white p-4 rounded-md shadow">
          <h3 className="font-semibold">On-Time Deliveries</h3>
          <p className="text-2xl font-bold">5</p>
          <p className="text-sm text-gray-500">Last 30 Days <span className="text-red-500">-2%</span></p>
          <ResponsiveContainer width="100%" height={150}>
            <BarChart data={depotDelivery} layout="vertical">
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" />
              <Tooltip />
              <Bar dataKey="value" fill="#EF4444" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Trips By Stations */}
        <div className="bg-white p-4 rounded-md shadow">
          <h3 className="font-semibold">Trips By Driver</h3>
          <p className="text-2xl font-bold">10</p>
          <p className="text-sm text-gray-500">Last 7 Days <span className="text-green-600">+3%</span></p>
          <ResponsiveContainer width="100%" height={150}>
            <BarChart data={tripsByDriver} layout="vertical">
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" />
              <Tooltip />
              <Bar dataKey="value" fill="#EF4444" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>

  );
}
