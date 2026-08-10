import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const data = [
  { name: 'Zone A Corridor', value: 45 },
  { name: 'River Bend', value: 30 },
  { name: 'Highway 9 Crossing', value: 15 },
  { name: 'North Village', value: 10 },
];

const COLORS = ['#E74C3C', '#E67E22', '#F1C40F', '#3498DB'];

export default function DangerousRoutesChart() {
  return (
    <div className="p-6 bg-[#1E272E] rounded-lg shadow-md border border-[#2C3E50]/50">
      <h2 className="text-xl font-bold text-white mb-2">Most Dangerous Routes</h2>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
              stroke="none"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ borderRadius: '8px', border: 'none', backgroundColor: '#1E272E', color: '#ECF0F1', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.5)' }}
            />
            <Legend 
               verticalAlign="bottom" 
               height={36} 
               iconType="circle"
               wrapperStyle={{ fontSize: '12px', color: '#95A5A6' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
