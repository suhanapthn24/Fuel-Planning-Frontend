import React, { useState, useEffect } from "react";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

const endpointMap = {
  today: {
    url: `${API_BASE}/stations/expiring/today`,
    label: "Expiring Today",
    description: "Stations due to expire today.",
  },
  thisweek: {
    url: `${API_BASE}/stations/expiring/thisweek`,
    label: "Expiring This Week",
    description: "Stations due to expire within this week.",
  },
  predictedThreshold: {
    url: `${API_BASE}/stations/predicted/threshold?days=30`,
    label: "Predicted Threshold (30 days)",
    description: "Stations predicted to reach threshold in next 30 days.",
  },
  critical: {
    url: `${API_BASE}/stations/critical?threshold_days=5`,
    label: "Critical Stations (5 days)",
    description: "Stations critical within 5 days threshold.",
  },
};

function StationListTooltip({ stations }) {
  return (
    <div className="absolute z-50 top-full mt-2 left-1/2 -translate-x-1/2 w-72 max-h-64 overflow-auto rounded-lg bg-black bg-opacity-90 p-4 text-xs text-white shadow-lg">
      <ul className="space-y-2">
        {stations.map((station) => (
          <li key={station.station_id || station.id} className="break-words">
            <strong>{station.site_name}</strong>
            <br />
            Days to threshold:{" "}
            {station.days_until_threshold
              ? station.days_until_threshold.toFixed(1)
              : "N/A"}
          </li>
        ))}
      </ul>
    </div>
  );
}

function RingCard({ title, count, tint = "#60a5fa", stations = [] }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="relative isolate w-[160px] h-[200px] p-6 bg-white rounded-3xl flex flex-col items-center justify-center shadow-md cursor-pointer transition-shadow duration-300 hover:shadow-xl"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Circular ring */}
      <svg viewBox="0 0 36 36" className="w-20 h-20 mb-5">
        <path
          className="text-gray-200"
          d="M18 2.0845
              a 15.9155 15.9155 0 0 1 0 31.831
              a 15.9155 15.9155 0 0 1 0 -31.831"
          fill="none"
          stroke="#e5e7eb"
          strokeWidth="3"
        />
        <path
          stroke={tint}
          strokeWidth="3"
          strokeDasharray={`${count}, 100`}
          strokeLinecap="round"
          fill="none"
          d="M18 2.0845
              a 15.9155 15.9155 0 0 1 0 31.831
              a 15.9155 15.9155 0 0 1 0 -31.831"
        />
        <text
          x="18"
          y="20.35"
          className="text-gray-800 text-xl font-semibold"
          textAnchor="middle"
          alignmentBaseline="central"
        >
          {count}
        </text>
      </svg>

      <p className="text-center text-lg font-semibold text-gray-600">{title}</p>

      {/* Tooltip on hover */}
      {isHovered && stations.length > 0 && <StationListTooltip stations={stations} />}
    </div>
  );
}

export default function PredictiveStations() {
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeView, setActiveView] = useState("today");

  useEffect(() => {
    setLoading(true);
    setError(null);
    const fetchData = async () => {
      try {
        const { url } = endpointMap[activeView];
        const res = await axios.get(url);
        setPredictions(res.data);
      } catch (err) {
        console.error("Failed to fetch station data:", err);
        setError("Failed to load data.");
        setPredictions([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [activeView]);

  const atRiskStations = predictions.filter((p) => p.will_reach_threshold);
  const stableStations = predictions.filter((p) => !p.will_reach_threshold);

  return (
    <div className="p-8 bg-gray-50 min-h-screen max-w-7xl mx-auto">
      <h1 className="text-4xl font-extrabold mb-10 text-gray-800 text-center">
        🚨 Predictive Fuel Risk Dashboard
      </h1>

      {/* View selector */}
      <div className="flex flex-wrap justify-center gap-5 mb-10">
        {Object.entries(endpointMap).map(([key, { label }]) => (
          <button
            key={key}
            onClick={() => setActiveView(key)}
            className={`px-6 py-2 rounded-lg font-semibold transition-shadow duration-300 focus:outline-none ${
              activeView === key
                ? "bg-blue-600 text-white shadow-lg"
                : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-100"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <p className="text-center mb-12 text-gray-600 font-medium max-w-xl mx-auto">
        {endpointMap[activeView].description}
      </p>

      {loading ? (
        <div className="text-center mt-20 text-lg font-semibold text-gray-700">
          Loading station data...
        </div>
      ) : error ? (
        <div className="text-center mt-20 text-lg font-semibold text-red-600">
          {error}
        </div>
      ) : (
        <>
          {/* Summary rings */}
          <div className="flex justify-center gap-12 mb-16 flex-wrap">
            <RingCard
              title="At Risk"
              count={atRiskStations.length}
              tint="#fca5a5" // muted red pastel
              stations={atRiskStations}
            />
            <RingCard
              title="Stable"
              count={stableStations.length}
              tint="#6ee7b7" // muted green pastel
              stations={stableStations}
            />
            <RingCard
              title="Total"
              count={predictions.length}
              tint="#93c5fd" // muted blue pastel
              stations={predictions}
            />
          </div>
        </>
      )}
    </div>
  );
}
