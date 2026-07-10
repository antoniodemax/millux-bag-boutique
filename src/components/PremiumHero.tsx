import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const PremiumHero = () => {
  return (
    <section className="relative w-full h-screen flex items-center justify-center overflow-hidden pt-[72px]">
      {/* Background Image */}
      <motion.div
        initial={{ scale: 1.05, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1, ease: 'easeOut' }}
        className="absolute inset-0"
      >
        <img
          src="https://images.unsplash.com/photo-1548036328-c9fa89d128fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
          alt="Premium luxury handbag"
          className="w-full h-full object-cover"
        />
        {/* Subtle Overlay */}
        <div className="absolute inset-0 bg-black/20"></div>
      </motion.div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h1
            className="text-white mb-6"
            style={{
              fontFamily: "'Playfair Display', serif",
              letterSpacing: '-0.02em',
            }}
          >
            Carry Confidence.
          </h1>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-white/90 text-lg md:text-xl max-w-2xl mx-auto mb-10 font-inter leading-relaxed"
        >
          Timeless handbags designed for modern women who appreciate elegance, quality, and everyday functionality.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-6 justify-center items-center"
        >
          <Link to="/shop">
            <button className="btn-primary flex items-center gap-2">
              Shop Collection
              <ArrowRight className="w-4 h-4" />
            </button>
          </Link>

          <Link to="/about">
            <button className="btn-secondary">Our Story</button>
          </Link>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
      >
        <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
          <div className="w-1 h-2 bg-white rounded-full mt-2"></div>
        </div>
      </motion.div>
    </section>
  );
};

export default PremiumHero;
