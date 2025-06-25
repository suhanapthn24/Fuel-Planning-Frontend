import React, { useState } from "react";
import Sidebar from "./ssidebar";
import Navbar from "./snavbar";
import { FaEye } from "react-icons/fa";

const deliveries = [
  {
    id: "TRP - 001",
    depot: "Depot A",
    volume: "5000 L",
    eta: "11:00 AM",
    receivedAt: "11:05 AM",
    status: "Received",
  },
  {
    id: "TRP - 002",
    depot: "Depot B",
    volume: "4000 L",
    eta: "03:00 AM",
    receivedAt: "-",
    status: "Pending",
  },
  {
    id: "TRP - 003",
    depot: "Depot C",
    volume: "3000 L",
    eta: "03:00 AM",
    receivedAt: "03:00 AM",
    status: "Received",
  },
  {
    id: "TRP - 004",
    depot: "Depot C",
    volume: "3000 L",
    eta: "03:00 AM",
    receivedAt: "03:00 AM",
    status: "Received",
  },
  {
    id: "TRP - 005",
    depot: "Depot C",
    volume: "3000 L",
    eta: "03:00 AM",
    receivedAt: "03:00 AM",
    status: "Received",
  },
];

const statusBadge = (status) => {
  if (status === "Received") {
    return <span className="text-xs px-2 py-1 bg-green-500 text-white rounded-full">Received</span>;
  } else if (status === "Pending") {
    return <span className="text-xs px-2 py-1 bg-red-500 text-white rounded-full">Pending</span>;
  }
  return <span className="text-xs px-2 py-1 bg-gray-400 text-white rounded-full">{status}</span>;
};

export default function Deliveries() {
  const [selectedDelivery, setSelectedDelivery] = useState(null);

  const handleView = (delivery) => {
    setSelectedDelivery(delivery);
  };

  const closeModal = () => {
    setSelectedDelivery(null);
  };

  return (
    <div className="h-screen">
      {/* Fixed Navbar on top */}
      <div className="fixed top-0 left-0 right-0 z-10">
        <Navbar />
      </div>

      {/* Sidebar and Content */}
      <div className="flex pt-16 h-full">
        {/* Sidebar */}
        <div className="fixed top-16 left-0 bottom-0 w-60 z-10">
          <Sidebar />
        </div>

        {/* Main Content */}
        <div className="ml-60 mt-4 px-6 w-full overflow-y-auto">
          <h2 className="text-2xl font-semibold mb-6">Deliveries</h2>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-4 mb-4">
            <input
              type="text"
              placeholder="Search By Name"
              className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-400"
            />
            <select className="border border-gray-300 rounded px-4 py-2 text-sm">
              <option>Data Range</option>
            </select>
            <select className="border border-gray-300 rounded px-4 py-2 text-sm">
              <option>Depot</option>
            </select>
            <select className="border border-gray-300 rounded px-4 py-2 text-sm">
              <option>Status</option>
            </select>
          </div>

          {/* Table */}
          <div className="bg-white rounded-lg shadow overflow-x-auto">
            <table className="min-w-full table-auto text-sm">
              <thead className="bg-gray-100 text-left">
                <tr>
                  <th className="px-4 py-3">Delivery ID</th>
                  <th className="px-4 py-3">Depot</th>
                  <th className="px-4 py-3">Volume</th>
                  <th className="px-4 py-3">ETA</th>
                  <th className="px-4 py-3">Received At</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-center">View</th>
                </tr>
              </thead>
              <tbody>
                {deliveries.map((delivery, index) => (
                  <tr key={index} className="border-t">
                    <td className="px-4 py-3">{delivery.id}</td>
                    <td className="px-4 py-3">{delivery.depot}</td>
                    <td className="px-4 py-3">{delivery.volume}</td>
                    <td className="px-4 py-3">{delivery.eta}</td>
                    <td className="px-4 py-3">{delivery.receivedAt}</td>
                    <td className="px-4 py-3">{statusBadge(delivery.status)}</td>
                    <td
                      className="px-4 py-3 text-center text-blue-500 cursor-pointer"
                      onClick={() => handleView(delivery)}
                    >
                      <FaEye />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal */}
      {selectedDelivery && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative">
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-gray-500 hover:text-black text-lg font-bold"
            >
              ×
            </button>
            <h3 className="text-xl font-semibold mb-4">Delivery Details</h3>
            <p><strong>ID:</strong> {selectedDelivery.id}</p>
            <p><strong>Depot:</strong> {selectedDelivery.depot}</p>
            <p><strong>Volume:</strong> {selectedDelivery.volume}</p>
            <p><strong>ETA:</strong> {selectedDelivery.eta}</p>
            <p><strong>Received At:</strong> {selectedDelivery.receivedAt}</p>
            <p><strong>Status:</strong> {selectedDelivery.status}</p>
          </div>
        </div>
      )}
    </div>
  );
}
