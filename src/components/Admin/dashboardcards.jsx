import React, { useEffect, useState } from "react";
import {
  CircularProgressbar,
  buildStyles,
} from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useNavigate } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

function RingCard({ title, count, tint = "#60a5fa", onClick }) {
  return (
    <button
      onClick={onClick}
      className="relative isolate w-full max-w-[180px] h-[200px] p-5 bg-white/30 backdrop-blur-lg border border-white/40 rounded-3xl flex flex-col items-center justify-center shadow-md hover:shadow-xl transition-all duration-300 group focus:outline-none"
    >
      {/* Shine on hover */}
      <span className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Ring chart */}
      <div className="w-[80px] h-[80px]">
        <CircularProgressbar
          value={75}
          text={
            count === null ? "–" : count === -1 ? "!" : `${count}`
          }
          strokeWidth={2}  // thinner stroke here
          styles={buildStyles({
            pathColor: tint,
            trailColor: "rgba(0,0,0,0.1)",
            strokeLinecap: "round",
            textColor: "#374151",
            textSize: "20px",
          })}
        />
      </div>

      {/* Title */}
      <p className="mt-4 text-center text-[14px] font-semibold text-gray-600 tracking-wide">
        {title}
      </p>
    </button>
  );
}

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
  if (error) return { count: -1, tint: "#fca5a5" }; // muted red
  return { count, tint: null };
}

function ActiveDepotCard() {
  const { count, tint } = useCount("/depots/");
  const navigate = useNavigate();
  return (
    <RingCard
      title="Active Depots"
      count={count}
      tint={tint || "#fbbf24"} // muted amber
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
      tint={tint || "#60a5fa"} // muted blue (same as original)
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
      tint={tint || "#86efac"} // muted green pastel
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
      tint={tint || "#fca5a5"} // muted red pastel
      onClick={() => navigate("/exceptions")}
    />
  );
}

export default function DashboardCards() {
  return (
    <div className="grid grid-cols-2 gap-10 max-w-xl mx-auto mt-10">
      <ActiveDepotCard />
      <ActiveDriverCard />
      <TotalStationsCard />
      <ExceptionAlertsCard />
    </div>
  );
}
