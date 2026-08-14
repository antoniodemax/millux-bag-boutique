import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Search } from "lucide-react";
import { products } from "@/data/products";
import { ProductCard } from "@/components/ProductCard";
import { ProductGrid } from "@/components/ProductGrid";
import SEO from "@/components/SEO";

const Collections = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState("featured"); // featured, new-arrival, bestseller, price-low, price-high, name

  // Get unique categories from products
  const categories = useMemo(() => {
    return [...new Set(products.map(p => p.category))];
  }, [products]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    return products
      .filter(product => {
        // Search filter
        if (searchTerm &&
            !product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
            !product.category.toLowerCase().includes(searchTerm.toLowerCase())) {
          return false;
        }

        // Category filter
        if (selectedCategory && product.category !== selectedCategory) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case "featured":
            return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
          case "new-arrival":
            return (b.newArrival ? 1 : 0) - (a.newArrival ? 1 : 0);
          case "bestseller":
            return (b.bestseller ? 1 : 0) - (a.bestseller ? 1 : 0);
          case "price-low":
            return a.price - b.price;
          case "price-high":
            return b.price - a.price;
          case "name":
            return a.name.localeCompare(b.name);
          default:
            return 0;
        }
      });
  }, [products, searchTerm, selectedCategory, sortBy]);

  return (
    <>
      <SEO
        title="Millux Collections"
        description="Discover the Millux Collections - premium luxury bags crafted with intention."
        keywords="Millux Collections, luxury bags, premium handbags, Millux bags"
      />
      <div className="min-h-[calc(100vh-88px)] bg-background py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-12">
            <h1 className="font-playfair text-3xl md:text-4xl text-primary mb-4">
              Collections
            </h1>
            <p className="text-text-secondary max-w-md">
              Discover our curated selection of luxury bags, each piece designed to
              accompany you through life's most meaningful moments.
            </p>
          </div>

          {/* Controls */}
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-10">
            {/* Search */}
            <div className="flex-1 md:w-64">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
                <label htmlFor="search-input" className="sr-only">
                  Search collections
                </label>
                <input
                  id="search-input"
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search collections..."
                  className="pl-10 pr-4 py-3 bg-transparent border border-border/30 rounded-lg focus:border-accent focus:outline-none text-sm text-primary"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div className="flex-1 md:w-64">
              <label htmlFor="category-filter" className="sr-only">
                Filter by category
              </label>
              <select
                id="category-filter"
                value={selectedCategory || ""}
                onChange={(e) => setSelectedCategory(e.target.value || null)}
                className="w-full py-3 bg-transparent border border-border/30 rounded-lg focus:border-accent focus:outline-none text-sm text-primary"
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort By */}
            <div className="flex-1 md:w-64">
              <label htmlFor="sort-select" className="sr-only">
                Sort products
              </label>
              <select
                id="sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full py-3 bg-transparent border border-border/30 rounded-lg focus:border-accent focus:outline-none text-sm text-primary"
              >
                <option value="featured">Featured First</option>
                <option value="new-arrival">New Arrivals</option>
                <option value="bestseller">Best Sellers</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="name">Name: A to Z</option>
              </select>
            </div>
          </div>

          {/* Products Count */}
          <div className="mb-8 text-sm text-text-muted">
            {filteredProducts.length} products found
          </div>

          {/* Empty State */}
          {filteredProducts.length === 0 && (
            <div className="text-center py-16">
              <p className="text-text-muted">No products match your current filters.</p>
            </div>
          )}

          {/* Product Grid */}
          <ProductGrid products={filteredProducts} />
        </div>
      </div>
    </>
  );
};

export default Collections;