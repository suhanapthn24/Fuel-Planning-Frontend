import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Assuming you're using React Router

const truckTypeColors = {
  rigid: "bg-blue-100 text-blue-800",
  articulated: "bg-green-100 text-green-800",
};

export default function Trucks() {
  const [trucks, setTrucks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem("access_token");
        if (!token) {
          // Redirect if not logged in
          navigate("/");
          return;
        }

        const headers = { Authorization: `Bearer ${token}` };

        const { data } = await axios.get("http://127.0.0.1:8000/trucks/", {
          headers,
        });

        console.log("Truck data:", data);
        if (mounted) setTrucks(data);
      } catch (err) {
        console.error("Error fetching trucks:", err);
        if (mounted) setError("Failed to fetch trucks");
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [navigate]);

  const filtered = useMemo(() => {
    return trucks.filter((t) =>
      `${t.registration_number} ${t.truck_type}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [trucks, search]);

  return (
    <section className="overflow-y-auto bg-gray-50 p-8 h-full">
      <h1 className="text-2xl font-semibold mb-6">Trucks Overview</h1>

      {/* Search & Add */}
      <div className="flex flex-wrap gap-4 mb-6 items-center">
        <div className="relative">
          <span className="absolute left-3 top-2.5 text-gray-400">
            <i className="fa fa-search" />
          </span>
          <input
            type="text"
            placeholder="Search by reg. # / type"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 pr-4 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-red-500 w-64"
          />
        </div>

        <button
          onClick={() => (window.location.href = "/trucks/new")}
          className="ml-auto flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md"
        >
          <i className="fa fa-plus" />
          Add New Truck
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        {loading ? (
          <div className="p-8 text-center">Loading…</div>
        ) : error ? (
          <div className="p-8 text-center text-red-600">{error}</div>
        ) : filtered.length === 0 ? (
          <div className="p-8 text-center">No trucks found.</div>
        ) : (
          <table className="min-w-full text-sm text-gray-700">
            <thead>
              <tr className="border-b bg-gray-100 text-left text-xs uppercase tracking-wider">
                <th className="px-6 py-3 font-semibold">Reg. Number</th>
                <th className="px-6 py-3 font-semibold">Type</th>
                <th className="px-6 py-3 font-semibold">Compartments</th>
                <th className="px-6 py-3 font-semibold">Total Cap.</th>
                {/* <th className="px-6 py-3 font-semibold">Comp Sizes</th> */}
                {/* <th className="px-6 py-3 font-semibold">Fuel</th> */}
                <th className="px-6 py-3 font-semibold">Available</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((t) => (
                <tr key={t.truck_id} className="border-b last:border-0 hover:bg-gray-50">
                  <td className="px-6 py-4">{t.registration_number}</td>
                  {/* <td className="px-6 py-4">{t.truck_type}</td> */}
                  <td className="px-6 py-4">
                    <span
                      className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                        truckTypeColors[t.truck_type.toLowerCase()] || "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {t.truck_type.charAt(0).toUpperCase() + t.truck_type.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">{t.compartments}</td>
                  <td className="px-6 py-4">{t.total_capacity}</td>
                  {/* <td className="px-6 py-4 whitespace-pre-wrap">
                    {[t.compartment_size_1,
                      t.compartment_size_2,
                      t.compartment_size_3,
                      t.compartment_size_4,
                      t.compartment_size_5]
                      .filter(Boolean)
                      .join(", ")}
                  </td> */}
                  {/* <td className="px-6 py-4">{t.fuel_type}</td> */}
                  <td className="px-6 py-4">
                    {t.available ? (
                      <span className="text-green-600 font-semibold">Yes</span>
                    ) : (
                      <span className="text-red-600 font-semibold">No</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
}
