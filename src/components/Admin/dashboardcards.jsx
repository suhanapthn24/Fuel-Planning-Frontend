// import React from "react";

// function Card({ title, count, change, changeColor }) {
//   return (
//     <div className="bg-white rounded-xl shadow p-4">
//       <h3 className="text-sm font-semibold text-gray-600">{title}</h3>
//       <div className="flex items-center justify-between mt-2">
//         <span className="text-2xl font-bold text-gray-800">
//           {count !== null ? count : "–"}
//         </span>
//         {/* <span className={`text-sm font-semibold ${changeColor}`}>
//           {change !== null ? (change >= 0 ? `+${change}%` : `${change}%`) : ""}
//         </span> */}
//       </div>
//     </div>
//   );
// }

// function ActiveDepotCard() {
//   const [count, setCount] = React.useState(null);
//   const [loading, setLoading] = React.useState(true);
//   const [error, setError] = React.useState(null);

//   React.useEffect(() => {
//     fetch("http://127.0.0.1:8000/depots/")
//       .then((res) => {
//         if (!res.ok) throw new Error("Network error");
//         return res.json();
//       })
//       .then((data) => setCount(data.length || 0))
//       .catch(() => setError("Failed to load"))
//       .finally(() => setLoading(false));
//   }, []);

//   if (loading)
//     return <Card title="Active Depot" count="..." changeColor="text-orange-500" />;
//   if (error)
//     return <Card title="Active Depot" count="Error" changeColor="text-red-500" />;

//   return <Card title="Active Depot" count={count} changeColor="text-orange-500" />;
// }

// function ActiveDriverCard() {
//   const [count, setCount] = React.useState(null);
//   const [loading, setLoading] = React.useState(true);
//   const [error, setError] = React.useState(null);

//   React.useEffect(() => {
//     fetch("http://127.0.0.1:8000/drivers/")
//       .then((res) => {
//         if (!res.ok) throw new Error("Network error");
//         return res.json();
//       })
//       .then((data) => setCount(data.length || 0))
//       .catch(() => setError("Failed to load"))
//       .finally(() => setLoading(false));
//   }, []);

//   if (loading)
//     return <Card title="Active Driver" count="..." changeColor="text-blue-500" />;
//   if (error)
//     return <Card title="Active Driver" count="Error" changeColor="text-red-500" />;

//   return <Card title="Active Driver" count={count} changeColor="text-blue-500" />;
// }

// function TotalStationsCard() {
//   const [count, setCount] = React.useState(null);
//   const [loading, setLoading] = React.useState(true);
//   const [error, setError] = React.useState(null);

//   React.useEffect(() => {
//     fetch("http://127.0.0.1:8000/stations/")
//       .then((res) => {
//         if (!res.ok) throw new Error("Network error");
//         return res.json();
//       })
//       .then((data) => setCount(data.length || 0))
//       .catch(() => setError("Failed to load"))
//       .finally(() => setLoading(false));
//   }, []);

//   if (loading)
//     return <Card title="Total Stations" count="..." changeColor="text-green-500" />;
//   if (error)
//     return <Card title="Total Stations" count="Error" changeColor="text-red-500" />;

//   return <Card title="Total Stations" count={count} changeColor="text-green-500" />;
// }

// function ExceptionAlertsCard() {
//   const [count, setCount] = React.useState(null);
//   const [loading, setLoading] = React.useState(true);
//   const [error, setError] = React.useState(null);

//   React.useEffect(() => {
//     fetch("http://127.0.0.1:8000/exceptions/")
//       .then((res) => {
//         if (!res.ok) throw new Error("Network error");
//         return res.json();
//       })
//       .then((data) => setCount(data.length || 0))
//       .catch(() => setError("Failed to load"))
//       .finally(() => setLoading(false));
//   }, []);

//   if (loading)
//     return <Card title="Exception Alerts" count="..." changeColor="text-red-500" />;
//   if (error)
//     return <Card title="Exception Alerts" count="0" changeColor="text-red-500" />;

//   return <Card title="Exception Alerts" count={count} changeColor="text-red-500" />;
// }

