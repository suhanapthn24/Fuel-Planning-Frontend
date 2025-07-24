import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from './sidebar';
import Navbar from './navbar';
import { Search } from 'lucide-react';

export default function AdminExceptions() {
  const [exceptions, setExceptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState({ key: '', direction: 'asc' });
  const [searchQuery, setSearchQuery] = useState('');

  const token = localStorage.getItem('access_token');
  if (!token) {
    return (
      <div className="flex items-center justify-center h-screen text-red-600">
        Unauthorized – Please log in.
      </div>
    );
  }

  const axiosConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  useEffect(() => {
    axios
      .get('http://localhost:8000/exceptions/', axiosConfig)
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
      .patch(
        `http://localhost:8000/exceptions/${ex.exception_id}`,
        { exception_status: 'acknowledged' },
        axiosConfig
      )
      .then(() =>
        refreshException(ex.exception_id, { exception_status: 'acknowledged' })
      )
      .catch((err) => alert('❌ Failed to acknowledge: ' + err.message));
  };

  const handleReassignDriver = (ex) => {
    const newDriverId = prompt('Enter new Driver ID for Trip ' + ex.trip_id);
    if (!newDriverId) return;
    axios
      .patch(
        `http://localhost:8000/trips/${ex.trip_id}`,
        { driver_id: newDriverId },
        axiosConfig
      )
      .then(() => alert('✅ Driver reassigned!'))
      .catch((err) => alert('❌ Failed to reassign driver: ' + err.message));
  };

  const handleNotifyDepot = (ex) => {
    axios
      .post(
        `http://localhost:8000/exceptions/${ex.exception_id}/notify_depot`,
        {},
        axiosConfig
      )
      .then(() => alert('✅ Depot notified'))
      .catch((err) => alert('❌ Failed to notify depot: ' + err.message));
  };

  const handleSortChange = (e) => {
    const key = e.target.value;
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getFilteredAndSortedExceptions = () => {
    let filtered = [...exceptions];
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (ex) =>
          ex.exception_type.toLowerCase().includes(query) ||
          ex.trip_id.toLowerCase().includes(query) ||
          ex.exception_status.toLowerCase().includes(query)
      );
    }

    const { key, direction } = sortConfig;
    if (key) {
      filtered.sort((a, b) => {
        const aVal = a[key];
        const bVal = b[key];
        if (aVal < bVal) return direction === 'asc' ? -1 : 1;
        if (aVal > bVal) return direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <div className="h-screen flex flex-col">
      <div className="h-16 w-full bg-white shadow z-10">
        <Navbar />
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className="w-64 bg-white shadow h-full overflow-y-auto">
          <Sidebar />
        </div>

        <main className="flex-1 p-8 bg-gray-50 overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Active Exceptions</h1>
          </div>

          {/* Search and Sort Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
            <div className="relative w-full sm:w-1/3">
              <input
                type="text"
                placeholder="Search by Type, Trip ID, Status..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full border border-gray-300 rounded-md pl-10 pr-4 py-2"
              />
              <Search className="absolute top-2.5 left-3 w-5 h-5 text-gray-400" />
            </div>

            <select
              className="bg-pink-100 px-4 py-2 rounded-md"
              value={sortConfig.key}
              onChange={handleSortChange}
            >
              <option value="">Sort by</option>
              <option value="exception_type">Exception Type</option>
              <option value="trip_id">Trip ID</option>
              <option value="date_stamp">Date</option>
              <option value="exception_status">Status</option>
            </select>
          </div>

          {/* Exception Table */}
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
                {getFilteredAndSortedExceptions().map((ex) => (
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
                        {ex.exception_status.charAt(0).toUpperCase() +
                          ex.exception_status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-blue-600 space-x-3 text-sm whitespace-nowrap">
                      <button
                        className="hover:underline"
                        onClick={() => handleAcknowledge(ex)}
                      >
                        Acknowledge
                      </button>
                      <span>|</span>
                      <button
                        className="hover:underline"
                        onClick={() => handleReassignDriver(ex)}
                      >
                        Reassign Driver
                      </button>
                      <span>|</span>
                      <button
                        className="hover:underline"
                        onClick={() => handleNotifyDepot(ex)}
                      >
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


// import React, { useState, useEffect } from 'react';
// import Sidebar from './sidebar';
// import Navbar from './navbar';
// import { Search } from 'lucide-react';

// const DUMMY_EXCEPTIONS = [
//   {
//     exception_id: 'ex1',
//     exception_type: 'Fuel Leak',
//     trip_id: 'TR-1001',
//     date_stamp: '2025-07-01T09:15:00Z',
//     exception_status: 'pending',
//   },
//   {
//     exception_id: 'ex2',
//     exception_type: 'Delay',
//     trip_id: 'TR-1002',
//     date_stamp: '2025-07-01T11:30:00Z',
//     exception_status: 'acknowledged',
//   },
//   {
//     exception_id: 'ex3',
//     exception_type: 'Equipment Failure',
//     trip_id: 'TR-1003',
//     date_stamp: '2025-07-02T08:45:00Z',
//     exception_status: 'pending',
//   },
//   {
//     exception_id: 'ex4',
//     exception_type: 'Driver Absence',
//     trip_id: 'TR-1004',
//     date_stamp: '2025-07-02T14:00:00Z',
//     exception_status: 'acknowledged',
//   },
// ];

// export default function AdminExceptions() {
//   const [exceptions, setExceptions] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [sortConfig, setSortConfig] = useState({ key: '', direction: 'asc' });
//   const [searchQuery, setSearchQuery] = useState('');

//   // Simulate loading dummy data on mount
//   useEffect(() => {
//     setTimeout(() => {
//       setExceptions(DUMMY_EXCEPTIONS);
//       setLoading(false);
//     }, 500); // simulate delay
//   }, []);

//   // Dummy handlers simulate success and update local state
//   const refreshException = (id, updated) => {
//     setExceptions((prev) =>
//       prev.map((ex) => (ex.exception_id === id ? { ...ex, ...updated } : ex))
//     );
//   };

//   const handleAcknowledge = (ex) => {
//     if (ex.exception_status === 'acknowledged') return;
//     // Simulate API delay
//     setTimeout(() => {
//       refreshException(ex.exception_id, { exception_status: 'acknowledged' });
//       alert('✅ Exception acknowledged');
//     }, 500);
//   };

//   const handleReassignDriver = (ex) => {
//     const newDriverId = prompt('Enter new Driver ID for Trip ' + ex.trip_id);
//     if (!newDriverId) return;
//     setTimeout(() => {
//       alert(`✅ Driver reassigned to ${newDriverId}`);
//     }, 500);
//   };

//   const handleNotifyDepot = (ex) => {
//     setTimeout(() => {
//       alert('✅ Depot notified');
//     }, 500);
//   };

//   const handleSortChange = (e) => {
//     const key = e.target.value;
//     let direction = 'asc';
//     if (sortConfig.key === key && sortConfig.direction === 'asc') {
//       direction = 'desc';
//     }
//     setSortConfig({ key, direction });
//   };

//   const getFilteredAndSortedExceptions = () => {
//     let filtered = [...exceptions];
//     if (searchQuery.trim() !== '') {
//       const query = searchQuery.toLowerCase();
//       filtered = filtered.filter(
//         (ex) =>
//           ex.exception_type.toLowerCase().includes(query) ||
//           ex.trip_id.toLowerCase().includes(query) ||
//           ex.exception_status.toLowerCase().includes(query)
//       );
//     }

//     const { key, direction } = sortConfig;
//     if (key) {
//       filtered.sort((a, b) => {
//         const aVal = a[key];
//         const bVal = b[key];
//         if (aVal < bVal) return direction === 'asc' ? -1 : 1;
//         if (aVal > bVal) return direction === 'asc' ? 1 : -1;
//         return 0;
//       });
//     }

//     return filtered;
//   };

//   if (loading) {
//     return <div className="flex items-center justify-center h-screen">Loading...</div>;
//   }

//   return (
//     <div className="h-screen flex flex-col">
//       <div className="h-16 w-full bg-white shadow z-10">
//         <Navbar />
//       </div>

//       <div className="flex flex-1 overflow-hidden">
//         <div className="w-64 bg-white shadow h-full overflow-y-auto">
//           <Sidebar />
//         </div>

//         <main className="flex-1 p-8 bg-gray-50 overflow-y-auto">
//           <div className="flex justify-between items-center mb-6">
//             <h1 className="text-2xl font-bold">Active Exceptions</h1>
//           </div>

//           {/* Search and Sort Controls */}
//           <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
//             <div className="relative w-full sm:w-1/3">
//               <input
//                 type="text"
//                 placeholder="Search by Type, Trip ID, Status..."
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 className="w-full border border-gray-300 rounded-md pl-10 pr-4 py-2"
//               />
//               <Search className="absolute top-2.5 left-3 w-5 h-5 text-gray-400" />
//             </div>

//             <select
//               className="bg-pink-100 px-4 py-2 rounded-md"
//               value={sortConfig.key}
//               onChange={handleSortChange}
//             >
//               <option value="">Sort by</option>
//               <option value="exception_type">Exception Type</option>
//               <option value="trip_id">Trip ID</option>
//               <option value="date_stamp">Date</option>
//               <option value="exception_status">Status</option>
//             </select>
//           </div>

//           {/* Exception Table */}
//           <div className="bg-white rounded-xl shadow overflow-x-auto">
//             <table className="min-w-full text-sm text-left">
//               <thead className="bg-gray-100 text-gray-700 font-semibold">
//                 <tr>
//                   <th className="px-6 py-4">Exception Type</th>
//                   <th className="px-6 py-4">Trip ID</th>
//                   <th className="px-6 py-4">Timestamp</th>
//                   <th className="px-6 py-4">Status</th>
//                   <th className="px-6 py-4 text-center">Actions</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-gray-200">
//                 {getFilteredAndSortedExceptions().map((ex) => (
//                   <tr key={ex.exception_id} className="hover:bg-gray-50">
//                     <td className="px-6 py-4">{ex.exception_type}</td>
//                     <td className="px-6 py-4">{ex.trip_id}</td>
//                     <td className="px-6 py-4">
//                       {new Date(ex.date_stamp).toLocaleString()}
//                     </td>
//                     <td className="px-6 py-4">
//                       <span
//                         className={`px-3 py-1 rounded-full text-xs font-medium ${
//                           ex.exception_status === 'pending'
//                             ? 'bg-yellow-100 text-yellow-800'
//                             : 'bg-green-100 text-green-800'
//                         }`}
//                       >
//                         {ex.exception_status.charAt(0).toUpperCase() +
//                           ex.exception_status.slice(1)}
//                       </span>
//                     </td>
//                     <td className="px-6 py-4 text-blue-600 space-x-3 text-sm whitespace-nowrap">
//                       <button
//                         className="hover:underline"
//                         onClick={() => handleAcknowledge(ex)}
//                       >
//                         Acknowledge
//                       </button>
//                       <span>|</span>
//                       <button
//                         className="hover:underline"
//                         onClick={() => handleReassignDriver(ex)}
//                       >
//                         Reassign Driver
//                       </button>
//                       <span>|</span>
//                       <button
//                         className="hover:underline"
//                         onClick={() => handleNotifyDepot(ex)}
//                       >
//                         Notify Depot
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// }
