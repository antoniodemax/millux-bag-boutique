import { Link } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { useCart } from '@/context/CartContext';
import { toast } from '@/components/ui/sonner';
import type { Product } from '@/types/models';
import { cn } from '@/lib/utils';

export type ProductCardProduct = Pick<Product, 'id' | 'name' | 'slug' | 'category' | 'price' | 'images'> &
  Partial<Pick<Product, 'availability' | 'stock' | 'newArrival' | 'bestseller' | 'featured'>>;

const FALLBACK_IMAGE = '/images/handbags-category.png';

/**
 * Catalogue card. The image carries the card; type sits quietly beneath it.
 * The add-to-bag control is a 44px target on every viewport with an
 * accessible label, and is disabled when the piece is sold out.
 */
export const ProductCard = ({ product, className }: { product: ProductCardProduct; className?: string }) => {
  const { addItem } = useCart();
  const image = product.images?.[0] || FALLBACK_IMAGE;
  const soldOut = product.availability === 'out_of_stock' || product.stock === 0;
  const lowStock = !soldOut && (product.availability === 'low_stock' || (typeof product.stock === 'number' && product.stock > 0 && product.stock <= 5));

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (soldOut) return;
    addItem(product);
    toast.success(`${product.name} added to your bag`);
  };

  return (
    <article className={cn('group', className)}>
      <div className="relative">
        <Link to={`/products/${product.slug}`} className="block focus-ring" aria-label={`${product.name}, ${formatPrice(product.price)}`}>
          <div className="relative aspect-[4/5] w-full overflow-hidden bg-stone">
            <img
              src={image}
              alt={product.name}
              loading="lazy"
              decoding="async"
              className={cn(
                'h-full w-full object-cover transition-transform duration-700 ease-out motion-safe:group-hover:scale-[1.04]',
                soldOut && 'opacity-70'
              )}
            />
            {product.newArrival && !soldOut && (
              <span className="absolute left-3 top-3 bg-paper px-2 py-1 brand-label text-ink">New</span>
            )}
            {soldOut && (
              <span className="absolute left-3 top-3 bg-ink px-2 py-1 brand-label text-paper">Sold out</span>
            )}
          </div>
        </Link>

        <button
          type="button"
          onClick={handleAdd}
          disabled={soldOut}
          aria-label={soldOut ? `${product.name} is sold out` : `Add ${product.name} to bag`}
          className={cn(
            'absolute bottom-3 right-3 z-10 flex h-11 w-11 items-center justify-center bg-paper text-ink shadow-sm transition-colors focus-ring',
            'hover:bg-ink hover:text-paper disabled:opacity-0 disabled:pointer-events-none',
            'lg:opacity-0 lg:translate-y-1 lg:group-hover:opacity-100 lg:group-hover:translate-y-0 lg:focus-visible:opacity-100 lg:transition-all lg:duration-300'
          )}
        >
          <ShoppingBag className="h-[18px] w-[18px]" strokeWidth={1.5} aria-hidden="true" />
        </button>
      </div>

      <div className="mt-4 space-y-1">
        <p className="brand-label text-faint">{product.category}</p>
        <h3 className="font-display text-base sm:text-lg leading-snug text-ink">
          <Link to={`/products/${product.slug}`} className="focus-ring hover:text-gold-deep transition-colors">
            {product.name}
          </Link>
        </h3>
        <div className="flex items-baseline justify-between gap-3">
          <p className="font-sans text-sm text-body">{formatPrice(product.price)}</p>
          {lowStock && <span className="brand-label text-warning">Few left</span>}
        </div>
      </div>
    </article>
  );
};

export default ProductCard;
