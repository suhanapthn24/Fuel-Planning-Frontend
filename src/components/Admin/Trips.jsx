import React, { useState } from "react";
import TopNavbar from "./navbar";
import Sidebar from "./sidebar";
import { TripsTable } from "./Tripstable";
import AssignTrip from "./assigntrip";
import { Search } from "lucide-react";
import { FaFilter } from "react-icons/fa";

export default function Trips() {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="h-screen flex flex-col">
      {/* Top Navbar */}
      <div className="h-16 w-full bg-white shadow z-10">
        <TopNavbar />
      </div>

      {/* Sidebar + Main */}
      <div className="flex flex-1 overflow-hidden">
        <div className="w-64 bg-white shadow h-full overflow-y-auto">
          <Sidebar />
        </div>

        {/* Main content */}
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

          {/* Conditional Rendering */}
          {showForm ? (
            <AssignTrip onBack={() => setShowForm(false)} />
          ) : (
            <>
              {/* Filters and Search */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
                <div className="relative w-full sm:w-1/3">
                  <input
                    type="text"
                    placeholder="Search by Trip ID"
                    className="w-full border border-gray-300 rounded-md pl-10 pr-4 py-2"
                  />
                  <Search className="absolute top-2.5 left-3 w-5 h-5 text-gray-400" />
                </div>
                <div className="flex gap-4 flex-wrap">
                  <button className="bg-pink-100 px-4 py-2 rounded-md">Date Range ▾</button>
                  <button className="bg-pink-100 px-4 py-2 rounded-md">Driver ▾</button>
                  <button className="bg-pink-100 px-4 py-2 rounded-md">Trip Status ▾</button>
                </div>
              </div>

              {/* Table */}
              <TripsTable />
            </>
          )}
        </main>
      </div>
    </div>
  );
}
