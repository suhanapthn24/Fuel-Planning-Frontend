import React from "react";
import {
  HomeIcon,
  TruckIcon,
  ExclamationTriangleIcon,
  ChartBarIcon,
  BellIcon,
  ArrowLeftOnRectangleIcon,
} from "@heroicons/react/24/solid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGasPump } from "@fortawesome/free-solid-svg-icons";
import { useNavigate, useLocation } from "react-router-dom";

const GasPumpIcon = ({ className }) => (
  <FontAwesomeIcon icon={faGasPump} className={className} />
);

const sidebarItems = [
  { name: "Dashboard", icon: HomeIcon, path: "/station" },
  { name: "Deliveries", icon: TruckIcon, path: "/deliveries" },
  { name: "Inventory", icon: GasPumpIcon, path: "/inventory" },
  { name: "Exceptions", icon: ExclamationTriangleIcon, path: "/sexceptions" },
  { name: "Notifications", icon: BellIcon, path: "/snotifications" },
  { name: "Reports", icon: ChartBarIcon, path: "/sreports" }, // Confirm if route exists
  { name: "Logout", icon: ArrowLeftOnRectangleIcon, path: "/" },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="h-[calc(100vh-64px)] w-60 bg-red-600 text-white flex flex-col rounded-tr-3xl rounded-br-3xl mt-[64px] fixed left-0 top-0 z-40">
      <div className="flex items-center justify-center py-4 border-b border-red-500 mb-4">
        <div className="flex flex-col items-center">{/* Logo or Title */}</div>
      </div>

      <nav className="flex flex-col gap-2 px-3">
        {sidebarItems.map(({ name, icon: Icon, path }, index) => {
          const isActive =
            location.pathname === path || location.pathname.startsWith(path + "/");

          return (
            <button
              key={index}
              onClick={() => {
                if (!isActive) navigate(path);
              }}
              className={`flex items-center gap-3 px-4 py-2 rounded-full font-medium transition-all text-sm ${
                isActive ? "bg-white text-red-600" : "hover:bg-red-500 hover:text-white"
              }`}
            >
              <Icon className={`h-5 w-5 ${isActive ? "text-red-600" : "text-white"}`} />
              {name}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
