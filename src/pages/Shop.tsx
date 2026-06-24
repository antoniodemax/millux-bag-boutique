import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import SEO from "@/components/SEO";

const categories = [
  { name: "Handbags for Women", image: "/images/handbags-category.png", available: true },
  { name: "Sling Bags", available: true },
  { name: "Travel Bags", available: true },
  { name: "Laptop Bags", available: true },
  { name: "Large Bags", available: false },
  { name: "Bridal Bags", available: false },
  { name: "Gym Bags", available: false },
  { name: "Briefcase", available: false },
  { name: "School Bags", available: false },
  { name: "Lunch Bags", available: false },
  { name: "Men Bags", available: false },
  { name: "Baby Diaper Bags", available: false },
];

const Shop = () => {
  const handleWhatsAppOrder = (category?: string) => {
    const msg = category
      ? `Hi! I'm interested in your ${category} collection. Can you show me what's available?`
      : "Hi! I'm interested in browsing your bag collection. Can you help me?";
    window.open(`https://wa.me/254723425778?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <>
      <SEO
        title="Shop Premium Bags & Handbags"
        description="Browse our complete collection of premium bags, handbags, travel bags, and laptop bags. Order directly on WhatsApp for fast delivery in Nairobi."
        keywords="bags Kenya, handbags Kenya, premium bags, bags Nairobi, sling bags, travel bags"
      />
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">Shop Our Collection</h1>
            <p className="text-gray-600 max-w-2xl mx-auto mb-6">
              Browse by category and place your order directly on WhatsApp — we'll confirm availability and arrange delivery.
            </p>
            <Button
              onClick={() => handleWhatsAppOrder()}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3"
              size="lg"
            >
              <MessageCircle className="h-5 w-5 mr-2" />
              Browse All on WhatsApp
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {categories.map((category) => (
              <Card
                key={category.name}
                className={`h-full transition-all duration-300 hover:shadow-lg ${
                  category.available ? "hover:scale-105 cursor-pointer" : "opacity-60"
                }`}
                onClick={() => category.available && handleWhatsAppOrder(category.name)}
              >
                <CardContent className="p-0">
                  <div className="bg-gray-200 h-48 flex items-center justify-center relative overflow-hidden rounded-t-lg">
                    {category.image ? (
                      <img
                        src={category.image}
                        alt={`${category.name} — MilluxCollections`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-center text-gray-500">
                        <div className="w-16 h-16 bg-gray-300 rounded-lg mx-auto mb-2"></div>
                      </div>
                    )}
                    {!category.available && (
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <span className="text-white font-semibold">Coming Soon</span>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 text-center mb-3">{category.name}</h3>
                    {category.available && (
                      <Button
                        className="w-full bg-green-600 hover:bg-green-700 text-white text-sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleWhatsAppOrder(category.name);
                        }}
                      >
                        <MessageCircle className="h-4 w-4 mr-1" />
                        Order on WhatsApp
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Shop;
