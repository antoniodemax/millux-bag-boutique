import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { products } from "@/data/products";
import { formatPrice } from "@/lib/utils";
import SEO from "@/components/SEO";

const ProductDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const findProduct = products.find(p => p.slug === slug);
    setProduct(findProduct);
    setLoading(false);
  }, [slug]);

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
          <div className="flex flex-col lg:flex-row gap-12">
            {/* Product Images */}
            <div className="w-full lg:w-1/2">
              <div className="aspect-[4/5] w-full bg-gray-100 overflow-hidden rounded-xl mb-6">
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Thumbnails */}
              {product.images.length > 1 && (
                <div className="flex flex-wrap gap-4">
                  {product.images.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`${product.name} view ${index + 1}`}
                      className="w-16 h-16 object-cover rounded border border-border/30 hover:border-primary transition-all duration-200"
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="w-full lg:w-1/2 space-y-8">
              <div className="space-y-4">
                <p className="text-xs uppercase tracking-widest text-acent">
                  {product.category}
                </p>
                <h1 className="font-playfair text-3xl md:text-4xl text-primary mb-2">
                  {product.name}
                </h1>
                <p className="font-medium text-2xl text-primary">
                  {formatPrice(product.price)}
                </p>

                {/* Badges */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {product.newArrival && (
                    <span className="px-3 py-1 bg-accent/10 text-accent text-xs font-medium rounded">
                      New Arrival
                    </span>
                  )}
                  {product.bestseller && (
                    <span className="px-3 py-1 bg-accent/10 text-accent text-xs font-medium rounded">
                      Best Seller
                    </span>
                  )}
                  {product.featured && (
                    <span className="px-3 py-1 bg-accent/10 text-accent text-xs font-medium rounded">
                      Featured
                    </span>
                  )}
                  {product.availability === 'low_stock' && (
                    <span className="px-3 py-1 bg-border/10 text-text-muted text-xs font-medium rounded">
                      Limited Stock
                    </span>
                  )}
                </div>
              </div>

              <div className="space-y-6">
                <h2 className="font-playfair text-xl text-primary mb-4">
                  Description
                </h2>
                <p className="text-text-muted leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Availability & CTA */}
              <div className="space-y-4">
                <p className="flex items-center gap-2 text-sm">
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
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={() => {
                      // WhatsApp inquiry
                      const msg = `Hi! I'm interested in purchasing the ${product.name} for ${formatPrice(product.price)}. Is it available?`;
                      window.open(`https://wa.me/254723425778?text=${encodeURIComponent(msg)}`, '_blank');
                    }}
                    className="w-full sm:w-auto flex items-center justify-center px-8 py-4 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90 transition-all duration-200"
                  >
                    Order via WhatsApp
                  </button>

                  <button
                    onClick={() => {
                      // Inquire for more details
                      const msg = `Hi! I'd like to know more about the ${product.name}. Could you provide additional details and styling suggestions?`;
                      window.open(`https://wa.me/254723425778?text=${encodeURIComponent(msg)}`, '_blank');
                    }}
                    className="w-full sm:w-auto flex items-center justify-center px-8 py-4 border border-primary/20 text-primary text-sm font-medium rounded-lg hover:border-primary/30 transition-all duration-200"
                  >
                    Product Inquiry
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductDetail;