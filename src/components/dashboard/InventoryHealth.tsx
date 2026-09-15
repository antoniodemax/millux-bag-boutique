interface InventoryHealthProps {
  data: { inStock: number; lowStock: number; outOfStock: number } | null;
}

const SEGMENTS = [
  { key: 'inStock', label: 'In stock', color: '#0A0A0A' },
  { key: 'lowStock', label: 'Low stock (≤5)', color: '#A27627' },
  { key: 'outOfStock', label: 'Out of stock', color: '#C9C3B6' },
] as const;

/** Simple stacked bar of product stock status */
export const InventoryHealth = ({ data }: InventoryHealthProps) => {
  const total = data ? data.inStock + data.lowStock + data.outOfStock : 0;

  if (!data || total === 0) {
    return <p className="text-sm text-[#5B5852] py-8 text-center">No products in inventory yet.</p>;
  }

  return (
    <div>
      <div className="flex h-3 w-full overflow-hidden rounded-full bg-[#F5F2EC]">
        {SEGMENTS.map((seg) => {
          const value = data[seg.key];
          if (value === 0) return null;
          return (
            <div
              key={seg.key}
              style={{ width: `${(value / total) * 100}%`, backgroundColor: seg.color }}
              title={`${seg.label}: ${value}`}
            />
          );
        })}
      </div>
      <ul className="mt-5 space-y-3">
        {SEGMENTS.map((seg) => (
          <li key={seg.key} className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2.5 text-[#5B5852]">
              <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: seg.color }} />
              {seg.label}
            </span>
            <span className="font-sans font-semibold tabular-nums text-base text-[#0A0A0A]">{data[seg.key]}</span>
          </li>
        ))}
        <li className="flex items-center justify-between text-xs text-[#8C887F] pt-2 border-t border-[#E4E0D7]">
          <span>Products</span>
          <span>{total}</span>
        </li>
      </ul>
    </div>
  );
};
