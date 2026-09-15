import { Link } from 'react-router-dom';
import { Container } from '@/components/store/Primitives';
import { StoreButton } from '@/components/store/Button';

const NotFound = () => (
  <Container className="flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
    <p className="brand-label text-gold-deep">Millux Collections</p>
    <h1 className="mt-4 font-display text-display-xl text-ink">404</h1>
    <p className="mt-4 max-w-sm text-sm text-soft sm:text-base">This page doesn't exist. It may have moved, or the address may be incorrect.</p>
    <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
      <StoreButton asChild>
        <Link to="/">Back to home</Link>
      </StoreButton>
      <Link to="/shop" className="brand-link">Shop the collection</Link>
    </div>
  </Container>
);

export default NotFound;
