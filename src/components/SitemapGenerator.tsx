import { useEffect } from 'react';

const SitemapGenerator = () => {
  useEffect(() => {
    const baseUrl = window.location.origin;
    const pages = ['', '/shop', '/about', '/contact'];
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map(page => `  <url>
    <loc>${baseUrl}${page}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>${page === '' ? '1.0' : page === '/shop' ? '0.9' : '0.8'}</priority>
  </url>`).join('\n')}
</urlset>`;
    console.log('Generated sitemap:', sitemap);
  }, []);

  return null;
};

export default SitemapGenerator;
