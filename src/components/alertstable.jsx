export default function AlertsTable() {
  const rows = [
    { timestamp: "2024-03-15 14:30", type: "Low Fuel Level", desc: "Vehicle ID: 12345, Current Fuel: 5%" },
    { timestamp: "2024-03-15 14:30", type: "Low Fuel Level", desc: "Vehicle ID: 12345, Current Fuel: 5%" },
    { timestamp: "2024-03-15 14:30", type: "Low Fuel Level", desc: "Vehicle ID: 12345, Current Fuel: 5%" },
  ];

  return (
    <div className="bg-white shadow rounded-md overflow-hidden">
      <table className="w-full table-auto text-left">
        <thead className="bg-gray-100 text-sm uppercase text-gray-600">
          <tr>
            <th className="px-6 py-3">Timestamp</th>
            <th className="px-6 py-3">Alert Type</th>
            <th className="px-6 py-3">Description</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="border-t text-sm text-gray-700">
              <td className="px-6 py-3">{r.timestamp}</td>
              <td className="px-6 py-3">{r.type}</td>
              <td className="px-6 py-3">{r.desc}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
