import { Link } from 'react-router-dom';
import SEO from '@/components/SEO';
import { Container, PageHeading } from '@/components/store/Primitives';
import { StoreButton } from '@/components/store/Button';

const story = [
  "Founded with a passion for quality and design, Millux Collections began as a vision to create bags that seamlessly blend elegance with everyday functionality. We believe that a great bag is more than just an accessory—it's an extension of your personality and a companion for life's adventures.",
  'Our curated collection features carefully selected pieces that meet our rigorous standards for quality, craftsmanship, and design. From professional office essentials to elegant evening pieces, each item is chosen with the discerning modern consumer in mind.',
  "At Millux Collections, we're committed to exceptional customer service and creating memorable purchasing experiences. We believe in building lasting relationships with our clients, offering thoughtful guidance to help you discover the perfect bag for your lifestyle.",
];

const values = [
  {
    title: 'Quality first',
    description: 'We never compromise on quality. Every bag undergoes rigorous inspection to meet our exacting standards for durability and craftsmanship.',
  },
  {
    title: 'Customer focus',
    description: "Your satisfaction is our priority. We're here to provide personalised guidance and support to help you find your perfect bag.",
  },
  {
    title: 'Style and function',
    description: 'Beautiful design meets practical functionality. Every piece is thoughtfully designed for modern life while maintaining timeless elegance.',
  },
];

const About = () => (
  <>
    <SEO title="About Millux Collections" description="The story behind Millux Collections, a Nairobi house for luxury bags and accessories." />
    <Container className="pb-20">
      <PageHeading eyebrow="The house" title="About Millux Collections" />

      {/* Founder */}
      <section className="grid gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16" aria-labelledby="founder-heading">
        <div className="max-w-md">
          <div className="aspect-[4/5] overflow-hidden bg-stone">
            <img src="/images/founder.png" alt="Milkah Adhiambo, founder of Millux Collections" className="h-full w-full object-cover object-top" />
          </div>
        </div>
        <div className="flex flex-col justify-center">
          <p className="brand-label text-gold-deep">Founder</p>
          <h2 id="founder-heading" className="mt-3 text-display-md">Milkah Adhiambo</h2>
          <p className="mt-5 max-w-prose text-sm leading-relaxed text-soft sm:text-base">
            With over a decade of experience in fashion and retail, Milkah founded Millux Collections with a singular mission: to make premium bags accessible to everyone. Her meticulous eye for quality and unwavering commitment to customer satisfaction drive every decision we make.
          </p>
          <blockquote className="mt-8 border-l-2 border-gold pl-5 font-display text-lg italic leading-relaxed text-ink sm:text-xl">
            “I believe the right bag can transform your entire day. That's why we're dedicated to offering pieces that are as beautiful as they are functional.”
          </blockquote>
        </div>
      </section>

      {/* Story */}
      <section className="mt-20 border-t border-line pt-14 lg:mt-28 lg:pt-20" aria-labelledby="story-heading">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)]">
          <h2 id="story-heading" className="text-display-md">Our story</h2>
          <div className="max-w-prose space-y-5 text-sm leading-relaxed text-soft sm:text-base">
            {story.map((paragraph) => (
              <p key={paragraph.slice(0, 24)}>{paragraph}</p>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="mt-20 border-t border-line pt-14 lg:mt-28 lg:pt-20" aria-labelledby="values-heading">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)]">
          <h2 id="values-heading" className="text-display-md">Our values</h2>
          <ol className="divide-y divide-line border-y border-line">
            {values.map((value, index) => (
              <li key={value.title} className="grid grid-cols-[3rem_1fr] gap-4 py-6 sm:grid-cols-[4rem_1fr]">
                <span className="font-display text-2xl text-gold-deep">0{index + 1}</span>
                <div>
                  <h3 className="font-display text-xl text-ink">{value.title}</h3>
                  <p className="mt-2 max-w-prose text-sm leading-relaxed text-soft">{value.description}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <div className="mt-16 flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:gap-8">
        <StoreButton asChild>
          <Link to="/shop">Shop the collection</Link>
        </StoreButton>
        <Link to="/contact" className="brand-link">Get in touch</Link>
      </div>
    </Container>
  </>
);

export default About;
