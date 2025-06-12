
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import CategoryGrid from "@/components/CategoryGrid";
import TestimonialsSection from "@/components/TestimonialsSection";
import HeroBanner from "@/components/HeroBanner";
import { Sparkles, Shield, Truck, Star, Award, Heart } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen overflow-hidden">
      {/* Hero Section with Enhanced Animation */}
      <HeroBanner />

      {/* Enhanced Features Section with Floating Animation */}
      <section className="py-20 bg-gradient-to-br from-brand-light via-white to-brand-secondary/30 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-br from-brand-accent/20 to-brand-primary/20 rounded-full animate-pulse blur-xl"></div>
          <div className="absolute top-40 right-20 w-48 h-48 bg-gradient-to-br from-brand-secondary/30 to-brand-accent/20 rounded-full animate-bounce delay-1000 blur-xl"></div>
          <div className="absolute bottom-20 left-1/3 w-24 h-24 bg-gradient-to-br from-brand-primary/30 to-brand-dark/20 rounded-full animate-pulse delay-500 blur-xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl lg:text-5xl font-bold text-brand-dark mb-6 relative">
              Why Choose Our Bags?
              <div className="absolute -top-4 -right-4 animate-spin-slow">
                <Star className="w-8 h-8 text-brand-accent" />
              </div>
            </h2>
            <p className="text-xl text-brand-primary max-w-3xl mx-auto">
              Experience the perfect blend of style, quality, and innovation
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group text-center p-8 rounded-3xl bg-gradient-to-br from-white to-brand-light/50 hover:from-brand-accent/10 hover:to-brand-secondary/20 transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 shadow-lg hover:shadow-2xl border border-brand-secondary/30">
              <div className="w-20 h-20 bg-gradient-to-br from-brand-dark to-brand-primary rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 relative overflow-hidden">
                <Sparkles className="w-10 h-10 text-brand-light animate-pulse" />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
              </div>
              <h3 className="text-2xl font-bold text-brand-dark mb-4 group-hover:text-brand-primary transition-colors">Premium Quality</h3>
              <p className="text-brand-primary leading-relaxed">
                Crafted with the finest materials and attention to detail for lasting elegance and durability.
              </p>
              <div className="mt-4 flex justify-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-brand-accent fill-current" />
                ))}
              </div>
            </div>

            <div className="group text-center p-8 rounded-3xl bg-gradient-to-br from-white to-brand-light/50 hover:from-brand-accent/10 hover:to-brand-secondary/20 transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 shadow-lg hover:shadow-2xl border border-brand-secondary/30 md:translate-y-4">
              <div className="w-20 h-20 bg-gradient-to-br from-brand-primary to-brand-accent rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 relative overflow-hidden">
                <Shield className="w-10 h-10 text-brand-light animate-pulse" />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
              </div>
              <h3 className="text-2xl font-bold text-brand-dark mb-4 group-hover:text-brand-primary transition-colors">Lifetime Guarantee</h3>
              <p className="text-brand-primary leading-relaxed">
                Every bag comes with our comprehensive satisfaction guarantee and premium quality assurance.
              </p>
              <div className="mt-4 flex justify-center">
                <Award className="w-6 h-6 text-brand-accent opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:animate-bounce" />
              </div>
            </div>

            <div className="group text-center p-8 rounded-3xl bg-gradient-to-br from-white to-brand-light/50 hover:from-brand-accent/10 hover:to-brand-secondary/20 transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 shadow-lg hover:shadow-2xl border border-brand-secondary/30">
              <div className="w-20 h-20 bg-gradient-to-br from-brand-accent to-brand-secondary rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 relative overflow-hidden">
                <Truck className="w-10 h-10 text-brand-dark animate-pulse" />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
              </div>
              <h3 className="text-2xl font-bold text-brand-dark mb-4 group-hover:text-brand-primary transition-colors">Express Delivery</h3>
              <p className="text-brand-primary leading-relaxed">
                Lightning-fast and secure delivery to bring your perfect bag right to your doorstep.
              </p>
              <div className="mt-4 flex justify-center">
                <Heart className="w-6 h-6 text-brand-accent opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:animate-ping" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Featured Category with Magnetic Effect */}
      <section className="py-20 bg-gradient-to-br from-brand-dark via-brand-primary to-brand-secondary relative overflow-hidden">
        {/* Dynamic Background Pattern */}
        <div className="absolute inset-0">
          <div 
            className="absolute inset-0 opacity-20" 
            style={{ 
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z'/%3E%3C/g%3E%3C/svg%3E")` 
            }}
          ></div>
          
          {/* Floating Geometric Shapes */}
          <div className="absolute top-20 left-10 w-8 h-8 bg-brand-accent/30 rotate-45 animate-spin-slow"></div>
          <div className="absolute top-40 right-20 w-12 h-12 bg-brand-light/20 rounded-full animate-bounce delay-700"></div>
          <div className="absolute bottom-32 left-1/4 w-6 h-6 bg-brand-secondary/40 rotate-12 animate-pulse delay-300"></div>
          <div className="absolute bottom-20 right-1/3 w-10 h-10 bg-brand-accent/25 rounded-full animate-ping delay-1000"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-5xl lg:text-6xl font-bold text-brand-light mb-6 relative">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-light via-brand-accent to-brand-light animate-gradient-x">
                Featured Collection
              </span>
              <div className="absolute -top-6 -right-6 animate-bounce delay-500">
                <Sparkles className="w-10 h-10 text-brand-accent" />
              </div>
            </h2>
            <p className="text-xl text-brand-light/90 max-w-3xl mx-auto leading-relaxed">
              Discover our signature handbags for women - where luxury meets functionality in perfect harmony
            </p>
          </div>
          
          <div className="group cursor-pointer">
            <Card className="max-w-6xl mx-auto overflow-hidden shadow-2xl rounded-3xl bg-gradient-to-br from-brand-light/95 via-white to-brand-secondary/50 backdrop-blur-sm border border-brand-accent/30 hover:shadow-[0_20px_50px_rgba(0,0,0,0.3)] transition-all duration-700 hover:scale-[1.02] transform-gpu">
              <CardContent className="p-0">
                <div className="grid grid-cols-1 lg:grid-cols-2">
                  <div className="relative h-80 lg:h-[500px] overflow-hidden">
                    <img 
                      src="https://images.unsplash.com/photo-1584917865442-de89df76afd3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
                      alt="Handbags for Women"
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 filter group-hover:brightness-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/40 via-transparent to-transparent"></div>
                    
                    {/* Floating Badge */}
                    <div className="absolute top-6 left-6 bg-gradient-to-r from-brand-accent to-brand-secondary text-brand-dark px-4 py-2 rounded-full font-medium text-sm shadow-lg animate-pulse">
                      New Collection ✨
                    </div>
                    
                    {/* Magnetic Hover Effect */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-white/20 rounded-full animate-ping"></div>
                    </div>
                  </div>
                  
                  <div className="p-12 lg:p-16 flex flex-col justify-center relative overflow-hidden">
                    {/* Background Decoration */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-brand-accent/10 to-transparent rounded-full -translate-y-1/2 translate-x-1/2"></div>
                    
                    <h3 className="text-4xl lg:text-5xl font-bold text-brand-dark mb-6 relative">
                      Handbags for Women
                      <div className="absolute -bottom-2 left-0 w-20 h-1 bg-gradient-to-r from-brand-accent to-brand-primary rounded-full group-hover:w-32 transition-all duration-500"></div>
                    </h3>
                    
                    <p className="text-lg text-brand-primary mb-8 leading-relaxed">
                      Elevate your style with our exquisite collection of handbags. 
                      From everyday essentials to statement pieces, find the perfect 
                      bag to complement your unique style and sophisticated lifestyle.
                    </p>
                    
                    <div className="flex flex-col sm:flex-row gap-4 mb-8">
                      <div className="flex items-center text-brand-primary">
                        <Shield className="w-5 h-5 mr-2 text-brand-accent" />
                        <span className="font-medium">Premium Leather</span>
                      </div>
                      <div className="flex items-center text-brand-primary">
                        <Star className="w-5 h-5 mr-2 text-brand-accent" />
                        <span className="font-medium">Handcrafted</span>
                      </div>
                      <div className="flex items-center text-brand-primary">
                        <Heart className="w-5 h-5 mr-2 text-brand-accent" />
                        <span className="font-medium">Lifetime Warranty</span>
                      </div>
                    </div>
                    
                    <Link to="/shop?category=handbags-women">
                      <Button className="w-full sm:w-auto bg-gradient-to-r from-brand-primary via-brand-dark to-brand-primary hover:from-brand-dark hover:via-brand-primary hover:to-brand-dark text-brand-light px-10 py-4 text-lg font-medium rounded-full transition-all duration-500 hover:scale-105 shadow-xl hover:shadow-2xl transform-gpu group-hover:animate-pulse bg-size-200 animate-gradient-x">
                        <Sparkles className="w-5 h-5 mr-2" />
                        Shop Collection
                        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Categories Grid with Enhanced Animation */}
      <div className="relative">
        <CategoryGrid />
      </div>

      {/* Testimonials with Floating Elements */}
      <div className="relative">
        <TestimonialsSection />
      </div>
    </div>
  );
};

export default Index;
