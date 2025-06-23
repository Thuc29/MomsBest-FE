import { Close } from "@mui/icons-material";
import React from "react";

function AlertDialog({ open, title, message, type, onConfirm, onDismiss }) {
  // Define styles for different alert types
  const alertStyles = {
    info: {
      bg: "bg-blue-50",
      border: "border-blue-200",
      text: "text-blue-700",
      button: "bg-blue-600 hover:bg-blue-700",
    },
    success: {
      bg: "bg-green-50",
      border: "border-green-200",
      text: "text-green-700",
      button: "bg-green-600 hover:bg-green-700",
    },
    warning: {
      bg: "bg-yellow-50",
      border: "border-yellow-200",
      text: "text-yellow-700",
      button: "bg-yellow-600 hover:bg-yellow-700",
    },
    error: {
      bg: "bg-red-50",
      border: "border-red-200",
      text: "text-red-700",
      button: "bg-red-600 hover:bg-red-700",
    },
  };

  const showCancelButton = title !== "Đặt lịch thành công";
  const currentStyle = alertStyles[type] || alertStyles.info;

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div
        className={`rounded-lg p-6 max-w-md w-full ${currentStyle.bg} ${currentStyle.border}`}
      >
        {/* Header */}
        <div className="flex justify-between border-b pb-2 border-blue-300 items-center mb-4">
          <h2 className={`text-xl font-bold text-yellow-500`}>{title}</h2>
          <button
            onClick={onDismiss}
            className="text-gray-500 hover:text-gray-700"
          >
            <Close size={24} />
          </button>
        </div>

        {/* Message */}
        <p className={`mb-6 font-semibold text-blue-500`}>{message}</p>

        {/* Buttons */}
        <div className="flex justify-end gap-4">
          {showCancelButton && (
            <button
              onClick={onDismiss}
              className="px-4 py-1  border-red-600 border text-red-700 rounded-xl hover:text-white hover:bg-red-600"
            >
              Hủy
            </button>
          )}
          {onConfirm && (
            <button
              onClick={onConfirm}
              className={`px-4 py-1 font-semibold text-green-600 hover:text-white rounded-xl border-green-600 border hover:bg-green-600`}
            >
              Xác nhận
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default AlertDialog;
