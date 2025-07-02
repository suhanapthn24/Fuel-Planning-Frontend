// import React from 'react';

// const circleColor = {
//   red: 'bg-red-100 text-red-500',
//   yellow: 'bg-yellow-100 text-yellow-500',
//   green: 'bg-green-100 text-green-500',
//   purple: 'bg-purple-100 text-purple-500',
// };

// const metrics = [
//   { label: 'Critical Stations', percent: 25, color: 'red' },
//   { label: 'Dry-Stock Stations', percent: 38, color: 'purple' },
//   { label: 'Maintenance-Due Vehicles', percent: 15, color: 'green' },
//   { label: 'Trips at Risk', percent: 5, color: 'yellow' },
// ];

// export default function DashboardStatusCircles() {
//   return (
//     <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8">
//       {metrics.map((metric, index) => (
//         <div
//           key={index}
//           className="bg-white rounded-xl shadow p-4 flex flex-col items-center justify-center"
//         >
//           <div
//             className={`w-20 h-20 rounded-full flex items-center justify-center text-xl font-bold ${circleColor[metric.color]}`}
//           >
//             {metric.percent}%
//           </div>
//           <p className="mt-3 text-center text-sm font-medium text-gray-700">{metric.label}</p>
//         </div>
//       ))}
//     </div>
//   );
// }

import React from 'react';

const circleColor = {
  red: 'bg-red-100 text-red-500',
  yellow: 'bg-yellow-100 text-yellow-500',
  green: 'bg-green-100 text-green-500',
  purple: 'bg-purple-100 text-purple-500',
};

const metrics = [
  { label: 'Critical Stations', percent: 25, color: 'red' },
  { label: 'Dry-Stock Stations', percent: 38, color: 'purple' },
  { label: 'Maintenance-Due Vehicles', percent: 15, color: 'green' },
  { label: 'Trips at Risk', percent: 5, color: 'yellow' },
];

export default function DashboardStatusCircles() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8">
      {metrics.map((metric, index) => (
        <div
          key={index}
          className="bg-white rounded-xl shadow p-4 flex flex-col items-center justify-center"
        >
          <div
            className={`w-20 h-20 rounded-full flex items-center justify-center text-xl font-bold ${circleColor[metric.color]}`}
          >
            {metric.percent}%
          </div>
          <p className="mt-3 text-center text-sm font-medium text-gray-700">{metric.label}</p>
        </div>
      ))}
    </div>
  );
}
