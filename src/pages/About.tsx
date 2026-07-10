
import { motion } from 'framer-motion';
import { Heart, Zap, Sparkles } from 'lucide-react';

interface ValueCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: number;
}

const ValueCard = ({ icon, title, description, delay }: ValueCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay }}
    viewport={{ once: true }}
    whileHover={{ y: -8 }}
    className="group relative"
  >
    <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100">
      <div className="flex justify-center mb-6">
        <div className="text-gray-700 group-hover:text-amber-600 transition-colors duration-300">
          {icon}
        </div>
      </div>
      <h3 className="text-center font-[520] text-lg text-gray-900 mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
        {title}
      </h3>
      <p className="text-center text-gray-600 leading-relaxed text-sm">
        {description}
      </p>
    </div>
  </motion.div>
);

const About = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FAF8F5' }}>
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="pt-20 pb-12 md:pt-32 md:pb-20"
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight"
              style={{
                color: '#2B2B2B',
                fontFamily: "'Playfair Display', serif",
                letterSpacing: '-0.01em',
              }}
            >
              About Millux Collections
            </h1>
            <p
              className="text-lg md:text-xl max-w-3xl mx-auto leading-relaxed"
              style={{ color: '#6F6F6F' }}
            >
              Crafting premium bags that combine timeless elegance with everyday functionality. 
              Each piece is a celebration of quality craftsmanship and sophisticated design.
            </p>
          </motion.div>
        </div>
      </motion.section>

      {/* Story & Founder Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="py-12 md:py-20"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Story Content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2
                className="text-3xl md:text-4xl font-bold mb-8"
                style={{
                  color: '#2B2B2B',
                  fontFamily: "'Playfair Display', serif",
                }}
              >
                Our Story
              </h2>

              <div className="space-y-6">
                <p
                  className="text-base md:text-lg leading-relaxed"
                  style={{ color: '#6F6F6F' }}
                >
                  Founded with a passion for quality and design, Millux Collections began as a vision to create bags that seamlessly blend elegance with everyday functionality. We believe that a great bag is more than just an accessory—it's an extension of your personality and a companion for life's adventures.
                </p>

                <p
                  className="text-base md:text-lg leading-relaxed"
                  style={{ color: '#6F6F6F' }}
                >
                  Our curated collection features carefully selected pieces that meet our rigorous standards for quality, craftsmanship, and design. From professional office essentials to elegant evening pieces, each item is chosen with the discerning modern consumer in mind.
                </p>

                <p
                  className="text-base md:text-lg leading-relaxed"
                  style={{ color: '#6F6F6F' }}
                >
                  At Millux Collections, we're committed to exceptional customer service and creating memorable purchasing experiences. We believe in building lasting relationships with our clients, offering thoughtful guidance to help you discover the perfect bag for your lifestyle.
                </p>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="mt-10 px-8 py-3 rounded-lg font-medium text-white transition-colors duration-300 text-sm md:text-base"
                style={{
                  backgroundColor: '#2B2B2B',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#C6A56A';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#2B2B2B';
                }}
              >
                Explore Our Collection
              </motion.button>
            </motion.div>

            {/* Founder Section */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="relative">
                {/* Founder Image */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                  className="mb-8 rounded-2xl overflow-hidden shadow-lg"
                  style={{ backgroundColor: '#FFFFFF' }}
                >
                  <img
                    src="/images/founder.png"
                    alt="Milkah Adhiambo - Founder"
                    className="w-full h-96 md:h-[450px] object-cover"
                  />
                </motion.div>

                {/* Founder Badge */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  viewport={{ once: true }}
                  className="inline-flex items-center px-4 py-2 rounded-full mb-6"
                  style={{
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #ECECEC',
                  }}
                >
                  <span
                    className="text-sm font-medium"
                    style={{ color: '#2B2B2B' }}
                  >
                    Founder
                  </span>
                </motion.div>

                {/* Founder Bio */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  viewport={{ once: true }}
                >
                  <h3
                    className="text-2xl md:text-3xl font-bold mb-4"
                    style={{
                      color: '#2B2B2B',
                      fontFamily: "'Playfair Display', serif",
                    }}
                  >
                    Milkah Adhiambo
                  </h3>

                  <p
                    className="text-base leading-relaxed mb-5"
                    style={{ color: '#6F6F6F' }}
                  >
                    With over a decade of experience in fashion and retail, Milkah founded Millux Collections with a singular mission: to make premium bags accessible to everyone. Her meticulous eye for quality and unwavering commitment to customer satisfaction drive every decision we make.
                  </p>

                  <div
                    className="italic text-base leading-relaxed p-5 rounded-lg"
                    style={{
                      backgroundColor: '#FFFFFF',
                      borderLeft: '3px solid #C6A56A',
                      color: '#2B2B2B',
                    }}
                  >
                    "I believe the right bag can transform your entire day. That's why we're dedicated to offering pieces that are as beautiful as they are functional."
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Values Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
        className="py-16 md:py-24"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2
              className="text-3xl md:text-4xl font-bold"
              style={{
                color: '#2B2B2B',
                fontFamily: "'Playfair Display', serif",
              }}
            >
              Our Values
            </h2>
            <p
              className="text-lg mt-4"
              style={{ color: '#6F6F6F' }}
            >
              The principles that guide every decision
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <ValueCard
              icon={<Sparkles className="w-8 h-8" />}
              title="Quality First"
              description="We never compromise on quality. Every bag undergoes rigorous inspection to meet our exacting standards for durability and craftsmanship."
              delay={0}
            />

            <ValueCard
              icon={<Heart className="w-8 h-8" />}
              title="Customer Focus"
              description="Your satisfaction is our priority. We're here to provide personalized guidance and support to help you find your perfect bag."
              delay={0.1}
            />

            <ValueCard
              icon={<Zap className="w-8 h-8" />}
              title="Style & Function"
              description="Beautiful design meets practical functionality. Every piece is thoughtfully designed for modern life while maintaining timeless elegance."
              delay={0.2}
            />
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default About;
