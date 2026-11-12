"use client";

import {
  ArrowClockwiseIcon,
  CheckCircleIcon,
  PlayIcon,
} from "@phosphor-icons/react";
import HanziWriter from "hanzi-writer";
import { useEffect, useMemo, useRef, useState } from "react";

interface Props {
  /** The word - each Chinese character can be watched or written in turn. */
  text: string;
  /** Only build the writer while the panel is actually visible. */
  active?: boolean;
  strokeColor?: string;
  outlineColor?: string;
  radicalColor?: string;
  highlightColor?: string;
  drawingColor?: string;
  className?: string;
}

/** Matches CJK ideographs (incl. Extension A/B and compatibility blocks). */
const CJK_CHAR = /[㐀-䶿一-鿿豈-﫿\u{20000}-\u{2FA1F}]/u;

type Mode = "watch" | "write";

const MODES: Mode[] = ["watch", "write"];

/**
 * Stroke-order coach: watch the character animate, then switch to "write" to
 * trace it on the canvas and get per-stroke feedback (powered by hanzi-writer's
 * quiz mode). Multi-character words expose a chip per character.
 *
 * Remount (via `key`) to reset when the word changes.
 */
const HanziPractice: React.FC<Props> = ({
  text,
  active = true,
  // tuned for a light (warm paper) card back - dark strokes on a pale ground
  // give the high foreground/background contrast that best supports recall
  strokeColor = "#8c1515",
  outlineColor = "rgba(140,21,21,0.22)",
  radicalColor = "#b3862b",
  highlightColor = "#d91e26",
  drawingColor = "#b84f14",
  className,
}) => {
  const chars = useMemo(
    () => Array.from(text ?? "").filter((c) => CJK_CHAR.test(c)),
    [text],
  );

  const boxRef = useRef<HTMLDivElement>(null);
  const targetRef = useRef<HTMLDivElement>(null);
  const writerRef = useRef<HanziWriter | null>(null);

  const [charIndex, setCharIndex] = useState(0);
  const [mode, setMode] = useState<Mode>("watch");
  const [size, setSize] = useState(0);
  const [restartNonce, setRestartNonce] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [completed, setCompleted] = useState<number[]>([]);
  const [failed, setFailed] = useState(false);

  const char = chars[charIndex] ?? chars[0] ?? "";

  // keep the writer square and sized to the available space
  useEffect(() => {
    const el = boxRef.current;
    if (!el || !active) return;
    const measure = () => {
      const { width, height } = el.getBoundingClientRect();
      const next = Math.round(
        Math.max(120, Math.min(360, Math.min(width, height))),
      );
      setSize((prev) => (Math.abs(prev - next) > 2 ? next : prev));
    };
    measure();
    // re-measure once the dialog open / card flip transitions have settled
    const timers = [80, 260, 550].map((ms) => window.setTimeout(measure, ms));
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => {
      ro.disconnect();
      timers.forEach((t) => window.clearTimeout(t));
    };
  }, [active]);

  // (re)build the writer for the current character / mode / size
  useEffect(() => {
    const el = targetRef.current;
    if (!el || !active || !char || size === 0) return;

    el.innerHTML = "";
    let cancelled = false;

    const writer = HanziWriter.create(el, char, {
      width: size,
      height: size,
      padding: 6,
      showCharacter: false,
      showOutline: true,
      strokeColor,
      outlineColor,
      radicalColor,
      highlightColor,
      drawingColor,
      drawingWidth: Math.max(14, Math.round(size / 11)),
      strokeAnimationSpeed: 1.2,
      delayBetweenStrokes: 90,
      delayBetweenLoops: 1400,
      onLoadCharDataError: () => {
        if (!cancelled) setFailed(true);
      },
      onLoadCharDataSuccess: () => {
        if (!cancelled) setFailed(false);
      },
    });
    writerRef.current = writer;

    if (mode === "watch") {
      void writer.loopCharacterAnimation();
    } else {
      void writer.quiz({
        leniency: 1.2,
        showHintAfterMisses: 3,
        onCorrectStroke: (data) => {
          if (!cancelled) setMistakes(data.totalMistakes);
        },
        onMistake: (data) => {
          if (!cancelled) setMistakes(data.totalMistakes);
        },
        onComplete: (data) => {
          if (cancelled) return;
          setMistakes(data.totalMistakes);
          setCompleted((prev) =>
            prev.includes(charIndex) ? prev : [...prev, charIndex],
          );
          if (charIndex + 1 < chars.length) {
            window.setTimeout(() => {
              if (cancelled) return;
              setMistakes(0);
              setCharIndex(charIndex + 1);
            }, 850);
          }
        },
      });
    }

    return () => {
      cancelled = true;
      try {
        writer.cancelQuiz();
      } catch {
        /* writer torn down before data loaded */
      }
      try {
        void writer.pauseAnimation();
      } catch {
        /* writer torn down before data loaded */
      }
      el.innerHTML = "";
      writerRef.current = null;
    };
  }, [
    char,
    charIndex,
    chars,
    mode,
    size,
    active,
    restartNonce,
    strokeColor,
    outlineColor,
    radicalColor,
    highlightColor,
    drawingColor,
  ]);

  // a fresh quiz for the current character has no mistakes yet
  const displayMistakes = mode === "write" ? mistakes : 0;

  return (
    <div className={`flex! h-full! flex-col! gap-3! ${className ?? ""}`}>
      {/* mode toggle */}
      <div className="flex! shrink-0! gap-1! rounded-xl! bg-hongbao-brown-900/8! p-1! text-sm! font-bold!">
        {MODES.map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => {
              setMistakes(0);
              setMode(m);
            }}
            aria-pressed={mode === m}
            className={`flex-1! rounded-lg! py-2! capitalize! transition-colors! duration-150! ${
              mode === m
                ? "bg-hongbao-red-600! text-white! shadow-sm!"
                : "text-hongbao-brown-800/60! hover:text-hongbao-brown-800!"
            }`}
          >
            {m}
          </button>
        ))}
      </div>

      {/* writer target */}
      <div
        ref={boxRef}
        className="flex! min-h-0! flex-1! items-center! justify-center! py-1!"
      >
        {failed ? (
          <span lang="zh" className="text-4xl! font-bold! text-hongbao-brown-800!">
            {char}
          </span>
        ) : (
          <div
            ref={targetRef}
            style={{ width: size || undefined, height: size || undefined }}
            className="touch-none! rounded-2xl! bg-white/60! ring-1! ring-inset! ring-hongbao-brown-900/10!"
          />
        )}
      </div>

      {/* footer: character chips + contextual action */}
      <div className="flex! shrink-0! items-center! justify-between! gap-2!">
        {chars.length > 1 ? (
          <div className="flex! gap-1!">
            {chars.map((c, i) => (
              <button
                key={i}
                type="button"
                lang="zh"
                onClick={() => {
                  setMistakes(0);
                  setCharIndex(i);
                }}
                className={`relative! flex! h-7! w-7! items-center! justify-center! rounded-lg! text-sm! transition-colors! duration-150! ${
                  i === charIndex
                    ? "bg-hongbao-red-600! text-white!"
                    : "bg-hongbao-brown-900/8! text-hongbao-brown-800/70! hover:bg-hongbao-brown-900/15!"
                }`}
              >
                {c}
                {completed.includes(i) && (
                  <CheckCircleIcon
                    size={12}
                    weight="fill"
                    className="absolute! -top-1! -right-1! text-green-600!"
                  />
                )}
              </button>
            ))}
          </div>
        ) : (
          <span />
        )}

        {mode === "watch" ? (
          <button
            type="button"
            onClick={() => writerRef.current?.animateCharacter()}
            className="flex! shrink-0! items-center! gap-1! rounded-full! bg-hongbao-brown-900/8! px-2.5! py-1! text-xs! font-bold! text-hongbao-brown-800! transition-colors! duration-150! hover:bg-hongbao-brown-900/15!"
          >
            <PlayIcon size={12} weight="fill" />
            Replay
          </button>
        ) : (
          <div className="flex! shrink-0! items-center! gap-2!">
            {displayMistakes > 0 && (
              <span className="text-xs! font-medium! text-hongbao-brown-800/60!">
                {displayMistakes} miss{displayMistakes === 1 ? "" : "es"}
              </span>
            )}
            <button
              type="button"
              onClick={() => {
                setMistakes(0);
                setRestartNonce((n) => n + 1);
              }}
              className="flex! items-center! gap-1! rounded-full! bg-hongbao-brown-900/8! px-2.5! py-1! text-xs! font-bold! text-hongbao-brown-800! transition-colors! duration-150! hover:bg-hongbao-brown-900/15!"
            >
              <ArrowClockwiseIcon size={12} weight="bold" />
              Restart
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default HanziPractice;
