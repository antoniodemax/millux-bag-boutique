
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ShoppingCart } from "lucide-react";

// Mock product data - in real app this would come from API
const mockProduct = {
  id: 1,
  name: "Classic Leather Handbag",
  price: 8500,
  category: "Handbags for Women",
  image: "",
  description: "This elegant leather handbag is crafted from premium materials and designed for the modern woman. Features multiple compartments, secure zippers, and a comfortable shoulder strap. Perfect for everyday use or special occasions.",
  features: [
    "Premium leather construction",
    "Multiple interior compartments",
    "Secure zipper closure",
    "Adjustable shoulder strap",
    "Dust bag included"
  ]
};

const ProductDetail = () => {
  const { id } = useParams();
  
  const handleWhatsAppInquiry = () => {
    const message = `Hi! I'm interested in the ${mockProduct.name} (KSh ${mockProduct.price.toLocaleString()}) from MilluxCollections. Can you provide more details?`;
    const whatsappUrl = `https://wa.me/254700000000?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Image */}
          <div>
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <div className="bg-gray-200 h-96 lg:h-[500px] flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <div className="w-32 h-32 bg-gray-300 rounded-lg mx-auto mb-4"></div>
                    <p>{mockProduct.name}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Product Details */}
          <div>
            <div className="mb-4">
              <span className="text-sm text-gray-500 uppercase tracking-wide">
                {mockProduct.category}
              </span>
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {mockProduct.name}
            </h1>
            
            <div className="text-2xl font-bold text-gray-900 mb-6">
              KSh {mockProduct.price.toLocaleString()}
            </div>
            
            <p className="text-gray-600 mb-8 leading-relaxed">
              {mockProduct.description}
            </p>

            {/* Features */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Features</h3>
              <ul className="space-y-2">
                {mockProduct.features.map((feature, index) => (
                  <li key={index} className="flex items-center text-gray-600">
                    <div className="w-2 h-2 bg-gray-400 rounded-full mr-3"></div>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              <Button className="w-full" size="lg">
                <ShoppingCart className="h-5 w-5 mr-2" />
                Add to Cart
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full" 
                size="lg"
                onClick={handleWhatsAppInquiry}
              >
                Inquire on WhatsApp
              </Button>
            </div>

            {/* Additional Info */}
            <div className="mt-8 pt-8 border-t border-gray-200">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-600">
                <div>
                  <strong>Free Delivery:</strong> Nairobi & Mombasa
                </div>
                <div>
                  <strong>Return Policy:</strong> 7 days
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
