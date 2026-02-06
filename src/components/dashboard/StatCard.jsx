import React from "react";

const StatCard = ({ label, value, icon: Icon, trend }) => (
  <div className="bg-white p-6 border border-gray-200 hover:border-black transition-all duration-300 group relative overflow-hidden">
    <div className="relative z-10 flex justify-between items-start mb-4">
      <div className="p-3 bg-gray-50 group-hover:bg-black group-hover:text-white transition-colors duration-300">
        {Icon && <Icon className="w-5 h-5" />}
      </div>
      {trend && (
        <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-1 uppercase tracking-wider">
          {trend}
        </span>
      )}
    </div>
    <h3 className="relative z-10 text-3xl font-light mb-1">{value}</h3>
    <p className="relative z-10 text-[10px] font-bold uppercase tracking-widest text-gray-400 group-hover:text-black transition-colors">
      {label}
    </p>
  </div>
);

export default StatCard;
