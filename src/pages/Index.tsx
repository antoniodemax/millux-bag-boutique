
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import CategoryGrid from "@/components/CategoryGrid";
import TestimonialsSection from "@/components/TestimonialsSection";
import HeroBanner from "@/components/HeroBanner";
import { Sparkles, Shield, Truck } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section with Image Carousel */}
      <HeroBanner />

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-8 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-colors duration-300">
              <div className="w-16 h-16 bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-6">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Premium Quality</h3>
              <p className="text-gray-600">
                Crafted with the finest materials and attention to detail for lasting elegance.
              </p>
            </div>
            <div className="text-center p-8 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-colors duration-300">
              <div className="w-16 h-16 bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Quality Guarantee</h3>
              <p className="text-gray-600">
                Every bag comes with our satisfaction guarantee and quality assurance.
              </p>
            </div>
            <div className="text-center p-8 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-colors duration-300">
              <div className="w-16 h-16 bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-6">
                <Truck className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Fast Delivery</h3>
              <p className="text-gray-600">
                Quick and secure delivery to bring your perfect bag right to your door.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Category */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
            alt="Luxury handbag collection background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-brand-dark/80 via-brand-primary/70 to-brand-secondary/90"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-brand-dark/60 to-transparent"></div>
        </div>

        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div 
            className="absolute inset-0" 
            style={{ 
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='7' cy='7' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` 
            }}
          ></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-brand-light mb-6">
              Featured Collection
            </h2>
            <p className="text-xl text-brand-light/90 max-w-3xl mx-auto leading-relaxed">
              Explore our signature handbags for women - crafted with premium materials 
              and designed for the modern woman who values both style and functionality.
            </p>
          </div>
          
          <Card className="max-w-6xl mx-auto overflow-hidden shadow-2xl rounded-3xl bg-brand-light/95 backdrop-blur-sm">
            <CardContent className="p-0">
              <div className="grid grid-cols-1 lg:grid-cols-2">
                <div className="relative h-80 lg:h-[500px] overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1584917865442-de89df76afd3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
                    alt="Handbags for Women"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/30 to-transparent"></div>
                </div>
                <div className="p-12 lg:p-16 flex flex-col justify-center">
                  <h3 className="text-3xl lg:text-4xl font-bold text-brand-dark mb-6">
                    Handbags for Women
                  </h3>
                  <p className="text-lg text-brand-primary mb-8 leading-relaxed">
                    Elevate your style with our exquisite collection of handbags. 
                    From everyday essentials to statement pieces, find the perfect 
                    bag to complement your unique style and lifestyle needs.
                  </p>
                  <Link to="/shop?category=handbags-women">
                    <Button className="w-full sm:w-auto bg-brand-primary hover:bg-brand-dark text-brand-light px-8 py-4 text-lg font-medium rounded-full transition-all duration-300 hover:scale-105 shadow-lg">
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
