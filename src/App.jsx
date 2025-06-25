import React from "react";
import { Routes, Route } from "react-router-dom";

// Auth Components
import Login from "./components/Login";
import Register from "./components/Register";
import ForgotPassword from "./components/forgetpassword";

// Admin Components
import Dashboard from "./components/Admin/dashboard";
import Trips from "./components/Admin/Trips";
import Exceptions from "./components/Admin/Exceptions";
import Reports from "./components/Admin/reports";
import Notifications from "./components/Admin/notifications";

// User Component
import User from "./components/user";

// Station Components
import StationDashboard from "./components/Station/station";
import StationExceptions from "./components/Station/sexceptions";
import StationNotifications from "./components/Station/snotifications";
import Inventory from "./components/Station/inventory";
import Deliveries from "./components/Station/deliveries";
import StationReports from "./components/Station/sreports";

function App() {
  return (
    <Routes>
      {/* Auth Routes */}
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgetpassword" element={<ForgotPassword />} />

      {/* Admin Routes */}
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/trips" element={<Trips />} />
      <Route path="/exceptions" element={<Exceptions />} />
      <Route path="/reports" element={<Reports />} />
      <Route path="/notifications" element={<Notifications />} />

      {/* User Route */}
      <Route path="/user" element={<User />} />

      {/* Station Routes */}
      <Route path="/station" element={<StationDashboard />} />
      <Route path="/deliveries" element={<Deliveries />} />
      <Route path="/sexceptions" element={<StationExceptions />} />
      <Route path="/snotifications" element={<StationNotifications />} />
      <Route path="/inventory" element={<Inventory />} />
      <Route path="/sreports" element={<StationReports />} />
    </Routes>
  );
}

export default App;
