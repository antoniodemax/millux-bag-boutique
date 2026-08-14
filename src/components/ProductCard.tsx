import { Link } from "react-router-dom";
import { formatPrice } from "@/lib/utils";

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
  const { name, category, price, images, slug } = product;
  const imageUrl = images[0] || '/images/handbags-category.png';

  return (
    <Link
      to={`/products/${slug}`}
      className="block group"
    >
      <div className="aspect-[4/5] w-full bg-surface overflow-hidden rounded-xl border border-subtle hover:shadow-md transition-shadow duration-300 hover:scale-[1.02]">
        <img
          src={imageUrl}
          alt={name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="pt-4">
        <p className="text-sm uppercase tracking-widest text-text-muted mb-1">
          {category}
        </p>
        <h3 className="font-playfair text-lg text-primary mb-2 line-tight">
          {name}
        </h3>
        <p className="font-medium text-accent">{formatPrice(price)}</p>
      </div>
    </Link>
  );
};