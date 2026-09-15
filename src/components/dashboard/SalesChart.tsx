import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { formatMoney } from '@/components/admin/ui';

interface SalesChartProps {
  data: Array<{ day: string; total: number }>;
}

const formatDay = (day: string) => {
  const d = new Date(`${day}T00:00:00`);
  if (Number.isNaN(d.getTime())) return day;
  return d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric' });
};

export const SalesChart = ({ data }: SalesChartProps) => {
  const hasSales = data.some((d) => d.total > 0);

  if (data.length === 0) {
    return <p className="text-sm text-[#5B5852] py-8 text-center">No sales data available.</p>;
  }

  return (
    <div>
      {!hasSales && (
        <p className="text-xs text-[#8C887F] mb-3 !leading-normal md:!text-xs">
          No sales recorded in the last 7 days.
        </p>
      )}
      <ResponsiveContainer width="100%" height={240}>
        <LineChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid stroke="#E4E0D7" strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="day"
            tickFormatter={formatDay}
            tick={{ fontSize: 11, fill: '#8C887F' }}
            axisLine={{ stroke: '#E4E0D7' }}
            tickLine={false}
          />
          <YAxis
            width={64}
            tick={{ fontSize: 11, fill: '#8C887F' }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(value: number) => `£${Number(value).toLocaleString('en-GB')}`}
          />
          <Tooltip
            formatter={(value: number) => [formatMoney(Number(value)), 'Sales']}
            labelFormatter={(label) => formatDay(String(label))}
            contentStyle={{ background: '#fff', border: '1px solid #E4E0D7', borderRadius: 8, fontSize: 12 }}
            labelStyle={{ color: '#5B5852' }}
            cursor={{ stroke: '#E4E0D7' }}
          />
          <Line
            type="monotone"
            dataKey="total"
            stroke="#A27627"
            strokeWidth={2}
            dot={{ r: 3, stroke: '#A27627', fill: '#fff', strokeWidth: 1.5 }}
            activeDot={{ r: 5, fill: '#A27627' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
