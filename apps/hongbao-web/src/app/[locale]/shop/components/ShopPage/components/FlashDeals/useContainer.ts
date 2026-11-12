"use client";

import { useEffect, useState } from "react";

/** Midnight tonight, in epoch ms - the flash sale "resets" every day. */
const endOfToday = (): number => {
  const d = new Date();
  d.setHours(23, 59, 59, 999);
  return d.getTime();
};

const pad = (n: number): string => String(n).padStart(2, "0");

/**
 * Live countdown to end of day. Returns `null` until mounted so the server and
 * first client render agree (the remaining time is different on each).
 */
const useContainer = () => {
  const [parts, setParts] = useState<{
    hours: string;
    minutes: string;
    seconds: string;
  } | null>(null);

  useEffect(() => {
    const tick = () => {
      const remaining = Math.max(0, endOfToday() - Date.now());
      const totalSeconds = Math.floor(remaining / 1000);
      setParts({
        hours: pad(Math.floor(totalSeconds / 3600)),
        minutes: pad(Math.floor((totalSeconds % 3600) / 60)),
        seconds: pad(totalSeconds % 60),
      });
    };
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);

  return { parts };
};

export default useContainer;
