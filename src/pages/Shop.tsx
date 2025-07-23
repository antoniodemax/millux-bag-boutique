import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useProducts } from "@/hooks/useProducts";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/contexts/AuthContext";
import { ShoppingCart, MessageCircle, Eye } from "lucide-react";
import SEO from "@/components/SEO";

const Shop = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const { data: products, isLoading } = useProducts();
  const { addToCart } = useCart();
  const { user } = useAuth();

  const categories = [
    { value: "all", label: "All Categories" },
    { value: "handbags", label: "Handbags for Women" },
    { value: "travel", label: "Travel Bags" },
    { value: "laptop", label: "Laptop Bags" },
  ];

  const filteredProducts = products?.filter(product => 
    selectedCategory === "all" || product.category.toLowerCase().includes(selectedCategory)
  ) || [];

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price;
      case "price-high":
        return b.price - a.price;
      default:
        return a.name.localeCompare(b.name);
    }
  });

  const handleAddToCart = (productId: string) => {
    if (!user) {
      window.location.href = '/auth';
      return;
    }
    addToCart({ productId, quantity: 1 });
  };

  const handleWhatsAppOrder = (product: any) => {
    const message = `Hi! I'd like to order this product:\n\n📦 ${product.name}\n💰 Price: KSh ${product.price.toLocaleString()}\n📋 Category: ${product.category}\n\nPlease let me know about availability and delivery details.`;
    const whatsappUrl = `https://wa.me/254723425778?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  // Dynamic SEO based on selected category
  const getCategoryInfo = () => {
    const categoryLabel = categories.find(cat => cat.value === selectedCategory)?.label || "All Categories";
    const title = selectedCategory === "all" 
      ? "Shop Premium Bags & Handbags" 
      : `${categoryLabel} - Premium Quality`;
    const description = selectedCategory === "all"
      ? "Browse our complete collection of premium bags, handbags, travel bags, and laptop bags. Quality guaranteed with free delivery in Nairobi."
      : `Discover our ${categoryLabel.toLowerCase()} collection. Premium quality ${categoryLabel.toLowerCase()} with free delivery in Nairobi .`;
    
    return { title, description, categoryLabel };
  };

  const { title, description } = getCategoryInfo();

  if (isLoading) {
    return (
      <>
        <SEO 
          title="Loading Shop..."
          description="Loading our premium bags collection from MilluxCollection"
        />
        <div className="min-h-screen bg-gray-50 py-4 sm:py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-brand-primary mx-auto mb-4"></div>
              <p className="text-gray-600 text-sm sm:text-base">Loading products...</p>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <SEO 
        title={title}
        description={description}
        keywords={`${title.toLowerCase()}, bags Kenya, handbags Kenya, premium bags, ${selectedCategory !== "all" ? selectedCategory + " bags," : ""} bags Nairobi, bags Mombasa`}
      />
      <div className="min-h-screen bg-gray-50 py-4 sm:py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 sm:mb-4">Shop Our Collection</h1>
            <p className="text-gray-600 text-sm sm:text-base">Discover premium bags for every occasion and lifestyle.</p>
          </div>

          {/* Filters - Fully Responsive */}
          <div className="flex flex-col gap-3 sm:flex-row sm:gap-4 mb-6 sm:mb-8">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full sm:w-64">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Products Grid - Responsive */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {sortedProducts.map((product) => (
              <Card key={product.id} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
                <CardContent className="p-0">
                  {/* Product Image */}
                  <div className="relative bg-gray-100 h-48 sm:h-56 lg:h-64 overflow-hidden rounded-t-lg">
                     {product.image_url ? (
                       <img 
                         src={product.image_url} 
                         alt={`${product.name} - Premium ${product.category} from MilluxCollection`}
                         className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                         onLoad={() => console.log(`Image loaded successfully: ${product.image_url}`)}
                         onError={(e) => {
                           console.error(`Failed to load image: ${product.image_url}`);
                           e.currentTarget.style.display = 'none';
                           e.currentTarget.nextElementSibling?.classList.remove('hidden');
                         }}
                       />
                     ) : (
                       <div className={`flex flex-col items-center justify-center h-full text-gray-400 ${product.image_url ? 'hidden' : ''}`}>
                         <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-200 rounded-lg mb-2"></div>
                         <p className="text-xs sm:text-sm text-center px-2">{product.name}</p>
                       </div>
                    )}
                    
                    {/* Stock Badge */}
                    {product.stock_quantity && product.stock_quantity > 0 && (
                      <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                        In Stock
                      </div>
                    )}
                    
                    {/* Out of Stock Badge */}
                    {(!product.stock_quantity || product.stock_quantity <= 0) && (
                      <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                        Out of Stock
                      </div>
                    )}
                  </div>

                  {/* Product Details */}
                  <div className="p-3 sm:p-4">
                    {/* Product Name */}
                    <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base line-clamp-2 min-h-[2.5rem] sm:min-h-[3rem]">
                      {product.name}
                    </h3>
                    
                    {/* Category */}
                    <p className="text-xs sm:text-sm text-gray-500 mb-2 capitalize">
                      {product.category}
                    </p>
                    
                    {/* Description */}
                    {product.description && (
                      <p className="text-xs sm:text-sm text-gray-600 mb-3 line-clamp-2">
                        {product.description}
                      </p>
                    )}
                    
                    {/* Price - Prominent Display */}
                    <div className="mb-4">
                      <span className="text-xl sm:text-2xl font-bold text-brand-primary">
                        KSh {product.price.toLocaleString()}
                      </span>
                    </div>
                    
                    {/* Action Buttons - Responsive Stack */}
                    <div className="space-y-2">
                      {/* WhatsApp Order Button - Primary */}
                      <Button 
                        className="w-full bg-green-600 hover:bg-green-700 text-white text-xs sm:text-sm py-2"
                        onClick={() => handleWhatsAppOrder(product)}
                      >
                        <MessageCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                        Order on WhatsApp
                      </Button>
                      
                      {/* Secondary Actions Row */}
                      <div className="flex gap-2">
                        <Link to={`/product/${product.id}`} className="flex-1">
                          <Button size="sm" variant="outline" className="w-full text-xs sm:text-sm py-1.5">
                            <Eye className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                            View
                          </Button>
                        </Link>
                        
                        {user && (
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="flex-1 text-xs sm:text-sm py-1.5"
                            onClick={() => handleAddToCart(product.id)}
                            disabled={!product.stock_quantity || product.stock_quantity <= 0}
                          >
                            <ShoppingCart className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                            Add to Cart
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* No Products Message */}
          {sortedProducts.length === 0 && (
            <div className="text-center py-8 sm:py-12">
              <p className="text-gray-500 text-lg sm:text-xl mb-2">No products found in this category.</p>
              <p className="text-gray-400 text-sm sm:text-base">More products coming soon!</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Shop;
