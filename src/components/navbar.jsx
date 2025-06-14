import React from "react";
import logo from "../assests/taj-logo.png";
import { BellIcon } from "@heroicons/react/24/solid";
import { Link } from "react-router-dom";

export default function Navbar() {
  const navItems = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Drivers", path: "/drivers" },
    { name: "Depots", path: "/depots" },
    { name: "Stations", path: "/stations" },
  ];

  return (
    <div className="w-full bg-white shadow-sm px-6 py-3 flex justify-between items-center border-b fixed top-0 left-0 right-0 z-50">
      {/* Left: Logo + Nav Links */}
      <div className="flex items-center gap-12">
        <img src={logo} alt="Taj Gasoline" className="h-12" />

        <div className="flex gap-8 text-sm font-semibold">
          {navItems.map((item, index) => (
            <Link
              key={index}
              to={item.path}
              className="hover:text-red-600 relative"
            >
              {item.name}
              {item.name === "Dashboard" && (
                <div className="absolute -bottom-1 left-0 w-full h-1 bg-red-600 rounded"></div>
              )}
            </Link>
          ))}
        </div>
      </div>

      {/* Right: Search + Bell + Avatar */}
      <div className="flex items-center gap-4">
        <div className="bg-gray-100 px-3 py-1 rounded-full flex items-center">
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent outline-none px-2 text-sm"
          />
        </div>
        <BellIcon className="h-6 w-6 text-gray-700" />
        <img
          src=""
          alt="User"
          className="h-8 w-8 rounded-full border"
        />
      </div>
    </div>
  );
}
