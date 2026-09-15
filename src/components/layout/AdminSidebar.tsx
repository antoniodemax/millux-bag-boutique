import { NavLink, Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  Tags,
  ReceiptText,
  Users,
  BarChart3,
  Settings,
  LogOut,
  Store,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { logout } from '@/services/authService';
import { toast } from '@/components/ui/sonner';

export const ADMIN_NAV = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard, end: true },
  { name: 'Products', href: '/admin/products', icon: Package, end: false },
  { name: 'Categories', href: '/admin/categories', icon: Tags, end: false },
  { name: 'Orders', href: '/admin/orders', icon: ReceiptText, end: false },
  { name: 'Customers', href: '/admin/customers', icon: Users, end: false },
  { name: 'Analytics', href: '/admin/analytics', icon: BarChart3, end: false },
  { name: 'Settings', href: '/admin/settings', icon: Settings, end: false },
];

interface AdminSidebarProps {
  email?: string;
  mobileOpen: boolean;
  onClose: () => void;
}

export const AdminSidebar = ({ email, mobileOpen, onClose }: AdminSidebarProps) => {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await logout();
    } catch {
      // Cookie may already be gone; still send the admin to the login screen
    } finally {
      toast.success('Signed out');
      navigate('/admin/login', { replace: true });
    }
  };

  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <button
          type="button"
          aria-label="Close menu"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
        />
      )}

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-64 flex flex-col bg-[#1F1F1F] text-[#FAF8F5] transition-transform duration-300',
          mobileOpen ? 'translate-x-0' : '-translate-x-full',
          'lg:translate-x-0'
        )}
      >
        {/* Brand */}
        <div className="flex items-center justify-between px-6 h-20 border-b border-white/10">
          <Link to="/admin" className="flex items-center gap-3" onClick={onClose}>
            <img
              src="/images/milluxlogo-removebg-preview.png"
              alt="Millux Collections"
              className="h-8 w-auto"
            />
            <span className="text-[10px] uppercase tracking-[0.22em] text-[#B68D40]">Admin</span>
          </Link>
          <button
            type="button"
            onClick={onClose}
            className="lg:hidden text-[#FAF8F5]/70 hover:text-[#FAF8F5]"
            aria-label="Close menu"
          >
            <X size={18} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-6 px-3">
          <ul className="space-y-1">
            {ADMIN_NAV.map((item) => (
              <li key={item.href}>
                <NavLink
                  to={item.href}
                  end={item.end}
                  onClick={onClose}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-3 px-3 py-2.5 rounded-md text-sm tracking-wide transition-colors border-l-2',
                      isActive
                        ? 'border-[#B68D40] bg-white/[0.06] text-[#FAF8F5]'
                        : 'border-transparent text-[#FAF8F5]/60 hover:text-[#FAF8F5] hover:bg-white/[0.04]'
                    )
                  }
                >
                  {({ isActive }) => (
                    <>
                      <item.icon
                        size={17}
                        strokeWidth={1.6}
                        className={isActive ? 'text-[#B68D40]' : 'text-current'}
                      />
                      <span>{item.name}</span>
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer */}
        <div className="px-4 py-5 border-t border-white/10 space-y-3">
          <Link
            to="/"
            className="flex items-center gap-2 text-xs text-[#FAF8F5]/60 hover:text-[#B68D40] transition-colors"
          >
            <Store size={14} strokeWidth={1.6} />
            View store
          </Link>
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs text-[#FAF8F5]/70 truncate" title={email}>
              {email ?? 'Signed in'}
            </p>
            <button
              type="button"
              onClick={handleSignOut}
              className="flex items-center gap-1.5 text-xs text-[#FAF8F5]/60 hover:text-[#B68D40] transition-colors flex-shrink-0"
            >
              <LogOut size={14} strokeWidth={1.6} />
              Sign out
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;
