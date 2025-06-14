import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from "../assests/taj-logo.png";
import axios from 'axios';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    role: '',
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://127.0.0.1:8000/register", formData);
      alert("Registration successful!");
      navigate("/"); // Navigate to login
    } catch (error) {
      console.error(error);
      alert("Registration failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 relative">
      {/* Google Maps Background */}
      <div className="absolute inset-0">
        <iframe
          src="https://www.google.com/maps/embed/v1/view?key=AIzaSyA26SLopuCcY_MNgtC9vIk4KffEmEaDhDI&center=18.5204,73.8567&zoom=10&maptype=roadmap"
          className="w-full h-full object-cover pointer-events-none brightness-75 opacity-100 blur-sm"
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Dynamic Google Map"
        ></iframe>
        <div className="absolute inset-0 bg-white bg-opacity-30 backdrop-blur-sm"></div>
      </div>

      {/* Form */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md">
          <div className="flex justify-center mb-4">
            <img src={logo} alt="Taj Gasoline" className="h-16" />
          </div>
          <h1 className="text-center font-bold text-lg mb-6">Register</h1>

          <div className="space-y-4">
            <input type="text" name="name" value={formData.name} onChange={handleChange}
              placeholder="Full Name"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-400"
              required
            />
            <input type="email" name="email" value={formData.email} onChange={handleChange}
              placeholder="Email"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-400"
              required
            />
            <input type="text" name="phone" value={formData.phone} onChange={handleChange}
              placeholder="Phone"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-400"
              required
            />
            <input type="password" name="password" value={formData.password} onChange={handleChange}
              placeholder="Password"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-400"
              required
            />
            <select name="role" value={formData.role} onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-400"
              required
            >
              <option value="">Select Role</option>
              <option value="admin">Admin</option>
              <option value="driver">Driver</option>
            </select>
          </div>

          <button type="submit"
            className="mt-6 w-full bg-red-600 text-white py-2 rounded-full hover:bg-red-700 transition"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
}
