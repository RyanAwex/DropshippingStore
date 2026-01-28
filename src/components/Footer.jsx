import { ArrowRight, Facebook, Instagram, Mail, Twitter } from "lucide-react";
import React from "react";

function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 pt-20 pb-10 px-6 mt-auto">
      <div className="max-w-7xl mx-auto">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
          <div>
            <h3 className="text-2xl font-bold tracking-widest uppercase mb-4">
              Vraxia Store
            </h3>
            <p className="text-gray-500 text-sm leading-relaxed max-w-sm">
              Curated essentials for the modern home. We prioritize quality,
              minimalism, and timeless design.
            </p>
          </div>
          <div className="flex flex-col justify-center">
            <h4 className="text-sm font-bold uppercase tracking-wider mb-4">
              Join our newsletter
            </h4>
            <div className="flex border-b border-black py-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 focus:outline-none"
              />
              <button className="text-black hover:text-gray-600 cursor-pointer">
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Links Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16 text-sm">
          {[
            {
              title: "Shop",
              links: [
                "New Arrivals",
                "Best Sellers",
                "Home Decor",
                "Accessories",
              ],
            },
            {
              title: "Company",
              links: ["About Us", "Sustainability", "Careers", "Press"],
            },
            {
              title: "Support",
              links: ["FAQ", "Shipping", "Order Status", "Contact"],
            },
          ].map((section, idx) => (
            <div key={idx}>
              <h4 className="font-bold uppercase tracking-wider mb-6">
                {section.title}
              </h4>
              <ul className="space-y-4 text-gray-500">
                {section.links.map((link) => (
                  <li key={link}>
                    <a href="#" className="hover:text-black transition-colors">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Social Icons */}
          <div>
            <h4 className="font-bold uppercase tracking-wider mb-6">
              Follow Us
            </h4>
            <div className="flex space-x-6 text-gray-500">
              <Instagram className="w-5 h-5 hover:text-black cursor-pointer" />
              <Facebook className="w-5 h-5 hover:text-black cursor-pointer" />
              <Twitter className="w-5 h-5 hover:text-black cursor-pointer" />
              <Mail className="w-5 h-5 hover:text-black cursor-pointer" />
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-400 uppercase tracking-widest">
          <p>&copy; 2026 Vraxia Store. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-gray-600">
              Privacy
            </a>
            <a href="#" className="hover:text-gray-600">
              Terms
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
export default Footer;
