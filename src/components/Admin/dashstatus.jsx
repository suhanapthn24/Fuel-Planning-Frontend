// // import React from 'react';

// // const circleColor = {
// //   red: 'bg-red-100 text-red-500',
// //   yellow: 'bg-yellow-100 text-yellow-500',
// //   green: 'bg-green-100 text-green-500',
// //   purple: 'bg-purple-100 text-purple-500',
// // };

// // const metrics = [
// //   { label: 'Critical Stations', percent: 25, color: 'red' },
// //   { label: 'Dry-Stock Stations', percent: 38, color: 'purple' },
// //   { label: 'Maintenance-Due Vehicles', percent: 15, color: 'green' },
// //   { label: 'Trips at Risk', percent: 5, color: 'yellow' },
// // ];

// // export default function DashboardStatusCircles() {
// //   return (
// //     <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8">
// //       {metrics.map((metric, index) => (
// //         <div
// //           key={index}
// //           className="bg-white rounded-xl shadow p-4 flex flex-col items-center justify-center"
// //         >
// //           <div
// //             className={`w-20 h-20 rounded-full flex items-center justify-center text-xl font-bold ${circleColor[metric.color]}`}
// //           >
// //             {metric.percent}%
// //           </div>
// //           <p className="mt-3 text-center text-sm font-medium text-gray-700">{metric.label}</p>
// //         </div>
// //       ))}
// //     </div>
// //   );
// // }

// import React from 'react';

// const circleColor = {
//   red: 'bg-red-100 text-red-500',
//   yellow: 'bg-yellow-100 text-yellow-500',
//   green: 'bg-green-100 text-green-500',
//   purple: 'bg-purple-100 text-purple-500',
// };

// const metrics = [
//   { label: 'Critical Stations', percent: 25, color: 'red' },
//   { label: 'Dry-Stock Stations', percent: 38, color: 'purple' },
//   { label: 'Maintenance-Due Vehicles', percent: 15, color: 'green' },
//   { label: 'Trips at Risk', percent: 5, color: 'yellow' },
// ];

// export default function DashboardStatusCircles() {
//   return (
//     <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8">
//       {metrics.map((metric, index) => (
//         <div
//           key={index}
//           className="bg-white rounded-xl shadow p-4 flex flex-col items-center justify-center"
//         >
//           <div
//             className={`w-20 h-20 rounded-full flex items-center justify-center text-xl font-bold ${circleColor[metric.color]}`}
//           >
//             {metric.percent}%
//           </div>
//           <p className="mt-3 text-center text-sm font-medium text-gray-700">{metric.label}</p>
//         </div>
//       ))}
//     </div>
//   );
// }

// import React, { useEffect, useState } from "react";
// import { formatDistanceToNow, parseISO } from "date-fns";

// const API_BASE =
//   import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

// export default function PredictiveModels() {
//   const [criticalStations, setCriticalStations] = useState([]);
//   const [tripRisks, setTripRisks] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   /* ─────────── Fetch both prediction lists in parallel ─────────── */
//   useEffect(() => {
//     async function fetchData() {
//       try {
//         const [critRes, tripRes] = await Promise.all([
//           fetch(`${API_BASE}/predictions/stations-critical`),
//           fetch(`${API_BASE}/predictions/trips-risk`),
//         ]);

//         if (!critRes.ok || !tripRes.ok) throw new Error("Network error");

//         const [critData, tripData] = await Promise.all([
//           critRes.json(),
//           tripRes.json(),
//         ]);

//         setCriticalStations(critData);   // ⚡ map if your field names differ
//         setTripRisks(tripData);          // ⚡ map if your field names differ
//       } catch (e) {
//         console.error(e);
//         setError("Failed to load predictions.");
//       } finally {
//         setLoading(false);
//       }
//     }

//     fetchData();
//   }, []);

//   /* ─────────── Render helpers ─────────── */

