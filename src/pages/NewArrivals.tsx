import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ProductGrid } from "@/components/ProductGrid";
import SEO from "@/components/SEO";
import { getNewArrivals } from "@/services/productService";

const NewArrivals = () => {
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNewArrivals = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getNewArrivals();
        setNewArrivals(data);
      } catch (err) {
        console.error('Failed to fetch new arrivals:', err);
        setError('Failed to load new arrivals. Please try again later.');
        setNewArrivals([]);
      } finally {
        setLoading(false);
      }
    };

    fetchNewArrivals();
  }, []); // Empty deps means run once on mount

  return (
    <>
      <SEO
        title="New Arrivals - Millux Collections"
        description="Discover the latest additions to the Millux Collections."
        keywords="Millux Collections, new arrivals, luxury bags, latest bags"
      />
      {loading && (
        <div className="min-h-[calc(100vh-88px)] bg-background">
          <div className="flex items-center justify-center min-h-[calc(100vh-88px)]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </div>
      )}
      {error && (
        <div className="min-h-[calc(100vh-88px)] bg-background">
          <div className="flex items-center justify-center min-h-[calc(100vh-88px)] text-center px-6">
            <p className="text-text-muted">Unable to load new arrivals right now. Please try again.</p>
          </div>
        </div>
      )}
      {!loading && !error && (
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
      )}
    </>
  );
};

export default NewArrivals;