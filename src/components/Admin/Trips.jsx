import React, { useState } from "react";
import TopNavbar from "./navbar";
import Sidebar from "./sidebar";
import { TripsTable } from "./Tripstable";
import AssignTrip from "./assigntrip";
import { Search } from "lucide-react";

export default function Trips() {
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [filters, setFilters] = useState({
    status: "",
  });

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="h-screen flex flex-col">
      <div className="h-16 w-full bg-white shadow z-10">
        <TopNavbar />
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className="w-64 bg-white shadow h-full overflow-y-auto">
          <Sidebar />
        </div>

        <main className="flex-1 p-8 bg-gray-50 overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Trips</h1>
            <button
              onClick={() => setShowForm(true)}
              className="bg-pink-100 text-black px-4 py-2 rounded-lg font-medium"
            >
              New Trip
            </button>
          </div>

          {showForm ? (
            <AssignTrip onBack={() => setShowForm(false)} />
          ) : (
            <>
              {/* Search and Filters */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
                <div className="relative w-full sm:w-1/3">
                  <input
                    type="text"
                    placeholder="Search by Trip ID, Driver..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full border border-gray-300 rounded-md pl-10 pr-4 py-2"
                  />
                  <Search className="absolute top-2.5 left-3 w-5 h-5 text-gray-400" />
                </div>

                <select
                  className="bg-pink-100 px-4 py-2 rounded-md"
                  value={filters.status}
                  onChange={(e) => handleFilterChange("status", e.target.value)}
                >
                  <option value="">All Status</option>
                  <option value="active">Active</option>
                  <option value="scheduled">Scheduled</option>
                  <option value="complete">Complete</option>
                  <option value="delayed">Delayed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <TripsTable searchQuery={searchQuery} filters={filters} />
            </>
          )}
        </main>
      </div>
    </div>
  );
}