// export default function DashboardCards() {
//   return (
//     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//       <ActiveDepotCard />
//       <ActiveDriverCard />
//       <TotalStationsCard />
//       <ExceptionAlertsCard />
//     </div>
//   );
// }

// // export default function DashboardCards() {
// //   return (
// //     <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-10 px-4">
// //       <ActiveDepotCard />
// //       <ActiveDriverCard />
// //       <TotalStationsCard />
// //       <ExceptionAlertsCard />
// //     </div>
// //   );
// // }

import React, { useEffect, useState } from "react";
import {
  CircularProgressbar,
  buildStyles,
} from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useNavigate } from "react-router-dom";

// Base URL for your FastAPI backend
const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

// ───────────────────────────────────────────────────────────────
// Reusable Ring Card
function RingCard({ title, count, tint = "#60a5fa", onClick }) {
  return (
    <button
      onClick={onClick}
      className="relative isolate w-full max-w-[200px] h-[230px] p-6 bg-white/30 backdrop-blur-lg border border-white/40 rounded-3xl flex flex-col items-center justify-center shadow-md hover:shadow-xl transition-all duration-300 group focus:outline-none"
    >
      {/* Shine on hover */}
      <span className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      {/* Ring chart */}
      <div className="w-[84px] h-[84px]">
        <CircularProgressbar
          value={75}
          text={
            count === null
              ? "–"
              : count === -1
              ? "!"
              : `${count}`
          }
          styles={buildStyles({
            pathColor: tint,
            trailColor: "rgba(0,0,0,0.08)",
            strokeLinecap: "round",
            textColor: "#1f2937",
            textSize: "20px",
          })}
        />
      </div>

      {/* Title */}
      <p className="mt-5 text-center text-[14px] font-semibold text-gray-700 tracking-wide">
        {title}
      </p>
    </button>
  );
}

// ───────────────────────────────────────────────────────────────
// Reusable data-fetch hook
function useCount(endpoint) {
  const [count, setCount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let isMounted = true;
    fetch(`${API_BASE}${endpoint}`)
      .then((res) => {
        if (!res.ok) throw new Error("Network error");
        return res.json();
      })
      .then((data) => isMounted && setCount(data.length || 0))
      .catch(() => isMounted && setError(true))
      .finally(() => isMounted && setLoading(false));
    return () => (isMounted = false);
  }, [endpoint]);

  if (loading) return { count: null, tint: "#9ca3af" };
  if (error) return { count: -1, tint: "#ef4444" };
  return { count, tint: null };
}

// ───────────────────────────────────────────────────────────────
// Individual Cards
function ActiveDepotCard() {
  const { count, tint } = useCount("/depots/");
  const navigate = useNavigate();
  return (
    <RingCard
      title="Active Depots"
      count={count}
      tint={tint || "#fb923c"}
      onClick={() => navigate("/depots")}
    />
  );
}

function ActiveDriverCard() {
  const { count, tint } = useCount("/drivers/");
  const navigate = useNavigate();
  return (
    <RingCard
      title="Active Drivers"
      count={count}
      tint={tint || "#60a5fa"}
      onClick={() => navigate("/drivers")}
    />
  );
}

function TotalStationsCard() {
  const { count, tint } = useCount("/stations/");
  const navigate = useNavigate();
  return (
    <RingCard
      title="Total Stations"
      count={count}
      tint={tint || "#34d399"}
      onClick={() => navigate("/stations")}
    />
  );
}

function ExceptionAlertsCard() {
  const { count, tint } = useCount("/exceptions/");
  const navigate = useNavigate();
  return (
    <RingCard
      title="Exception Alerts"
      count={count || 0}
      tint={tint || "#f87171"}
      onClick={() => navigate("/exceptions")}
    />
  );
}

// ───────────────────────────────────────────────────────────────
// Main Dashboard Layout
export default function DashboardCards() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-8 place-items-center px-4 mt-10">
      <ActiveDepotCard />
      <ActiveDriverCard />
      <TotalStationsCard />
      <ExceptionAlertsCard />
    </div>
  );
}
