"use client";

import { IconDownload } from "@tabler/icons-react";

interface Props {
  label: string;
  onClick?: () => void;
}

/**
 * Gradient-ring pill button used for the PWA install action in the header.
 * The gradient lives on the outer element and is revealed as a hairline ring
 * around the inner white pill, so the button reads as an elegant outline
 * rather than a heavy filled CTA (which is reserved for RubyButtonComponent).
 */
const InstallButton: React.FC<Props> = ({ label, onClick }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group! relative! rounded-full! p-[1.5px]! bg-gradient-to-r! from-hongbao-red-500! via-hongbao-orange-500! to-hongbao-gold-500! shadow-sm! cursor-pointer! transition-all! duration-200! ease-out! hover:shadow-md! hover:shadow-hongbao-red-500/25! active:scale-95!"
    >
      <span className="flex! items-center! justify-center! gap-2! rounded-full! bg-white! px-4! py-2! transition-colors! duration-200! ease-out! group-hover:bg-hongbao-cream-50!">
        <IconDownload
          size={18}
          className="text-hongbao-red-600! transition-transform! duration-200! ease-out! group-hover:translate-y-[2px]!"
        />
        <span className="text-sm! font-semibold! text-hongbao-red-700! whitespace-nowrap!">
          {label}
        </span>
      </span>
    </button>
  );
};

export default InstallButton;
