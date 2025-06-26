import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './navbar';
import Sidebar from './sidebar';
import DashboardCards from './dashboardcards';
import DashboardAnalytics from './dashanalytics';

export function AdminExceptions() {
  const [exceptions, setExceptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get('http://localhost:8000/exceptions/')
      .then((res) => setExceptions(res.data))
      .catch((err) => console.error('Error fetching exceptions:', err))
      .finally(() => setLoading(false));
  }, []);

  const refreshException = (id, updated) => {
    setExceptions((prev) =>
      prev.map((ex) => (ex.exception_id === id ? { ...ex, ...updated } : ex))
    );
  };

  const handleAcknowledge = (ex) => {
    if (ex.exception_status === 'acknowledged') return;
    axios
      .patch(`http://localhost:8000/exceptions/${ex.exception_id}`, {
        exception_status: 'acknowledged',
      })
      .then(() => refreshException(ex.exception_id, { exception_status: 'acknowledged' }))
      .catch((err) => alert('Failed to acknowledge: ' + err));
  };

  const handleReassignDriver = (ex) => {
    const newDriverId = prompt('Enter new Driver ID for Trip ' + ex.trip_id);
    if (!newDriverId) return;
    axios
      .patch(`http://localhost:8000/trips/${ex.trip_id}`, {
        driver_id: newDriverId,
      })
      .then(() => alert('Driver reassigned!'))
      .catch((err) => alert('Failed to reassign driver: ' + err));
  };

  const handleNotifyDepot = (ex) => {
    axios
      .post(`http://localhost:8000/exceptions/${ex.exception_id}/notify_depot`)
      .then(() => alert('Depot notified'))
      .catch((err) => alert('Failed to notify depot: ' + err));
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <div className="bg-white rounded-xl shadow overflow-x-auto">
      <table className="min-w-full text-sm text-left">
        <thead className="bg-gray-100 text-gray-700 font-semibold">
          <tr>
            <th className="px-6 py-4">Exception Type</th>
            <th className="px-6 py-4">Trip ID</th>
            <th className="px-6 py-4">Timestamp</th>
            <th className="px-6 py-4">Status</th>
            <th className="px-6 py-4 text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {exceptions.map((ex) => (
            <tr key={ex.exception_id} className="hover:bg-gray-50">
              <td className="px-6 py-4">{ex.exception_type}</td>
              <td className="px-6 py-4">{ex.trip_id}</td>
              <td className="px-6 py-4">{new Date(ex.date_stamp).toLocaleString()}</td>
              <td className="px-6 py-4">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    ex.exception_status === 'pending'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-green-100 text-green-800'
                  }`}
                >
                  {ex.exception_status.charAt(0).toUpperCase() + ex.exception_status.slice(1)}
                </span>
              </td>
              <td className="px-6 py-4 text-blue-600 space-x-3 text-sm whitespace-nowrap">
                <button className="hover:underline" onClick={() => handleAcknowledge(ex)}>
                  Acknowledge
                </button>
                <span>|</span>
                <button className="hover:underline" onClick={() => handleReassignDriver(ex)}>
                  Reassign Driver
                </button>
                <span>|</span>
                <button className="hover:underline" onClick={() => handleNotifyDepot(ex)}>
                  Notify Depot
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function Dashboard() {
  const [exceptions, setExceptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get('http://localhost:8000/exceptions/')
      .then((res) => setExceptions(res.data))
      .catch((err) => console.error('Error fetching exceptions:', err))
      .finally(() => setLoading(false));
  }, []);

  const [trips, setTrips] = useState([]);            
  const [alerts, setAlerts] = useState([]);         

  // Fetch trips & alerts in parallel with exceptions
  useEffect(() => {
    Promise.all([
      axios.get('http://localhost:8000/trips/'),     
      axios.get('http://localhost:8000/alerts/'),     
    ])
      .then(([tripsRes, alertsRes]) => {
        setTrips(tripsRes.data);
        setAlerts(alertsRes.data);
      })
      .catch((err) => console.error('Error fetching trips/alerts:', err));
  }, []);

  const counts = {
    // TRIP METRICS
    activeTrips: trips.filter((t) => t.trip_status === 'active').length,
    delayedTrips: trips.filter((t) => t.trip_status === 'delayed').length,

    // ALERTS METRICS
    bufferAlerts: alerts.filter((a) => a.alert_type === 'buffer').length,

    // EXCEPTION METRICS
    totalExceptions: exceptions.length,
    pendingExceptions: exceptions.filter((e) => e.exception_status === 'pending').length,
    acknowledgedExceptions: exceptions.filter((e) => e.exception_status === 'acknowledged').length,
  };

  return (
    <div className="h-screen flex flex-col">
      {/* Top Navbar */}
      <div className="h-16 w-full bg-white shadow z-10">
        <Navbar />
      </div>

      {/* Sidebar & content area */}
      <div className="flex flex-1 overflow-hidden">
        <div className="w-64 bg-white shadow h-full overflow-y-auto">
          <Sidebar />
        </div>

        <main className="flex-1 p-6 overflow-y-auto bg-gray-50">
          {/* Header */}
          <h1 className="text-2xl font-bold mb-1">Dashboard</h1>
          <p className="text-sm text-gray-500 mb-6">
            Overview of key metrics and alerts for your fuel fleet operations.
          </p>

          {/* Metric cards – now receive live counts */}
          <DashboardCards counts={counts} />

          {/* Exception Alerts */}
          <h2 className="text-lg font-bold mt-10 mb-2">Exception Alerts</h2>
          {loading ? (
            <p className="text-sm text-gray-500">Loading exceptions…</p>
          ) : exceptions.length === 0 ? (
            <p className="text-sm text-gray-500">No active exceptions 🎉</p>
          ) : (
            <div className="bg-white rounded-xl shadow overflow-x-auto">
              <table className="min-w-full text-sm text-left">
                <thead className="bg-gray-100 text-gray-700 font-semibold">
                  <tr>
                    <th className="px-6 py-4">Exception Type</th>
                    <th className="px-6 py-4">Trip ID</th>
                    <th className="px-6 py-4">Timestamp</th>
                    <th className="px-6 py-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {exceptions.slice(0, 5).map((ex) => (
                    <tr key={ex.exception_id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">{ex.exception_type}</td>
                      <td className="px-6 py-4">{ex.trip_id}</td>
                      <td className="px-6 py-4">{new Date(ex.date_stamp).toLocaleString()}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            ex.exception_status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-green-100 text-green-800'
                          }`}
                        >
                          {ex.exception_status.charAt(0).toUpperCase() + ex.exception_status.slice(1)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {exceptions.length > 5 && (
                <p className="text-right text-xs text-gray-500 py-2 pr-4">
                  Showing 5 of {exceptions.length} exceptions – see “Exceptions” page for full list.
                </p>
              )}
            </div>
          )}

          {/* Analytics */}
          <h2 className="text-lg font-bold mt-10 mb-4">Performance Metrics</h2>
          <DashboardAnalytics />
        </main>
      </div>
    </div>
  );
}
