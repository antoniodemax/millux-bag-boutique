
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { ShoppingBag, MessageCircle } from 'lucide-react';

const Auth = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleWhatsAppContact = () => {
    const message = "Hi! I'm interested in your products at MilluxCollections and would like to place an order.";
    const whatsappUrl = `https://wa.me/254700000000?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag className="h-12 w-12 text-brand-primary mx-auto mb-4 animate-pulse" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <ShoppingBag className="h-12 w-12 text-brand-primary mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-gray-900">Welcome to MilluxCollections</h2>
          <p className="mt-2 text-gray-600">Contact us directly to place your order</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Get in Touch</CardTitle>
            <CardDescription>
              Ready to shop? Contact us on WhatsApp for personalized service and instant ordering.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={handleWhatsAppContact}
              className="w-full bg-green-600 hover:bg-green-700"
              size="lg"
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              Contact us on WhatsApp
            </Button>
            
            <div className="text-center">
              <p className="text-sm text-gray-600">
                Our team will help you browse products, check availability, and process your order directly through WhatsApp.
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            We provide personalized shopping assistance and secure payment options
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
