import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import SEO from '@/components/SEO';
import { Logo } from '@/components/brand/Logo';
import { StoreButton } from '@/components/store/Button';
import { Container, SectionHeading, ProductGridSkeleton, ErrorState, EmptyState, Skeleton } from '@/components/store/Primitives';
import { ProductGrid } from '@/components/ProductGrid';
import { getProducts } from '@/services/productService';
import { getAvailableCategories } from '@/services/categoryService';
import type { Product, Category } from '@/types/models';

const WHATSAPP_URL = `https://wa.me/254723425778?text=${encodeURIComponent("Hi! I'm interested in your bags from Millux Collections")}`;
const HERO_IMAGE = '/images/handbags-category.png';

type LoadState = 'loading' | 'ready' | 'error';

/**
 * Homepage. Every product shown comes from the catalogue API; sections that
 * have nothing to show are omitted rather than padded with placeholders.
 */
const HomePage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [state, setState] = useState<LoadState>('loading');

  const load = useCallback(async () => {
    setState('loading');
    try {
      const [productList, categoryList] = await Promise.all([getProducts(), getAvailableCategories()]);
      setProducts(productList);
      setCategories(categoryList);
      setState('ready');
    } catch {
      setState('error');
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const featured = useMemo(() => {
    const flagged = products.filter((p) => p.featured);
    return (flagged.length > 0 ? flagged : products).slice(0, 4);
  }, [products]);
  const newArrivals = useMemo(() => products.filter((p) => p.newArrival).slice(0, 4), [products]);
  const bestsellers = useMemo(() => products.filter((p) => p.bestseller).slice(0, 4), [products]);

  // A representative image for each category: the category's own image, else its first product's
  const categoryTiles = useMemo(
    () =>
      categories
        .map((c) => {
          const sample = products.find((p) => p.category === c.name);
          return { ...c, image: c.image || sample?.images?.[0] || '', count: products.filter((p) => p.category === c.name).length };
        })
        .filter((c) => c.count > 0),
    [categories, products]
  );

  return (
    <>
      <SEO
        title="Millux Collections | Luxury Bags & Accessories"
        description="Millux Collections: luxury handbags and accessories from Nairobi. Browse the collection and order personally over WhatsApp."
        image="/images/millux.png"
      />

      {/* ---------------- HERO ---------------- */}
      <section className="border-b border-line">
        <Container className="grid items-center gap-10 py-10 sm:py-14 lg:grid-cols-2 lg:gap-16 lg:py-14 xl:py-16">
          <div className="order-2 lg:order-1">
            <p className="brand-label text-gold-deep">Nairobi · Luxury bags &amp; accessories</p>
            <h1 className="mt-5 text-display-xl">
              Carried with <em className="not-italic text-gold">intent</em>.
            </h1>
            <p className="mt-6 max-w-md text-base leading-relaxed text-soft sm:text-lg">
              Structured totes, shoulder bags and clutches chosen for the way you move through the day. Browse the collection and order personally over WhatsApp.
            </p>
            <div className="mt-8 flex flex-col gap-4 xs:flex-row xs:items-center xs:gap-6">
              <StoreButton asChild variant="gold" size="lg" className="xs:min-w-[220px]">
                <Link to="/shop">Shop the collection</Link>
              </StoreButton>
              <Link to="/new-arrivals" className="brand-link self-start xs:self-auto">
                New arrivals
              </Link>
            </div>
          </div>

          <div className="order-1 lg:order-2">
            {/* Capped width keeps the bag refined on wide screens instead of filling the column */}
            <div className="relative mx-auto aspect-[4/5] w-full max-w-sm overflow-hidden bg-stone sm:max-w-md lg:mr-0 lg:max-w-[460px] xl:max-w-[520px] 2xl:max-w-[560px]">
              <img
                src={HERO_IMAGE}
                alt="A structured Millux handbag with quilted leather and gold clasp"
                width={1024}
                height={1024}
                loading="eager"
                decoding="async"
                className="absolute left-1/2 top-0 h-[125%] w-auto max-w-none -translate-x-1/2"
              />
            </div>
          </div>
        </Container>
      </section>

      {state === 'error' && (
        <Container>
          <ErrorState title="The collection is unavailable" message="We could not reach the catalogue. Please try again in a moment." onRetry={load} />
        </Container>
      )}

      {state === 'loading' && (
        <Container className="py-16 sm:py-20">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="mt-4 h-8 w-64" />
          <div className="mt-10">
            <ProductGridSkeleton count={4} />
          </div>
        </Container>
      )}

      {state === 'ready' && products.length === 0 && (
        <Container>
          <EmptyState
            title="The collection is being prepared"
            message="New pieces are on their way. Message us on WhatsApp and we will let you know the moment they arrive."
            action={{ onClick: () => window.open(WHATSAPP_URL, '_blank', 'noopener'), label: 'WhatsApp us' }}
          />
        </Container>
      )}

      {state === 'ready' && products.length > 0 && (
        <>
          {/* ---------------- FEATURED ---------------- */}
          <section className="py-16 sm:py-20 lg:py-24">
            <Container>
              <SectionHeading eyebrow="Featured" title="Pieces of the season" link={{ to: '/shop', label: 'View all' }} />
              <div className="mt-10 lg:mt-14">
                <ProductGrid products={featured} columns={4} />
              </div>
            </Container>
          </section>

          {/* ---------------- CATEGORIES ---------------- */}
          {categoryTiles.length > 1 && (
            <section className="border-y border-line bg-stone py-16 sm:py-20 lg:py-24">
              <Container>
                <SectionHeading eyebrow="Browse" title="By silhouette" />
                <ul className="mt-10 grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:mt-14 xl:grid-cols-5">
                  {categoryTiles.map((c) => (
                    <li key={c.id}>
                      <Link to={`/shop?category=${encodeURIComponent(c.name)}`} className="group block focus-ring">
                        <div className="aspect-[3/4] w-full overflow-hidden bg-paper">
                          {c.image && (
                            <img
                              src={c.image}
                              alt=""
                              loading="lazy"
                              decoding="async"
                              className="h-full w-full object-cover object-[center_20%] transition-transform duration-700 ease-out motion-safe:group-hover:scale-[1.04]"
                            />
                          )}
                        </div>
                        <div className="mt-3 flex items-baseline justify-between gap-2">
                          <span className="font-display text-base text-ink group-hover:text-gold-deep transition-colors sm:text-lg">{c.name}</span>
                          <span className="brand-label text-faint">{c.count}</span>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </Container>
            </section>
          )}

          {/* ---------------- NEW ARRIVALS ---------------- */}
          {newArrivals.length > 0 && (
            <section className="py-16 sm:py-20 lg:py-24">
              <Container>
                <SectionHeading eyebrow="Just in" title="New arrivals" link={{ to: '/new-arrivals', label: 'See all new arrivals' }} />
                <div className="mt-10 lg:mt-14">
                  <ProductGrid products={newArrivals} columns={4} />
                </div>
              </Container>
            </section>
          )}

          {/* ---------------- HOUSE ---------------- */}
          <section className="bg-ink text-paper">
            <Container className="grid gap-10 py-16 sm:py-20 lg:grid-cols-[1fr_1.2fr] lg:items-center lg:gap-20 lg:py-28">
              <div>
                <Logo on="dark" className="h-16 sm:h-20 lg:h-24" linked={false} />
              </div>
              <div>
                <p className="brand-label text-gold-bright">From the founder</p>
                <blockquote className="mt-5 font-display text-2xl leading-snug sm:text-3xl lg:text-[2.25rem]">
                  “I believe the right bag can transform your entire day. That's why we're dedicated to offering pieces that are as beautiful as they are functional.”
                </blockquote>
                <p className="mt-6 text-sm text-paper/70">Milkah Adhiambo, founder</p>
                <Link to="/about" className="brand-link mt-8 inline-block !text-paper !border-paper/60 hover:!text-gold-bright hover:!border-gold-bright">
                  About the house
                </Link>
              </div>
            </Container>
          </section>

          {/* ---------------- BESTSELLERS ---------------- */}
          {bestsellers.length > 0 && (
            <section className="py-16 sm:py-20 lg:py-24">
              <Container>
                <SectionHeading eyebrow="Most loved" title="Bestsellers" link={{ to: '/shop', label: 'Shop all' }} />
                <div className="mt-10 lg:mt-14">
                  <ProductGrid products={bestsellers} columns={4} />
                </div>
              </Container>
            </section>
          )}
        </>
      )}

      {/* ---------------- ASSISTANCE ---------------- */}
      <section className="border-t border-line bg-stone">
        <Container className="flex flex-col gap-6 py-12 sm:py-16 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-xl">
            <p className="brand-label text-gold-deep">Personal service</p>
            <h2 className="mt-3 text-display-sm">Orders are confirmed over WhatsApp.</h2>
            <p className="mt-3 text-sm leading-relaxed text-soft sm:text-base">
              Add pieces to your bag, then send your order to us. We confirm availability, delivery and payment with you personally.
            </p>
          </div>
          <StoreButton asChild variant="secondary" size="lg" className="self-start lg:self-auto">
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">Message us on WhatsApp</a>
          </StoreButton>
        </Container>
      </section>
    </>
  );
};

export default HomePage;
