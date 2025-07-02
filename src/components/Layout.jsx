// src/layouts/AdminLayout.jsx
import React from "react";
import { Outlet } from "react-router-dom";

import Sidebar from "../components/Admin/sidebar";
import Navbar  from "../components/Admin/navbar";

/**
 *  | Sidebar |   Navbar (row 1 col 2) |
 *  | Sidebar |   Page content (row 2) |
 */
export default function AdminLayout() {
  return (
    <div className="grid grid-cols-[15rem_1fr] grid-rows-[4rem_1fr] h-screen">
      {/* left column – stays visible for every admin page */}
      <Sidebar className="row-span-2" />

      {/* top row – fixed height, stays visible for every admin page */}
      <header className="row-start-1 col-start-2 h-16 border-b bg-white z-10">
        <Navbar />
      </header>

      {/* Routed pages render here */}
      <main className="row-start-2 col-start-2 overflow-y-auto bg-gray-50 p-8">
        <Outlet />
      </main>
    </div>
  );
}
