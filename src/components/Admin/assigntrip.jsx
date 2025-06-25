import React from "react";

export default function AssignTrip({ onBack }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Assign New Trip</h2>
        <button
          className="text-sm text-red-500 underline"
          onClick={onBack}
        >
          Cancel
        </button>
      </div>

      <form className="space-y-4">
        <select className="w-full border rounded px-4 py-2">
          <option>Select Driver</option>
        </select>
        <select className="w-full border rounded px-4 py-2">
          <option>Start Location</option>
        </select>
        <select className="w-full border rounded px-4 py-2">
          <option>Destination</option>
        </select>
        <input className="w-full border rounded px-4 py-2" placeholder="ETA" />
        <input className="w-full border rounded px-4 py-2" placeholder="Fuel Volume (Liters)" />
        <input className="w-full border rounded px-4 py-2" placeholder="Preferred Route (Optional)" />

        <div className="text-right">
          <button className="bg-pink-100 text-black px-6 py-2 rounded-full">
            Assign & Notify
          </button>
        </div>
      </form>
    </div>
  );
}
