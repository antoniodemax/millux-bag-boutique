
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import CategoryGrid from "@/components/CategoryGrid";
import TestimonialsSection from "@/components/TestimonialsSection";

const Index = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-gray-50 to-gray-100 py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
              Premium Bags for
              <span className="block text-gray-700">Every Occasion</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Discover our curated collection of stylish handbags, travel bags, and accessories 
              that combine elegance with functionality.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/shop">
                <Button size="lg" className="w-full sm:w-auto bg-gray-900 hover:bg-gray-800">
                  Shop Now
                </Button>
              </Link>
              <Link to="/about">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Category */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Collection</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Explore our signature handbags for women - crafted with premium materials 
              and designed for the modern woman.
            </p>
          </div>
          
          <Card className="max-w-4xl mx-auto overflow-hidden">
            <CardContent className="p-0">
              <div className="grid grid-cols-1 lg:grid-cols-2">
                <div className="bg-gray-100 h-64 lg:h-96 flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <div className="w-24 h-24 bg-gray-300 rounded-lg mx-auto mb-4"></div>
                    <p>Handbags for Women</p>
                  </div>
                </div>
                <div className="p-8 lg:p-12 flex flex-col justify-center">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    Handbags for Women
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Elevate your style with our exquisite collection of handbags. 
                    From everyday essentials to statement pieces, find the perfect 
                    bag to complement your unique style.
                  </p>
                  <Link to="/shop?category=handbags-women">
                    <Button className="w-full sm:w-auto">
                      Shop Handbags
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Categories Grid */}
      <CategoryGrid />

      {/* Testimonials */}
      <TestimonialsSection />
    </div>
  );
};

export default Index;
