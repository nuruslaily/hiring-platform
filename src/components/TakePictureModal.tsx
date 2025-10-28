import React from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import HandDetector from "./HandDetector";

interface TakePictureModalProps {
  open: boolean;
  onClose: () => void;
  onCapture: (photo: string) => void;
}

const TakePictureModal: React.FC<TakePictureModalProps> = ({
  open,
  onClose,
  onCapture,
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl w-[640px] p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
        >
          <XMarkIcon className="w-6 h-6 text-[#404040]" />
        </button>

        <h2 className="text-lg font-semibold text-[#1D1F20] mb-4">
          Raise Your Hand to Capture
        </h2>
        <p className="text-sm text-gray-600 mb-4">
          We'll take the photo once your hand pose is detected.
        </p>

        <div className="w-full aspect-square bg-white rounded-lg overflow-hidden flex items-center justify-center">
          <HandDetector
            onCapture={(photo) => {
              onCapture(photo);
              onClose();
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default TakePictureModal;
