import React, { useState, useRef, useEffect } from "react";
import logo from "../assests/taj-logo.png";
import { BellIcon } from "@heroicons/react/24/solid";
import { Link, useNavigate, useLocation } from "react-router-dom";
import UserDropdown from "../UserDropdown";  // Import here


export default function Navbar() {
  const navItems = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Truck", path: "/trucks" },
    { name: "Drivers", path: "/drivers" },
    { name: "Depots", path: "/depots" },
    { name: "Stations", path: "/stations" },
  ];

  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="w-full bg-white shadow-sm px-6 py-3 flex justify-between items-center border-b fixed top-0 left-0 right-0 z-50">
      {/* Left: Logo + Nav Links */}
      <div className="flex items-center gap-12">
        <img src={logo} alt="Taj Gasoline" className="h-12" />

        <div className="flex gap-8 text-sm font-semibold">
          {navItems.map((item, index) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={index}
                to={item.path}
                className={`hover:text-red-600 relative ${
                  isActive ? "text-red-600" : "text-gray-700"
                }`}
              >
                {item.name}
                {isActive && (
                  <div className="absolute -bottom-1 left-0 w-full h-1 bg-red-600 rounded"></div>
                )}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Right: Search + Bell + Avatar */}
      <div className="relative flex items-center gap-4" ref={dropdownRef}>
        <div className="bg-gray-100 px-3 py-1 rounded-full flex items-center">
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent outline-none px-2 text-sm"
          />
        </div>

        <Link to="/notifications" className="text-gray-700 hover:text-red-600">
          <BellIcon className="h-6 w-6" />
        </Link>

        {/* Profile Icon */}
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className="h-8 w-8 rounded-full border overflow-hidden focus:outline-none"
          aria-label="User Profile"
        >
          <img src="" alt="User" className="h-8 w-8 object-cover" />
        </button>

        {/* User Dropdown Component */}
        {showDropdown && <UserDropdown onClose={() => setShowDropdown(false)} />}
      </div>
    </div>
  );
}
