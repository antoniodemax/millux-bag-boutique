import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, Sparkles, Award, TrendingUp, Zap, Star } from "lucide-react";

const bagImages = [
  {
    url: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    alt: "Elegant leather handbag",
    badge: "Best Seller",
    tagline: "Timeless Elegance"
  },
  {
    url: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    alt: "Stylish shoulder bag",
    badge: "New Arrival",
    tagline: "Modern Style"
  },
  {
    url: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    alt: "Premium travel bag",
    badge: "Limited Edition",
    tagline: "Adventure Ready"
  },
  {
    url: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    alt: "Designer handbag collection",
    badge: "Premium",
    tagline: "Luxury Collection"
  }
];

const HeroBanner = () => {
  const [currentImage, setCurrentImage] = useState(0);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      if (!isHovering) {
        setCurrentImage((prev) => (prev + 1) % bagImages.length);
      }
    }, 3500);
    return () => clearInterval(timer);
  }, [isHovering]);

  const nextImage = () => setCurrentImage((prev) => (prev + 1) % bagImages.length);
  const prevImage = () => setCurrentImage((prev) => (prev - 1 + bagImages.length) % bagImages.length);

  return (
    <section className="relative min-h-screen overflow-hidden bg-gradient-to-br from-brand-dark via-brand-primary to-brand-secondary">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1584917865442-de89df76afd3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2000&q=80"
          alt="Premium bags background"
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-brand-dark/80 via-brand-primary/70 to-brand-secondary/80"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-screen py-20">
          {/* Left Content */}
          <div className="text-center lg:text-left space-y-8">
            <div className="space-y-6">
              <div className="flex items-center justify-center lg:justify-start gap-2 mb-4">
                <div className="w-2 h-2 bg-brand-accent rounded-full"></div>
                <span className="text-brand-accent font-medium text-sm uppercase tracking-wide">Premium Brand</span>
                <div className="w-2 h-2 bg-brand-accent rounded-full"></div>
              </div>

              <h1 className="text-5xl lg:text-7xl font-bold text-brand-light leading-tight">
                <span className="block">Premium</span>
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-brand-accent via-brand-light to-brand-accent">
                  Bags
                </span>
                <span className="block text-3xl lg:text-4xl font-light text-brand-accent">
                  for Every Occasion
                </span>
              </h1>

              <p className="text-xl lg:text-2xl text-brand-light/90 max-w-2xl leading-relaxed">
                Discover our curated collection of <span className="text-brand-accent font-semibold">stylish handbags</span>,
                travel bags, and accessories that combine elegance with functionality.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start">
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
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-8 pt-8">
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

          {/* Right Image Carousel */}
          <div
            className="relative"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            <div className="relative w-full h-[600px] lg:h-[700px] rounded-3xl overflow-hidden shadow-2xl group hover:shadow-[0_25px_60px_rgba(0,0,0,0.4)] transition-shadow duration-500">
              {bagImages.map((image, index) => (
                <div
                  key={index}
                  className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                    index === currentImage ? 'opacity-100' : 'opacity-0'
                  }`}
                >
                  <img
                    src={image.url}
                    alt={image.alt}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>

                  <div className="absolute top-6 left-6 bg-gradient-to-r from-brand-accent to-brand-secondary text-brand-dark px-4 py-2 rounded-full font-medium text-sm shadow-lg">
                    {image.badge}
                  </div>

                  <div className="absolute bottom-20 left-6 text-brand-light">
                    <div className="text-2xl font-bold mb-2">{image.tagline}</div>
                    <div className="flex items-center space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-brand-accent fill-current" />
                      ))}
                    </div>
                  </div>
                </div>
              ))}

              {/* Navigation Arrows */}
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-brand-light/95 hover:bg-brand-light p-4 rounded-full shadow-xl transition-all duration-300 hover:scale-110"
              >
                <ChevronLeft className="w-6 h-6 text-brand-dark" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-brand-light/95 hover:bg-brand-light p-4 rounded-full shadow-xl transition-all duration-300 hover:scale-110"
              >
                <ChevronRight className="w-6 h-6 text-brand-dark" />
              </button>

              {/* Dots Indicator */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-3">
                {bagImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImage(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index === currentImage
                        ? 'bg-brand-accent scale-125'
                        : 'bg-brand-light/50 hover:bg-brand-light/70'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Trending Badge */}
            <div className="absolute top-4 right-4 bg-gradient-to-r from-brand-primary to-brand-dark text-brand-light px-3 py-1 rounded-full text-xs font-medium shadow-lg">
              <TrendingUp className="w-3 h-3 inline mr-1" />
              Trending
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
