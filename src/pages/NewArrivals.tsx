import { useCallback, useEffect, useState } from 'react';
import SEO from '@/components/SEO';
import { ProductGrid } from '@/components/ProductGrid';
import { Container, PageHeading, ProductGridSkeleton, ErrorState, EmptyState } from '@/components/store/Primitives';
import { getNewArrivals } from '@/services/productService';
import type { Product } from '@/types/models';

const NewArrivals = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setProducts(await getNewArrivals());
    } catch {
      setError('We could not load the new arrivals right now.');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <>
      <SEO
        title="New arrivals - Millux Collections"
        description="The latest additions to the Millux Collections range of luxury bags."
        keywords="Millux Collections, new arrivals, luxury bags, latest bags"
      />
      <Container className="pb-20 lg:pb-28">
        <PageHeading
          eyebrow="Just in"
          title="New arrivals"
          description="The newest pieces to join the collection."
        />

        {loading ? (
          <ProductGridSkeleton count={8} />
        ) : error ? (
          <ErrorState title="New arrivals are unavailable" message={error} onRetry={load} />
        ) : products.length === 0 ? (
          <EmptyState
            title="Nothing new just yet"
            message="Browse the full collection while the next pieces arrive."
            action={{ to: '/shop', label: 'Shop all bags' }}
          />
        ) : (
          <>
            <p className="brand-label mb-6 text-faint">
              {products.length} {products.length === 1 ? 'piece' : 'pieces'}
            </p>
            <ProductGrid products={products} columns={4} />
          </>
        )}
      </Container>
    </>
  );
};

export default NewArrivals;
