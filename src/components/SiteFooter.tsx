import { Link } from 'react-router-dom';
import { Logo } from '@/components/brand/Logo';

const columns = [
  {
    title: 'Shop',
    links: [
      { label: 'All bags', to: '/shop' },
      { label: 'New arrivals', to: '/new-arrivals' },
    ],
  },
  {
    title: 'The house',
    links: [
      { label: 'About Millux', to: '/about' },
      { label: 'Contact', to: '/contact' },
    ],
  },
  {
    title: 'Account',
    links: [
      { label: 'Sign in', to: '/customer/login' },
      { label: 'Create account', to: '/customer/register' },
      { label: 'My orders', to: '/customer/orders' },
    ],
  },
];

const assistance = [
  { label: 'WhatsApp +254 723 425 778', href: 'https://wa.me/254723425778' },
  { label: 'info@milluxcollection.com', href: 'mailto:info@milluxcollection.com' },
  { label: 'Instagram', href: 'https://instagram.com/milluxcollections' },
];

/**
 * Dark footer: the white-and-gold lockup is the brand's second lockup and
 * belongs on ink. Only links that go somewhere real are listed.
 */
const SiteFooter = () => (
  <footer className="bg-ink text-paper">
    <div className="site-container py-14 lg:py-20">
      <div className="grid gap-12 lg:grid-cols-[1.4fr_repeat(3,1fr)] lg:gap-8">
        <div>
          <Logo on="dark" className="h-16 sm:h-20" />
          <p className="mt-6 max-w-xs text-sm leading-relaxed text-paper/70">
            Luxury bags and accessories, Nairobi. Orders are confirmed personally over WhatsApp.
          </p>
        </div>

        {columns.map((col) => (
          <div key={col.title}>
            <h3 className="brand-label font-sans text-gold-bright">{col.title}</h3>
            <ul className="mt-5 space-y-3">
              {col.links.map((l) => (
                <li key={l.label}>
                  <Link to={l.to} className="text-sm text-paper/80 hover:text-paper transition-colors focus-ring">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mt-14 flex flex-col gap-6 border-t border-paper/15 pt-8 sm:flex-row sm:items-center sm:justify-between">
        <ul className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-x-8">
          {assistance.map((a) => (
            <li key={a.label}>
              <a href={a.href} target="_blank" rel="noopener noreferrer" className="text-sm text-paper/80 hover:text-gold-bright transition-colors focus-ring">
                {a.label}
              </a>
            </li>
          ))}
        </ul>
        <p className="text-xs text-paper/50">© {new Date().getFullYear()} Millux Collections. Nairobi, Kenya.</p>
      </div>
    </div>
  </footer>
);

export default SiteFooter;
