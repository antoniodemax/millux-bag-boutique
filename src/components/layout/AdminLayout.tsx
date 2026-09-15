import { ReactNode, useState } from 'react';
import { Menu } from 'lucide-react';
import { AdminSidebar } from './AdminSidebar';

interface AdminLayoutProps {
  children: ReactNode;
  email?: string;
}

/**
 * Full-height admin shell: fixed charcoal sidebar + warm off-white content area.
 * The storefront chrome is hidden on /admin routes (see App.tsx).
 */
export const AdminLayout = ({ children, email }: AdminLayoutProps) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#222222]">
      <AdminSidebar email={email} mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />

      <div className="lg:pl-64 flex flex-col min-h-screen">
        {/* Mobile top bar */}
        <div className="lg:hidden sticky top-0 z-30 flex items-center gap-3 h-14 px-4 bg-[#1F1F1F] text-[#FAF8F5]">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
            className="text-[#FAF8F5]/80 hover:text-[#FAF8F5]"
          >
            <Menu size={20} />
          </button>
          <span className="font-playfair text-base">Millux</span>
          <span className="text-[10px] uppercase tracking-[0.22em] text-[#B68D40]">Admin</span>
        </div>

        <main className="flex-1 px-4 py-8 sm:px-8 lg:px-12 lg:py-10">
          <div className="mx-auto w-full max-w-6xl">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
