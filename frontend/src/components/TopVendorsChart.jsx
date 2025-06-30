import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = ['#00bcd4', '#2196f3', '#3f51b5', '#9c27b0', '#e91e63'];

function TopVendorsChart({ data }) {
  if (!data || data.length === 0) return null;

  // Aggregate total amount per recipient
  const totals = {};
  data.forEach((item) => {
    if (!totals[item.recipient]) totals[item.recipient] = 0;
    totals[item.recipient] += item.amount;
  });

  // Convert to array and sort
  const topVendors = Object.entries(totals)
    .map(([name, amount]) => ({ name, value: amount }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);

  return (
    <div className="bg-[#1c2333] p-4 rounded-lg shadow-lg h-full">
      <h2 className="text-lg font-semibold mb-2">Top 5 Vendors</h2>
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={topVendors}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={80}
            label={({ name }) => name}
          >
            {topVendors.map((_, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(val) => `$${val.toLocaleString()}`} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export default TopVendorsChart;
