import { useMemo } from "react";
import { Link } from "react-router-dom";
import { products } from "@/data/products";
import { ProductGrid } from "@/components/ProductGrid";
import SEO from "@/components/SEO";

const NewArrivals = () => {
  const newArrivals = useMemo(() => {
    return products.filter(p => p.newArrival);
  }, [products]);

  return (
    <>
      <SEO
        title="New Arrivals - Millux Collections"
        description="Discover the latest additions to the Millux Collections."
        keywords="Millux Collections, new arrivals, luxury bags, latest bags"
      />
      <div className="min-h-[calc(100vh-88px)] bg-background py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <h1 className="font-playfair text-3xl md:text-4xl text-primary mb-4">
              New Arrivals
            </h1>
            <p className="text-text-secondary max-w-md">
              Explore our latest arrivals, each piece meticulously crafted to
              embody the Millux philosophy of carried intention.
            </p>
          </div>

          {newArrivals.length === 0 && (
            <div className="text-center py-16">
              <p className="text-text-muted">No new arrivals at the moment.</p>
            </div>
          )}

          <ProductGrid products={newArrivals} />
        </div>
      </div>
    </>
  );
};

export default NewArrivals;