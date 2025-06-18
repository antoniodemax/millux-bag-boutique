
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Award, Users, Heart } from "lucide-react";

const AboutSection = () => {
  return (
    <section className="py-16 lg:py-20 bg-gradient-to-br from-brand-light via-white to-brand-secondary/20 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-brand-accent/20 to-brand-primary/10 rounded-full animate-float blur-xl"></div>
        <div className="absolute bottom-20 right-20 w-48 h-48 bg-gradient-to-br from-brand-secondary/30 to-brand-accent/20 rounded-full animate-float-delayed blur-xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-brand-dark mb-6">
            About MilluxCollections
          </h2>
          <p className="text-lg lg:text-xl text-brand-primary max-w-3xl mx-auto leading-relaxed">
            Crafting premium bags that combine style, functionality, and durability for the modern lifestyle.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-12">
          <div className="space-y-6 animate-fade-in">
            <h3 className="text-2xl lg:text-3xl font-bold text-brand-dark">Our Story</h3>
            <p className="text-brand-primary leading-relaxed">
              Founded with a passion for quality and design, MilluxCollections began as a vision to create 
              bags that seamlessly blend elegance with everyday functionality. We believe that a great bag 
              is more than just an accessory – it's an extension of your personality.
            </p>
            <p className="text-brand-primary leading-relaxed">
              Our curated collection features carefully selected pieces that meet our high standards for 
              quality, craftsmanship, and style. From professional laptop bags to elegant evening clutches, 
              each piece is chosen with the modern consumer in mind.
            </p>
            <Link to="/about">
              <Button className="group bg-gradient-to-r from-brand-primary to-brand-dark hover:from-brand-dark hover:to-brand-primary text-brand-light px-6 py-3 rounded-full transition-all duration-300 hover:scale-105">
                Learn More About Us
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>

          <div className="relative animate-fade-in delay-300">
            <img 
              src="/lovable-uploads/be8feb59-6ba3-45a2-a52e-5a7b4940d995.png" 
              alt="Milkah Adhiambo - Founder of MilluxCollections"
              className="w-full max-w-md mx-auto rounded-2xl shadow-2xl hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute -bottom-4 -right-4 bg-gradient-to-r from-brand-accent to-brand-secondary text-brand-dark px-4 py-2 rounded-full font-medium text-sm shadow-lg animate-bounce">
              Our Founder ✨
            </div>
          </div>
        </div>

        {/* Values Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in delay-500">
          <Card className="text-center p-6 hover:shadow-xl transition-all duration-300 hover:scale-105 border border-brand-secondary/30">
            <CardContent className="p-0">
              <div className="w-16 h-16 bg-gradient-to-br from-brand-primary to-brand-dark rounded-full mx-auto mb-4 flex items-center justify-center">
                <Award className="w-8 h-8 text-brand-light" />
              </div>
              <h4 className="text-lg font-semibold text-brand-dark mb-2">Quality First</h4>
              <p className="text-brand-primary text-sm">Every bag is carefully inspected to meet our high standards.</p>
            </CardContent>
          </Card>

          <Card className="text-center p-6 hover:shadow-xl transition-all duration-300 hover:scale-105 border border-brand-secondary/30">
            <CardContent className="p-0">
              <div className="w-16 h-16 bg-gradient-to-br from-brand-accent to-brand-primary rounded-full mx-auto mb-4 flex items-center justify-center">
                <Users className="w-8 h-8 text-brand-dark" />
              </div>
              <h4 className="text-lg font-semibold text-brand-dark mb-2">Customer Focus</h4>
              <p className="text-brand-primary text-sm">Your satisfaction is our priority and driving force.</p>
            </CardContent>
          </Card>

          <Card className="text-center p-6 hover:shadow-xl transition-all duration-300 hover:scale-105 border border-brand-secondary/30">
            <CardContent className="p-0">
              <div className="w-16 h-16 bg-gradient-to-br from-brand-secondary to-brand-accent rounded-full mx-auto mb-4 flex items-center justify-center">
                <Heart className="w-8 h-8 text-brand-primary" />
              </div>
              <h4 className="text-lg font-semibold text-brand-dark mb-2">Style & Function</h4>
              <p className="text-brand-primary text-sm">Beautiful design meets practical functionality.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
