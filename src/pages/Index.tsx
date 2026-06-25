import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import CategoryGrid from "@/components/CategoryGrid";
import TestimonialsSection from "@/components/TestimonialsSection";
import HeroBanner from "@/components/HeroBanner";
import AboutSection from "@/components/AboutSection";
import { Sparkles, Shield, Truck } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen overflow-hidden">
      <HeroBanner />
      <AboutSection />

      {/* Features Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-brand-light via-white to-brand-secondary/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-brand-dark mb-4 sm:mb-6">
              Why Choose Our Bags?
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-brand-primary max-w-3xl mx-auto px-4">
              Experience the perfect blend of style, quality, and innovation
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            <div className="group text-center p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-white to-brand-light/50 hover:from-brand-accent/10 hover:to-brand-secondary/20 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl border border-brand-secondary/30">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-brand-dark to-brand-primary rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <Sparkles className="w-8 h-8 sm:w-10 sm:h-10 text-brand-light" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-brand-dark mb-3 sm:mb-4 group-hover:text-brand-primary transition-colors">Premium Quality</h3>
              <p className="text-sm sm:text-base text-brand-primary leading-relaxed">
                Crafted with the finest materials and attention to detail for lasting elegance and durability.
              </p>
            </div>

            <div className="group text-center p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-white to-brand-light/50 hover:from-brand-accent/10 hover:to-brand-secondary/20 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl border border-brand-secondary/30 md:translate-y-4">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-brand-primary to-brand-accent rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <Shield className="w-8 h-8 sm:w-10 sm:h-10 text-brand-light" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-brand-dark mb-3 sm:mb-4 group-hover:text-brand-primary transition-colors">Lifetime Guarantee</h3>
              <p className="text-sm sm:text-base text-brand-primary leading-relaxed">
                Every bag comes with our comprehensive satisfaction guarantee and premium quality assurance.
              </p>
            </div>

            <div className="group text-center p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-white to-brand-light/50 hover:from-brand-accent/10 hover:to-brand-secondary/20 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl border border-brand-secondary/30">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-brand-accent to-brand-secondary rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <Truck className="w-8 h-8 sm:w-10 sm:h-10 text-brand-dark" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-brand-dark mb-3 sm:mb-4 group-hover:text-brand-primary transition-colors">Express Delivery</h3>
              <p className="text-sm sm:text-base text-brand-primary leading-relaxed">
                Lightning-fast and secure delivery to bring your perfect bag right to your doorstep.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Collection */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-brand-dark via-brand-primary to-brand-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-brand-light mb-4 sm:mb-6">
              Featured Collection
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-brand-light/90 max-w-3xl mx-auto leading-relaxed px-4">
              Discover our signature handbags for women — where luxury meets functionality in perfect harmony
            </p>
          </div>

          <div className="group cursor-pointer">
            <Card className="max-w-6xl mx-auto overflow-hidden shadow-2xl rounded-3xl bg-gradient-to-br from-brand-light/95 via-white to-brand-secondary/50 border border-brand-accent/30 hover:shadow-[0_20px_50px_rgba(0,0,0,0.3)] transition-shadow duration-500">
              <CardContent className="p-0">
                <div className="grid grid-cols-1 lg:grid-cols-2">
                  <div className="relative h-64 sm:h-80 lg:h-[500px] overflow-hidden">
                    <img
                      src="https://images.unsplash.com/photo-1584917865442-de89df76afd3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
                      alt="Handbags for Women"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/40 via-transparent to-transparent"></div>
                    <div className="absolute top-4 left-4 sm:top-6 sm:left-6 bg-gradient-to-r from-brand-accent to-brand-secondary text-brand-dark px-3 py-1 sm:px-4 sm:py-2 rounded-full font-medium text-xs sm:text-sm shadow-lg">
                      New Collection
                    </div>
                  </div>

                  <div className="p-6 sm:p-8 lg:p-12 xl:p-16 flex flex-col justify-center">
                    <h3 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-brand-dark mb-4 sm:mb-6">
                      Handbags for Women
                    </h3>
                    <p className="text-sm sm:text-base lg:text-lg text-brand-primary mb-6 sm:mb-8 leading-relaxed">
                      Elevate your style with our exquisite collection of handbags.
                      From everyday essentials to statement pieces, find the perfect
                      bag to complement your unique style and sophisticated lifestyle.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6 sm:mb-8">
                      <div className="flex items-center text-brand-primary">
                        <Shield className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-brand-accent" />
                        <span className="font-medium text-sm sm:text-base">Premium Leather</span>
                      </div>
                      <div className="flex items-center text-brand-primary">
                        <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-brand-accent" />
                        <span className="font-medium text-sm sm:text-base">Handcrafted</span>
                      </div>
                      <div className="flex items-center text-brand-primary">
                        <Shield className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-brand-accent" />
                        <span className="font-medium text-sm sm:text-base">Lifetime Warranty</span>
                      </div>
                    </div>
                    <Link to="/shop?category=handbags-women">
                      <Button className="w-full sm:w-auto bg-gradient-to-r from-brand-primary to-brand-dark hover:from-brand-dark hover:to-brand-primary text-brand-light px-6 sm:px-8 lg:px-10 py-3 sm:py-4 text-base sm:text-lg font-medium rounded-full transition-all duration-300 hover:scale-105 shadow-xl">
                        <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                        Shop Collection
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <CategoryGrid />
      <TestimonialsSection />
    </div>
  );
};

export default Index;
