import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import Navbar from "./navbar";
import Sidebar from "./sidebar";
import DashboardCards from "./dashboardcards";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

function RingWithTooltip({ title, count, tint, stations }) {
  const [showTooltip, setShowTooltip] = React.useState(false);

  return (
    <div
      className="relative flex flex-col items-center cursor-pointer"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <div
        className="w-20 h-20 rounded-full flex items-center justify-center font-bold text-xl text-gray-900 shadow-md"
        style={{ border: `6px solid ${tint}`, backgroundColor: `${tint}22` }} // subtle tinted background
      >
        {count}
      </div>
      <span className="mt-2 text-center font-semibold text-gray-700">{title}</span>

      {showTooltip && stations.length > 0 && (
        <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-64 max-h-48 overflow-auto rounded-lg bg-white shadow-lg border border-gray-300 p-3 text-sm text-gray-900 z-50">
          <strong>{title} Stations:</strong>
          <ul className="mt-1 list-disc list-inside max-h-36 overflow-y-auto">
            {stations.map((station) => (
              <li key={station.station_id || station.id}>{station.site_name}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default function Dashboard() {
  const [exceptions, setExceptions] = useState([]);
  const [trips, setTrips] = useState([]);
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      navigate("/", { replace: true }); 
    }
  }, [navigate]);

  const excelDownloadUrl =
    "https://docs.google.com/spreadsheets/d/1cpl4X28sLhX8XtxgvlJVFPhJ6pEJz3nTV4LWBVmNorM/edit?gid=0#gid=0";
  const powerBIUrl =
    "https://app.powerbi.com/view?r=YOUR_POWERBI_EMBED_LINK_HERE"; // Replace with your PowerBI link

  useEffect(() => {
    Promise.all([
      axios.get("http://localhost:8000/exceptions/"),
      axios.get("http://localhost:8000/trips/"),
      axios.get("http://localhost:8000/stations"),
    ])
      .then(([exceptionsRes, tripsRes, stationsRes]) => {
        setExceptions(exceptionsRes.data);
        setTrips(tripsRes.data);
        setStations(stationsRes.data);
      })
      .catch((err) => console.error("Error fetching dashboard data:", err))
      .finally(() => setLoading(false));
  }, []);

  const counts = {
    activeTrips: trips.filter((t) => t.trip_status === "active").length,
    delayedTrips: trips.filter((t) => t.trip_status === "delayed").length,
    totalExceptions: exceptions.length,
    pendingExceptions: exceptions.filter((e) => e.exception_status === "pending")
      .length,
    acknowledgedExceptions: exceptions.filter(
      (e) => e.exception_status === "acknowledged"
    ).length,
  };

  const handleExportExcel = () => {
    window.open(excelDownloadUrl, "_blank");
  };

  // Prepare stations lists for rings:
  const atRiskStations = stations.filter((s) => s.will_reach_threshold);
  const stableStations = stations.filter((s) => !s.will_reach_threshold);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Navbar */}
      <div className="h-16 bg-white shadow z-10">
        <Navbar />
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow h-full overflow-y-auto">
          <Sidebar />
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col overflow-hidden p-6">
          {/* Left side: Dashboard Cards and Rings summary side-by-side */}
          <div className="flex justify-between mb-6 max-w-6xl w-full gap-8">
            <div className="flex-1 bg-white rounded-lg shadow p-6 min-w-[300px]">
              <h2 className="text-lg font-semibold mb-4">Dashboard Cards</h2>
              <DashboardCards counts={counts} />
            </div>

            <div className="w-[360px] bg-white rounded-lg shadow p-6 flex flex-col">
              <h2 className="text-lg font-semibold mb-4 text-center">
                Predictive Models Summary
              </h2>
              <div className="flex justify-around gap-6">
                <RingWithTooltip
                  title="At Risk"
                  count={atRiskStations.length}
                  tint="#fca5a5" // muted pastel red
                  stations={atRiskStations}
                />
                <RingWithTooltip
                  title="Stable"
                  count={stableStations.length}
                  tint="#6ee7b7" // muted pastel green
                  stations={stableStations}
                />
                <RingWithTooltip
                  title="Total"
                  count={stations.length}
                  tint="#93c5fd" // muted pastel blue
                  stations={stations}
                />
              </div>
            </div>
          </div>

          {/* Power BI section at bottom full width */}
          <section className="mt-auto">
            <h2 className="text-lg font-bold mb-4">Power BI Dashboard</h2>
            <div className="mb-4 flex items-center gap-4">
              <button
                onClick={handleExportExcel}
                className="bg-indigo-600 text-white px-5 py-2 rounded hover:bg-indigo-700 transition"
              >
                Export Excel
              </button>
            </div>
            <div className="border rounded-lg h-96 bg-white shadow flex items-center justify-center">
              <iframe
                title="Power BI Dashboard"
                width="100%"
                height="100%"
                frameBorder="0"
                allowFullScreen
                src={powerBIUrl}
              />
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
