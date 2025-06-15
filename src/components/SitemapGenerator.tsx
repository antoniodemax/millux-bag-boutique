
import { useEffect } from 'react';
import { useProducts } from '@/hooks/useProducts';

const SitemapGenerator = () => {
  const { data: products } = useProducts();

  useEffect(() => {
    if (products && products.length > 0) {
      generateSitemap();
    }
  }, [products]);

  const generateSitemap = () => {
    const baseUrl = window.location.origin;
    const staticPages = [
      '',
      '/shop',
      '/about',
      '/contact',
      '/auth'
    ];

    const productPages = products?.map(product => `/product/${product.id}`) || [];
    
    const allPages = [...staticPages, ...productPages];
    
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages.map(page => `  <url>
    <loc>${baseUrl}${page}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>${page.includes('/product/') ? 'weekly' : 'monthly'}</changefreq>
    <priority>${page === '' ? '1.0' : page === '/shop' ? '0.9' : '0.8'}</priority>
  </url>`).join('\n')}
</urlset>`;

    // Log sitemap for debugging - in production, you'd submit this to search engines
    console.log('Generated sitemap:', sitemap);
  };

  return null; // This component doesn't render anything
};

export default SitemapGenerator;
