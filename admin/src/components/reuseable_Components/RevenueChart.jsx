import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "Jan", revenue: 4000 },
  { name: "Feb", revenue: 3000 },
  { name: "Mar", revenue: 5000 },
  { name: "Apr", revenue: 2780 },
  { name: "May", revenue: 1890 },
  { name: "Jun", revenue: 2390 },
  { name: "Jul", revenue: 3490 },
];

export default function RevenueChart() {
  return (
    <div className="revenue-chart-container">
      <div className="chart-header">
        <h3>Revenue Generated</h3>
        <p>$59,342.32</p>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid stroke="#2C3655" />

          <XAxis
            dataKey="name"
            stroke="#A3AED0"
          />

          <YAxis stroke="#A3AED0" />

          <Tooltip />

          <Line
            type="monotone"
            dataKey="revenue"
            stroke="rgb(122, 214, 122)"
            strokeWidth={3}
            dot={{ r: 4 }}
            activeDot={{ r: 7 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}