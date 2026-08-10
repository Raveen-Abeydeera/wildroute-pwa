import React, { useState } from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

// 1. Define your mock data structures
// In a real scenario, you would fetch this from your backend API.
const sightingData = {
  days: [
    { period: 'Mon', sightings: 12 },
    { period: 'Tue', sightings: 19 },
    { period: 'Wed', sightings: 15 },
    { period: 'Thu', sightings: 22 },
    { period: 'Fri', sightings: 28 },
    { period: 'Sat', sightings: 35 },
    { period: 'Sun', sightings: 31 },
  ],
  months: [
    { period: 'Jan', sightings: 120 },
    { period: 'Feb', sightings: 145 },
    { period: 'Mar', sightings: 110 },
    { period: 'Apr', sightings: 180 },
    { period: 'May', sightings: 210 },
    { period: 'Jun', sightings: 195 },
  ],
  years: [
    { period: '2022', sightings: 1450 },
    { period: '2023', sightings: 1620 },
    { period: '2024', sightings: 1890 },
    { period: '2025', sightings: 2100 },
    { period: '2026', sightings: 2340 },
  ]
};

export default function ElephantAnalyticsChart() {
  // 2. Manage the selected timeframe state
  const [timeframe, setTimeframe] = useState('days');

  return (
    <div className="p-6 bg-[#1E272E] rounded-lg shadow-md border border-[#2C3E50]/50">
      
      {/* Dashboard Header & Toggles */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-white">Elephant Sightings</h2>
        <div className="flex space-x-2">
          {['days', 'months', 'years'].map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-4 py-2 rounded-md capitalize transition-colors font-bold text-sm ${
                timeframe === tf 
                  ? 'bg-[#2ECC71] text-[#121212]' 
                  : 'bg-[#2C3E50] text-[#95A5A6] hover:bg-[#34495E]'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      {/* The Chart */}
      <div className="h-80 w-full">
        {/* ResponsiveContainer ensures the chart fits your dashboard grid */}
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={sightingData[timeframe]}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorSightings" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2ECC71" stopOpacity={0.5}/>
                <stop offset="95%" stopColor="#2ECC71" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#2C3E50" />
            <XAxis dataKey="period" stroke="#95A5A6" tick={{ fill: '#95A5A6' }} />
            <YAxis stroke="#95A5A6" tick={{ fill: '#95A5A6' }} />
            <Tooltip 
              contentStyle={{ borderRadius: '8px', border: 'none', backgroundColor: '#1E272E', color: '#ECF0F1', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.5)' }}
              itemStyle={{ color: '#2ECC71' }}
              cursor={{ stroke: '#2ECC71', strokeWidth: 1, strokeDasharray: '3 3' }}
            />
            <Area 
              type="monotone" 
              dataKey="sightings" 
              name="Sightings"
              stroke="#2ECC71" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorSightings)" 
              activeDot={{ r: 6, fill: '#2ECC71', stroke: '#121212', strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
}
