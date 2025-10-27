import React, { useEffect } from "react";
import { CheckCircle, X, XCircle } from "lucide-react";

interface NotificationProps {
  show: boolean;
  message: string;
  type: "success" | "error";
  onClose: () => void;
}

const Notification: React.FC<NotificationProps> = ({
  show,
  message,
  type,
  onClose,
}) => {
  // Auto close setelah 3 detik
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  if (!show) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-in slide-in-from-bottom-full duration-300">
      <div
        className={`
          flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg border
          ${
            type === "success"
              ? "bg-green-50 border-green-200 text-green-800"
              : "bg-red-50 border-red-200 text-red-800"
          }
        `}
      >
        {/* Icon */}
        <div className="shrink-0">
          {type === "success" ? (
            <CheckCircle className="h-5 w-5 text-green-600" />
          ) : (
            <XCircle className="h-5 w-5 text-red-600" />
          )}
        </div>

        {/* Message */}
        <div className="flex-1">
          <p className="text-sm font-medium">{message}</p>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className={`
            shrink-0 p-1 rounded-full hover:bg-opacity-20 transition
            ${
              type === "success"
                ? "hover:bg-green-600 text-green-600"
                : "hover:bg-red-600 text-red-600"
            }
          `}
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default Notification;
