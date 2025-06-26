import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from './ssidebar';
import Navbar from './snavbar';

export default function StationExceptions() {
  const [exceptions, setExceptions] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null); // null → create, number → update
  const [formData, setFormData] = useState({
    exception_type: '',
    trip_id: '',
    date_stamp: '',
    exception_status: 'pending',
  });
  const [error, setError] = useState('');

  useEffect(() => {
    axios
      .get('http://localhost:8000/exceptions/')
      .then((res) => setExceptions(res.data))
      .catch((err) => console.error('Fetch failed:', err));
  }, []);

  const resetForm = () => {
    setFormData({
      exception_type: '',
      trip_id: '',
      date_stamp: '',
      exception_status: 'pending',
    });
    setEditingId(null);
  };

  const openCreateModal = () => {
    resetForm();
    setShowModal(true);
  };

  const openEditModal = (ex) => {
    setEditingId(ex.exception_id);
    setFormData({
      exception_type: ex.exception_type,
      trip_id: ex.trip_id,
      date_stamp: new Date(ex.date_stamp).toISOString().slice(0, 16), // yyyy‑MM‑ddTHH:mm
      exception_status: ex.exception_status,
    });
    setShowModal(true);
  };

  const handleSubmit = () => {
    const { exception_type, trip_id, date_stamp } = formData;
    if (!exception_type || !trip_id || !date_stamp) {
      setError('All fields are required.');
      return;
    }

    const payload = {
      ...formData,
      date_stamp: new Date(date_stamp).toISOString(), // ensure ISO
    };

    // Decide between POST (create) and PATCH (update)
    const request = editingId
      ? axios.patch(`http://127.0.0.1:8000/exceptions/${editingId}`, payload)
      : axios.post('http://127.0.0.1:8000/exceptions/', payload);

    request
      .then((res) => {
        let updated;
        if (editingId) {
          // replace item in list
          updated = exceptions.map((ex) =>
            ex.exception_id === editingId ? res.data : ex
          );
        } else {
          updated = [...exceptions, res.data];
        }
        setExceptions(updated);
        setShowModal(false);
        resetForm();
        setError('');
      })
      .catch((err) => {
        console.error('Submit failed:', err);
        setError('Failed to save exception.');
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
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Active Exceptions</h2>
            <button
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
              onClick={openCreateModal}
            >
              Raise Exception
            </button>
          </div>

          {/* Exceptions table */}
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
                    <td className="px-6 py-4 text-blue-600 space-x-2 text-sm">
                      <button
                        className="hover:underline"
                        onClick={() => openEditModal(ex)}
                      >
                        Update
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Modal – create / edit */}
          {showModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative">
                {/* Close button */}
                <button
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                    setError('');
                  }}
                  className="absolute top-2 right-2 text-gray-500 hover:text-black text-lg font-bold"
                >
                  ×
                </button>

                <h3 className="text-lg font-semibold mb-4">
                  {editingId ? 'Edit Exception' : 'Raise New Exception'}
                </h3>
                {error && <p className="text-red-600 text-sm mb-2">{error}</p>}

                {/* Exception Type */}
                <select
                  value={formData.exception_type}
                  onChange={(e) => setFormData({ ...formData, exception_type: e.target.value })}
                  className="w-full mb-3 px-3 py-2 border rounded bg-white"
                >
                  <option value="" disabled>
                    Select Exception Type
                  </option>
                  <option value="low fuel">Low Fuel</option>
                  <option value="route deviation">Route Deviation</option>
                  <option value="excessive speed">Excessive Speed</option>
                  <option value="unscheduled">Unscheduled</option>
                  <option value="other">Other</option>
                </select>

                {/* Trip ID */}
                <input
                  type="text"
                  placeholder="Trip ID"
                  value={formData.trip_id}
                  onChange={(e) => setFormData({ ...formData, trip_id: e.target.value })}
                  className="w-full mb-3 px-3 py-2 border rounded"
                />

                {/* Date Time */}
                <input
                  type="datetime-local"
                  value={formData.date_stamp}
                  onChange={(e) => setFormData({ ...formData, date_stamp: e.target.value })}
                  className="w-full mb-3 px-3 py-2 border rounded"
                />

                {/* Status dropdown (only in edit mode) */}
                {editingId && (
                  <select
                    value={formData.exception_status}
                    onChange={(e) => setFormData({ ...formData, exception_status: e.target.value })}
                    className="w-full mb-3 px-3 py-2 border rounded bg-white"
                  >
                    <option value="pending">Pending</option>
                    <option value="acknowledged">Acknowledged</option>
                  </select>
                )}

                {/* Submit */}
                <button
                  onClick={handleSubmit}
                  className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded"
                >
                  {editingId ? 'Save Changes' : 'Submit'}
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
