
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ShoppingCart, Plus, Minus } from "lucide-react";
import { useProduct } from "@/hooks/useProducts";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { data: product, isLoading } = useProduct(id || '');
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [quantity, setQuantity] = useState(1);
  
  const handleWhatsAppInquiry = () => {
    if (!product) return;
    const message = `Hi! I'm interested in the ${product.name} (KSh ${product.price.toLocaleString()}) from MilluxCollections. Can you provide more details?`;
    const whatsappUrl = `https://wa.me/254700000000?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleAddToCart = () => {
    if (!user) {
      window.location.href = '/auth';
      return;
    }
    if (!product) return;
    addToCart({ productId: product.id, quantity });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary mx-auto mb-4"></div>
            <p className="text-gray-600">Loading product...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Product not found</h1>
            <p className="text-gray-600">The product you're looking for doesn't exist.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Image */}
          <div>
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <div className="bg-gray-200 h-96 lg:h-[500px] flex items-center justify-center">
                  {product.image_url ? (
                    <img 
                      src={product.image_url} 
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-center text-gray-500">
                      <div className="w-32 h-32 bg-gray-300 rounded-lg mx-auto mb-4"></div>
                      <p>{product.name}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Product Details */}
          <div>
            <div className="mb-4">
              <span className="text-sm text-gray-500 uppercase tracking-wide">
                {product.category}
              </span>
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {product.name}
            </h1>
            
            <div className="text-2xl font-bold text-gray-900 mb-6">
              KSh {product.price.toLocaleString()}
            </div>
            
            {product.description && (
              <p className="text-gray-600 mb-8 leading-relaxed">
                {product.description}
              </p>
            )}

            {/* Stock Status */}
            <div className="mb-6">
              <p className="text-sm text-gray-600">
                Stock: {product.stock_quantity || 0} available
              </p>
            </div>

            {/* Quantity Selector */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantity
              </label>
              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="text-lg font-medium w-12 text-center">{quantity}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setQuantity(quantity + 1)}
                  disabled={quantity >= (product.stock_quantity || 0)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              <Button 
                className="w-full" 
                size="lg"
                onClick={handleAddToCart}
                disabled={!product.stock_quantity || product.stock_quantity <= 0}
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                Purchase
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
