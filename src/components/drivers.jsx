import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";

const licenseTypeColors = {
  commercial: "bg-blue-100 text-blue-800",
  heavy_vehicle: "bg-red-100 text-red-800",
  light_vehicle: "bg-green-100 text-green-800",
  trailer: "bg-yellow-100 text-yellow-800",
  tanker: "bg-purple-100 text-purple-800",
  other: "bg-gray-100 text-gray-800",
};

export default function Drivers() {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);
  const [search,  setSearch]  = useState("");

  /* ── fetch once ─────────────────────────────────────────────────────── */
  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        setLoading(true);
        setError(null);

        // const token   = localStorage.getItem("token");
        // const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const headers = {};

        const { data } = await axios.get(
          "http://127.0.0.1:8000/drivers/?skip=0&limit=100",
          { headers }
        );

        console.log("Driver data:", data);
        if (mounted) setDrivers(data);
      } catch (err) {
        console.error("Error fetching drivers:", err);
        if (mounted) setError("Failed to fetch drivers");
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => { mounted = false; };
  }, []);

  /* ── search filter (by name or license) ─────────────────────────────── */
  const filtered = useMemo(() => {
    return drivers.filter((d) =>
      `${d.driver_name} ${d.license_number}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [drivers, search]);

  /* ── render ──────────────────────────────────────────────────────────── */
  return (
    <section className="overflow-y-auto bg-gray-50 p-8 h-full">
      <h1 className="text-2xl font-semibold mb-6">Drivers Overview</h1>

      {/* Search & Add */}
      <div className="flex flex-wrap gap-4 mb-6 items-center">
        <div className="relative">
          <span className="absolute left-3 top-2.5 text-gray-400">
            <i className="fa fa-search" />
          </span>
          <input
            type="text"
            placeholder="Search by name / license"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 pr-4 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-red-500 w-64"
          />
        </div>

        <button
          onClick={() => (window.location.href = "/drivers/new")}
          className="ml-auto flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md"
        >
          <i className="fa fa-plus" />
          Add New Driver
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        {loading ? (
          <div className="p-8 text-center">Loading…</div>
        ) : error ? (
          <div className="p-8 text-center text-red-600">{error}</div>
        ) : filtered.length === 0 ? (
          <div className="p-8 text-center">No drivers found.</div>
        ) : (
          <table className="min-w-full text-sm text-gray-700">
            <thead>
              <tr className="border-b bg-gray-100 text-left text-xs uppercase tracking-wider">
                <th className="px-6 py-3 font-semibold">Name</th>
                <th className="px-6 py-3 font-semibold">License #</th>
                <th className="px-6 py-3 font-semibold">License Type</th>
                <th className="px-6 py-3 font-semibold">Phone</th>
                {/* <th className="px-6 py-3 font-semibold">Truck ID</th> */}
              </tr>
            </thead>
            <tbody>
              {filtered.map((d) => (
                <tr key={d.driver_id} className="border-b last:border-0 hover:bg-gray-50">
                  <td className="px-6 py-4">{d.driver_name}</td>
                  <td className="px-6 py-4">{d.license_number}</td>
                  <td className="px-6 py-4">
                    <span
                        className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                        licenseTypeColors[d.license_type] || licenseTypeColors.other
                        }`}
                    >
                        {d.license_type.replace(/_/g, " ")}
                    </span>
                    </td>
                  <td className="px-6 py-4">{d.driver_phone}</td>
                  {/* <td className="px-6 py-4">{d.truck_id}</td> */}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
}
