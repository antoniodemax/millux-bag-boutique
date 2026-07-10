import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Shield, Truck, Heart, Award, Clock, CheckCircle } from 'lucide-react';
import PremiumHero from '@/components/PremiumHero';
import { PremiumSection, PremiumCard, FeatureRow } from '@/components/PremiumComponents';

const HomePage = () => {
  const featuredProducts = [
    {
      id: 1,
      title: 'Classic Leather Tote',
      price: '$249',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
    },
    {
      id: 2,
      title: 'Elegant Shoulder Bag',
      price: '$189',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
    },
    {
      id: 3,
      title: 'Premium Laptop Bag',
      price: '$299',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
    },
  ];

  const categories = [
    {
      name: 'Handbags',
      image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=60',
      description: 'Timeless elegance for every occasion',
    },
    {
      name: 'Laptop Bags',
      image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=60',
      description: 'Professional and stylish',
    },
    {
      name: 'Travel Bags',
      image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=60',
      description: 'Adventure ready companions',
    },
  ];

  return (
    <div className="bg-light overflow-hidden">
      <PremiumHero />

      <PremiumSection
        title="Featured Collection"
        subtitle="Handpicked pieces that define modern elegance"
        background="white"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group"
            >
              <motion.div
                whileHover={{ y: -8 }}
                transition={{ duration: 0.3 }}
                className="bg-white card"
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                  className="mb-6 rounded-lg overflow-hidden h-64 sm:h-72"
                >
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-full h-full object-cover"
                  />
                </motion.div>

                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3
                      className="text-lg font-bold text-primary"
                      style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                      {product.title}
                    </h3>
                    <p className="text-accent font-medium text-sm mt-1">{product.price}</p>
                  </div>
                  <button className="p-2 text-gray-400 hover:text-accent transition-colors">
                    <Heart className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex gap-1 mb-4">
                  {Array.from({ length: product.rating }).map((_, i) => (
                    <span key={i} className="text-accent text-xs">★</span>
                  ))}
                </div>

                <button className="w-full py-2 border border-primary text-primary hover:bg-primary hover:text-white transition-all duration-300 rounded-lg font-medium text-sm">
                  Quick View
                </button>
              </motion.div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="flex justify-center mt-12"
        >
          <Link to="/shop" className="btn-primary flex items-center gap-2">
            View All Products
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </PremiumSection>

      <PremiumSection
        title="Shop by Category"
        subtitle="Explore our curated collections"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categories.map((category, index) => (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -4 }}
              className="group cursor-pointer"
            >
              <div className="relative rounded-xl overflow-hidden h-72 sm:h-80 bg-gray-200">
                <motion.img
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-300"></div>

                <div className="absolute inset-0 flex flex-col justify-center items-center text-white text-center">
                  <h3
                    className="text-3xl font-bold mb-2"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    {category.name}
                  </h3>
                  <p className="text-sm opacity-90">{category.description}</p>
                  <div className="mt-6 flex items-center gap-2 group-hover:gap-4 transition-all">
                    <span className="text-sm font-medium">Explore</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </PremiumSection>

      <PremiumSection
        title="Why Choose Millux"
        subtitle="Excellence in every detail"
        background="white"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <FeatureRow
            icon={<Award className="w-6 h-6" />}
            title="Premium Craftsmanship"
            description="Each bag is meticulously crafted with the finest materials and attention to detail, ensuring timeless quality."
          />
          <FeatureRow
            icon={<Heart className="w-6 h-6" />}
            title="Handpicked Collection"
            description="Every piece is carefully selected to meet our rigorous standards for design, durability, and style."
          />
          <FeatureRow
            icon={<Truck className="w-6 h-6" />}
            title="Fast & Secure Delivery"
            description="We partner with trusted logistics providers to ensure your order arrives safely and promptly."
          />
          <FeatureRow
            icon={<Shield className="w-6 h-6" />}
            title="Secure Shopping"
            description="Your transactions are protected with industry-leading encryption and security protocols."
          />
          <FeatureRow
            icon={<Clock className="w-6 h-6" />}
            title="24/7 Support"
            description="Our dedicated team is always here to assist you with any questions or concerns."
          />
          <FeatureRow
            icon={<CheckCircle className="w-6 h-6" />}
            title="Quality Guarantee"
            description="We stand behind every product with our commitment to excellence and customer satisfaction."
          />
        </div>
      </PremiumSection>

      <PremiumSection title="What Our Customers Say">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              name: 'Sarah Johnson',
              role: 'Fashion Enthusiast',
              quote: 'The quality and elegance of these bags surpassed my expectations. Truly a luxury experience.',
              avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80',
            },
            {
              name: 'Emily Rodriguez',
              role: 'Business Professional',
              quote: 'Finally found a laptop bag that looks as professional as it is functional. Worth every penny.',
              avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80',
            },
            {
              name: 'Jessica Lee',
              role: 'Travel Blogger',
              quote: 'These bags are my travel companions. Durable, stylish, and built to last through adventures.',
              avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80',
            },
          ].map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white card text-center"
            >
              <img
                src={testimonial.avatar}
                alt={testimonial.name}
                className="w-16 h-16 rounded-full mx-auto mb-4 object-cover"
              />
              <p className="text-secondary italic mb-4">"{testimonial.quote}"</p>
              <h4 className="font-bold text-primary" style={{ fontFamily: "'Playfair Display', serif" }}>
                {testimonial.name}
              </h4>
              <p className="text-muted text-sm">{testimonial.role}</p>
            </motion.div>
          ))}
        </div>
      </PremiumSection>

      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="py-16 md:py-20 bg-primary text-white"
      >
        <div className="container-wide max-w-2xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
            Stay Updated
          </h2>
          <p className="mb-8 text-white/80">Subscribe to receive exclusive offers and updates about new collections.</p>

          <form className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-6 py-3 rounded-lg bg-white text-primary placeholder-gray-400 focus:outline-none"
            />
            <button type="submit" className="btn-primary">
              Subscribe
            </button>
          </form>
        </div>
      </motion.section>
    </div>
  );
};

export default HomePage;
