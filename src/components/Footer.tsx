import { Link } from "react-router-dom";

const shopLinks = [
  { label: "Totes", path: "/shop" },
  { label: "Shoulder Bags", path: "/shop" },
  { label: "Crossbody", path: "/shop" },
  { label: "Clutches & Evening", path: "/shop" },
  { label: "Travel", path: "/shop" },
];

const houseLinks = [
  { label: "Our Story", path: "/about" },
  { label: "Craftsmanship", path: "/about" },
  { label: "Sustainability", path: "/about" },
  { label: "Press", path: "/about" },
  { label: "Careers", path: "/contact" },
];

const helpLinks = [
  { label: "Bag Care Guide", path: "/contact" },
  { label: "Delivery & Returns", path: "/contact" },
  { label: "Bespoke Orders", path: "/contact" },
  { label: "Contact Us", path: "/contact" },
  { label: "FAQs", path: "/contact" },
];

const Footer = () => {
  return (
    <footer className="bg-white border-t border-[#EAE5DF]">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-16 grid grid-cols-2 md:grid-cols-4 gap-10">
        {/* Identity */}
        <div className="col-span-2 md:col-span-1">
          <Link to="/" className="inline-block mb-5">
            <img
              src="/millux-collections-logo.png"
              alt="Millux Collections"
              className="h-35 w-auto object-contain"
            />
          </Link>
          <p className="text-sm text-[#666666] leading-relaxed max-w-[220px]">
            Luxury bags for the woman who defines her own moment.
          </p>
        </div>

        {/* Shop */}
        <div>
          <h4 className="text-xs uppercase tracking-widest text-[#1F1F1F] mb-5">
            Shop
          </h4>
          <ul className="flex flex-col gap-3">
            {shopLinks.map((l) => (
              <li key={l.label}>
                <Link
                  to={l.path}
                  className="text-sm text-[#666666] hover:text-[#B68D40] transition-colors duration-300"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* House */}
        <div>
          <h4 className="text-xs uppercase tracking-widest text-[#1F1F1F] mb-5">
            House
          </h4>
          <ul className="flex flex-col gap-3">
            {houseLinks.map((l) => (
              <li key={l.label}>
                <Link
                  to={l.path}
                  className="text-sm text-[#666666] hover:text-[#B68D40] transition-colors duration-300"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Help */}
        <div>
          <h4 className="text-xs uppercase tracking-widest text-[#1F1F1F] mb-5">
            Help
          </h4>
          <ul className="flex flex-col gap-3">
            {helpLinks.map((l) => (
              <li key={l.label}>
                <Link
                  to={l.path}
                  className="text-sm text-[#666666] hover:text-[#B68D40] transition-colors duration-300"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Legal row */}
      <div className="border-t border-[#EAE5DF]">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[#666666]">
            © 2026 Millux Collections Ltd. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            {["Privacy", "Terms of Use", "Cookies"].map((l) => (
              
              <a>
                key={l}
                href="#"
                className="text-xs text-[#666666] hover:text-[#B68D40] transition-colors duration-300"
              
                {1}
              </a>
            ))}
          </div>
        </div>
      </div>

     
    </footer>
  );
};

export default Footer;