
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
  title = "Millux Collections | Luxury Bags & Accessories",
  description = "Millux Collections: luxury handbags and accessories from Nairobi. Browse the collection and order personally over WhatsApp.",
  keywords = "Millux Collections, luxury bags Kenya, handbags Nairobi, designer bags Kenya",
  image = "/images/millux.png",
  url = window.location.href,
  type = "website",
  price,
  currency = "KES",
  availability,
  brand = "Millux Collections",
  category
}: SEOProps) => {
  const fullTitle = title.includes("Millux") ? title : `${title} | Millux Collections`;
  
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
      <meta property="og:site_name" content="Millux Collections" />

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
            "name": "Millux Collections",
            "description": "Luxury handbags and accessories, Nairobi",
            "url": "https://milluxcollections.vercel.app",
            "telephone": "+254723425778",
            "address": {
              "@type": "PostalAddress",
              "addressCountry": "KE",
              "addressRegion": "Kenya"
            },
            "openingHours": ["Mo-Fr 09:00-18:00", "Sa 10:00-16:00"],
            "areaServed": ["Nairobi", "Kenya"]
          })}
        </script>
      )}
    </Helmet>
  );
};

export default SEO;
