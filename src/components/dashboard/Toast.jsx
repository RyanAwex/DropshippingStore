import React, { useEffect } from "react";
import { CheckCircle, AlertCircle } from "lucide-react";

const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className={`fixed bottom-6 right-6 z-[100] flex items-center gap-3 px-6 py-4 shadow-2xl animation-slide-up border-l-4 ${type === "success" ? "bg-white border-black" : "bg-white border-red-500"}`}
    >
      {type === "success" ? (
        <CheckCircle className="w-5 h-5 text-black" />
      ) : (
        <AlertCircle className="w-5 h-5 text-red-500" />
      )}
      <span className="text-xs font-bold uppercase tracking-widest text-black">
        {message}
      </span>
    </div>
  );
};

export default Toast;
