import { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Minus, Plus } from 'lucide-react';
import SEO from '@/components/SEO';
import { ProductGrid } from '@/components/ProductGrid';
import { StoreButton } from '@/components/store/Button';
import {
  Container,
  SectionHeading,
  Skeleton,
  ErrorState,
  EmptyState,
  AvailabilityPill,
} from '@/components/store/Primitives';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { toast } from '@/components/ui/sonner';
import { useCart } from '@/context/CartContext';
import { getProductBySlug, getProductsByCategory } from '@/services/productService';
import type { Product } from '@/types/models';
import { formatPrice, cn } from '@/lib/utils';

const FALLBACK_IMAGE = '/images/handbags-category.png';
const WHATSAPP_NUMBER = '254723425778';

const ProductDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const { addItem } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [related, setRelated] = useState<Product[]>([]);

  const load = useCallback(async () => {
    if (!slug) return;
    setLoading(true);
    setError(null);
    setNotFound(false);
    setActiveImage(0);
    setQuantity(1);
    try {
      const data = await getProductBySlug(slug);
      if (!data) {
        setNotFound(true);
        setProduct(null);
      } else {
        setProduct(data);
      }
    } catch {
      setError('We could not load this piece right now.');
      setProduct(null);
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    load();
  }, [load]);

  // Related pieces are a secondary section: fail quietly
  useEffect(() => {
    let active = true;
    if (!product) {
      setRelated([]);
      return;
    }
    getProductsByCategory(product.category)
      .then((items) => {
        if (active) setRelated(items.filter((p) => p.id !== product.id).slice(0, 4));
      })
      .catch(() => {
        if (active) setRelated([]);
      });
    return () => {
      active = false;
    };
  }, [product]);

  if (loading) return <DetailSkeleton />;

  if (notFound) {
    return (
      <Container className="pb-20">
        <EmptyState
          title="This piece is no longer available"
          message="It may have sold out or been retired from the collection."
          action={{ to: '/shop', label: 'Shop all bags' }}
          className="py-24"
        />
      </Container>
    );
  }

  if (error || !product) {
    return (
      <Container className="pb-20">
        <ErrorState title="This piece is unavailable" message={error ?? undefined} onRetry={load} className="py-24" />
      </Container>
    );
  }

  const images = product.images && product.images.length > 0 ? product.images : [FALLBACK_IMAGE];
  const mainImage = images[Math.min(activeImage, images.length - 1)];
  const stock = typeof product.stock === 'number' ? product.stock : undefined;
  const soldOut = product.availability === 'out_of_stock' || stock === 0;
  const maxQty = stock && stock > 0 ? stock : 99;

  const changeQuantity = (delta: number) => {
    setQuantity((q) => Math.min(maxQty, Math.max(1, q + delta)));
  };

  const handleAddToBag = () => {
    if (soldOut) return;
    addItem(product, quantity);
    toast.success(`${product.name} added to your bag`);
  };

  const whatsappHref = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    `Hello Millux, I have a question about the ${product.name}.`
  )}`;

  const details = [
    { key: 'materials', label: 'Materials', value: product.materials },
    { key: 'dimensions', label: 'Dimensions', value: product.dimensions },
    { key: 'care', label: 'Care', value: product.care },
  ].filter((d) => d.value && d.value.trim().length > 0);

  return (
    <>
      <SEO
        title={`${product.name} - Millux Collections`}
        description={product.description || `${product.name} from Millux Collections.`}
        keywords={`Millux, ${product.name}, luxury bag, ${product.category}`}
        type="product"
        price={product.price}
        currency="GBP"
        availability={soldOut ? 'out_of_stock' : 'in_stock'}
        image={mainImage}
        category={product.category}
      />

      <Container className="pb-20 lg:pb-28">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="py-6 sm:py-8">
          <ol className="flex flex-wrap items-center gap-x-3 gap-y-1 brand-label text-faint">
            <li>
              <Link to="/shop" className="transition-colors hover:text-ink focus-ring">
                Shop
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link
                to={`/shop?category=${encodeURIComponent(product.category)}`}
                className="transition-colors hover:text-ink focus-ring"
              >
                {product.category}
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="text-ink truncate max-w-[60vw] sm:max-w-none">
              {product.name}
            </li>
          </ol>
        </nav>

        <div className="grid gap-10 lg:grid-cols-[11fr_9fr] lg:gap-16">
          {/* Gallery */}
          <div>
            <div className="aspect-[4/5] w-full overflow-hidden bg-stone">
              <img
                src={mainImage}
                alt={product.name}
                decoding="async"
                className={cn('h-full w-full object-cover', soldOut && 'opacity-70')}
              />
            </div>

            {images.length > 1 && (
              <div className="mt-4 flex gap-3 overflow-x-auto" style={{ scrollbarWidth: 'none' }} role="group" aria-label="Product images">
                {images.map((src, index) => (
                  <button
                    key={`${src}-${index}`}
                    type="button"
                    onClick={() => setActiveImage(index)}
                    aria-pressed={activeImage === index}
                    aria-label={`View image ${index + 1} of ${images.length}`}
                    className={cn(
                      'h-20 w-20 shrink-0 overflow-hidden border bg-stone transition-colors focus-ring',
                      activeImage === index ? 'border-ink' : 'border-transparent hover:border-line-strong'
                    )}
                  >
                    <img src={src} alt="" className="h-full w-full object-cover" loading="lazy" decoding="async" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="lg:sticky lg:top-28 lg:self-start">
            <p className="brand-label text-faint">{product.category}</p>
            <h1 className="mt-3 text-display-md">{product.name}</h1>
            <div className="mt-4 flex flex-wrap items-baseline gap-x-6 gap-y-2">
              <p className="font-sans text-xl text-ink">{formatPrice(product.price)}</p>
              <AvailabilityPill availability={product.availability} stock={stock} />
            </div>

            {product.description && product.description.trim().length > 0 && (
              <p className="mt-6 text-sm leading-relaxed text-soft sm:text-base">{product.description}</p>
            )}

            {/* Quantity + actions */}
            <div className="mt-8 space-y-4">
              {!soldOut && (
                <div className="flex items-center gap-4">
                  <span id="quantity-label" className="brand-label text-ink">
                    Quantity
                  </span>
                  <div className="inline-flex items-center border border-line" role="group" aria-labelledby="quantity-label">
                    <button
                      type="button"
                      onClick={() => changeQuantity(-1)}
                      disabled={quantity <= 1}
                      aria-label="Decrease quantity"
                      className="flex h-11 w-11 items-center justify-center text-ink transition-colors hover:bg-stone disabled:opacity-30 focus-ring"
                    >
                      <Minus className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
                    </button>
                    <span className="w-10 text-center font-sans text-sm text-ink" aria-live="polite">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => changeQuantity(1)}
                      disabled={quantity >= maxQty}
                      aria-label="Increase quantity"
                      className="flex h-11 w-11 items-center justify-center text-ink transition-colors hover:bg-stone disabled:opacity-30 focus-ring"
                    >
                      <Plus className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
                    </button>
                  </div>
                </div>
              )}

              <StoreButton size="lg" full onClick={handleAddToBag} disabled={soldOut}>
                {soldOut ? 'Sold out' : 'Add to bag'}
              </StoreButton>
              <StoreButton asChild variant="secondary" full>
                <a href={whatsappHref} target="_blank" rel="noopener noreferrer">
                  Ask on WhatsApp
                </a>
              </StoreButton>
            </div>

            {details.length > 0 && (
              <Accordion type="multiple" className="mt-10 border-t border-line">
                {details.map((d) => (
                  <AccordionItem key={d.key} value={d.key} className="border-line">
                    <AccordionTrigger className="brand-label py-4 text-ink hover:no-underline hover:text-gold-deep">
                      {d.label}
                    </AccordionTrigger>
                    <AccordionContent className="pb-5 text-sm leading-relaxed text-soft">{d.value}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            )}

            <p className={cn('text-xs text-faint', details.length > 0 ? 'mt-6' : 'mt-10 border-t border-line pt-6')}>
              Orders are confirmed personally over WhatsApp.
            </p>
          </div>
        </div>

        {related.length > 0 && (
          <section className="mt-20 lg:mt-28" aria-labelledby="related-heading">
            <SectionHeading
              eyebrow="Complete the look"
              title={<span id="related-heading">You may also like</span>}
              link={{ to: `/shop?category=${encodeURIComponent(product.category)}`, label: `More ${product.category}` }}
              className="mb-8 sm:mb-10"
            />
            <ProductGrid products={related} columns={4} />
          </section>
        )}
      </Container>
    </>
  );
};

const DetailSkeleton = () => (
  <Container className="pb-20" aria-busy="true" aria-label="Loading product">
    <div className="py-6 sm:py-8">
      <Skeleton className="h-3 w-48" />
    </div>
    <div className="grid gap-10 lg:grid-cols-[11fr_9fr] lg:gap-16">
      <Skeleton className="aspect-[4/5] w-full" />
      <div>
        <Skeleton className="h-3 w-20" />
        <Skeleton className="mt-4 h-9 w-3/4" />
        <Skeleton className="mt-4 h-5 w-24" />
        <Skeleton className="mt-8 h-4 w-full" />
        <Skeleton className="mt-2 h-4 w-11/12" />
        <Skeleton className="mt-2 h-4 w-2/3" />
        <Skeleton className="mt-10 h-14 w-full" />
        <Skeleton className="mt-4 h-12 w-full" />
      </div>
    </div>
  </Container>
);

export default ProductDetail;
