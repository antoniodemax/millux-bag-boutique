import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, X, ShoppingBag, User } from 'lucide-react';
import { Logo } from '@/components/brand/Logo';
import { useCart } from '@/context/CartContext';
import { cn } from '@/lib/utils';

const NAV = [
  { label: 'Shop', to: '/shop' },
  { label: 'New Arrivals', to: '/new-arrivals' },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' },
];

const WHATSAPP_URL = 'https://wa.me/254723425778';

const navClass = ({ isActive }: { isActive: boolean }) =>
  cn(
    'brand-label py-2 border-b transition-colors duration-200 focus-ring',
    isActive ? 'text-ink border-gold' : 'text-soft border-transparent hover:text-ink'
  );

/**
 * Storefront header. The logo is the anchor: centred on desktop between the
 * navigation and the account/bag controls, centred on mobile between the
 * menu and bag buttons. White background so the black-ink lockup reads
 * exactly as the brand artwork does.
 */
const SiteHeader = () => {
  const [open, setOpen] = useState(false);
  const { cartCount } = useCart();
  const location = useLocation();

  // Close the drawer on navigation and lock body scroll while it is open
  useEffect(() => { setOpen(false); }, [location.pathname]);
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => { document.body.style.overflow = prev; window.removeEventListener('keydown', onKey); };
  }, [open]);

  const bagLabel = `Shopping bag, ${cartCount} item${cartCount === 1 ? '' : 's'}`;

  return (
    <header className="sticky top-0 z-40 bg-paper border-b border-line">
      <div className="site-container">
        {/* ---------- Desktop ---------- */}
        <div className="hidden lg:grid h-24 grid-cols-[1fr_auto_1fr] items-center gap-8">
          <nav aria-label="Primary" className="flex items-center gap-8">
            {NAV.map((item) => (
              <NavLink key={item.to} to={item.to} className={navClass}>
                {item.label}
              </NavLink>
            ))}
          </nav>

          <Logo on="light" className="h-14 xl:h-16" priority />

          <div className="flex items-center justify-end gap-6">
            <Link to="/customer/profile" className="brand-label inline-flex items-center gap-2 text-soft hover:text-ink transition-colors focus-ring py-2">
              <User className="h-[18px] w-[18px]" strokeWidth={1.5} aria-hidden="true" />
              Account
            </Link>
            <Link to="/cart" aria-label={bagLabel} className="brand-label inline-flex items-center gap-2 text-ink hover:text-gold-deep transition-colors focus-ring py-2">
              <span className="relative">
                <ShoppingBag className="h-[18px] w-[18px]" strokeWidth={1.5} aria-hidden="true" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-gold px-1 text-[10px] font-semibold tracking-normal text-paper">
                    {cartCount}
                  </span>
                )}
              </span>
              Bag
            </Link>
          </div>
        </div>

        {/* ---------- Mobile / tablet ---------- */}
        <div className="grid h-[72px] grid-cols-[44px_1fr_44px] items-center lg:hidden">
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            aria-expanded={open}
            aria-controls="mobile-menu"
            className="flex h-11 w-11 items-center justify-center text-ink focus-ring"
          >
            <Menu className="h-6 w-6" strokeWidth={1.5} />
          </button>

          <div className="flex justify-center">
            <Logo on="light" className="h-10 xs:h-11 sm:h-12" priority />
          </div>

          <Link to="/cart" aria-label={bagLabel} className="relative flex h-11 w-11 items-center justify-center text-ink focus-ring">
            <ShoppingBag className="h-6 w-6" strokeWidth={1.5} aria-hidden="true" />
            {cartCount > 0 && (
              <span className="absolute top-1 right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-gold px-1 text-[10px] font-semibold text-paper">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* ---------- Mobile drawer ---------- */}
      {open && createPortal(
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" id="mobile-menu" aria-label="Menu">
          <div aria-hidden="true" onClick={() => setOpen(false)} className="absolute inset-0 bg-ink/40" />
          <div className="absolute inset-y-0 left-0 flex w-[min(88vw,380px)] flex-col bg-paper shadow-2xl animate-in slide-in-from-left duration-200">
            <div className="flex h-[72px] items-center justify-between border-b border-line px-5">
              <Logo on="light" className="h-9" />
              <button type="button" onClick={() => setOpen(false)} aria-label="Close menu" className="flex h-11 w-11 items-center justify-center text-ink focus-ring -mr-2">
                <X className="h-6 w-6" strokeWidth={1.5} />
              </button>
            </div>

            <nav aria-label="Primary" className="flex flex-col px-5 pt-6">
              {NAV.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center justify-between border-b border-line py-4 font-display text-2xl text-ink focus-ring',
                      isActive && 'text-gold-deep'
                    )
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>

            <div className="mt-auto flex flex-col gap-1 border-t border-line px-5 py-5">
              <Link to="/customer/profile" className="flex items-center gap-3 py-3 brand-label text-ink focus-ring">
                <User className="h-5 w-5" strokeWidth={1.5} aria-hidden="true" /> Account
              </Link>
              <Link to="/cart" className="flex items-center gap-3 py-3 brand-label text-ink focus-ring">
                <ShoppingBag className="h-5 w-5" strokeWidth={1.5} aria-hidden="true" />
                Bag{cartCount > 0 ? ` (${cartCount})` : ''}
              </Link>
              <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="py-3 brand-label text-gold-deep focus-ring">
                WhatsApp us
              </a>
            </div>
          </div>
        </div>
      , document.body)}
    </header>
  );
};

export default SiteHeader;
