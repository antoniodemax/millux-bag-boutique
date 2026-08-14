import { Link } from "react-router-dom";
import { ShoppingBag } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/context/CartContext";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    slug: string;
    category: string;
    price: number;
    images: string[];
  };
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const { name, category, price, images, slug, id } = product;
  const imageUrl = images[0] || '/images/handbags-category.png';
  const { addItem } = useCart();

  return (
    <>
      <Link
        to={`/products/${slug}`}
        className="block group"
      >
        <div className="relative aspect-[4/5] w-full bg-surface overflow-hidden rounded-xl border border-subtle hover:shadow-md transition-shadow duration-300 hover:scale-[1.02]">
          <img
            src={imageUrl}
            alt={name}
            className="w-full h-full object-cover"
          />
          {/* Add to Bag button on hover */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/0 hover:bg-black/10 transition-opacity duration-300 opacity-0 hover:opacity-100 pointer-events-none">
            <ShoppingBag className="h-5 w-5 text-white" />
          </div>
          {/* Alternative: small button in corner */}
          <button
            onClick={() => addItem(product)}
            className="absolute top-3 right-3 z-10 p-1 bg-white/80 hover:bg-white/90 rounded-full transition-all duration-200 hover:scale-105 border border-border/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent/20"
            aria-label="Add to bag"
          >
            <ShoppingBag className="h-4 w-4 text-brand-primary" />
          </button>
        </div>
      </Link>
      <div className="pt-4">
        <p className="text-sm uppercase tracking-widest text-text-muted mb-1">
          {category}
        </p>
        <h3 className="font-playfair text-lg text-primary mb-2 line-tight">
          {name}
        </h3>
        <p className="font-medium text-accent">{formatPrice(price)}</p>
      </div>
    </>
  );
};