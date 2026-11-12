"use client";

import { SpeakerHighIcon } from "@phosphor-icons/react";
import { canSpeak, speak } from "../../speech";

interface Props {
  text: string;
  light?: boolean;
}

/** Plays the given Mandarin text aloud - stops the click reaching the flip handler underneath it. */
const SpeakButton: React.FC<Props> = ({ text, light }) => {
  if (!canSpeak()) return null;

  return (
    <button
      type="button"
      aria-label="Play pronunciation"
      onClick={(e) => {
        e.stopPropagation();
        speak(text);
      }}
      className={`flex! items-center! justify-center! w-8! h-8! rounded-full! shrink-0! cursor-pointer! transition-colors! duration-150! ease-out! ${
        light
          ? "bg-white/15! text-white! hover:bg-white/25!"
          : "bg-gray-100! text-gray-600! hover:bg-hongbao-red-50! hover:text-hongbao-red-600!"
      }`}
    >
      <SpeakerHighIcon size={16} weight="fill" />
    </button>
  );
};

export default SpeakButton;
