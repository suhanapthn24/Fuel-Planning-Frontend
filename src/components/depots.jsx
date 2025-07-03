// src/components/Depots.jsx
import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";

export default function Depots() {
  const [depots, setDepots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");

  /* ------------------------------------------------------------------ */
  /* fetch once on mount                                                */
  /* ------------------------------------------------------------------ */
  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        setLoading(true);
        setError(null);

        /* Auth header (comment out if your GET is public) */
        const token   = localStorage.getItem("token");
        const headers = token ? { Authorization: `Bearer ${token}` } : {};

        const { data } = await axios.get(
          "http://127.0.0.1:8000/depots/",
          { headers }
        );

        console.log("Depots from API:", data);
        if (mounted) setDepots(data);
      } catch (err) {
        console.error("Error fetching depots:", err);
        if (mounted) setError("Failed to fetch depots");
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  /* ------------------------------------------------------------------ */
  /* memoised search filter                                             */
  /* ------------------------------------------------------------------ */
  const filteredDepots = useMemo(
    () =>
      depots.filter((d) =>
        d.depot_name.toLowerCase().includes(search.toLowerCase())
      ),
    [depots, search]
  );

  /* ------------------------------------------------------------------ */
  /* render                                                             */
  /* ------------------------------------------------------------------ */
  return (
    <>
      <h1 className="text-2xl font-semibold mb-6">Depots Overview</h1>

      {/* search & “add” button */}
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
          onClick={() => (window.location.href = "/depots/new")}
          className="ml-auto flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md"
        >
          <i className="fa fa-plus" />
          Add New Depot
        </button>
      </div>

      {/* table / states */}
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        {loading ? (
          <div className="p-8 text-center">Loading…</div>
        ) : error ? (
          <div className="p-8 text-center text-red-600">{error}</div>
        ) : filteredDepots.length === 0 ? (
          <div className="p-8 text-center">No depots found.</div>
        ) : (
          <table className="min-w-full text-sm text-gray-700">
            <thead>
              <tr className="border-b bg-gray-100 text-left text-xs uppercase tracking-wider">
                <th className="px-6 py-3 font-semibold">ID</th>
                <th className="px-6 py-3 font-semibold">Name</th>
                <th className="px-6 py-3 font-semibold">Address</th>
                <th className="px-6 py-3 font-semibold">Fuel Types</th>
                <th className="px-6 py-3 font-semibold">Bays</th>
              </tr>
            </thead>
            <tbody>
              {filteredDepots.map((dep) => (
                <tr
                  key={dep.depot_id}
                  className="border-b last:border-0 hover:bg-gray-50"
                >
                  <td className="px-6 py-4">{dep.depot_id}</td>
                  <td className="px-6 py-4">{dep.depot_name}</td>
                  <td className="px-6 py-4">{dep.depot_address}</td>
                  <td className="px-6 py-4">{dep.fuel_types_available}</td>
                  <td className="px-6 py-4 whitespace-pre-wrap">
                    {dep.bay_available}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
