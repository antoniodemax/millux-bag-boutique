import { useState, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { products } from "@/data/products";
import { formatPrice } from "@/lib/utils";
import { ProductCard } from "@/components/ProductCard";
import { useCart } from "@/context/CartContext";
import SEO from "@/components/SEO";

const ProductDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addItem } = useCart();

  useEffect(() => {
    const findProduct = products.find(p => p.slug === slug);
    setProduct(findProduct);
    setLoading(false);
  }, [slug]);

  // Related products: same category, exclude current, limit to 4
  const relatedProducts = useMemo(() => {
    if (!product) return [];
    return products
      .filter(p => p.category === product.category && p.id !== product.id)
      .slice(0, 4);
  }, [product]);

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-88px)] bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-[calc(100vh-88px)] bg-background flex items-center justify-center">
        <p className="text-text-muted">Product not found</p>
      </div>
    );
  }

  return (
    <>
      <SEO
        title={`${product.name} - Millux Collections`}
        description={product.description}
        keywords={`Millux, ${product.name}, luxury bag, ${product.category}`}
      />
      <div className="min-h-[calc(100vh-88px)] bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Product Gallery and Information */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Product Gallery */}
            <div className="space-y-6">
              {/* Main Image */}
              <div className="aspect-[4/5] w-full bg-gray-100 overflow-hidden rounded-xl">
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Thumbnails */}
              {product.images.length > 1 && (
                <div className="flex flex-wrap gap-4 -mb-4">
                  {product.images.map((image, index) => (
                    <div key={index} className="w-16 h-16 shrink-0">
                      <img
                        src={image}
                        alt={`${product.name} view ${index + 1}`}
                        className="w-full h-full object-cover rounded border border-border/30 hover:border-primary transition-all duration-200 group-hover:scale-105"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Product Information */}
            <div className="space-y-6">
              <div className="space-y-4">
                <p className="text-xs uppercase tracking-widest text-text-muted">
                  {product.category}
                </p>
                <h1 className="font-playfair text-3xl md:text-4xl text-primary mb-2">
                  {product.name}
                </h1>
                <p className="font-medium text-2xl text-accent">
                  {formatPrice(product.price)}
                </p>

                {/* Short Description */}
                <p className="text-text-muted leading-relaxed mb-4">
                  {product.description}
                </p>

                {/* Availability */}
                <div className="flex items-center gap-2 text-sm">
                  <span className="h-2 w-2 rounded-full
                    {product.availability === 'in_stock' && 'bg-green-500'}
                    {product.availability === 'low_stock' && 'bg-yellow-500'}
                    {product.availability === 'out_of_stock' && 'bg-red-500'}
                  ">
                  </span>
                  <span className="text-text-muted">
                    {product.availability === 'in_stock' && 'In Stock'}
                    {product.availability === 'low_stock' && 'Low Stock'}
                    {product.availability === 'out_of_stock' && 'Out of Stock'}
                  </span>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => {
                    addItem(product);
                  }}
                  className="w-full sm:w-auto flex items-center justify-center px-8 py-4 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90 transition-all duration-200"
                >
                  Add to Bag
                </button>

                <button
                  onClick={() => {
                    // General assistance via WhatsApp
                    const msg = `Hi! I have a question about the ${product.name}. Could you please provide more details?`;
                    window.open(`https://wa.me/254723425778?text=${encodeURIComponent(msg)}`, '_blank');
                  }}
                  className="w-full sm:w-auto flex items-center justify-center px-8 py-4 border border-primary/20 text-primary text-sm font-medium rounded-lg hover:border-primary/30 transition-all duration-200"
                >
                  WhatsApp Assistance
                </button>
              </div>
            </div>
          </div>

          {/* Product Details */}
          <div className="mt-12">
            <h2 className="font-playfair text-xl text-primary mb-6">
              Product Details
            </h2>
            <div className="grid grid-cols-1 gap-6">
              <div>
                <h3 className="font-playfair text-lg text-primary mb-2">
                  Description
                </h3>
                <p className="text-text-muted leading-relaxed">
                  {product.description}
                </p>
              </div>
              <div>
                <h3 className="font-playfair text-lg text-primary mb-2">
                  Materials
                </h3>
                <p className="text-text-muted">
                  {product.materials}
                </p>
              </div>
              <div>
                <h3 className="font-playfair text-lg text-primary mb-2">
                  Dimensions
                </h3>
                <p className="text-text-muted">
                  {product.dimensions}
                </p>
              </div>
              <div>
                <h3 className="font-playfair text-lg text-primary mb-2">
                  Care Instructions
                </h3>
                <p className="text-text-muted">
                  {product.care}
                </p>
              </div>
            </div>
          </div>

          {/* Client Services */}
          <div className="mt-16">
            <h2 className="font-playfair text-xl text-primary mb-6">
              Client Services
            </h2>
            <div className="grid grid-cols-1 gap-6">
              <div>
                <h3 className="font-playfair text-lg text-primary mb-2">
                  Delivery
                </h3>
                <p className="text-text-muted">
                  We offer insured delivery within 3-5 business days for all Millux Collections items. Shipping costs are calculated at checkout.
                </p>
              </div>
              <div>
                <h3 className="font-playfair text-lg text-primary mb-2">
                  Returns & Exchanges
                </h3>
                <p className="text-text-muted">
                  We accept returns within 14 days of delivery for items in their original condition. Please contact us via WhatsApp to initiate a return.
                </p>
              </div>
              <div>
                <h3 className="font-playfair text-lg text-primary mb-2">
                  Customer Assistance
                </h3>
                <p className="text-text-muted">
                  Our team is available via WhatsApp for any inquiries, styling advice, or after-sales support. We strive to respond within 24 hours.
                </p>
              </div>
            </div>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div className="mt-16">
              <h2 className="font-playfair text-xl text-primary mb-6">
                You May Also Like
              </h2>
              <ProductGrid products={relatedProducts} />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ProductDetail;