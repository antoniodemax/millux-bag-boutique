import { Link } from "react-router-dom";

const shopLinks = [
  { label: "Collections", path: "/shop" },
  { label: "New Arrivals", path: "/shop" },
  ];

const companyLinks = [
  { label: "About", path: "/about" },
  { label: "Contact", path: "/contact" },
  { label: "Stockists", path: "/#" },
];

const clientServiceLinks = [
  { label: "Shipping", path: "/#" },
  { label: "Returns", path: "/#" },
  { label: "Privacy", path: "/#" },
  { label: "Terms", path: "/#" },
];

const socialLinks = [
  { label: "Instagram", path: "https://instagram.com/milluxcollections", external: true },
  { label: "WhatsApp", path: "https://wa.me/254723425778", external: true },
];

const Footer = () => {
  return (
    <footer className="bg-white border-t border-[#EAE5DF]">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-16 grid grid-cols-2 md:grid-cols-4 gap-10">
        {/* Identity */}
        <div className="col-span-2 md:col-span-1">
          <Link to="/" className="inline-block mb-5">
            <img
              src="/images/millux.png"
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

        {/* Company */}
        <div>
          <h4 className="text-xs uppercase tracking-widest text-[#1F1F1F] mb-5">
            Company
          </h4>
          <ul className="flex flex-col gap-3">
            {companyLinks.map((l) => (
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

        {/* Client Services */}
        <div>
          <h4 className="text-xs uppercase tracking-widest text-[#1F1F1F] mb-5">
            Client Services
          </h4>
          <ul className="flex flex-col gap-3">
            {clientServiceLinks.map((l) => (
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

      {/* Social Section */}
      <div className="border-t border-[#EAE5DF]">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <p className="text-xs text-[#666666]">
            © 2026 Millux Collections Ltd. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            {socialLinks.map((link) => (
              <a
                key={link.label}
                href={link.path}
                className={`text-xs text-[#666666] hover:text-[#B68D40] transition-colors duration-300 ${
                  link.external ? "after:[content:'→'] after:ml-1" : ""
                }`}
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;