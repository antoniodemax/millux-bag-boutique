import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface SectionProps {
  title?: string;
  subtitle?: string;
  children: ReactNode;
  background?: 'light' | 'white';
  className?: string;
}

export const PremiumSection = ({
  title,
  subtitle,
  children,
  background = 'light',
  className = '',
}: SectionProps) => {
  return (
    <section
      className={`section-padding ${background === 'white' ? 'bg-white' : 'bg-light'} ${className}`}
    >
      <div className="container-wide">
        {(title || subtitle) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center mb-16"
          >
            {title && (
              <h2 className="text-primary mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
                {title}
              </h2>
            )}
            {subtitle && <p className="text-secondary text-lg">{subtitle}</p>}
          </motion.div>
        )}
        {children}
      </div>
    </section>
  );
};

interface PremiumCardProps {
  icon?: ReactNode;
  title: string;
  description: string;
  image?: string;
  link?: string;
}

export const PremiumCard = ({ icon, title, description, image }: PremiumCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      whileHover={{ y: -4 }}
      className="card"
    >
      {image && (
        <motion.div
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.3 }}
          className="mb-6 rounded-lg overflow-hidden h-48 sm:h-64"
        >
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover"
          />
        </motion.div>
      )}

      {icon && <div className="mb-4 text-accent">{icon}</div>}

      <h3
        className="text-lg font-bold text-primary mb-3"
        style={{ fontFamily: "'Playfair Display', serif" }}
      >
        {title}
      </h3>
      <p className="text-secondary text-sm leading-relaxed">{description}</p>
    </motion.div>
  );
};

interface FeatureRowProps {
  icon: ReactNode;
  title: string;
  description: string;
}

export const FeatureRow = ({ icon, title, description }: FeatureRowProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="flex gap-6 items-start"
    >
      <div className="flex-shrink-0 text-accent mt-1">{icon}</div>
      <div>
        <h4
          className="text-lg font-bold text-primary mb-2"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          {title}
        </h4>
        <p className="text-secondary">{description}</p>
      </div>
    </motion.div>
  );
};
