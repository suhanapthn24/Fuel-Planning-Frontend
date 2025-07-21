// src/components/Depots.jsx
import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";

const Product = {
  diesel: "bg-blue-100 text-blue-800",
  petrol: "bg-red-100 text-red-800",
  hobc: "bg-green-100 text-green-800",
  other: "bg-gray-100 text-gray-800",
};

const Status = {
  active: "bg-green-100 text-green-800",
  inactive: "bg-red-100 text-red-800",
};

export default function Depots() {
  const [depots, setDepots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem("token");
        const headers = token ? { Authorization: `Bearer ${token}` } : {};

        const { data } = await axios.get("http://127.0.0.1:8000/depots/", {
          headers,
        });

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

  const filteredDepots = useMemo(() => {
    return depots.filter((d) =>
      (d?.depot_name || "").toLowerCase().includes((search || "").toLowerCase())
    );
  }, [depots, search]);

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
                <th className="px-6 py-3 font-semibold">Code</th>
                <th className="px-6 py-3 font-semibold">Name</th>
                <th className="px-6 py-3 font-semibold">Address</th>
                <th className="px-6 py-3 font-semibold">Product</th>
                <th className="px-6 py-3 font-semibold">Bay 1</th>
                <th className="px-6 py-3 font-semibold">Bay 2</th>
                <th className="px-6 py-3 font-semibold">Bay 3</th>
                <th className="px-6 py-3 font-semibold">Bay 4</th>
                <th className="px-6 py-3 font-semibold">Bay 5</th>
                <th className="px-6 py-3 font-semibold">Capacity</th>
                <th className="px-6 py-3 font-semibold">Loading Time (mins)</th>
                <th className="px-6 py-3 font-semibold">Opening Hours</th>
              </tr>
            </thead>
            <tbody>
              {filteredDepots.map((dep) => {
                const productType = dep.product?.toLowerCase() || "other";
                const badgeClass = Product[productType] || Product.other;

                const statusType = dep.status?.toLowerCase() === "inactive" ? "inactive" : "active";
                const statusClass = Status[statusType];

                return (
                  <tr
                    key={dep.depot_id}
                    className="border-b last:border-0 hover:bg-gray-50"
                  >
                    <td className="px-6 py-4">{dep.depot_code}</td>
                    <td className="px-6 py-4">{dep.depot_name}</td>
                    <td className="px-6 py-4">{dep.depot_address}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${badgeClass}`}
                      >
                        {dep.product}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${statusClass}`}
                      >
                        {dep.bay_1}
                      </span>
                    </td>
                    
                    <td className="px-6 py-4">{dep.bay_2}</td>
                    <td className="px-6 py-4">{dep.bay_3}</td>
                    <td className="px-6 py-4">{dep.bay_4}</td>
                    <td className="px-6 py-4">{dep.bay_5}</td>
                    <td className="px-6 py-4">{dep.capacity}</td>
                    <td className="px-6 py-4">{dep.admin}</td>
                    <td className="px-6 py-4">{dep.opening_hours}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
