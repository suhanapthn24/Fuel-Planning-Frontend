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
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { CheckCircle2 } from "lucide-react";

// Base URL for API
const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

// Generate a color on a green(0)→yellow(50)→red(100) scale
function getColor(percent) {
  const hue = Math.round((1 - percent / 100) * 120); // 120° green to 0° red
  return `hsl(${hue}, 100%, 40%)`;
}

// Reusable RingCard for predictive models
function RingCard({ title, count, percent = 0, onClick }) {
  const displayPercent = count === 0 ? 100 : percent;
  // Safe case always green
  const tint = count === 0 ? "#22c55e" : getColor(displayPercent);

  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center bg-white rounded-2xl shadow-lg p-8 max-w-xs w-full hover:shadow-xl transition-shadow"
    >
      <div className="w-32 h-32">
        <CircularProgressbar
          value={displayPercent}
          text={
            count === 0 ? (
              <CheckCircle2 className="w-10 h-10 text-green-500" />
            ) : (
              `${count}`
            )
          }
          styles={buildStyles({
            pathColor: tint,
            trailColor: "#e5e7eb",
            strokeLinecap: "round",
            textColor: tint,
            textSize: "28px",
          })}
        />
      </div>
      <span className="mt-4 text-xl font-semibold text-gray-800">{title}</span>
    </button>
  );
}

export default function PredictiveModels() {
  const [stations, setStations] = useState([]);
  const [loadingStations, setLoadingStations] = useState(true);
  const [errorStations, setErrorStations] = useState(false);
  const [trucks, setTrucks] = useState([]);
  const [loadingTrucks, setLoadingTrucks] = useState(true);
  const [errorTrucks, setErrorTrucks] = useState(false);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    const fetchData = async (endpoint, setter, setLoading, setError) => {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE}${endpoint}`);
        if (!res.ok) throw new Error();
        const data = await res.json();
        setter(data.stations || data.trucks || []);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchData(
      "/api/stations/critical_ml",
      setStations,
      setLoadingStations,
      setErrorStations
    );
    fetchData(
      "/api/trucks/maintainance_ml",
      setTrucks,
      setLoadingTrucks,
      setErrorTrucks
    );
  }, []);

  const totalStations = stations.length;
  const riskStations = stations.filter((s) => s.will_breach).length;
  const stationPercent = totalStations
    ? Math.round((riskStations / totalStations) * 100)
    : 0;

  const totalTrucks = trucks.length;
  const riskTrucks = trucks.filter((t) => t.will_need_maint).length;
  const truckPercent = totalTrucks
    ? Math.round((riskTrucks / totalTrucks) * 100)
    : 0;

  const toggle = (key) => setExpanded((prev) => (prev === key ? null : key));

  return (
    <div className="space-y-8 px-4">
      {/* Predictive Model Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-8 justify-items-center">
        <RingCard
          title={riskStations > 0 ? "Stations at Risk" : "All Stations Safe"}
          count={riskStations}
          percent={stationPercent}
          onClick={() => riskStations > 0 && toggle("stations")}
        />
        <RingCard
          title={riskTrucks > 0 ? "Trucks at Risk" : "All Trucks Safe"}
          count={riskTrucks}
          percent={truckPercent}
          onClick={() => riskTrucks > 0 && toggle("trucks")}
        />
        <RingCard
          title="Placeholder Model A"
          count={0}
          percent={0}
          onClick={() => {}}
        />
        <RingCard
          title="Placeholder Model B"
          count={0}
          percent={0}
          onClick={() => {}}
        />
      </div>

      {/* Expanded Details */}
      {expanded === "stations" && (
        <section className="bg-white shadow rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">
            Stations Approaching Critical Level
          </h2>
          {loadingStations ? (
            <p>Loading stations…</p>
          ) : errorStations ? (
            <p className="text-red-600">Failed to load stations.</p>
          ) : (
            <ul className="space-y-2 max-h-64 overflow-y-auto">
              {stations
                .filter((s) => s.will_breach)
                .map((s) => (
                  <li
                    key={s.station_id}
                    className="bg-red-50 border rounded p-3"
                  >
                    <p className="font-semibold">{s.station_id}</p>
                    <p className="text-sm">
                      Fuel: <strong>{s.current_l} L</strong>
                    </p>
                    <p className="text-sm">
                      Prob:{" "}
                      <strong>{(s.prob_crit_24h * 100).toFixed(2)}%</strong>
                    </p>
                  </li>
                ))}
            </ul>
          )}
        </section>
      )}

      {expanded === "trucks" && (
        <section className="bg-white shadow rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">
            Trucks Approaching Maintenance
          </h2>
          {loadingTrucks ? (
            <p>Loading trucks…</p>
          ) : errorTrucks ? (
            <p className="text-red-600">Failed to load trucks.</p>
          ) : (
            <ul className="space-y-2 max-h-64 overflow-y-auto">
              {trucks
                .filter((t) => t.will_need_maint)
                .map((t) => (
                  <li key={t.truck_id} className="bg-red-50 border rounded p-3">
                    <p className="font-semibold">Truck {t.truck_id}</p>
                    <p className="text-sm">
                      Mileage: <strong>{t.odometer_km} km</strong>
                    </p>
                    <p className="text-sm">
                      Prob:{" "}
                      <strong>{(t.prob_maint_24h * 100).toFixed(2)}%</strong>
                    </p>
                  </li>
                ))}
            </ul>
          )}
        </section>
      )}
    </div>
  );
}