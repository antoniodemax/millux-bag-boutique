import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Dot } from 'recharts';

interface SalesChartProps {
  data: Array<{ day: string; total: number }>;
}

export const SalesChart = ({ data }: SalesChartProps) => {
  if (data.length === 0) {
    return (
      <div className="bg-card/80 backdrop-blur rounded-xl border border-border/20 p-6">
        <p className="text-text-muted">No sales data available</p>
      </div>
    );
  }

  return (
    <div className="bg-card/80 backdrop-blur rounded-xl border border-border/20 p-6">
      <h3 className="text-text-sm font-medium text-text-muted mb-4">Sales by Day (Last 7 Days)</h3>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="day" tick={({ x, y, width, height, payload }: any) => (
            <text
              x={x}
              y={y + 15}
              dy={0}
              textAnchor="middle"
              style={{ fontSize: 12, fill: '#9CA3AF' }}
            >
              {payload}
            </text>
          )} />
          <YAxis tickCount={4} tickFormatter={(value) => `£{value}`} domain={['auto', 'auto']} />
          <Tooltip
            formatter={(value) => `£{value}`}
            contentStyle={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 4, padding: 8 }}
            labelStyle={{ fontSize: 12, color: '#64748b' }}
            wrapperStyle={{ pointerEvents: 'none' }}
          />
          <Line type="monotone" dataKey="total" stroke="#10b981" strokeWidth={2} />
          <Dot dataKey="total" stroke="#10b981" strokeWidth={2} r={4} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};