
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'product' | 'article';
  price?: number;
  currency?: string;
  availability?: 'in_stock' | 'out_of_stock';
  brand?: string;
  category?: string;
}

const SEO = ({
  title = "MilluxCollection - Premium Bags & Handbags in Kenya",
  description = "Discover premium quality bags and handbags at MilluxCollection. From stylish handbags to travel bags, laptop bags, and more. Free delivery in Nairobi & Mombasa.",
  keywords = "bags Kenya, handbags Kenya, travel bags, laptop bags, women bags, premium bags Nairobi, bags Mombasa",
  image = "/placeholder.svg",
  url = window.location.href,
  type = "website",
  price,
  currency = "KES",
  availability,
  brand = "MilluxCollection",
  category
}: SEOProps) => {
  const fullTitle = title.includes("MilluxCollections") ? title : `${title} | MilluxCollections`;
  
  const structuredData = {
    "@context": "https://schema.org",
    "@type": type === "product" ? "Product" : "WebSite",
    "name": title,
    "description": description,
    "url": url,
    "brand": {
      "@type": "Brand",
      "name": brand
    },
    ...(type === "product" && price && {
      "offers": {
        "@type": "Offer",
        "price": price,
        "priceCurrency": currency,
        "availability": availability === "in_stock" 
          ? "https://schema.org/InStock" 
          : "https://schema.org/OutOfStock",
        "seller": {
          "@type": "Organization",
          "name": brand
        }
      }
    }),
    ...(category && { "category": category })
  };

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={url} />

      {/* Open Graph Tags */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={type === "product" ? "product" : "website"} />
      <meta property="og:site_name" content="MilluxCollection" />

      {/* Twitter Card Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Product-specific meta tags */}
      {type === "product" && price && (
        <>
          <meta property="product:price:amount" content={price.toString()} />
          <meta property="product:price:currency" content={currency} />
          <meta property="product:availability" content={availability || "in_stock"} />
        </>
      )}

      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>

      {/* Local Business Schema for homepage */}
      {type === "website" && (
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            "name": "MilluxCollection",
            "description": "Premium bags and handbags store in Kenya",
            "url": "https://milluxcollection.com",
            "telephone": "+254723425778",
            "address": {
              "@type": "PostalAddress",
              "addressCountry": "KE",
              "addressRegion": "Kenya"
            },
            "openingHours": "Mo-Sa 08:00-18:00",
            "priceRange": "$$",
            "areaServed": ["Nairobi", "Mombasa", "Kenya"]
          })}
        </script>
      )}
    </Helmet>
  );
};

export default SEO;
