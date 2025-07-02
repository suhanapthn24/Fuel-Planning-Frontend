import React from "react";

function Card({ title, count, change, changeColor }) {
  return (
    <div className="bg-white rounded-xl shadow p-4">
      <h3 className="text-sm font-semibold text-gray-600">{title}</h3>
      <div className="flex items-center justify-between mt-2">
        <span className="text-2xl font-bold text-gray-800">
          {count !== null ? count : "–"}
        </span>
        {/* <span className={`text-sm font-semibold ${changeColor}`}>
          {change !== null ? (change >= 0 ? `+${change}%` : `${change}%`) : ""}
        </span> */}
      </div>
    </div>
  );
}

function ActiveDepotCard() {
  const [count, setCount] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    fetch("http://127.0.0.1:8000/depots/")
      .then((res) => {
        if (!res.ok) throw new Error("Network error");
        return res.json();
      })
      .then((data) => setCount(data.length || 0))
      .catch(() => setError("Failed to load"))
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return <Card title="Active Depot" count="..." changeColor="text-orange-500" />;
  if (error)
    return <Card title="Active Depot" count="Error" changeColor="text-red-500" />;

  return <Card title="Active Depot" count={count} changeColor="text-orange-500" />;
}

function ActiveDriverCard() {
  const [count, setCount] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    fetch("http://127.0.0.1:8000/drivers/")
      .then((res) => {
        if (!res.ok) throw new Error("Network error");
        return res.json();
      })
      .then((data) => setCount(data.length || 0))
      .catch(() => setError("Failed to load"))
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return <Card title="Active Driver" count="..." changeColor="text-blue-500" />;
  if (error)
    return <Card title="Active Driver" count="Error" changeColor="text-red-500" />;

  return <Card title="Active Driver" count={count} changeColor="text-blue-500" />;
}

function TotalStationsCard() {
  const [count, setCount] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    fetch("http://127.0.0.1:8000/stations/")
      .then((res) => {
        if (!res.ok) throw new Error("Network error");
        return res.json();
      })
      .then((data) => setCount(data.length || 0))
      .catch(() => setError("Failed to load"))
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return <Card title="Total Stations" count="..." changeColor="text-green-500" />;
  if (error)
    return <Card title="Total Stations" count="Error" changeColor="text-red-500" />;

  return <Card title="Total Stations" count={count} changeColor="text-green-500" />;
}

function ExceptionAlertsCard() {
  const [count, setCount] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    fetch("http://127.0.0.1:8000/exceptions/")
      .then((res) => {
        if (!res.ok) throw new Error("Network error");
        return res.json();
      })
      .then((data) => setCount(data.length || 0))
      .catch(() => setError("Failed to load"))
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return <Card title="Exception Alerts" count="..." changeColor="text-red-500" />;
  if (error)
    return <Card title="Exception Alerts" count="0" changeColor="text-red-500" />;

  return <Card title="Exception Alerts" count={count} changeColor="text-red-500" />;
}

// export default function DashboardCards() {
//   return (
//     <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-10 px-4">
//       <ActiveDepotCard />
//       <ActiveDriverCard />
//       <TotalStationsCard />
//       <ExceptionAlertsCard />
//     </div>
//   );
// }

export default function DashboardCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <ActiveDepotCard />
      <ActiveDriverCard />
      <TotalStationsCard />
      <ExceptionAlertsCard />
    </div>
  );
}