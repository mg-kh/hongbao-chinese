"use client";

import { IconCheck } from "@tabler/icons-react";

interface Props {
  steps: string[];
  /** Zero-based index of the step the user is on. */
  current: number;
  /** Called with a completed step's index - lets users jump back. */
  onStepClick: (index: number) => void;
}

/**
 * A single progress indicator that reads the same on mobile and desktop: one
 * numbered node per step (a 1:1 map of the flow), completed nodes checked and
 * clickable for backward navigation.
 */
const CheckoutProgress: React.FC<Props> = ({ steps, current, onStepClick }) => (
  <div className="flex!">
    {steps.map((label, i) => {
      const done = i < current;
      const active = i === current;
      const lineBefore =
        i <= current ? "bg-hongbao-red-500!" : "bg-gray-200!";
      const lineAfter = i < current ? "bg-hongbao-red-500!" : "bg-gray-200!";

      return (
        <div
          key={label}
          className="relative! flex! flex-1! flex-col! items-center!"
        >
          {i > 0 && (
            <span
              className={`absolute! left-0! right-1/2! top-4! h-0.5! -translate-y-1/2! ${lineBefore}`}
            />
          )}
          {i < steps.length - 1 && (
            <span
              className={`absolute! left-1/2! right-0! top-4! h-0.5! -translate-y-1/2! ${lineAfter}`}
            />
          )}

          <button
            type="button"
            disabled={!done}
            onClick={() => done && onStepClick(i)}
            aria-current={active ? "step" : undefined}
            className={`relative! z-10! flex! h-8! w-8! items-center! justify-center! rounded-full! text-xs! font-bold! transition-colors! duration-200! ${
              done
                ? "bg-hongbao-red-500! text-white! cursor-pointer!"
                : active
                  ? "bg-hongbao-red-500! text-white! ring-4! ring-hongbao-red-100!"
                  : "bg-gray-100! text-gray-400!"
            }`}
          >
            {done ? <IconCheck size={15} stroke={3} /> : i + 1}
          </button>

          <span
            className={`mt-2! text-center! text-[11px]! font-semibold! sm:text-xs! ${
              active
                ? "text-hongbao-red-700!"
                : done
                  ? "text-gray-700!"
                  : "text-gray-400!"
            }`}
          >
            {label}
          </span>
        </div>
      );
    })}
  </div>
);

export default CheckoutProgress;