//   const renderCritical = () => (
//     <div>
//       <h3 className="text-md font-semibold mb-2">Stations Approaching Critical Level</h3>
//       {criticalStations.length === 0 ? (
//         <p className="text-sm text-gray-500">No stations at risk.</p>
//       ) : (
//         <ul className="space-y-2 max-h-[260px] overflow-y-auto pr-1">
//           {criticalStations.map((s) => (
//             <li
//               key={s.station_id}
//               className="border rounded p-3 flex flex-col hover:bg-gray-50 cursor-pointer transition"
//             >
//               <span className="font-semibold">{s.station_name}</span>
//               <span className="text-sm">
//                 Runs out&nbsp;
//                 <strong>
//                   {formatDistanceToNow(parseISO(s.run_out_eta), {
//                     addSuffix: true,
//                   })}
//                 </strong>
//               </span>
//               <span className="text-sm">
//                 Trip scheduled:&nbsp;
//                 <span
//                   className={
//                     s.trip_scheduled ? "text-green-600" : "text-red-500"
//                   }
//                 >
//                   {s.trip_scheduled ? "Yes" : "No"}
//                 </span>
//               </span>
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );

//   const renderTrips = () => (
//     <div>
//       <h3 className="text-md font-semibold mb-2">Trips at Risk</h3>
//       {tripRisks.length === 0 ? (
//         <p className="text-sm text-gray-500">No trips flagged.</p>
//       ) : (
//         <ul className="space-y-2 max-h-[260px] overflow-y-auto pr-1">
//           {tripRisks.map((t) => (
//             <li
//               key={t.trip_id}
//               className="border rounded p-3 flex flex-col hover:bg-gray-50 cursor-pointer transition"
//             >
//               <span className="font-semibold">Trip {t.trip_id}</span>
//               <span className="text-sm">{t.route}</span>
//               <span className="text-sm">
//                 Risk:&nbsp;
//                 <span
//                   className={
//                     t.risk_score >= 0.7
//                       ? "text-red-600"
//                       : t.risk_score >= 0.4
//                       ? "text-yellow-500"
//                       : "text-green-600"
//                   }
//                 >
//                   {(t.risk_score * 100).toFixed(0)}%
//                 </span>
//               </span>
//               <span className="text-sm">
//                 Start&nbsp;
//                 {formatDistanceToNow(parseISO(t.scheduled_start), {
//                   addSuffix: true,
//                 })}
//               </span>
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );

//   /* ─────────── Final render ─────────── */
//   return (
//     <section className="flex-1 bg-white rounded-lg shadow p-6 min-w-0">
//       <h2 className="text-lg font-semibold mb-4">Predictive Insights</h2>

//       {loading ? (
//         <p>Loading predictions…</p>
//       ) : error ? (
//         <p className="text-red-600">{error}</p>
//       ) : (
//         <div className="space-y-6">
//           {renderCritical()}
//           {renderTrips()}
//         </div>
//       )}
//     </section>
//   );
// }

// import React from "react";
// import { formatDistanceToNow, parseISO } from "date-fns";

// export default function PredictiveModels() {
//   const criticalStations = [
//     {
//       station_id: "ST‑009",
//       station_name: "North Harbour",
//       run_out_eta: "2025-07-03T06:30:00Z",
//       trip_scheduled: false,
//     },
//     {
//       station_id: "ST‑012",
//       station_name: "Westside Express",
//       run_out_eta: "2025-07-03T14:15:00Z",
//       trip_scheduled: true,
//     },
//   ];

//   const tripRisks = [
//     {
//       trip_id: "TR‑1017",
//       route: "Depot‑3 ➜ Station 9",
//       risk_score: 0.78,
//       scheduled_start: "2025-07-02T22:00:00Z",
//     },
//     {
//       trip_id: "TR‑1021",
//       route: "Depot‑1 ➜ Station 14",
//       risk_score: 0.46,
//       scheduled_start: "2025-07-03T03:00:00Z",
//     },
//     {
//       trip_id: "TR‑1033",
//       route: "Depot‑2 ➜ Station 4",
//       risk_score: 0.29,
//       scheduled_start: "2025-07-03T05:30:00Z",
//     },
//   ];

