import React, { useState, useEffect } from 'react';
import axios from 'axios';

import Navbar from './navbar';
import Sidebar from './sidebar';
import DashboardCards from './dashboardcards';
import PredictiveModels from './dashstatus';

export default function Dashboard() {
  const [exceptions, setExceptions] = useState([]);
  const [trips, setTrips] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [models, setModels] = useState([]);

  // Put your Excel download link here (replace below URL)
  const excelDownloadUrl = 'https://docs.google.com/spreadsheets/d/1cpl4X28sLhX8XtxgvlJVFPhJ6pEJz3nTV4LWBVmNorM/edit?gid=0#gid=0';

  useEffect(() => {
    Promise.all([
      axios.get('http://localhost:8000/exceptions/'),
      axios.get('http://localhost:8000/trips/'),
      axios.get('http://localhost:8000/alerts/'),
      axios.get('http://localhost:8000/models/'),
    ])
      .then(([exceptionsRes, tripsRes, alertsRes, modelsRes]) => {
        setExceptions(exceptionsRes.data);
        setTrips(tripsRes.data);
        setAlerts(alertsRes.data);
        setModels(modelsRes.data);
      })
      .catch((err) => console.error('Error fetching dashboard data:', err))
      .finally(() => setLoading(false));
  }, []);

  const counts = {
    activeTrips: trips.filter((t) => t.trip_status === 'active').length,
    delayedTrips: trips.filter((t) => t.trip_status === 'delayed').length,
    bufferAlerts: alerts.filter((a) => a.alert_type === 'buffer').length,
    totalExceptions: exceptions.length,
    pendingExceptions: exceptions.filter((e) => e.exception_status === 'pending').length,
    acknowledgedExceptions: exceptions.filter((e) => e.exception_status === 'acknowledged').length,
  };

  // Function to trigger download
  const handleExportExcel = () => {
    // Open the Excel file URL in a new tab or trigger download
    window.open(excelDownloadUrl, '_blank');
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Navbar */}
      <div className="h-16 bg-white shadow z-10">
        <Navbar />
      </div>

      {/* Sidebar + Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow h-full overflow-y-auto">
          <Sidebar />
        </div>

        {/* Main Content */}
        <main className="flex-1 p-6 overflow-y-auto">
        <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

        {/* Show Dashboard Cards at the top */}
        <section className="bg-white rounded-lg shadow p-6 mb-6 min-w-0">
          <h2 className="text-lg font-semibold mb-4">Dashboard Cards</h2>
          <DashboardCards counts={counts} />
        </section>

        {/* Two side-by-side blocks for lists */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Block: Predictive Models */}
          <section className="flex-1 bg-white rounded-lg shadow p-6 min-w-0">
            <h2 className="text-lg font-semibold mb-4">Predictive Models</h2>
            {/* {loading ? (
              <p>Loading models...</p>
            ) : models.length === 0 ? (
              <p>No models found.</p>
            ) : (
              <ul className="space-y-2 max-h-[400px] overflow-y-auto">
                {models.map((model) => (
                  <li
                    key={model.id || model.model_id}
                    className="border rounded p-3 hover:bg-gray-50 cursor-pointer"
                  >
                    <p className="font-semibold">{model.name || model.model_name}</p>
                    <p>Status: {model.status || 'N/A'}</p>
                    <p>Last Run: {model.last_run || 'N/A'}</p>
                  </li>
                ))}
              </ul>
            )} */}
            <PredictiveModels />
          </section>

          {/* Right Block: Exceptions List (or you can replace with Trips, Alerts, etc.) */}
          {/* <section className="flex-1 bg-white rounded-lg shadow p-6 min-w-0">
            <h2 className="text-lg font-semibold mb-4">Exceptions</h2>
            {loading ? (
              <p>Loading exceptions...</p>
            ) : exceptions.length === 0 ? (
              <p>No exceptions found.</p>
            ) : (
              <ul className="space-y-2 max-h-[400px] overflow-y-auto">
                {exceptions.map((exception) => (
                  <li
                    key={exception.id || exception.exception_id}
                    className="border rounded p-3 hover:bg-gray-50 cursor-pointer"
                  >
                    <p className="font-semibold">{exception.title || exception.exception_type}</p>
                    <p>Status: {exception.exception_status}</p>
                    <p>Reported at: {new Date(exception.reported_at).toLocaleString()}</p>
                  </li>
                ))}
              </ul>
            )}
          </section> */}
        </div>

        {/* Export + Power BI */}
        <div className="mt-10">
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
              // src="https://app.powerbi.com/view?r=eyJrIjoiZmRmYTgwZDgtZjllNy00NTUzLWJmYWItZjQxOWUxM2E5NjM5IiwidCI6IjQ5YmM2YjEzLTlmZTUtNGZmMS05ZDYxLTY1YjcwOGIwYjc5NSJ9"
              frameBorder="0"
              allowFullScreen
            />
          </div>
        </div>
      </main>
      </div>
    </div>
  );
}
