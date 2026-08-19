import {
  TrendingUp as LuTrendingUp,
  ShoppingCart as LuShoppingCart,
  PackageMinus as LuPackageMinus,
  Store as LuStore,
} from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string | number;
  trend: string;
  icon: keyof typeof IconMap;
  color?: 'green' | 'orange' | 'red' | 'blue';
}

const IconMap = {
  TrendingUp: LuTrendingUp,
  ShoppingCart: LuShoppingCart,
  PackageMinus: LuPackageMinus,
  Store: LuStore,
} as const;

export const StatCard = ({ label, value, trend, icon, color = 'green' }: StatCardProps) => {
  const Icon = IconMap[icon];

  return (
    <div className="bg-card/80 backdrop-blur rounded-xl border border-border/20 p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <Icon className={`h-4 w-4 text-${color}-500`} />
          <h3 className="text-text-sm font-medium text-text-muted">{label}</h3>
        </div>
        <p className="text-text-sm font-medium text-text-muted">{trend}</p>
      </div>
      <p className="text-2xl font-bold text-primary">{typeof value === 'number' ? value.toLocaleString() : value}</p>
    </div>
  );
};