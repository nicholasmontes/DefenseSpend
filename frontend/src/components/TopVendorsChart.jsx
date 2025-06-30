import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AA336A'];

function TopVendorsChart({ data }) {
  if (!data || data.length === 0) return <p>No vendor data available.</p>;

  // Aggregate total award amounts per vendor
  const totals = data.reduce((acc, item) => {
    const vendor = item['Recipient Name'] || 'Unknown';
    acc[vendor] = (acc[vendor] || 0) + item['Award Amount'];
    return acc;
  }, {});

  // Convert to array and get top 5
  const topVendors = Object.entries(totals)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);

  return (
    <div className="bg-[#1c2333] p-4 rounded-lg shadow-lg">
      <h2 className="text-xl mb-4 font-semibold">Top 5 Vendors by Award Amount</h2>
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
          <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export default TopVendorsChart;
