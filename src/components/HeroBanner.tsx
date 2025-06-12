
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, Sparkles, Award, TrendingUp } from "lucide-react";

const bagImages = [
  {
    url: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    alt: "Elegant leather handbag",
    badge: "Best Seller"
  },
  {
    url: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    alt: "Stylish shoulder bag",
    badge: "New Arrival"
  },
  {
    url: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    alt: "Premium travel bag",
    badge: "Limited Edition"
  },
  {
    url: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    alt: "Designer handbag collection",
    badge: "Premium"
  }
];

const HeroBanner = () => {
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % bagImages.length);
    }, 4000);

    return () => clearInterval(timer);
  }, []);

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % bagImages.length);
  };

  const prevImage = () => {
    setCurrentImage((prev) => (prev - 1 + bagImages.length) % bagImages.length);
  };

  return (
    <section className="relative min-h-screen overflow-hidden bg-gradient-to-br from-brand-dark via-brand-primary to-brand-secondary">
      {/* Enhanced Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div 
          className="absolute inset-0" 
          style={{ 
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='120' height='120' viewBox='0 0 120 120' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.15'%3E%3Cpath d='M9 0h2v20H9V0zm25.134.84l1.732 1-10 17.32-1.732-1 10-17.32zm-2 0L43.134 18.16l-1.732 1L31.402 1.84l1.732-1z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` 
          }}
        ></div>
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-br from-brand-accent/30 to-brand-secondary/20 rounded-full animate-float blur-xl"></div>
        <div className="absolute top-40 right-32 w-48 h-48 bg-gradient-to-br from-brand-light/20 to-brand-accent/30 rounded-full animate-float-delayed blur-xl"></div>
        <div className="absolute bottom-32 left-1/4 w-24 h-24 bg-gradient-to-br from-brand-secondary/40 to-brand-primary/30 rounded-full animate-float-slow blur-xl"></div>
        <div className="absolute bottom-20 right-20 w-36 h-36 bg-gradient-to-br from-brand-accent/25 to-brand-light/20 rounded-full animate-float-reverse blur-xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-screen py-20">
          {/* Enhanced Left Content */}
          <div className="text-center lg:text-left space-y-8 animate-fade-in">
            <div className="space-y-6">
              <div className="flex items-center justify-center lg:justify-start gap-2 mb-4">
                <div className="w-2 h-2 bg-brand-accent rounded-full animate-pulse"></div>
                <span className="text-brand-accent font-medium text-sm uppercase tracking-wide">Premium Brand</span>
                <div className="w-2 h-2 bg-brand-accent rounded-full animate-pulse delay-300"></div>
              </div>
              
              <h1 className="text-5xl lg:text-7xl font-bold text-brand-light leading-tight">
                <span className="block animate-fade-in">Premium</span>
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-brand-accent via-brand-light to-brand-accent animate-gradient-x bg-size-200">
                  Bags
                </span>
                <span className="block text-3xl lg:text-4xl font-light text-brand-accent animate-fade-in delay-500">
                  for Every Occasion
                </span>
              </h1>
              
              <p className="text-xl lg:text-2xl text-brand-light/90 max-w-2xl leading-relaxed animate-fade-in delay-700">
                Discover our curated collection of <span className="text-brand-accent font-semibold">stylish handbags</span>, 
                travel bags, and accessories that combine elegance with functionality.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start animate-fade-in delay-1000">
              <Link to="/shop">
                <Button 
                  size="lg" 
                  className="group w-full sm:w-auto bg-gradient-to-r from-brand-accent via-brand-accent to-brand-accent hover:from-brand-accent/90 hover:via-brand-accent hover:to-brand-accent/90 text-brand-dark px-10 py-4 text-lg font-medium rounded-full transition-all duration-500 hover:scale-105 shadow-xl hover:shadow-2xl transform-gpu relative overflow-hidden"
                >
                  <Sparkles className="w-5 h-5 mr-2 group-hover:animate-spin" />
                  Shop Collection
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                </Button>
              </Link>
              
              <Link to="/about">
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="group w-full sm:w-auto border-2 border-brand-accent text-brand-accent hover:bg-brand-accent hover:text-brand-dark px-10 py-4 text-lg font-medium rounded-full transition-all duration-500 hover:scale-105 shadow-lg hover:shadow-xl transform-gpu relative overflow-hidden"
                >
                  <Award className="w-5 h-5 mr-2 group-hover:animate-bounce" />
                  Our Story
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-brand-accent/10 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                </Button>
              </Link>
            </div>

            {/* Enhanced Trust Indicators */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-8 pt-8 animate-fade-in delay-1200">
              <div className="group text-center hover:scale-110 transition-transform duration-300 cursor-pointer">
                <div className="text-3xl font-bold text-brand-light group-hover:text-brand-accent transition-colors">500+</div>
                <div className="text-sm text-brand-accent group-hover:text-brand-light transition-colors">Happy Customers</div>
              </div>
              <div className="group text-center hover:scale-110 transition-transform duration-300 cursor-pointer">
                <div className="text-3xl font-bold text-brand-light group-hover:text-brand-accent transition-colors">50+</div>
                <div className="text-sm text-brand-accent group-hover:text-brand-light transition-colors">Unique Designs</div>
              </div>
              <div className="group text-center hover:scale-110 transition-transform duration-300 cursor-pointer">
                <div className="text-3xl font-bold text-brand-light group-hover:text-brand-accent transition-colors">24/7</div>
                <div className="text-sm text-brand-accent group-hover:text-brand-light transition-colors">Customer Support</div>
              </div>
            </div>
          </div>

          {/* Enhanced Right Image Carousel */}
          <div className="relative animate-fade-in delay-300">
            <div className="relative w-full h-[600px] lg:h-[700px] rounded-3xl overflow-hidden shadow-2xl group">
              {bagImages.map((image, index) => (
                <div
                  key={index}
                  className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
                    index === currentImage 
                      ? 'opacity-100 scale-100 rotate-0' 
                      : 'opacity-0 scale-110 rotate-1'
                  }`}
                >
                  <img
                    src={image.url}
                    alt={image.alt}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
                  
                  {/* Dynamic Badge */}
                  <div className="absolute top-6 left-6 bg-gradient-to-r from-brand-accent to-brand-secondary text-brand-dark px-4 py-2 rounded-full font-medium text-sm shadow-lg animate-pulse">
                    {image.badge} ✨
                  </div>
                </div>
              ))}
              
              {/* Enhanced Navigation Arrows */}
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-brand-light/95 hover:bg-brand-light p-4 rounded-full shadow-xl transition-all duration-300 hover:scale-125 transform-gpu group-hover:shadow-2xl"
              >
                <ChevronLeft className="w-6 h-6 text-brand-dark" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-brand-light/95 hover:bg-brand-light p-4 rounded-full shadow-xl transition-all duration-300 hover:scale-125 transform-gpu group-hover:shadow-2xl"
              >
                <ChevronRight className="w-6 h-6 text-brand-dark" />
              </button>

              {/* Enhanced Dots Indicator */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-3">
                {bagImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImage(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index === currentImage 
                        ? 'bg-brand-accent scale-150 shadow-lg' 
                        : 'bg-brand-light/50 hover:bg-brand-light/70 hover:scale-125'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Enhanced Floating Elements */}
            <div className="absolute -top-6 -right-6 w-32 h-32 bg-gradient-to-br from-brand-accent/40 to-brand-primary/30 rounded-full opacity-60 animate-spin-slow blur-sm"></div>
            <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-gradient-to-br from-brand-secondary/50 to-brand-accent/30 rounded-full opacity-40 animate-pulse delay-1000 blur-sm"></div>
            
            {/* Trending Badge */}
            <div className="absolute top-4 right-4 bg-gradient-to-r from-brand-primary to-brand-dark text-brand-light px-3 py-1 rounded-full text-xs font-medium shadow-lg animate-bounce">
              <TrendingUp className="w-3 h-3 inline mr-1" />
              Trending
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-brand-accent rounded-full flex justify-center relative overflow-hidden">
          <div className="w-1 h-3 bg-brand-accent rounded-full mt-2 animate-pulse"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-brand-accent/20 to-transparent animate-pulse delay-300"></div>
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;
