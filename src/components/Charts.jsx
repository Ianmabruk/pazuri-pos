import React from 'react';
import {
  PieChart as RePieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Legend
} from 'recharts';

const COLORS = ['#4f46e5', '#06b6d4', '#f97316', '#ef4444', '#10b981', '#a78bfa'];

export default function Charts({ data = [], title = '', type = 'pie' }) {
  if (!Array.isArray(data)) return null;

  return (
    <div className="card padded" style={{ minHeight: 240 }}>
      <p style={{ fontWeight: 700, marginBottom: 8 }}>{title}</p>
      <div style={{ width: '100%', height: 220 }}>
        <ResponsiveContainer>
          {type === 'pie' ? (
            <RePieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={70}
                fill="#8884d8"
                label
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </RePieChart>
          ) : (
            <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 5 }}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill={COLORS[0]} />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
}
