import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Product = {
  diesel: "bg-blue-100 text-blue-800",
  petrol: "bg-red-100 text-red-800",
  hobc: "bg-green-100 text-green-800",
  other: "bg-gray-100 text-gray-800",
};

export default function Stations() {
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;

    const fetchStations = async () => {
      const token = localStorage.getItem("access_token"); // or sessionStorage
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const headers = {
          Authorization: `Bearer ${token}`,
        };

        const { data } = await axios.get("http://127.0.0.1:8000/stations", {
          headers,
        });

        if (mounted) setStations(data);
      } catch (err) {
        console.error("Error fetching stations:", err);
        if (mounted) setError("Failed to fetch stations");
        if (err.response?.status === 401 || err.response?.status === 403) {
          navigate("/login");
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchStations();

    return () => {
      mounted = false;
    };
  }, [navigate]);

  const filteredStations = useMemo(() => {
    return stations.filter((s) =>
      (s?.station_name || "").toLowerCase().includes(search.toLowerCase())
    );
  }, [stations, search]);

  return (
    <section className="overflow-y-auto bg-gray-50 p-8 h-full">
      <h1 className="text-2xl font-semibold mb-6">Stations Overview</h1>

      {/* Search + Add Button */}
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

      {/* Table */}
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
                <th className="px-6 py-3 font-semibold">ERP code</th>
                <th className="px-6 py-3 font-semibold">Name</th>
                <th className="px-6 py-3 font-semibold">Capacity</th>
                <th className="px-6 py-3 font-semibold">Default Supply Depot</th>
                <th className="px-6 py-3 font-semibold">Address</th>
                <th className="px-6 py-3 font-semibold">Product</th>
                <th className="px-6 py-3 font-semibold">Monthly average sales</th>
                <th className="px-6 py-3 font-semibold">Deadstock</th>
                <th className="px-6 py-3 font-semibold">Tank number</th>
              </tr>
            </thead>
            <tbody>
              {filteredStations.map((s) => {
                const productType = s.product?.toLowerCase() || "other";
                const badgeClass = Product[productType] || Product.other;

                return (
                  <tr
                    key={s.erp_code}
                    className="border-b last:border-0 hover:bg-gray-50"
                  >
                    <td className="px-6 py-4">{s.erp_code}</td>
                    <td className="px-6 py-4">{s.site_name}</td>
                    <td className="px-6 py-4">{s.capacity}</td>
                    <td className="px-6 py-4">{s.supply_depot}</td>
                    <td className="px-6 py-4">{s.address}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${badgeClass}`}
                      >
                        {s.product}
                      </span>
                    </td>
                    <td className="px-6 py-4">{s.monthly_avg_sales}</td>
                    <td className="px-6 py-4">{s.deadstock}</td>
                    <td className="px-6 py-4">{s.tank_no}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
}
