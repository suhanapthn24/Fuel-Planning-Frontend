export default function DashboardCards() {
  const data = [
    { label: "Active Trips", count: 125 },
    { label: "Delayed Trips", count: 15 },
    { label: "Buffer Alerts", count: 8 },
    { label: "Exception Alerts", count: 3 }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      {data.map((card, i) => (
        <div key={i} className="bg-white p-4 rounded-md shadow border text-center">
          <p className="font-medium text-gray-700">{card.label}</p>
          <p className="text-2xl font-bold">{card.count}</p>
        </div>
      ))}
    </div>
  );
}
