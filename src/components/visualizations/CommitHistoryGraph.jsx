import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import moment from 'moment';

export const CommitHistoryGraph = ({ commitData }) => {
  // Format data for the chart: { week: 'YYYY-MM-DD', commits: total_commits }
  const chartData = commitData.map(d => ({
    week: moment.unix(d.week).format('MMM DD'),
    commits: d.total,
  }));

  return (
    <div className="w-full h-[400px] bg-slate-800/50 backdrop-blur-lg border border-slate-700 p-4 rounded-xl shadow-lg">
      <h3 className="text-xl font-bold mb-4 text-slate-100">Weekly Commits (Last Year)</h3>
      <ResponsiveContainer>
        <BarChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#475569" vertical={false} />
          <XAxis
            dataKey="week"
            stroke="#94a3b8"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="#94a3b8"
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }}
            contentStyle={{
              backgroundColor: '#1e293b',
              border: '1px solid #334155',
              borderRadius: '0.5rem',
              color: '#f1f5f9'
            }}
          />
          <Legend wrapperStyle={{ color: '#cbd5e1' }} />
          <Bar
            dataKey="commits"
            fill="url(#colorUv)"
            radius={[4, 4, 0, 0]}
          />
          <defs>
            <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#2563eb" stopOpacity={0.8}/>
            </linearGradient>
          </defs>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};