//   const renderCritical = () => (
//     <div className="flex-1">
//       <h3 className="text-md font-semibold mb-2">
//         Stations Approaching Critical Level
//       </h3>
//       {criticalStations.length === 0 ? (
//         <p className="text-sm text-gray-500">No stations at risk.</p>
//       ) : (
//         <ul className="space-y-2 max-h-[260px] overflow-y-auto pr-1">
//           {criticalStations.map((s) => (
//             <li
//               key={s.station_id}
//               className="border rounded p-3 flex flex-col hover:bg-gray-50 cursor-pointer transition"
//             >
//               <span className="font-semibold">{s.station_name}</span>
//               <span className="text-sm">
//                 Runs out&nbsp;
//                 <strong>
//                   {formatDistanceToNow(parseISO(s.run_out_eta), {
//                     addSuffix: true,
//                   })}
//                 </strong>
//               </span>
//               <span className="text-sm">
//                 Trip scheduled:&nbsp;
//                 <span
//                   className={
//                     s.trip_scheduled ? "text-green-600" : "text-red-500"
//                   }
//                 >
//                   {s.trip_scheduled ? "Yes" : "No"}
//                 </span>
//               </span>
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );

//   const renderTrips = () => (
//     <div className="flex-1">
//       <h3 className="text-md font-semibold mb-2">Trips at Risk</h3>
//       {tripRisks.length === 0 ? (
//         <p className="text-sm text-gray-500">No trips flagged.</p>
//       ) : (
//         <ul className="space-y-2 max-h-[260px] overflow-y-auto pr-1">
//           {tripRisks.map((t) => (
//             <li
//               key={t.trip_id}
//               className="border rounded p-3 flex flex-col hover:bg-gray-50 cursor-pointer transition"
//             >
//               <span className="font-semibold">Trip {t.trip_id}</span>
//               <span className="text-sm">{t.route}</span>
//               <span className="text-sm">
//                 Risk:&nbsp;
//                 <span
//                   className={
//                     t.risk_score >= 0.7
//                       ? "text-red-600"
//                       : t.risk_score >= 0.4
//                       ? "text-yellow-500"
//                       : "text-green-600"
//                   }
//                 >
//                   {(t.risk_score * 100).toFixed(0)}%
//                 </span>
//               </span>
//               <span className="text-sm">
//                 Start&nbsp;
//                 {formatDistanceToNow(parseISO(t.scheduled_start), {
//                   addSuffix: true,
//                 })}
//               </span>
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );

//   return (
//     <section className="flex-1 bg-white rounded-lg shadow p-6 min-w-0">
//       <h2 className="text-lg font-semibold mb-4">Predictive Insights</h2>
//       <div className="flex space-x-6">
//         {renderCritical()}
//         {renderTrips()}
//       </div>
//     </section>
//   );
// }

import React, { useEffect, useState } from "react";
import { formatDistanceToNow, parseISO } from "date-fns";

export default function PredictiveModels() {
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchCriticalStations() {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch("http://localhost:8000/api/stations/critical_ml");
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const data = await response.json();
        setStations(data.stations || []);
      } catch (err) {
        console.error(err);
        setError("Failed to load critical stations.");
      } finally {
        setLoading(false);
      }
    }

    fetchCriticalStations();
  }, []);

  if (loading) return <p>Loading stations...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <section className="flex-1 bg-white rounded-lg shadow p-6 min-w-0">
      <h2 className="text-lg font-semibold mb-4">Stations Approaching Critical Level</h2>
      {stations.length === 0 ? (
        <p className="text-sm text-gray-500">No stations at risk.</p>
      ) : (
        <ul className="space-y-2 max-h-[260px] overflow-y-auto pr-1">
          {stations.map((s) => (
            <li
              key={s.station_id}
              className="border rounded p-3 flex flex-col hover:bg-gray-50 cursor-pointer transition"
            >
              <span className="font-semibold">{s.station_id}</span>
              <span className="text-sm">
                Current fuel level: <strong>{s.current_l} L</strong>
              </span>
              <span className="text-sm">
                Probability critical next 24h:{" "}
                <strong>{(s.prob_crit_24h * 100).toFixed(2)}%</strong>
              </span>
              <span className={`text-sm ${s.will_breach ? "text-red-600" : "text-green-600"}`}>
                {s.will_breach ? "At risk" : "Safe"}
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

