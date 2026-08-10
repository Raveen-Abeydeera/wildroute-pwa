import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { time: '00:00', incidents: 10 },
  { time: '04:00', incidents: 15 },
  { time: '08:00', incidents: 40 },
  { time: '12:00', incidents: 25 },
  { time: '16:00', incidents: 65 },
  { time: '20:00', incidents: 85 },
];

export default function PeakConflictHoursChart() {
  return (
    <div className="p-6 bg-[#1E272E] rounded-lg shadow-md border border-[#2C3E50]/50">
      <h2 className="text-xl font-bold text-white mb-6">Peak Conflict Hours</h2>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#2C3E50" />
            <XAxis dataKey="time" stroke="#95A5A6" tick={{ fill: '#95A5A6' }} />
            <YAxis stroke="#95A5A6" tick={{ fill: '#95A5A6' }} />
            <Tooltip 
              cursor={{ fill: '#2C3E50' }}
              contentStyle={{ borderRadius: '8px', border: 'none', backgroundColor: '#1E272E', color: '#ECF0F1', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.5)' }}
              itemStyle={{ color: '#f39c12' }}
            />
            <Bar dataKey="incidents" name="Incidents" fill="#f39c12" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
