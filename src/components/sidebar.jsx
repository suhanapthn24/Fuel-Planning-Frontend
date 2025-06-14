import React from "react";
import {
  HomeIcon,
  TruckIcon,
  ExclamationTriangleIcon,
  ChartBarIcon,
  BellIcon,
  UserIcon,
  ArrowLeftOnRectangleIcon,
} from "@heroicons/react/24/solid";
import { useNavigate, useLocation } from "react-router-dom";

const sidebarItems = [
  { name: "Dashboard", icon: HomeIcon, path: "/dashboard" },
  { name: "Trips", icon: TruckIcon, path: "/trips" },
  { name: "Exceptions", icon: ExclamationTriangleIcon, path: "/exceptions" },
  { name: "Reports", icon: ChartBarIcon, path: "/reports" },
  { name: "Notifications", icon: BellIcon, path: "/notifications" },
  { name: "User", icon: UserIcon, path: "/user" },
  { name: "Logout", icon: ArrowLeftOnRectangleIcon, path: "/" },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="h-[calc(100vh-64px)] w-60 bg-red-600 text-white flex flex-col rounded-tr-3xl rounded-br-3xl mt-[64px] fixed left-0 top-0 z-40">
      {/* Logo Section */}
      <div className="flex items-center justify-center py-4 border-b border-red-500 mb-4">
        <div className="flex flex-col items-center">
          {/* <span className="text-xs font-semibold tracking-wide">TAJ GASOLINE</span> */}
        </div>
      </div>

      {/* Sidebar Items */}
      <nav className="flex flex-col gap-2 px-3">
        {sidebarItems.map(({ name, icon: Icon, path }, index) => {
          const isActive = location.pathname === path;

          return (
            <button
              key={index}
              onClick={() => navigate(path)}
              className={`flex items-center gap-3 px-4 py-2 rounded-full font-medium transition-all text-sm ${
                isActive
                  ? "bg-white text-red-600"
                  : "hover:bg-red-500 hover:text-white"
              }`}
            >
              <Icon className="h-5 w-5" />
              {name}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
