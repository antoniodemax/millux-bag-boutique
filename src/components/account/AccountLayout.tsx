import { NavLink, useNavigate } from 'react-router-dom';
import { customerLogout } from '@/services/authService';
import { toast } from '@/components/ui/sonner';
import { Container, PageHeading } from '@/components/store/Primitives';
import { StoreButton } from '@/components/store/Button';
import { cn } from '@/lib/utils';

const tabs = [
  { label: 'Profile', to: '/customer/profile' },
  { label: 'Orders', to: '/customer/orders' },
];

/**
 * Shell for the signed-in customer area: heading, tab navigation and sign out.
 * Pages render only their own content inside it.
 */
const AccountLayout = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await customerLogout();
      toast.success('Signed out');
      navigate('/');
    } catch {
      toast.error('Could not sign out. Please try again.');
    }
  };

  return (
    <Container className="pb-20">
      <PageHeading eyebrow="Millux Collections" title="My account">
        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-b border-line">
          <nav aria-label="Account" className="flex gap-8">
            {tabs.map((t) => (
              <NavLink
                key={t.to}
                to={t.to}
                className={({ isActive }) =>
                  cn(
                    'brand-label -mb-px border-b-2 py-3 transition-colors focus-ring',
                    isActive ? 'border-gold text-ink' : 'border-transparent text-soft hover:text-ink'
                  )
                }
              >
                {t.label}
              </NavLink>
            ))}
          </nav>
          <StoreButton variant="tertiary" size="sm" onClick={handleLogout} className="mb-2">
            Sign out
          </StoreButton>
        </div>
      </PageHeading>
      {children}
    </Container>
  );
};

export default AccountLayout;
