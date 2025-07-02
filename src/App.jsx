import React from "react";
import { Routes, Route } from "react-router-dom";

/* Auth */
import Login          from "./components/Login";
import Register       from "./components/Register";
import ForgotPassword from "./components/forgetpassword";
import Profile        from "./components/profile";
import ApproveUsers   from "./components/Admin/ApproveUsers";

/* Admin pages */
import Dashboard     from "./components/Admin/dashboard";
import Trips         from "./components/Admin/Trips";
import Exceptions    from "./components/Admin/Exceptions";
import Reports       from "./components/Admin/reports";
import Notifications from "./components/Admin/notifications";
import Depots        from "./components/depots";
import Trucks        from "./components/trucks";     // ← new
import Drivers       from "./components/drivers";    // ← new
import Stations      from "./components/stations";

/* Station‑specific extras */
import Inventory          from "./components/Station/inventory";
import Deliveries         from "./components/Station/deliveries";
import StationExceptions  from "./components/Station/sexceptions";
import StationReports     from "./components/Station/sreports";
import StationNotifications from "./components/Station/snotifications";

/* Layout */
import AdminLayout from "./components/Layout";
import AddStationCard from "./components/addstation";

function App() {
  return (
    <Routes>

      {/* ---------- auth pages (no layout) ---------- */}
      <Route path="/"            element={<Login />} />
      <Route path="/register"    element={<Register />} />
      <Route path="/forgetpassword" element={<ForgotPassword />} />
      <Route path="/profile"     element={<Profile />} />
      <Route path="/approve"     element={<ApproveUsers />} />
      <Route path="/dashboard"     element={<Dashboard />} /> 
      <Route path="/trips"         element={<Trips />} />
      <Route path="/exceptions"    element={<Exceptions />} />
      <Route path="/reports"       element={<Reports />} />
      <Route path="/notifications" element={<Notifications />} />

      {/* ---------- everything that lives inside the admin layout ---------- */}
      <Route element={<AdminLayout />}>

        {/* NEW links added to navbar / sidebar */}
        <Route path="/depots"   element={<Depots />} />
        <Route path="/trucks"   element={<Trucks />} />
        <Route path="/drivers"  element={<Drivers />} />
        <Route path="/stations" element={<Stations />} />
        <Route path="/stations/new" element={<AddStationCard />} />

        {/* station‑extras can stay nested or get their own layout – your call */}
        <Route path="/deliveries"    element={<Deliveries />} />
        <Route path="/sexceptions"   element={<StationExceptions />} />
        <Route path="/snotifications" element={<StationNotifications />} />
        <Route path="/inventory"     element={<Inventory />} />
        <Route path="/sreports"      element={<StationReports />} />
      </Route>
    </Routes>
  );
}

export default App;
