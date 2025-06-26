import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function Profile({ email }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!email) {
      console.error("No email provided to fetch profile");
      setLoading(false);
      return;
    }

    axios
      .get(`http://localhost:8000/user/${encodeURIComponent(email)}`)
      .then((res) => {
        setUser(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to fetch user profile:', err);
        setLoading(false);
      });
  }, [email]);

  if (loading) return <p>Loading profile...</p>;

  if (!user) return <p>User not found.</p>;

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      <h1 className="text-xl font-bold mb-4">My Profile</h1>
      <img
        src={user.avatarUrl || 'https://via.placeholder.com/100'}
        alt={user.name}
        className="h-24 w-24 rounded-full mb-4 object-cover"
      />
      <p><strong>Name:</strong> {user.name}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Phone:</strong> {user.phone || 'N/A'}</p>
      {/* Add more fields as needed */}
    </div>
  );
}
