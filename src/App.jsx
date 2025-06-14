import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Dashboard from "./components/dashboard";
import Trips from "./components/Trips";
import Exceptions from "./components/Exceptions";
import User from "./components/user";
import ForgotPassword from "./components/forgetpassword";
import Reports from "./components/reports";
import Notifications from "./components/notifications";
import Register from "./components/Register";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/trips" element={<Trips />} />
      <Route path="/exceptions" element={<Exceptions />} />
      <Route path="/user" element={<User />} />
      <Route path="/forgetpassword" element={<ForgotPassword />} />
      <Route path="/reports" element={<Reports />} />
      <Route path="/notifications" element={<Notifications />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  );
}

export default App;
