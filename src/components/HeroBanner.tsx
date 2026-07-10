import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Award, Zap } from "lucide-react";

const HeroBanner = () => {

  return (
    <section className="relative min-h-screen overflow-hidden bg-gradient-to-br from-brand-dark via-brand-primary to-brand-secondary">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1584917865442-de89df76afd3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2000&q=80"
          alt="Premium bags background"
          className="w-full h-full object-cover opacity-16"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-brand-dark/80 via-brand-primary/70 to-brand-secondary/80"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="flex items-center justify-center min-h-screen py-20">
          {/* Content */}
          <div className="text-center space-y-8">
            <div className="space-y-6">
              <div className="flex items-center justify-center lg:justify-start gap-2 mb-4">
                <div className="w-2 h-2 bg-brand-accent rounded-full"></div>
                <span className="text-brand-accent font-medium text-sm uppercase tracking-wide">Premium Brand</span>
                <div className="w-2 h-2 bg-brand-accent rounded-full"></div>
              </div>

              <h1 className="text-5xl lg:text-7xl font-bold text-brand-light leading-tight max-w-4xl mx-auto">
                <span className="block">Premium</span>
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-brand-accent via-brand-light to-brand-accent">
                  Bags
                </span>
                <span className="block text-3xl lg:text-4xl font-light text-brand-accent">
                  for Every Occasion
                </span>
              </h1>

              <p className="text-xl lg:text-2xl text-brand-light/90 max-w-4xl mx-auto leading-relaxed">
                Discover our curated collection of <span className="text-brand-accent font-semibold">stylish handbags</span>,
                travel bags, and accessories that combine elegance with functionality.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link to="/shop">
                <Button
                  size="lg"
                  className="group w-full sm:w-auto bg-brand-accent hover:bg-brand-accent/90 text-brand-dark px-10 py-4 text-lg font-medium rounded-full transition-all duration-300 hover:scale-105 hover:shadow-xl"
                >
                  <Zap className="w-5 h-5 mr-2" />
                  Shop Collection
                </Button>
              </Link>

              <Link to="/about">
                <Button
                  variant="outline"
                  size="lg"
                  className="group w-full sm:w-auto border-2 border-brand-accent text-brand-accent hover:bg-brand-accent hover:text-brand-dark px-10 py-4 text-lg font-medium rounded-full transition-all duration-300 hover:scale-105 hover:shadow-xl"
                >
                  <Award className="w-5 h-5 mr-2" />
                  Our Story
                </Button>
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap items-center justify-center gap-8 pt-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-brand-light">500+</div>
                <div className="text-sm text-brand-accent">Happy Customers</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-brand-light">50+</div>
                <div className="text-sm text-brand-accent">Unique Designs</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-brand-light">24/7</div>
                <div className="text-sm text-brand-accent">Customer Support</div>
              </div>
            </div>
          </div>


        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 cursor-pointer">
        <div className="w-6 h-10 border-2 border-brand-accent rounded-full flex justify-center">
          <div className="w-1 h-3 bg-brand-accent rounded-full mt-2"></div>
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;
