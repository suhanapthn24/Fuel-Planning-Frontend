import React from "react";
import Sidebar from "./sidebar";
import Navbar from "./navbar";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, BarChart, Bar, ResponsiveContainer, PieChart, Pie, Cell,
} from "recharts";

// Sample data
const COLORS = ["#EF4444", "#10B981", "#F59E0B", "#3B82F6"];
const bufferData = [ { day: "Mon", value: 10 }, { day: "Tue", value: 14 }, { day: "Wed", value: 12 }, { day: "Thu", value: 8 }, { day: "Fri", value: 3 }, { day: "Sat", value: 13 }, { day: "Sun", value: 9 }];
const deliveriesData = [ { week: "Week 1", value: 65 }, { week: "Week 2", value: 95 }, { week: "Week 3", value: 95 }, { week: "Week 4", value: 55 }];
const tripsByDriver = [ { name: "Driver C", value: 5 }, { name: "Driver B", value: 3 }, { name: "Driver A", value: 2 }];
const depotDelivery = [ { name: "Depot Z", value: 3 }, { name: "Depot Y", value: 2 }];
const tripsByStation = [ { name: "Station 1", value: 5 }, { name: "Station 2", value: 3 }, { name: "Station 3", value: 2 }];
const fuelUsage = [ { name: "Used", value: 340 }, { name: "Remaining", value: 160 }];
const driverRatings = [ { name: "Driver A", value: 4.7 }, { name: "Driver B", value: 4.3 }, { name: "Driver C", value: 3.9 }, { name: "Driver D", value: 4.5 }];
const tripDurations = [ { day: "Mon", value: 50 }, { day: "Tue", value: 70 }, { day: "Wed", value: 60 }, { day: "Thu", value: 45 }, { day: "Fri", value: 80 }];

export default function Reports() {
  return (
    <div>
      {/* Fixed Sidebar */}
      <div className="fixed top-0 left-0 w-64 h-full z-20">
        <Sidebar />
      </div>

      {/* Fixed Navbar */}
      <div className="fixed top-0 left-64 right-0 h-16 z-10">
        <Navbar />
      </div>

      {/* Main content starts AFTER navbar and sidebar */}
      <div className="ml-64 mt-16 p-6 bg-gray-100 min-h-screen">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Reports Dashboard</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <ChartCard title="Avg. Buffer Time" value="15 Min" change="+10%" color="green">
            <LineChart data={bufferData}><XAxis dataKey="day" /><YAxis /><Tooltip /><Line type="monotone" dataKey="value" stroke="#EF4444" strokeWidth={3} /></LineChart>
          </ChartCard>

          <ChartCard title="On-Time Deliveries" value="95%" change="-5%" color="red">
            <BarChart data={deliveriesData}><XAxis dataKey="week" /><YAxis /><Tooltip /><Bar dataKey="value" fill="#EF4444" barSize={30} /></BarChart>
          </ChartCard>

          <ChartCard title="Trips by Driver" value="10" change="+5%" color="green">
            <BarChart data={tripsByDriver} layout="vertical"><XAxis type="number" /><YAxis dataKey="name" type="category" /><Tooltip /><Bar dataKey="value" fill="#EF4444" /></BarChart>
          </ChartCard>

          <ChartCard title="Depot Deliveries" value="5" change="-2%" color="red">
            <BarChart data={depotDelivery} layout="vertical"><XAxis type="number" /><YAxis dataKey="name" type="category" /><Tooltip /><Bar dataKey="value" fill="#EF4444" /></BarChart>
          </ChartCard>

          <ChartCard title="Trips by Station" value="10" change="+3%" color="green">
            <BarChart data={tripsByStation} layout="vertical"><XAxis type="number" /><YAxis dataKey="name" type="category" /><Tooltip /><Bar dataKey="value" fill="#EF4444" /></BarChart>
          </ChartCard>

          <ChartCard title="Fuel Usage" value="500L" change="+20L" color="green">
            <PieChart><Pie data={fuelUsage} dataKey="value" cx="50%" cy="50%" outerRadius={50} label>{fuelUsage.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip /></PieChart>
          </ChartCard>

          <ChartCard title="Trip Completion" value="87%" change="+7%" color="green">
            <div className="mt-4">
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div className="bg-green-500 h-full rounded-full" style={{ width: "87%" }}></div>
              </div>
            </div>
          </ChartCard>

          <ChartCard title="Trip Duration" value="60 min" change="-4%" color="red">
            <LineChart data={tripDurations}><XAxis dataKey="day" /><YAxis /><Tooltip /><Line type="monotone" dataKey="value" stroke="#3B82F6" strokeWidth={3} /></LineChart>
          </ChartCard>

          <ChartCard title="Driver Ratings" value="Avg. 4.5" change="+0.2" color="green">
            <BarChart data={driverRatings} layout="vertical"><XAxis type="number" domain={[0, 5]} /><YAxis dataKey="name" type="category" /><Tooltip /><Bar dataKey="value" fill="#10B981" /></BarChart>
          </ChartCard>
        </div>
      </div>
    </div>
  );
}

// Reusable chart container card
const ChartCard = ({ title, value, change, color, children }) => (
  <div className="bg-white p-4 rounded-2xl shadow hover:shadow-lg transition-all duration-300">
    <h3 className="text-lg font-semibold text-gray-700">{title}</h3>
    <div className="text-xl font-bold text-gray-900">
      {value}
      <span className={`ml-2 text-sm font-medium text-${color}-600`}>{change}</span>
    </div>
    <p className="text-xs text-gray-500 mb-2">Last 30 Days</p>
    <div className="h-36">
      <ResponsiveContainer width="100%" height="100%">
        {children}
      </ResponsiveContainer>
    </div>
  </div>
);
