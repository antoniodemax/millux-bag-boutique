import SEO from '@/components/SEO';
import { Container, PageHeading } from '@/components/store/Primitives';
import { StoreButton } from '@/components/store/Button';

const WHATSAPP_URL = `https://wa.me/254723425778?text=${encodeURIComponent("Hi! I'd like to get in touch with Millux Collections.")}`;

const hours = [
  { days: 'Monday – Friday', time: '9:00 AM – 6:00 PM' },
  { days: 'Saturday', time: '10:00 AM – 4:00 PM' },
  { days: 'Sunday', time: 'Closed' },
];

const Contact = () => (
  <>
    <SEO title="Contact Millux Collections" description="Reach Millux Collections on WhatsApp, email or phone. Nairobi, Kenya." />
    <Container className="pb-20">
      <PageHeading
        eyebrow="Assistance"
        title="Contact us"
        description="Questions about a piece, an order, or styling advice: we answer personally."
      />

      <div className="grid gap-12 md:grid-cols-2 md:gap-16">
        <section aria-labelledby="channels-heading">
          <h2 id="channels-heading" className="brand-label text-gold-deep">Reach us</h2>
          <dl className="mt-6 divide-y divide-line border-y border-line">
            <div className="py-5">
              <dt className="brand-label text-faint">WhatsApp</dt>
              <dd className="mt-2">
                <p className="text-base text-ink">+254 723 425 778</p>
                <p className="mt-1 text-sm text-soft">The quickest way to ask about availability or an order.</p>
                <StoreButton asChild className="mt-4">
                  <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">Chat on WhatsApp</a>
                </StoreButton>
              </dd>
            </div>
            <div className="py-5">
              <dt className="brand-label text-faint">Email</dt>
              <dd className="mt-2">
                <a href="mailto:info@milluxcollection.com" className="text-base text-ink hover:text-gold-deep transition-colors focus-ring break-all">
                  info@milluxcollection.com
                </a>
              </dd>
            </div>
            <div className="py-5">
              <dt className="brand-label text-faint">Phone</dt>
              <dd className="mt-2">
                <a href="tel:+254723425778" className="text-base text-ink hover:text-gold-deep transition-colors focus-ring">
                  +254 723 425 778
                </a>
              </dd>
            </div>
            <div className="py-5">
              <dt className="brand-label text-faint">Location</dt>
              <dd className="mt-2 text-base text-ink">Nairobi, Kenya</dd>
            </div>
          </dl>
        </section>

        <section aria-labelledby="hours-heading">
          <h2 id="hours-heading" className="brand-label text-gold-deep">Hours</h2>
          <dl className="mt-6 divide-y divide-line border-y border-line">
            {hours.map((h) => (
              <div key={h.days} className="flex items-center justify-between gap-6 py-5">
                <dt className="text-sm text-soft">{h.days}</dt>
                <dd className="text-sm text-ink">{h.time}</dd>
              </div>
            ))}
          </dl>
        </section>
      </div>
    </Container>
  </>
);

export default Contact;
