import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

interface PaymentMixProps {
  data: Array<{ method: string; amount: number; count: number }>;
}

const COLORS = ['#10b981', '#3b82f6', '#8b5cf6', '#ec4899', '#f97316', '#6366f1'];

export const PaymentMix = ({ data }: PaymentMixProps) => {
  if (data.length === 0) {
    return (
      <div className="bg-card/80 backdrop-blur rounded-xl border border-border/20 p-6">
        <h3 className="text-text-sm font-medium text-text-muted mb-4">Payment Mix</h3>
        <p className="text-text-muted">No payment data available</p>
      </div>
    );
  }

  return (
    <div className="bg-card/80 backdrop-blur rounded-xl border border-border/20 p-6">
      <h3 className="text-text-sm font-medium text-text-muted mb-4">Payment Mix</h3>
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie
            data={data}
            dataKey="amount"
            nameKey="method"
            cx="50%"
            cy="50%"
            innerRadius="60%"
            outerRadius="80%"
            labelLine={false}
            label={({ name, value, percent }) => (
              <text
                x={0}
                y={0}
                textAnchor="middle"
                dominantBaseline="middle"
                fill="#fff"
                fontSize={12}
              >
                {name}
              </text>
            )}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value) => `£{value}`}
            contentStyle={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 4, padding: 8 }}
            labelStyle={{ fontSize: 12, color: '#64748b' }}
            wrapperStyle={{ pointerEvents: 'none' }}
          />
          <Legend verticalAlign="top" height={36} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};