import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";

export default function Stations() {
  const [stations, setStations] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);
  const [search, setSearch]     = useState("");

  /* ─────────────────────────  fetch once on mount  ─────────────────────── */
  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        setLoading(true);
        setError(null);

        // Optional auth header
        // const token   = localStorage.getItem("token");
        // const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const headers = {};

        const { data } = await axios.get(
          "http://127.0.0.1:8000/stations/",
          { headers }
        );

        console.log("Station data from API:", data);
        if (mounted) setStations(data);
      } catch (err) {
        console.error("Error fetching stations:", err);
        if (mounted) setError("Failed to fetch stations");
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  /* ──────────────────────────  search filter  ──────────────────────────── */
  const filteredStations = useMemo(() => {
    return stations.filter((s) =>
      s.station_name.toLowerCase().includes(search.toLowerCase())
    );
  }, [stations, search]);

  /* ────────────────────────────  render  ───────────────────────────────── */
  return (
    <section className="overflow-y-auto bg-gray-50 p-8 h-full">
      <h1 className="text-2xl font-semibold mb-6">Stations Overview</h1>

      {/* search bar + add btn */}
      <div className="flex flex-wrap gap-4 mb-6 items-center">
        <div className="relative">
          <span className="absolute left-3 top-2.5 text-gray-400">
            <i className="fa fa-search" />
          </span>
          <input
            type="text"
            placeholder="Search By Name"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 pr-4 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-red-500 w-56"
          />
        </div>

        <button
          onClick={() => (window.location.href = "/stations/new")}
          className="ml-auto flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md"
        >
          <i className="fa fa-plus" />
          Add New Station
        </button>
      </div>

      {/* table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        {loading ? (
          <div className="p-8 text-center">Loading…</div>
        ) : error ? (
          <div className="p-8 text-center text-red-600">{error}</div>
        ) : filteredStations.length === 0 ? (
          <div className="p-8 text-center">No stations found.</div>
        ) : (
          <table className="min-w-full text-sm text-gray-700">
            <thead>
              <tr className="border-b bg-gray-100 text-left text-xs uppercase tracking-wider">
                <th className="px-6 py-3 font-semibold">Name</th>
                <th className="px-6 py-3 font-semibold">Capacity</th>
                <th className="px-6 py-3 font-semibold">Operational Window</th>
                <th className="px-6 py-3 font-semibold">Address</th>
                <th className="px-6 py-3 font-semibold">Fuel Types Required</th>
                <th className="px-6 py-3 font-semibold">Depot ID</th>
                <th className="px-6 py-3 font-semibold">Critical Level</th>
                <th className="px-6 py-3 font-semibold">Dry Stock Level</th>
              </tr>
            </thead>
            <tbody>
              {filteredStations.map((s) => (
                <tr
                  key={`${s.station_name}-${s.depot_id}`}
                  className="border-b last:border-0 hover:bg-gray-50"
                >
                  <td className="px-6 py-4">{s.station_name}</td>
                  <td className="px-6 py-4">{s.capacity}</td>
                  <td className="px-6 py-4">{s.operational_window}</td>
                  <td className="px-6 py-4">{s.station_address}</td>
                  <td className="px-6 py-4 whitespace-pre-wrap">
                    {Array.isArray(s.fuel_types_required)
                      ? s.fuel_types_required.join(", ")
                      : s.fuel_types_required}
                  </td>
                  <td className="px-6 py-4">{s.depot_id}</td>
                  <td className="px-6 py-4">{s.critical_level}</td>
                  <td className="px-6 py-4">{s.dry_stock_level}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
}
