import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from './ssidebar';
import Navbar from './snavbar';

export default function StationExceptions() {
  const [exceptions, setExceptions] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    type: '',
    tripId: '',
    timestamp: '',
    status: 'Pending',
  });
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get("http://localhost:8000/exceptions/")
      .then(res => setExceptions(res.data))
      .catch(err => console.error('Fetch failed:', err));
  }, []);

  const handleRaiseException = () => {
    if (!formData.type || !formData.tripId || !formData.timestamp) {
      setError('All fields are required.');
      return;
    }

    axios.post('http://localhost:8000/exceptions/', formData)
      .then(res => {
        setExceptions([...exceptions, res.data]);
        setShowModal(false);
        setFormData({ type: '', tripId: '', timestamp: '', status: 'Pending' });
        setError('');
      })
      .catch(err => {
        console.error('Post failed:', err);
        setError('Failed to raise exception.');
      });
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      setShowModal(false);
      setError('');
    }
  };

  return (
    <div className="h-screen flex flex-col" onKeyDown={handleKeyDown} tabIndex={0}>
      <div className="h-16 w-full bg-white shadow z-10">
        <Navbar />
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className="w-64 bg-white shadow h-full overflow-y-auto">
          <Sidebar />
        </div>

        <main className="flex-1 overflow-y-auto p-8 bg-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Active Exceptions</h2>
            <button
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
              onClick={() => setShowModal(true)}
            >
              Raise Exception
            </button>
          </div>

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
                    <td className="px-6 py-4">{new Date(ex.timestamp).toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        ex.status === 'Pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-green-100 text-green-800'
                      }`}>
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

          {/* Modal */}
          {showModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative">
                <button
                  onClick={() => setShowModal(false)}
                  className="absolute top-2 right-2 text-gray-500 hover:text-black text-lg font-bold"
                >
                  ×
                </button>
                <h3 className="text-lg font-semibold mb-4">Raise New Exception</h3>
                {error && <p className="text-red-600 text-sm mb-2">{error}</p>}
                <input
                  type="text"
                  placeholder="Exception Type"
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full mb-3 px-3 py-2 border rounded"
                />
                <input
                  type="text"
                  placeholder="Trip ID"
                  value={formData.tripId}
                  onChange={(e) => setFormData({ ...formData, tripId: e.target.value })}
                  className="w-full mb-3 px-3 py-2 border rounded"
                />
                <input
                  type="datetime-local"
                  value={formData.timestamp}
                  onChange={(e) => setFormData({ ...formData, timestamp: e.target.value })}
                  className="w-full mb-3 px-3 py-2 border rounded"
                />
                <button
                  onClick={handleRaiseException}
                  className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded"
                >
                  Submit
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
