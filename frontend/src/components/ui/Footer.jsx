

import { memo } from "react";
import { FaFacebookF, FaInstagram, FaYoutube, FaPinterestP } from "react-icons/fa";
import { FaCcPaypal, FaCcVisa, FaCcStripe } from "react-icons/fa6";
import { SiKlarna } from "react-icons/si";

const Footer = memo(() => {
  const footerLinks = [
    {
      title: "TOP CATEGORIES",
      links: [
        "Laptops",
        "PC & Computers",
        "Cell Phones",
        "Tablets",
        "Gaming & VR",
        "Networks",
        "Cameras",
        "Sounds",
        "Office",
      ],
    },
    {
      title: "COMPANY",
      links: ["About Swco", "Contact", "Career", "Blog", "Sitemap", "Store Locations"],
    },
    {
      title: "HELP CENTER",
      links: [
        "Customer Service",
        "Policy",
        "Terms & Conditions",
        "Track Order",
        "FAQs",
        "My Account",
        "Product Support",
      ],
    },
    {
      title: "PARTNER",
      links: ["Become Seller", "Affiliate", "Advertise", "Partnership"],
    },
  ];

  return (
    <footer className="w-full bg-gray-200 shadow-md pt-14 dark:bg-[var(--color-bg-card)]">
      <div className="max-w-[1440px] mx-auto px-4 md:px-10">

        {/* TOP Section */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 pb-10">

          {/* BRAND INFO */}
          <div>
            <h3 className="font-bold text-[15px] tracking-wide">
              VENTARO - WHERE QUALITY MEETS YOU
            </h3>

            <div className="mt-6 text-sm leading-6">
              <p>CONTACT US</p>
              <p>257 Thatcher Road St, Brooklyn, Manhattan,<br />NY 10092</p>
              <p>contact@ventaro.com</p>
            </div>

            {/* Social icons */}
            <div className="flex items-center gap-4 mt-6 text-gray-700">
              <FaFacebookF className="hover:text-black cursor-pointer" size={18} />
              <FaInstagram className="hover:text-black cursor-pointer" size={18} />
              <FaPinterestP className="hover:text-black cursor-pointer" size={18} />
              <FaYoutube className="hover:text-black cursor-pointer" size={18} />
            </div>
          </div>

          {/* Dynamic Columns */}
          {footerLinks.map((col) => (
            <div key={col.title}>
              <h3 className="font-semibold text-[15px] mb-4">{col.title}</h3>
              <ul className="flex flex-col gap-2 text-sm text-gray-600">
                {col.links.map((item) => (
                  <li
                    key={item}
                    className="cursor-pointer hover:text-black transition"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}

        </div>

        {/* Bottom Section */}
        <div className="border-t py-6 flex flex-col md:flex-row justify-between items-center gap-4">

          <p className="text-sm text-gray-500">
            © 2025 <span className="font-semibold">Ventaro</span>. All Rights Reserved
          </p>

          {/* Payment Icons */}
          <div className="flex items-center gap-5 text-gray-700">
            <FaCcPaypal size={32} />
            <FaCcVisa size={32} />
            <FaCcStripe size={32} />
            <SiKlarna size={32} />
          </div>

        </div>
      </div>
    </footer>
  );
})

export default Footer