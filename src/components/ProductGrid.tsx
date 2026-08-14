import { ProductCard } from "./ProductCard";

interface ProductGridProps {
  products: {
    id: string;
    name: string;
    slug: string;
    category: string;
    price: number;
    images: String[];
  }[];
  className?: string;
}

export const ProductGrid = ({ products, className = "" }: ProductGridProps) => {
  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No products found.</p>
      </div>
    );
  }

  return (
    <div className={`${className} grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6`}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};