import React, { useState, useEffect } from 'react';
import Sidebar from './sidebar';
import Navbar from './navbar';
import axios from 'axios';

const User = () => {
  const [userInfo, setUserInfo] = useState({
    name: '',
    email: '',
    phone: '',
    role: '',
  });

  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState(userInfo);
  const [showPasswordReset, setShowPasswordReset] = useState(false);
  const [newPassword, setNewPassword] = useState('');

  const userEmail = localStorage.getItem('userEmail');

  useEffect(() => {
    if (userEmail) {
      axios.get(`http://127.0.0.1:8000/user/${userEmail}`)
        .then((res) => {
          setUserInfo(res.data);
          setForm(res.data);
        })
        .catch((err) => {
          console.error("Error fetching user:", err);
        });
    }
  }, [userEmail]);

  const handleEditToggle = () => {
    setEditMode(!editMode);
    setForm(userInfo);
  };

  const handleSave = () => {
    axios.put(`http://127.0.0.1:8000/user/${userEmail}`, form)
      .then(() => {
        setUserInfo(form);
        setEditMode(false);
      })
      .catch((err) => {
        console.error("Error updating user:", err);
      });
  };

  const handlePasswordReset = () => {
    alert(`Password reset to: ${newPassword}`);
    setNewPassword('');
    setShowPasswordReset(false);
  };

  return (
    <div className="h-screen flex flex-col">
      {/* Navbar at the top */}
      <div className="h-16 w-full bg-white shadow z-10">
        <Navbar />
      </div>

      {/* Main content area below navbar */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar on the left */}
        <div className="w-64 bg-white shadow h-full overflow-y-auto">
          <Sidebar />
        </div>

        {/* Content to the right of sidebar */}
        <main className="flex-1 overflow-y-auto p-8 bg-gray-100">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">User Profile</h2>

          <div className="bg-white p-6 rounded-xl shadow max-w-2xl">
            <div className="space-y-4">
              <div>
                <label className="block text-gray-600 text-sm mb-1">Name</label>
                <input
                  type="text"
                  className="w-full border px-4 py-2 rounded-lg bg-gray-50"
                  disabled={!editMode}
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-gray-600 text-sm mb-1">Email</label>
                <input
                  type="email"
                  className="w-full border px-4 py-2 rounded-lg bg-gray-50"
                  disabled
                  value={form.email}
                />
              </div>

              <div>
                <label className="block text-gray-600 text-sm mb-1">Phone</label>
                <input
                  type="text"
                  className="w-full border px-4 py-2 rounded-lg bg-gray-50"
                  disabled={!editMode}
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-gray-600 text-sm mb-1">Role</label>
                <input
                  type="text"
                  className="w-full border px-4 py-2 rounded-lg bg-gray-50"
                  disabled={!editMode}
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                />
              </div>
            </div>

            <div className="mt-6 flex justify-between">
              <div>
                <button
                  onClick={handleEditToggle}
                  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                >
                  {editMode ? 'Cancel' : 'Edit Profile'}
                </button>

                {editMode && (
                  <button
                    onClick={handleSave}
                    className="ml-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                  >
                    Save
                  </button>
                )}
              </div>

              <button
                onClick={() => setShowPasswordReset(true)}
                className="text-red-600 hover:underline"
              >
                Reset Password
              </button>
            </div>

            {showPasswordReset && (
              <div className="mt-6 border-t pt-4">
                <label className="block text-gray-600 text-sm mb-1">New Password</label>
                <input
                  type="password"
                  className="w-full border px-4 py-2 rounded-lg bg-gray-50 mb-3"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <div className="flex justify-end">
                  <button
                    onClick={handlePasswordReset}
                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-500"
                  >
                    Confirm Reset
                  </button>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default User;
