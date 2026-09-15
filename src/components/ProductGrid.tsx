import { ProductCard, type ProductCardProduct } from './ProductCard';
import { cn } from '@/lib/utils';

/**
 * Responsive catalogue grid: 2 columns on phones, 3 on tablets, 4 on wide
 * screens. Gutters stay tight so the imagery reads as one composed page.
 */
export const ProductGrid = ({
  products,
  className,
  columns = 4,
}: {
  products: ProductCardProduct[];
  className?: string;
  columns?: 3 | 4;
}) => {
  if (products.length === 0) return null;
  return (
    <div
      className={cn(
        'grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-6 sm:gap-y-10 md:grid-cols-3',
        columns === 4 && 'xl:grid-cols-4',
        className
      )}
    >
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

export default ProductGrid;
