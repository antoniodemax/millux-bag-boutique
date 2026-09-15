import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search } from 'lucide-react';
import SEO from '@/components/SEO';
import { ProductGrid } from '@/components/ProductGrid';
import {
  Container,
  PageHeading,
  ProductGridSkeleton,
  ErrorState,
  EmptyState,
  inputClass,
  selectClass,
  selectChevron,
} from '@/components/store/Primitives';
import { getProducts } from '@/services/productService';
import { getCategories } from '@/services/categoryService';
import type { Product, Category } from '@/types/models';
import { cn } from '@/lib/utils';

type SortKey = 'featured' | 'newest' | 'bestseller' | 'price-low' | 'price-high' | 'name';

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: 'featured', label: 'Featured' },
  { value: 'newest', label: 'New arrivals' },
  { value: 'bestseller', label: 'Best sellers' },
  { value: 'price-low', label: 'Price: low to high' },
  { value: 'price-high', label: 'Price: high to low' },
  { value: 'name', label: 'Name: A to Z' },
];

const WHATSAPP_URL = 'https://wa.me/254723425778';

const Collections = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedCategory = searchParams.get('category') ?? '';

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<SortKey>('featured');

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [productsData, categoriesData] = await Promise.all([getProducts(), getCategories()]);
      setProducts(productsData);
      setCategories(categoriesData);
    } catch {
      setError('We could not load the collection right now.');
      setProducts([]);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const setCategory = (name: string) => {
    const next = new URLSearchParams(searchParams);
    if (name) next.set('category', name);
    else next.delete('category');
    setSearchParams(next, { replace: true });
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSortBy('featured');
    setCategory('');
  };

  // Categories to offer: every API category plus any category a product uses that the API list lacks
  const categoryNames = useMemo(() => {
    const names = new Set<string>(categories.map((c) => c.name));
    products.forEach((p) => names.add(p.category));
    return Array.from(names);
  }, [categories, products]);

  const filtered = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return products
      .filter((p) => {
        if (selectedCategory && p.category !== selectedCategory) return false;
        if (term && !p.name.toLowerCase().includes(term) && !p.category.toLowerCase().includes(term)) return false;
        return true;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case 'featured':
            return Number(b.featured ?? false) - Number(a.featured ?? false);
          case 'newest':
            return Number(b.newArrival ?? false) - Number(a.newArrival ?? false);
          case 'bestseller':
            return Number(b.bestseller ?? false) - Number(a.bestseller ?? false);
          case 'price-low':
            return a.price - b.price;
          case 'price-high':
            return b.price - a.price;
          case 'name':
            return a.name.localeCompare(b.name);
          default:
            return 0;
        }
      });
  }, [products, selectedCategory, searchTerm, sortBy]);

  const hasActiveFilter = Boolean(selectedCategory || searchTerm.trim());

  return (
    <>
      <SEO
        title="Shop all bags - Millux Collections"
        description="Browse the full Millux Collections range of luxury bags and accessories."
        keywords="Millux Collections, luxury bags, handbags, totes, crossbody, clutches"
      />
      <Container className="pb-20 lg:pb-28">
        <PageHeading
          eyebrow="The collection"
          title="All bags"
          description="Every piece in the Millux range, from structured totes to evening clutches."
        />

        {/* Filters */}
        <div className="border-y border-line py-4 sm:py-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            {/* Category chips: horizontal scroll on phones, no page overflow */}
            <div
              role="group"
              aria-label="Filter by category"
              className="-mx-4 flex gap-6 overflow-x-auto px-4 sm:-mx-6 sm:px-6 lg:mx-0 lg:px-0 lg:flex-wrap"
              style={{ scrollbarWidth: 'none' }}
            >
              <CategoryChip active={!selectedCategory} onClick={() => setCategory('')}>
                All
              </CategoryChip>
              {categoryNames.map((name) => (
                <CategoryChip key={name} active={selectedCategory === name} onClick={() => setCategory(name)}>
                  {name}
                </CategoryChip>
              ))}
            </div>

            <div className="grid grid-cols-1 gap-3 xs:grid-cols-2 lg:flex lg:shrink-0 lg:gap-3">
              <div className="relative">
                <label htmlFor="shop-search" className="sr-only">
                  Search the collection
                </label>
                <Search
                  className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-faint"
                  strokeWidth={1.5}
                  aria-hidden="true"
                />
                <input
                  id="shop-search"
                  type="search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search"
                  className={cn(inputClass, 'pl-11 lg:w-56')}
                />
              </div>
              <div>
                <label htmlFor="shop-sort" className="sr-only">
                  Sort products
                </label>
                <select
                  id="shop-sort"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortKey)}
                  className={cn(selectClass, 'lg:w-52')}
                  style={selectChevron}
                >
                  {SORT_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 sm:mt-10">
          {loading ? (
            <ProductGridSkeleton count={8} />
          ) : error ? (
            <ErrorState title="The collection is unavailable" message={error} onRetry={load} />
          ) : products.length === 0 ? (
            <EmptyState
              title="Nothing here yet"
              message="New pieces are on their way. Ask us on WhatsApp about what is coming."
              action={{ onClick: () => window.open(WHATSAPP_URL, '_blank', 'noopener,noreferrer'), label: 'WhatsApp us' }}
            />
          ) : filtered.length === 0 ? (
            <EmptyState
              title="No pieces match"
              message="Try another category or clear your search."
              action={{ onClick: clearFilters, label: 'Clear filters' }}
            />
          ) : (
            <>
              <div className="mb-6 flex items-center justify-between gap-4">
                <p className="brand-label text-faint" aria-live="polite">
                  {filtered.length} {filtered.length === 1 ? 'piece' : 'pieces'}
                  {selectedCategory ? ` in ${selectedCategory}` : ''}
                </p>
                {hasActiveFilter && (
                  <button type="button" onClick={clearFilters} className="brand-link">
                    Clear
                  </button>
                )}
              </div>
              <ProductGrid products={filtered} columns={4} />
            </>
          )}
        </div>
      </Container>
    </>
  );
};

const CategoryChip = ({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) => (
  <button
    type="button"
    onClick={onClick}
    aria-pressed={active}
    className={cn(
      'brand-label shrink-0 whitespace-nowrap border-b py-3 transition-colors focus-ring',
      active ? 'border-gold text-ink' : 'border-transparent text-soft hover:text-ink'
    )}
  >
    {children}
  </button>
);

export default Collections;
