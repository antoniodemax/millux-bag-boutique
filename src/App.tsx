import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route, Navigate, useLocation, Link } from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';
import { useEffect, useState } from "react";
import Index from "./pages/Index";
import Collections from "./pages/Collections";
import NewArrivals from "./pages/NewArrivals";
import ProductDetail from "./pages/ProductDetail";
import About from "./pages/About";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import AdminLogin from "./pages/AdminLogin";
import { AdminDashboard } from "./pages/AdminDashboard";
import AdminProducts from "./pages/admin/Products";
import AdminProductForm from "./pages/admin/ProductForm";
import AdminCategories from "./pages/admin/Categories";
import AdminOrders from "./pages/admin/Orders";
import AdminCustomers from "./pages/admin/Customers";
import AdminAnalytics from "./pages/admin/Analytics";
import AdminSettings from "./pages/admin/Settings";
import CustomerRegister from "./pages/CustomerRegister";
import CustomerLogin from "./pages/CustomerLogin";
import CustomerProfile from "./pages/CustomerProfile";
import CustomerOrderHistory from "./pages/CustomerOrderHistory";
import CartPage from "./pages/CartPage";
import CustomerProtectedRoute from "./components/CustomerProtectedRoute";
import PremiumNavbar from "./components/PremiumNavbar";
import Footer from "./components/Footer";
import WhatsAppFloat from "./components/WhatsAppFloat";
import BackToTop from "./components/BackToTop";
import { me, User } from "@/services/authService";
import { AdminLayout } from "@/components/layout/AdminLayout";

/** Admin guard: requires an authenticated staff user with the admin role */
const AdminProtectedRoute = ({ children }: { children: (user: User) => React.ReactNode }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    let cancelled = false;
    const checkAuth = async () => {
      try {
        const current = await me();
        if (!cancelled) setUser(current && current.role === 'admin' ? current : null);
      } catch {
        if (!cancelled) setUser(null);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };
    checkAuth();
    return () => { cancelled = true; };
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#FAF8F5]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#B68D40]"></div>
      </div>
    );
  }

  return user ? <>{children(user)}</> : <Navigate to="/admin/login" replace />;
};

const AdminNotFound = () => (
  <div className="text-center py-20">
    <p className="font-playfair text-2xl text-[#1F1F1F]">Page not found</p>
    <p className="text-sm text-[#6B6B6B] mt-2">This admin page does not exist.</p>
    <Link to="/admin" className="inline-block mt-6 text-xs uppercase tracking-[0.12em] text-[#B68D40] hover:underline">
      Back to dashboard
    </Link>
  </div>
);

/** Storefront chrome (navbar, footer, floating widgets) is hidden inside the admin area */
const Shell = () => {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen bg-light">
      {!isAdmin && <PremiumNavbar />}
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/shop" element={<Collections />} />
        <Route path="/collections" element={<Collections />} />
        <Route path="/new-arrivals" element={<NewArrivals />} />
        <Route path="/products/:slug" element={<ProductDetail />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/customer/register" element={<CustomerRegister />} />
        <Route path="/customer/login" element={<CustomerLogin />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/*" element={
          <AdminProtectedRoute>
            {(user) => (
              <AdminLayout email={user.email}>
                <Routes>
                  <Route index element={<AdminDashboard />} />
                  <Route path="products" element={<AdminProducts />} />
                  <Route path="products/new" element={<AdminProductForm />} />
                  <Route path="products/:slug/edit" element={<AdminProductForm />} />
                  <Route path="categories" element={<AdminCategories />} />
                  <Route path="orders" element={<AdminOrders />} />
                  <Route path="customers" element={<AdminCustomers />} />
                  <Route path="customers/:id" element={<AdminCustomers />} />
                  <Route path="analytics" element={<AdminAnalytics />} />
                  <Route path="settings" element={<AdminSettings />} />
                  <Route path="*" element={<AdminNotFound />} />
                </Routes>
              </AdminLayout>
            )}
          </AdminProtectedRoute>}/>
        <Route path="/customer/*" element={
          <CustomerProtectedRoute>
            <div className="flex min-h-[calc(100vh-88px)]">
              {/* Sidebar - simplified for customer area */}
              <aside className="w-64 bg-white border-r shadow-sm">
                <div className="p-6">
                  <h2 className="text-xl font-bold text-primary">My Account</h2>
                  <nav className="mt-6 space-y-2">
                    <Link
                      to="/customer/profile"
                      className="flex items-center px-3 py-2 rounded text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                      Profile
                    </Link>
                    <Link
                      to="/customer/orders"
                      className="flex items-center px-3 py-2 rounded text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                      Order History
                    </Link>
                  </nav>
                </div>
              </aside>

              {/* Main Content */}
              <main className="flex-1 p-6">
                <Routes>
                  <Route path="profile" element={<CustomerProfile />} />
                  <Route path="orders" element={<CustomerOrderHistory />} />
                  <Route index element={<CustomerProfile />} />
                </Routes>
              </main>
            </div>
          </CustomerProtectedRoute>}/>
        <Route path="*" element={<NotFound />} />
      </Routes>
      {!isAdmin && <Footer />}
      {!isAdmin && <WhatsAppFloat />}
      {!isAdmin && <BackToTop />}
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
          <Shell />
        </BrowserRouter>
      </TooltipProvider>
    </HelmetProvider>
  );
};

export default App;
