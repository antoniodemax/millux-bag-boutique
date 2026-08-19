import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

interface InventoryHealthProps {
  data: { inStock: number; lowStock: number; outOfStock: number } | null;
}

export const InventoryHealth = ({ data }: InventoryHealthProps) => {
  if (!data) {
    return (
      <div className="bg-card/80 backdrop-blur rounded-xl border border-border/20 p-6">
        <h3 className="text-text-sm font-medium text-text-muted mb-4">Inventory Health</h3>
        <p className="text-text-muted">No inventory data available</p>
      </div>
    );
  }

  const chartData = [
    { name: 'In Stock', value: data.inStock, color: '#10b981' },
    { name: 'Low Stock', value: data.lowStock, color: '#f97316' },
    { name: 'Out of Stock', value: data.outOfStock, color: '#ef4444' },
  ].filter(item => item.value > 0);

  if (chartData.length === 0) {
    return (
      <div className="bg-card/80 backdrop-blur rounded-xl border border-border/20 p-6">
        <h3 className="text-text-sm font-medium text-text-muted mb-4">Inventory Health</h3>
        <p className="text-text-muted">No inventory data available</p>
      </div>
    );
  }

  return (
    <div className="bg-card/80 backdrop-blur rounded-xl border border-border/20 p-6">
      <h3 className="text-text-sm font-medium text-text-muted mb-4">Inventory Health</h3>
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
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
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value) => `${value} items`}
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