// fe/src/component/ui/Modal.js
import React from "react";

const Modal = ({ open, title, children, onClose }) => {
  if (!open) return null;
  return (
    <div className="fixed bg-black/50 inset-0 z-50 flex items-center justify-center">
      <div className="bg-white/90 rounded-2xl shadow-lg p-6 min-w-[320px]">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg text-gray-800 font-semibold">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-500 text-2xl hover:text-gray-700"
          >
            &times;
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

export default Modal;
