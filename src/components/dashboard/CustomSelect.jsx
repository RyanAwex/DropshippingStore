import React from "react";
import { ChevronDown } from "lucide-react";

const CustomSelect = ({
  value,
  onChange,
  options,
  placeholder = "Select...",
}) => (
  <div className="relative w-full group">
    <select
      value={value}
      onChange={onChange}
      className="w-full appearance-none border border-gray-200 p-3 pr-10 text-sm bg-white focus:border-black focus:outline-none rounded-none cursor-pointer transition-colors"
    >
      <option value="" disabled>
        {placeholder}
      </option>
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none group-hover:text-black transition-colors" />
  </div>
);

export default CustomSelect;
