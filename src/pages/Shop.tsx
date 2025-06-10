
import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Mock products data - in real app this would come from API
const mockProducts = [
  {
    id: 1,
    name: "Classic Leather Handbag",
    price: 8500,
    category: "Handbags for Women",
    image: "",
    description: "Elegant leather handbag perfect for everyday use"
  },
  {
    id: 2,
    name: "Designer Tote Bag",
    price: 12000,
    category: "Handbags for Women",
    image: "",
    description: "Spacious tote bag for the modern professional woman"
  },
  {
    id: 3,
    name: "Evening Clutch",
    price: 5500,
    category: "Handbags for Women",
    image: "",
    description: "Sophisticated clutch perfect for special occasions"
  },
];

const Shop = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("name");

  const categories = [
    { value: "all", label: "All Categories" },
    { value: "handbags", label: "Handbags for Women" },
    { value: "travel", label: "Travel Bags" },
    { value: "laptop", label: "Laptop Bags" },
  ];

  const filteredProducts = mockProducts.filter(product => 
    selectedCategory === "all" || product.category.toLowerCase().includes(selectedCategory)
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Shop Our Collection</h1>
          <p className="text-gray-600">Discover premium bags for every occasion and lifestyle.</p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
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

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="group hover:shadow-lg transition-all duration-300">
              <CardContent className="p-0">
                <div className="bg-gray-200 h-64 flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <div className="w-20 h-20 bg-gray-300 rounded-lg mx-auto mb-2"></div>
                    <p className="text-sm">{product.name}</p>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">{product.name}</h3>
                  <p className="text-sm text-gray-600 mb-3">{product.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-gray-900">
                      KSh {product.price.toLocaleString()}
                    </span>
                    <Link to={`/product/${product.id}`}>
                      <Button size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                        View Details
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No products found in this category.</p>
            <p className="text-gray-400">More products coming soon!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Shop;
