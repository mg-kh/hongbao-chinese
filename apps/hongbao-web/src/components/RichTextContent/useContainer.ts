import { useEffect, useRef, useState } from "react";

const ADVERTISEMENT_SELECTOR = '[data-type="advertisement"]';

const useContainer = (html: string) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [advertisementSlots, setAdvertisementSlots] = useState<HTMLElement[]>([]);

  // The editor persists `advertisement` nodes as empty placeholder divs (no
  // AdSense script in the stored HTML) - after each (re)render of the raw
  // HTML we find those divs and portal `AdsenseBanner` into them instead.
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const slots = Array.from(container.querySelectorAll<HTMLElement>(ADVERTISEMENT_SELECTOR));
    slots.forEach((slot) => {
      slot.innerHTML = "";
    });
    setAdvertisementSlots(slots);
  }, [html]);

  return { containerRef, advertisementSlots };
};

export default useContainer;
