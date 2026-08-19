import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';
import Index from "./pages/Index";
import Collections from "./pages/Collections";
import NewArrivals from "./pages/NewArrivals";
import ProductDetail from "./pages/ProductDetail";
import About from "./pages/About";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import AdminLogin from "./pages/AdminLogin";
import PremiumNavbar from "./components/PremiumNavbar";
import Footer from "./components/Footer";
import WhatsAppFloat from "./components/WhatsAppFloat";
import BackToTop from "./components/BackToTop";
import { me } from "@/services/authService";
import { useEffect, useState } from "react";

// Protected route component that checks authentication
const ProtectedRoute = ({ children, redirectTo = "/admin/login" }: { children: React.ReactNode; redirectTo?: string }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await me();
        setIsAuthenticated(true);
      } catch (err) {
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-[calc(100vh-88px)]">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>;
  }

  return isAuthenticated ? children : <Navigate to={redirectTo} replace />;
};

// Admin layout component
const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-background">
      {/* Admin navbar would go here - keeping it simple for now */}
      <div className="px-4 py-6">
        <h1 className="text-2xl font-bold text-primary mb-6">Admin Panel</h1>
        <div className="space-y-6">
          {children}
        </div>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <HelmetProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="min-h-screen bg-light">
            <PremiumNavbar />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/shop" element={<Collections />} />
              <Route path="/collections" element={<Collections />} />
              <Route path="/new-arrivals" element={<NewArrivals />} />
              <Route path="/products/:slug" element={<ProductDetail />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin/*" element={<ProtectedRoute>
                <AdminLayout>
                  <Routes>
                    <Route index element={<div className="text-center py-12">
                      <p className="text-text-muted">Welcome to the Admin Panel</p>
                      <p className="mt-4">Admin dashboard coming soon...</p>
                    </div>} />
                    {/* Additional admin routes will go here */}
                  </Routes>
                </AdminLayout>
              </ProtectedRoute>}/>
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Footer />
            <WhatsAppFloat />
            <BackToTop />
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </HelmetProvider>
  );
};

export default App;
