import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/** Reset scroll position on route change (SPA navigation keeps the old offset otherwise) */
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [pathname]);
  return null;
};

export default ScrollToTop;
