import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from './sidebar';
import Navbar from './navbar';

export default function AdminExceptions() {
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
    if (ex.exception_status === 'acknowledged') return; // already done
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
    <div className="h-screen flex flex-col">
      {/* Top bar */}
      <div className="h-16 w-full bg-white shadow z-10">
        <Navbar />
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow h-full overflow-y-auto">
          <Sidebar />
        </div>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto p-8 bg-gray-100">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Active Exceptions</h2>

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
                    <td className="px-6 py-4">
                      {new Date(ex.date_stamp).toLocaleString()}
                    </td>
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
        </main>
      </div>
    </div>
  );
}
