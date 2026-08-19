import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';
import { Home as LuHome } from 'lucide-react';
import Index from "./pages/Index";
import Collections from "./pages/Collections";
import NewArrivals from "./pages/NewArrivals";
import ProductDetail from "./pages/ProductDetail";
import About from "./pages/About";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import AdminLogin from "./pages/AdminLogin";
import { AdminDashboard } from "./pages/AdminDashboard";
import PremiumNavbar from "./components/PremiumNavbar";
import Footer from "./components/Footer";
import WhatsAppFloat from "./components/WhatsAppFloat";
import BackToTop from "./components/BackToTop";
import { me } from "@/services/authService";
import { AdminSidebar } from "@/components/layout/AdminSidebar";
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

// Admin layout component with sidebar
const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      // On tablet and below, we start collapsed to save space
      if (width < 1024) {
        setIsCollapsed(true);
      } else {
        setIsCollapsed(false);
      }
      // On mobile, we close the sidebar by default, open via hamburger
      if (width < 640) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const toggleCollapse = () => setIsCollapsed(!isCollapsed);

  const sidebarWidth = isCollapsed ? 16 : 64; // collapsed width: 4rem (64px) but we use 16 for the icon only? Actually we want 4rem when collapsed? Let's adjust: collapsed we show only icons, width 10rem (160px)? We'll use 16 for the icon column? Better to use fixed numbers.
  // We'll compute the width for the main content margin.
  const sidebarWidthValue = isCollapsed ? 16 : 64; // in rem? Actually we are using Tailwind, so we'll use the actual pixel values in the class.
  // We'll use a different approach: we'll set the width of the sidebar and the margin of the main content via class names.

  return (
    <div className="min-h-screen bg-background relative">
      {/* Sidebar */}
      <AdminSidebar
        isSidebarOpen={isSidebarOpen}
        isCollapsed={isCollapsed}
        onToggleSidebar={toggleSidebar}
        onToggleCollapse={toggleCollapse}
      />

      {/* Backdrop for mobile sidebar */}
      {!isSidebarOpen && window.innerWidth < 640 && (
        <div className="fixed inset-0 bg-black/50 z-40 onClick={toggleSidebar}" />
      )}

      {/* Main Content */}
      <main className={`min-h-[calc(100vh-88px)] flex-1 pl-6 pt-6 pb-4
        ${isSidebarOpen ? (isCollapsed ? 'pl-10' : 'pl-64') : 'pl-6'}
        ${typeof window !== 'undefined' && window.innerWidth < 640 && !isSidebarOpen ? 'pl-0' : ''}
        transition-all duration-300`}>
        {/* Admin Header */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
          <div className="flex items-center space-x-3">
            <button
              onClick={toggleSidebar}
              className={`
                md:hidden
                p-2 rounded hover:bg-border/20
                text-text-muted hover:text-primary
              `}
              aria-label="Toggle sidebar"
            >
              <LuHome className="h-4 w-4" />
            </button>
            <h1 className="text-2xl font-semibold text-primary">Admin Panel</h1>
          </div>
          <p className="text-text-muted mt-2 md:mt-0">Store performance and inventory overview.</p>
        </div>

        {/* Main Content Area */}
        <div className="mt-4 space-y-6">
          {children}
        </div>
      </main>
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
              <Route path="/admin/*" element={
                <ProtectedRoute>
                  <AdminLayout>
                    <Routes>
                      <Route index element={<AdminDashboard />} />
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
