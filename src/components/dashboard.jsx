import React from "react";
import Navbar from "../components/navbar";
import Sidebar from "../components/sidebar";
import DashboardCards from "../components/dashboardcards";
import AlertsTable from "../components/alertstable";
import DashboardAnalytics from "../components/dashanalytics";

export default function Dashboard() {
  return (
    <div className="h-screen flex flex-col">
      {/* Top Navbar at the top */}
      <div className="h-16 w-full bg-white shadow z-10">
        <Navbar />
      </div>

      {/* Body area: sidebar + content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar below the navbar */}
        <div className="w-64 bg-white shadow h-full overflow-y-auto">
          <Sidebar />
        </div>

        {/* Main content */}
        <main className="flex-1 p-6 overflow-y-auto bg-gray-50">
          {/* Heading */}
          <h1 className="text-2xl font-bold mb-1">Dashboard</h1>
          <p className="text-sm text-gray-500 mb-6">
            Overview of key metrics and alerts for your fuel fleet operations.
          </p>

          {/* Cards */}
          <DashboardCards />

          {/* Alerts */}
          <h2 className="text-lg font-bold mt-10 mb-2">Exception Alerts</h2>
          <AlertsTable />

          {/* Analytics */}
          <h2 className="text-lg font-bold mt-10 mb-4">Performance Metrics</h2>
          <DashboardAnalytics />
        </main>
      </div>
    </div>
  );
}
