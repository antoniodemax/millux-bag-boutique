import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0 },
};

const sectionReveal = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

function Reveal({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={fadeUp}
      transition={{ duration: 0.7, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

const newArrivals = [
  {
    title: 'Obsidian Structured Tote',
    price: '£480',
    category: 'Tote',
    badge: 'New',
    gradient: 'linear-gradient(160deg,#2E2E2E,#0A0A0A)',
  },
  {
    title: 'Cognac Shoulder Bag',
    price: '£360',
    category: 'Shoulder',
    badge: null,
    gradient: 'linear-gradient(150deg,#C88A4F,#8C5A2A)',
  },
  {
    title: 'Scarlet Mini Crossbody',
    price: '£295',
    category: 'Crossbody',
    badge: 'Bestseller',
    gradient: 'linear-gradient(150deg,#A33B34,#6E211D)',
  },
  {
    title: 'Onyx Leather Duffel',
    price: '£620',
    category: 'Travel',
    badge: 'Last 3',
    gradient: 'linear-gradient(150deg,#3A3A3A,#141414)',
  },
];

const pillars = [
  {
    n: '01',
    title: 'Master Leather-Work',
    body: 'Every bag is hand-stitched in limited runs by artisans with decades of craft — no shortcuts, no compromise.',
  },
  {
    n: '02',
    title: 'Ethically Sourced',
    body: 'We use only certified full-grain and vegetable-tanned leathers — because true luxury leaves no debt to the planet.',
  },
  {
    n: '03',
    title: 'Lifetime Repair',
    body: 'Every Millux bag comes with free lifetime repair and re-conditioning. Buy once, carry always.',
  },
];

const HomePage = () => {
  const [email, setEmail] = useState('');

  return (
    <div className="bg-[#FAF8F5] overflow-hidden">
      {/* ---------------- HERO ---------------- */}
      <section className="relative h-screen min-h-[640px] w-full overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/images/handbags-category.png"
            alt="Millux Collections leather handbags"
            className="w-full h-full object-cover"
          />
          {/* Enhanced overlay for better text readability */}
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(250,248,245,0.7)_0%,rgba(250,248,245,0.9)_100%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(250,248,245,0.3)_0%,transparent_50%)]" />
        </div>
        <div className="absolute bottom-0 inset-x-0 h-72 bg-gradient-to-t from-[#FAF8F5] via-[#FAF8F5]/60 to-transparent" />

        <div className="relative z-10 h-full flex items-center px-6 md:px-16">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: 'easeOut' }}
            className="max-w-xl"
          >
            <p className="text-xs font-semibold uppercase tracking-widest text-[#1F1F1F]/80 mb-6">
              Summer / Autumn 2026
            </p>
            <h1 className="font-playfair font-light text-5xl md:text-6xl lg:text-7xl leading-tight text-[#1F1F1F] mb-6">
              <span className="block">Carried</span>
              <span className="block mt-2">
                <span className="font-bold text-[#B68D40]">with</span> {' '}
                <span className="font-normal">Intent.</span>
              </span>
            </h1>
            <p className="text-base leading-relaxed text-[#1F1F1F]/80 max-w-lg mb-8">
              Bags that speak before you say a word — crafted in the world's
              finest leathers for the woman who never needs to announce
              herself.
            </p>
            <div className="flex items-center gap-6 flex-wrap">
              <Link
                to="/shop"
                className="inline-flex items-center gap-3 bg-[#B68D40] text-white uppercase text-xs tracking-wider px-8 py-5 hover:bg-[#1F1F1F] hover:text-[#B68D40] transition-all duration-300"
              >
                Explore Collection <ArrowRight size={16} />
              </Link>
              <Link
                to="/shop"
                className="uppercase text-xs tracking-wider text-[#1F1F1F]/80 hover:text-[#B68D40] border-b-[1px] border-[#B68D40]/30 pb-1 transition-colors duration-300"
              >
                View Lookbook
              </Link>
            </div>
          </motion.div>

          <div className="hidden md:flex absolute right-6 top-1/2 -translate-y-1/2 z-10">
            <span
              className="text-[10px] uppercase tracking-[0.3em] text-[#1F1F1F]/60 font-light"
              style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
            >
              Scroll to discover
            </span>
          </div>
        </div>
      </section>

      {/* ---------------- FEATURED COLLECTION ---------------- */}
      <section className="py-20 md:py-28 px-6 md:px-12">
        <Reveal className="flex items-end justify-between mb-16 flex-wrap gap-4">
          <div>
            <p className="text-xs uppercase tracking-widest text-[#B68D40] mb-3">
              THE COLLECTION
            </p>
            <h2 className="font-playfair text-3xl md:text-4xl text-[#1F1F1F]">
              Pieces selected for the way modern women move.
            </h2>
          </div>
          <Link
            to="/shop"
            className="text-xs uppercase tracking-wider text-[#1F1F1F]/70 hover:text-[#B68D40] transition-colors duration-300"
          >
            View All ›
          </Link>
        </Reveal>

        <div className="grid md:grid-cols-2 gap-8">
          <Reveal className="col-span-2 md:col-span-1">
            <Link to="/shop" className="group block">
              <div
                data-placeholder="featured-image"
                className="aspect-[4/5] w-full bg-[linear-gradient(160deg,#2E2E2E_0%,#0A0A0A_100%)] overflow-hidden rounded-xl"
              >
                <div className="w-full h-full transition-transform duration-500 ease-in-out group-hover:scale-105 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.05),transparent_70%)]" />
              </div>
              <h3 className="font-playfair text-2xl text-[#1F1F1F] mt-6">
                Noir Éclat Tote
              </h3>
              <p className="text-sm text-[#666666] mt-2">
                Structured black leather — minimal hardware, maximum presence.
              </p>
              <p className="text-xs text-[#B68D40] mt-4 uppercase tracking-wider">
                £480
              </p>
            </Link>
          </Reveal>

          <Reveal>
            <Link to="/shop" className="group block">
              <div
                data-placeholder="featured-image-2"
                className="aspect-[4/5] w-full bg-[linear-gradient(150deg,#C88A4F_0%,#8C5A2A_100%)] overflow-hidden rounded-xl"
              >
                <div className="w-full h-full transition-transform duration-500 ease-in-out group-hover:scale-105 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.05),transparent_70%)]" />
              </div>
              <h3 className="font-playfair text-2xl text-[#1F1F1F] mt-6">
                Cognac Shoulder Bag
              </h3>
              <p className="text-sm text-[#666666] mt-2">
                Soft pebble grain leather with elegant top handle and detachable strap.
              </p>
              <p className="text-xs text-[#B68D40] mt-4 uppercase tracking-wider">
                £360
              </p>
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ---------------- SHOP BY CATEGORY ---------------- */}
      <section className="py-20 md:py-28 px-6 md:px-12">
        <Reveal className="flex items-end justify-between mb-16 flex-wrap gap-4">
          <div>
            <p className="text-xs uppercase tracking-widest text-[#B68D40] mb-3">
              SHOP BY CATEGORY
            </p>
            <h2 className="font-playfair text-3xl md:text-4xl text-[#1F1F1F]">
              Discover Our Collections
            </h2>
          </div>
          <Link
            to="/shop"
            className="text-xs uppercase tracking-wider text-[#1F1F1F]/70 hover:text-[#B68D40] transition-colors duration-300"
          >
            Explore All ›
          </Link>
        </Reveal>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Totes */}
          <Reveal>
            <Link to="/shop?category=totes" className="group block">
              <div
                data-placeholder="totes"
                className="aspect-[3/4] w-full bg-[linear-gradient(160deg,#2E2E2E_0%,#0A0A0A_100%)] overflow-hidden rounded-xl"
              >
                <div className="w-full h-full transition-transform duration-500 ease-in-out group-hover:scale-105 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.05),transparent_70%)]" />
              </div>
              <p className="text-[10px] uppercase tracking-widest text-[#666666] mt-4">
                Totes
              </p>
              <h3 className="font-playfair text-lg text-[#1F1F1F] mt-1">
                Everyday Essentials
              </h3>
            </Link>
          </Reveal>

          {/* Shoulder Bags */}
          <Reveal>
            <Link to="/shop?category=shoulder" className="group block">
              <div
                data-placeholder="shoulder"
                className="aspect-[3/4] w-full bg-[linear-gradient(150deg,#C88A4F_0%,#8C5A2A_100%)] overflow-hidden rounded-xl"
              >
                <div className="w-full h-full transition-transform duration-500 ease-in-out group-hover:scale-105 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.05),transparent_70%)]" />
              </div>
              <p className="text-[10px] uppercase tracking-widest text-[#666666] mt-4">
                Shoulder
              </p>
              <h3 className="font-playfair text-lg text-[#1F1F1F] mt-1">
                Effortless Elegance
              </h3>
            </Link>
          </Reveal>

          {/* Crossbody */}
          <Reveal>
            <Link to="/shop?category=crossbody" className="group block">
              <div
                data-placeholder="crossbody"
                className="aspect-[3/4] w-full bg-[linear-gradient(150deg,#A33B34_0%,#6E211D_100%)] overflow-hidden rounded-xl"
              >
                <div className="w-full h-full transition-transform duration-500 ease-in-out group-hover:scale-105 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.05),transparent_70%)]" />
              </div>
              <p className="text-[10px] uppercase tracking-widest text-[#666666] mt-4">
                Crossbody
              </p>
              <h3 className="font-playfair text-lg text-[#1F1F1F] mt-1">
                Hands-Free Luxury
              </h3>
            </Link>
          </Reveal>

          {/* Clutches */}
          <Reveal>
            <Link to="/shop?category=clutches" className="group block">
              <div
                data-placeholder="clutches"
                className="aspect-[3/4] w-full bg-[linear-gradient(150deg,#8B4513_0%,#5D300A_100%)] overflow-hidden rounded-xl"
              >
                <div className="w-full h-full transition-transform duration-500 ease-in-out group-hover:scale-105 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.05),transparent_70%)]" />
              </div>
              <p className="text-[10px] uppercase tracking-widest text-[#666666] mt-4">
                Clutches
              </p>
              <h3 className="font-playfair text-lg text-[#1F1F1F] mt-1">
                Evening Refinement
              </h3>
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ---------------- NEW ARRIVALS ---------------- */}
      <section className="py-20 md:py-28 px-6 md:px-8">
        <Reveal className="flex items-end justify-between mb-16 flex-wrap gap-4 px-2">
          <div>
            <p className="text-xs uppercase tracking-widest text-[#B68D40] mb-3">
              NEW ARRIVALS
            </p>
            <h2 className="font-playfair text-3xl md:text-4xl text-[#1F1F1F]">
              Latest Additions
            </h2>
          </div>
          <Link
            to="/shop"
            className="text-xs uppercase tracking-wider text-[#1F1F1F]/70 hover:text-[#B68D40] transition-colors duration-300"
          >
            Shop All ›
          </Link>
        </Reveal>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          variants={sectionReveal}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-2"
        >
          {newArrivals.map((p) => (
            <motion.div
              variants={fadeUp}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              key={p.title}
            >
              <Link to="/shop" className="group block">
                <div
                  data-placeholder={p.title}
                  className="relative aspect-[3/4] w-full overflow-hidden rounded-xl"
                  style={{ background: p.gradient }}
                >
                  <div className="w-full h-full transition-transform duration-500 ease-in-out group-hover:scale-105" />
                  {p.badge && (
                    <span className="absolute top-4 left-4 bg-[#B68D40] text-white text-[9px] uppercase tracking-wider px-2.5 py-1">
                      {p.badge}
                    </span>
                  )}
                </div>
                <p className="text-[10px] uppercase tracking-widest text-[#666666] mt-4">
                  {p.category}
                </p>
                <h3 className="font-playfair text-sm text-[#1F1F1F] mt-1">
                  {p.title}
                </h3>
                <p className="text-xs text-[#666666] mt-1">{p.price}</p>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ---------------- EDITORIAL BRAND STORY ---------------- */}
      <section className="flex flex-col md:flex-row min-h-[600px]">
        <div className="w-full md:w-1/2 min-h-[420px] md:min-h-0 overflow-hidden">
          <img
            src="/images/handbags-category.png"
            alt="Millux Collections craftsmanship"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="w-full md:w-1/2 bg-[#FAF8F5] p-10 md:p-16 lg:p-24 flex flex-col justify-center">
          <Reveal>
            <p className="text-xs uppercase tracking-widest text-[#B68D40] mb-4">
              CARRIED WITH INTENT.
            </p>
            <h2 className="font-playfair text-3xl md:text-4xl text-[#1F1F1F] mb-6 leading-snug">
              Our Philosophy
            </h2>
            <p className="text-sm leading-relaxed text-[#666666] max-w-md mb-10">
              Millux Collections believes that true luxury lies in the details
              that go unseen. Each bag is conceived as a companion for life's
              journey — designed to hold not just your essentials, but your
              intentions, your memories, and your quiet confidence.
            </p>
            <div className="flex items-center gap-8 flex-wrap">
              <Link
                to="/about"
                className="border border-[#1F1F1F]/40 uppercase text-xs tracking-wider px-8 py-4 hover:border-[#B68D40] hover:text-[#B68D40] transition-colors duration-300"
              >
                Our Story
              </Link>
              <Link
                to="/about"
                className="uppercase text-xs tracking-wider text-[#1F1F1F] border-b border-[#1F1F1F]/40 pb-1 hover:border-[#B68D40] hover:text-[#B68D40] transition-colors duration-300"
              >
                Meet the Artisans
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ---------------- THE MILLUX STANDARD ---------------- */}
      <section className="grid grid-cols-1 md:grid-cols-3 border-y border-[#EAE5DF] divide-y md:divide-y-0 md:divide-x divide-[#EAE5DF] bg-white">
        {pillars.map((pillar) => (
          <Reveal key={pillar.n} className="p-10 md:p-14">
            <span className="font-playfair font-light text-3xl text-[#B68D40]/70">
              {pillar.n}
            </span>
            <h3 className="text-xs uppercase tracking-widest text-[#1F1F1F] mt-4 mb-3">
              {pillar.title}
            </h3>
            <p className="text-sm text-[#666666] leading-relaxed">
              {pillar.body}
            </p>
          </Reveal>
        ))}
      </section>

      {/* ---------------- BESTSELLERS ---------------- */}
      <section className="py-20 md:py-28 px-6 md:px-8">
        <Reveal className="flex items-end justify-between mb-16 flex-wrap gap-4">
          <div>
            <p className="text-xs uppercase tracking-widest text-[#B68D40] mb-3">
              BESTSELLERS
            </p>
            <h2 className="font-playfair text-3xl md:text-4xl text-[#1F1F1F]">
              Customer Favorites
            </h2>
          </div>
          <Link
            to="/shop"
            className="text-xs uppercase tracking-wider text-[#1F1F1F]/70 hover:text-[#B68D40] transition-colors duration-300"
          >
            View All ›
          </Link>
        </Reveal>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          variants={sectionReveal}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-2"
        >
          {/* Using same data as new arrivals for now, but marked as bestsellers */}
          {newArrivals.slice(0, 4).map((p, index) => (
            <motion.div
              key={p.title + index}
              variants={fadeUp}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            >
              <Link to="/shop" className="group block">
                <div
                  data-placeholder={p.title}
                  className="relative aspect-[3/4] w-full overflow-hidden rounded-xl"
                  style={{ background: p.gradient }}
                >
                  <div className="w-full h-full transition-transform duration-500 ease-in-out group-hover:scale-105" />
                  <span className="absolute top-4 left-4 bg-[#B68D40] text-white text-[9px] uppercase tracking-wider px-2.5 py-1">
                    Bestseller
                  </span>
                </div>
                <p className="text-[10px] uppercase tracking-widest text-[#666666] mt-4">
                  {p.category}
                </p>
                <h3 className="font-playfair text-sm text-[#1F1F1F] mt-1">
                  {p.title}
                </h3>
                <p className="text-xs text-[#666666] mt-1">{p.price}</p>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </section>

      
      {/* ---------------- SOCIAL / INSTAGRAM-STYLE SECTION ---------------- */}
      <section className="py-20 md:py-28 px-6 md:px-12">
        <Reveal className="mb-16 text-center">
          <p className="text-xs uppercase tracking-widest text-[#B68D40] mb-3">
            FROM OUR JOURNAL
          </p>
          <h2 className="font-playfair text-3xl md:text-4xl text-[#1F1F1F]">
            The Millux Diary
          </h2>
        </Reveal>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Social Post 1 */}
          <Reveal>
            <div className="aspect-[4/5] w-full bg-[linear-gradient(160deg,#2E2E2E_0%,#0A0A0A_100%)] overflow-hidden rounded-xl">
              <div className="w-full h-full transition-transform duration-500 ease-in-out hover:scale-105 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.03),transparent_70%)]" />
            </div>
            <p className="text-[10px] uppercase tracking-widest text-[#666666] mt-4">
              Journal Entry
            </p>
            <h3 className="font-playfair text-lg text-[#1F1F1F] mt-1">
              The Art of Leather Care
            </h3>
            <p className="text-sm text-[#666666] mt-2">
              How to maintain your Millux bag for years of timeless elegance.
            </p>
          </Reveal>

          {/* Social Post 2 */}
          <Reveal>
            <div className="aspect-[4/5] w-full bg-[linear-gradient(150deg,#C88A4F_0%,#8C5A2A_100%)] overflow-hidden rounded-xl">
              <div className="w-full h-full transition-transform duration-500 ease-in-out hover:scale-105 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.03),transparent_70%)]" />
            </div>
            <p className="text-[10px] uppercase tracking-widest text-[#666666] mt-4">
              Journal Entry
            </p>
            <h3 className="font-playfair text-lg text-[#1F1F1F] mt-1">
              Seasonal Styling Guide
            </h3>
            <p className="text-sm text-[#666666] mt-2">
              Transitioning your wardrobe from summer to autumn with Millux.
            </p>
          </Reveal>

          {/* Social Post 3 */}
          <Reveal>
            <div className="aspect-[4/5] w-full bg-[linear-gradient(150deg,#A33B34_0%,#6E211D_100%)] overflow-hidden rounded-xl">
              <div className="w-full h-full transition-transform duration-500 ease-in-out hover:scale-105 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.03),transparent_70%)]" />
            </div>
            <p className="text-[10px] uppercase tracking-widest text-[#666666] mt-4">
              Journal Entry
            </p>
            <h3 className="font-playfair text-lg text-[#1F1F1F] mt-1">
              Craftsmanship Spotlight
            </h3>
            <p className="text-sm text-[#666666] mt-2">
              Meet the hands behind our most iconic designs.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ---------------- NEWSLETTER ---------------- */}
      <section className="py-20 md:py-28 px-6">
        <Reveal className="max-w-xl mx-auto text-center">
          <div className="flex items-center justify-center gap-4 mb-5">
            <span className="h-px w-8 bg-[#EAE5DF]" />
            <p className="text-xs uppercase tracking-widest text-[#666666]">
              THE INNER CIRCLE
            </p>
            <span className="h-px w-8 bg-[#EAE5DF]" />
          </div>
          <h2 className="font-playfair text-3xl md:text-4xl text-[#1F1F1F] mb-4">
            First Access. Always.
          </h2>
          <p className="text-sm text-[#666666] leading-relaxed mb-10">
            Join our private list for early collection drops, exclusive
            events, and invitations to our seasonal presentations.
          </p>

          <form
            onSubmit={(e) => e.preventDefault()}
            className="flex items-stretch border border-[#EAE5DF] max-w-md mx-auto"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              className="flex-1 bg-transparent px-5 py-4 text-sm text-[#1F1F1F] placeholder:text-[#666666]/70 focus:outline-none"
            />
            <button
              type="submit"
              className="bg-[#B68D40] text-white uppercase text-xs tracking-wider px-6 hover:bg-[#1F1F1F] transition-colors duration-300 whitespace-nowrap"
            >
              Join the Circle
            </button>
          </form>
        </Reveal>
      </section>
    </div>
  );
};

export default HomePage;