import React from 'react';
import { Truck, ShieldCheck, RefreshCw, Globe, Award, Headphones } from 'lucide-react';

// You can swap these icons/text based on your preference
const benefits = [
  { 
    id: 1, 
    icon: Truck, 
    title: "Fast Shipping", 
    description: "Free delivery on all orders over $150" 
  },
  { 
    id: 2, 
    icon: Award, 
    title: "Premium Quality", 
    description: "Certified materials & craftsmanship" 
  },
  { 
    id: 3, 
    icon: ShieldCheck, 
    title: "Secure Checkout", 
    description: "100% protected payment processing" 
  },
  { 
    id: 4, 
    icon: RefreshCw, 
    title: "Easy Returns", 
    description: "Hassle-free 30-day return policy" 
  }
];

const BenefitsStrip = () => {
  return (
    <div className="w-full border-b border-gray-100 py-10 mb-12">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-y-10 gap-x-8">
          {benefits.map((item) => (
            <div key={item.id} className="flex flex-col items-center text-center group cursor-default">
              
              {/* Icon Container with Hover Effect */}
              <div className="mb-4 p-3 rounded-full bg-gray-50 text-gray-900 group-hover:bg-black group-hover:text-white transition-colors duration-300">
                <item.icon className="w-6 h-6" strokeWidth={1.5} />
              </div>
              
              {/* Title */}
              <h3 className="text-xs font-bold uppercase tracking-widest mb-2">
                {item.title}
              </h3>
              
              {/* Description */}
              <p className="text-[10px] md:text-xs text-gray-500 font-medium max-w-[150px] leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BenefitsStrip;