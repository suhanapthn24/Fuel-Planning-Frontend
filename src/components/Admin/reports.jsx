import React from "react";
import Sidebar from "./sidebar";
import Navbar from "./navbar";

export default function Reports({ counts = {} }) {
  const powerBiEmbedUrl = "https://app.powerbi.com/view?r=eyJrIjoiZmRmYTgwZDgtZjllNy00NTUzLWJmYWItZjQxOWUxM2E5NjM5IiwidCI6IjQ5YmM2YjEzLTlmZTUtNGZmMS05ZDYxLTY1YjcwOGIwYjc5NSJ9";

  return (
    <div>
      {/* Sidebar */}
      <div className="fixed top-0 left-0 w-64 h-full z-20">
        <Sidebar />
      </div>

      {/* Navbar */}
      <div className="fixed top-0 left-64 right-0 h-16 z-10">
        <Navbar />
      </div>

      {/* Main Content */}
      <div className="ml-64 mt-16 p-8 bg-gray-100 min-h-screen flex flex-col">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 border-b border-gray-300 pb-4">
          Utilization & Efficiency Reports
        </h2>

        {/* Power BI Report Section */}
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-gray-700">Power BI Dashboard</h3>
          <button
            className="bg-red-600 text-white px-5 py-2 rounded shadow hover:bg-red-700 transition"
            onClick={() => window.open(powerBiEmbedUrl, "_blank")}
          >
            Open in Power BI
          </button>
        </div>

        {/* Embed Power BI iframe */}
        <div className="flex-grow rounded-lg overflow-hidden shadow-lg border border-gray-300 bg-white">
          <iframe
            title="Power BI Dashboard"
            src={powerBiEmbedUrl}
            frameBorder="0"
            allowFullScreen
            className="w-full h-[700px]"
          />
        </div>
      </div>
    </div>
  );
}
