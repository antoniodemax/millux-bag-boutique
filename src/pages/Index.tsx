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
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_25%,rgba(255,255,255,0.15),transparent_55%)]" />
        </div>
        <div className="absolute bottom-0 inset-x-0 h-72 bg-gradient-to-t from-[#FAF8F5] via-[#FAF8F5]/60 to-transparent" />

        <div className="relative z-10 h-full flex items-center px-6 md:px-16">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: 'easeOut' }}
            className="max-w-xl"
          >
            <p className="text-xs font-semibold uppercase tracking-widest text-[#1F1F1F]/80 mb-4">
              Summer / Autumn 2026
            </p>
            <h1 className="font-playfair font-light text-5xl md:text-7xl leading-tight text-[#1F1F1F] mb-6">
              <span className="italic">Carried</span>{' '}
              <span className="font-bold text-[#B68D40] not-italic">
                with Intent.
              </span>
            </h1>
            <p className="text-sm leading-relaxed text-[#1F1F1F]/70 max-w-md mb-8">
              Bags that speak before you say a word — crafted in the world's
              finest leathers for the woman who never needs to announce
              herself.
            </p>
            <div className="flex items-center gap-8 flex-wrap">
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 bg-[#B68D40] text-white uppercase text-xs tracking-wider px-8 py-4 hover:bg-[#1F1F1F] transition-colors duration-300"
              >
                Explore Collection <ArrowRight size={14} />
              </Link>
              <Link
                to="/shop"
                className="uppercase text-xs tracking-wider text-[#1F1F1F] border-b border-[#1F1F1F]/40 pb-1 hover:border-[#B68D40] hover:text-[#B68D40] transition-colors duration-300"
              >
                View Lookbook
              </Link>
            </div>
          </motion.div>
        </div>

        <div className="hidden md:flex absolute right-6 top-1/2 -translate-y-1/2 z-10">
          <span
            className="text-[10px] uppercase tracking-[0.3em] text-[#1F1F1F]/60 font-light"
            style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
          >
            Scroll to discover
          </span>
        </div>
      </section>

      {/* ---------------- THE COLLECTIONS ---------------- */}
      <section className="py-24 md:py-32 px-6 md:px-12">
        <Reveal className="flex items-end justify-between mb-12 flex-wrap gap-4">
          <div>
            <p className="text-xs uppercase tracking-widest text-[#B68D40] mb-3">
              Curated Edits
            </p>
            <h2 className="font-playfair text-3xl md:text-4xl text-[#1F1F1F]">
              The Collections
            </h2>
          </div>
          <Link
            to="/shop"
            className="text-xs uppercase tracking-wider text-[#1F1F1F]/70 hover:text-[#B68D40] transition-colors duration-300"
          >
            All Collections ›
          </Link>
        </Reveal>

        <div className="grid md:grid-cols-2 gap-6">
          <Reveal>
            <Link to="/shop" className="group block">
              <div
                data-placeholder="noir-eclat"
                className="aspect-[3/4] w-full bg-[linear-gradient(160deg,#2A2A2A_0%,#0D0D0D_100%)] overflow-hidden"
              >
                <div className="w-full h-full transition-transform duration-500 ease-in-out group-hover:scale-105 bg-[radial-gradient(circle_at_70%_20%,rgba(255,255,255,0.08),transparent_60%)]" />
              </div>
              <p className="text-[10px] uppercase tracking-widest text-[#666666] mt-4">
                Tote
              </p>
              <h3 className="font-playfair text-xl text-[#1F1F1F] mt-1">
                Noir Éclat
              </h3>
              <p className="text-sm text-[#666666] mt-1">
                Structured black leather — minimal hardware, maximum
                presence.
              </p>
            </Link>
          </Reveal>

          <div className="flex flex-col gap-6">
            <Reveal>
              <Link to="/shop" className="group flex flex-col sm:flex-row gap-5 items-start">
                <div
                  data-placeholder="aurum"
                  className="aspect-[4/3] w-full sm:w-64 shrink-0 bg-[linear-gradient(135deg,#D8A857_0%,#A9762E_55%,#6E4A1C_100%)] overflow-hidden"
                >
                  <div className="w-full h-full transition-transform duration-500 ease-in-out group-hover:scale-105" />
                </div>
                <div className="pt-1">
                  <p className="text-[10px] uppercase tracking-widest text-[#666666]">
                    Clutch
                  </p>
                  <h3 className="font-playfair text-xl text-[#1F1F1F] mt-1">
                    Aurum
                  </h3>
                  <p className="text-[10px] uppercase tracking-widest text-[#B68D40] mt-2">
                    Limited Edition
                  </p>
                </div>
              </Link>
            </Reveal>

            <Reveal>
              <Link to="/shop" className="group flex flex-col sm:flex-row gap-5 items-start">
                <div
                  data-placeholder="velum"
                  className="aspect-[4/3] w-full sm:w-64 shrink-0 bg-[linear-gradient(135deg,#C15A2E_0%,#8A3B1B_55%,#4F2110_100%)] overflow-hidden"
                >
                  <div className="w-full h-full transition-transform duration-500 ease-in-out group-hover:scale-105" />
                </div>
                <div className="pt-1">
                  <p className="text-[10px] uppercase tracking-widest text-[#666666]">
                    Top-Handle
                  </p>
                  <h3 className="font-playfair text-xl text-[#1F1F1F] mt-1">
                    Velum
                  </h3>
                  <p className="text-[10px] uppercase tracking-widest text-[#B68D40] mt-2">
                    Heritage Edit
                  </p>
                </div>
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ---------------- NEW ARRIVALS ---------------- */}
      <section className="py-24 md:py-32 px-6 md:px-8">
        <Reveal className="flex items-end justify-between mb-12 flex-wrap gap-4 px-2">
          <div>
            <p className="text-xs uppercase tracking-widest text-[#B68D40] mb-3">
              Featured
            </p>
            <h2 className="font-playfair text-3xl md:text-4xl text-[#1F1F1F]">
              New Arrivals
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
                  className="relative aspect-[3/4] w-full overflow-hidden"
                  style={{ background: p.gradient }}
                >
                  <div className="w-full h-full transition-transform duration-500 ease-in-out group-hover:scale-105" />
                  {p.badge && (
                    <span className="absolute top-3 left-3 bg-[#B68D40] text-white text-[9px] uppercase tracking-wider px-2 py-1">
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

      {/* ---------------- THE HOUSE ---------------- */}
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
              The House
            </p>
            <h2 className="font-playfair text-3xl md:text-4xl text-[#1F1F1F] mb-6 leading-snug">
              <span className="italic">Carried in</span> Intention.
            </h2>
            <p className="text-sm leading-relaxed text-[#666666] max-w-md mb-10">
              Millux Collections was born from one conviction: a bag is not
              an accessory — it is an extension of who you are. Every seam
              is deliberate. Every clasp, a quiet declaration. We partner
              with master leather-workers across London, Lagos, and
              Florence to bring you bags that outlast trends — built to be
              carried, loved, and eventually inherited.
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
                Meet the Makers
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ---------------- BRAND PILLARS ---------------- */}
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

      {/* ---------------- NEWSLETTER ---------------- */}
      <section className="py-24 md:py-32 px-6">
        <Reveal className="max-w-xl mx-auto text-center">
          <div className="flex items-center justify-center gap-4 mb-5">
            <span className="h-px w-8 bg-[#EAE5DF]" />
            <p className="text-xs uppercase tracking-widest text-[#666666]">
              The Inner Circle
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