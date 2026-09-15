import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

/**
 * The Millux Collections lockup, rendered from the original artwork.
 * `on="light"` uses the black-ink version (millux.png, 3:1).
 * `on="dark"`  uses the white version with gold lettering (2.33:1).
 * Height controls the size; width follows the artwork's own ratio so the
 * mark is never stretched or cropped.
 */
export type LogoProps = {
  on?: 'light' | 'dark';
  /** Tailwind height classes, e.g. "h-10 md:h-14" */
  className?: string;
  /** Wrap in a link to the homepage (default true) */
  linked?: boolean;
  priority?: boolean;
};

const ART = {
  light: { src: '/images/millux.png', width: 2172, height: 724 },
  dark: { src: '/images/milluxlogo-removebg-preview.png', width: 763, height: 327 },
};

export const Logo = ({ on = 'light', className = 'h-12', linked = true, priority = false }: LogoProps) => {
  const art = ART[on];
  const img = (
    <img
      src={art.src}
      width={art.width}
      height={art.height}
      alt="Millux Collections"
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      className={cn('w-auto object-contain select-none', className)}
      draggable={false}
    />
  );
  if (!linked) return img;
  return (
    <Link to="/" aria-label="Millux Collections home" className="inline-flex shrink-0 focus-ring">
      {img}
    </Link>
  );
};

export default Logo;
