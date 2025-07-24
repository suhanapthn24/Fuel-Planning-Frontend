import React from "react";
import { Routes, Route } from "react-router-dom";

/* Auth */
import Login          from "./components/Login";
import Register       from "./components/Register";
import ForgotPassword from "./components/forgetpassword";
import Profile        from "./components/profile";
import ApproveUsers   from "./components/Admin/ApproveUsers";
import UserManagement from "./components/metadata/user";

/* Admin pages */
import Dashboard     from "./components/Admin/dashboard";
import Trips         from "./components/Admin/Trips";
import Exceptions    from "./components/Admin/Exceptions";
import Reports       from "./components/Admin/reports";
import Notifications from "./components/Admin/notifications";
import Depots        from "./components/metadata/depots";
import Trucks        from "./components/metadata/trucks";     
import Drivers       from "./components/metadata/drivers";   
import Stations      from "./components/metadata/stations";


/* Layout */
import AdminLayout from "./components/Layout";
import AddStationCard from "./components/Add entities/addstation";
import AddDepotCard from "./components/Add entities/adddepot";
import AddTruckCard from "./components/Add entities/addtruck";
import AddDriverCard from "./components/Add entities/adddriver";

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
       <Route path="/user" element={<UserManagement />} />

      {/* ---------- everything that lives inside the admin layout ---------- */}
      <Route element={<AdminLayout />}>

        {/* NEW links added to navbar / sidebar */}
        <Route path="/depots"   element={<Depots />} />
        <Route path="/trucks"   element={<Trucks />} />
        <Route path="/drivers"  element={<Drivers />} />
        <Route path="/stations" element={<Stations />} />
        <Route path="/stations/new" element={<AddStationCard />} />
        <Route path="/depots/new" element={<AddDepotCard />} />
        <Route path="/trucks/new" element={<AddTruckCard />} />
        <Route path="/drivers/new" element={<AddDriverCard />} />
      </Route>
    </Routes>
  );
}

export default App;
