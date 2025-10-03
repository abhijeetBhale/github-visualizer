import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import moment from 'moment';

export const CommitHistoryGraph = ({ commitData }) => {
  // Format data for the chart: { week: 'YYYY-MM-DD', commits: total_commits }
  const chartData = commitData.map(d => ({
    week: moment.unix(d.week).format('MMM DD'),
    commits: d.total,
  }));

  return (
    <div className="w-full h-[400px] bg-gray-800 p-4 rounded-lg shadow-lg">
      <h3 className="text-xl font-bold mb-4 text-white">Weekly Commits (Last Year)</h3>
      <ResponsiveContainer>
        <BarChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis dataKey="week" stroke="#9ca3af" fontSize={12} />
          <YAxis stroke="#9ca3af" />
          <Tooltip
            cursor={{ fill: 'rgba(255, 255, 255, 0.1)' }}
            contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '0.5rem' }}
          />
          <Legend />
          <Bar dataKey="commits" fill="#00C49F" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};