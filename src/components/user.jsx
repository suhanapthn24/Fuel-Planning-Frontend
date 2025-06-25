import React, { useState } from 'react';
import Sidebar from './Admin/sidebar';
import Navbar from './Admin/navbar';

const dummyUsers = [
  { name: 'Olivia Davis', email: 'Olivia.Davis@example.com', role: 'Driver', status: 'Active' },
  { name: 'Ethan Miller', email: 'Ethan.Miller@example.com', role: 'Driver', status: 'Active' },
  { name: 'Sophia Clark', email: 'Sophia.Clark@example.com', role: 'Driver', status: 'Inactive' },
  { name: 'Liam Wilson', email: 'Liam.Wilson@example.com', role: 'Driver', status: 'Active' },
  { name: 'Jack Brown', email: 'Jack.Brown@example.com', role: 'Driver', status: 'Active' },
];

export default function User() {
  const [activeTab, setActiveTab] = useState('Drivers');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredUsers = dummyUsers.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Navbar */}
      <div className="w-full">
        <Navbar />
      </div>

      {/* Sidebar + Content */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow h-full">
          <Sidebar />
        </div>

        {/* Main Content */}
        <main className="flex-1 p-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">User</h2>

          {/* Search bar */}
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search By Name"
              className="px-4 py-2 border rounded-full bg-white w-full sm:w-80"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Tabs BELOW search */}
          <div className="flex space-x-2 mb-6">
            {['Drivers', 'Depots', 'Stations'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-full font-medium text-sm ${
                  activeTab === tab ? 'bg-red-600 text-white' : 'bg-black text-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Table */}
          <div className="bg-white rounded-xl shadow overflow-hidden">
            <table className="min-w-full table-auto">
              <thead className="bg-gray-100 text-left text-sm text-gray-600">
                <tr>
                  <th className="p-4 font-semibold">Name</th>
                  <th className="p-4 font-semibold">Email Address</th>
                  <th className="p-4 font-semibold">Role</th>
                  <th className="p-4 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user, idx) => (
                  <tr key={idx} className="border-t text-sm text-gray-700 hover:bg-gray-50">
                    <td className="p-4 font-medium text-gray-800">{user.name}</td>
                    <td className="p-4">{user.email}</td>
                    <td className="p-4">{user.role}</td>
                    <td className="p-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium text-white ${
                          user.status === 'Active' ? 'bg-green-500' : 'bg-red-500'
                        }`}
                      >
                        {user.status}
                      </span>
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
