import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useState } from 'react';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF', '#FF4560'];

export const LanguageChart = ({ languageData }) => {
  const [activeIndex, setActiveIndex] = useState(null);
  // Convert { JavaScript: 1024 } to [{ name: 'JavaScript', value: 1024 }]
  const chartData = Object.entries(languageData)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value); // Sort for a cleaner look

  if (chartData.length === 0) {
    return (
      <div className="bg-gray-800 p-4 rounded-lg shadow-lg text-center h-full flex items-center justify-center">
        <p>No language data available.</p>
      </div>
    );
  }

  const onPieEnter = (_, index) => {
    setActiveIndex(index);
  };

  const onPieLeave = () => {
    setActiveIndex(null);
  };

  return (
    <div className="w-full h-[400px] bg-slate-800/50 backdrop-blur-lg border border-slate-700 p-4 rounded-xl shadow-lg">
      <h3 className="text-xl font-bold mb-4 text-slate-100">Language Breakdown</h3>
      <ResponsiveContainer>
        <PieChart>
          <Pie
            activeIndex={activeIndex}
            inactiveShape={{ opacity: 0.7 }}
            activeShape={{ r: '85%' }}
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius="80%"
            fill="#8884d8"
            dataKey="value"
            nameKey="name"
            onMouseEnter={onPieEnter}
            onMouseLeave={onPieLeave}
            label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            cursor={{ fill: 'rgba(255, 255, 255, 0.1)' }}
            contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '0.5rem' }}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};