import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from './sidebar';
import Navbar from './navbar';

const Exceptions = () => {
  const [exceptions, setExceptions] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8000/exceptions')
      .then(res => setExceptions(res.data))
      .catch(err => console.error('Error fetching exceptions:', err));
  }, []);

  return (
    <div className="h-screen flex flex-col">
      <div className="h-16 w-full bg-white shadow z-10">
        <Navbar />
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className="w-64 bg-white shadow h-full overflow-y-auto">
          <Sidebar />
        </div>

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
                  <th className="px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {exceptions.map((ex, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="px-6 py-4">{ex.type}</td>
                    <td className="px-6 py-4">{ex.tripId}</td>
                    <td className="px-6 py-4">{ex.timestamp}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          ex.status === 'Pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-green-100 text-green-800'
                        }`}
                      >
                        {ex.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-blue-600 space-x-2 text-sm">
                      <button className="hover:underline">Acknowledge</button>
                      <span>|</span>
                      <button className="hover:underline">Reassign Driver</button>
                      <span>|</span>
                      <button className="hover:underline">Notify Depot</button>
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
};

export default Exceptions;
