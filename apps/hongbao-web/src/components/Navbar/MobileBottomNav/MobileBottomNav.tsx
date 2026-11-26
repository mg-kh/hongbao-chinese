"use client";

import { useActiveRoute } from "@/hooks/useActiveRoute";
import { Link } from "@/i18n/navigation";
import { Box, Text } from "@mantine/core";

export interface TBottomNavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  /**
   * Route fragment used for the active check when it differs from `href`
   * (e.g. a nested route like "shop"). Falls back to `href`.
   */
  match?: string;
}

interface Props {
  items: TBottomNavItem[];
}

/** Row height of the bar; the spacer below it matches exactly so the last
 * section of a page can never end up underneath the bar. */
const ROW_HEIGHT = 64;

/**
 * App-style bottom navigation, mobile only (hidden from `lg` up where the
 * sidebar or header nav takes over). Full-width and flush to the bottom,
 * with a pill behind the active icon - Material 3's navigation bar pattern.
 * Driven entirely by `items` so new destinations are a one-line addition at
 * the call site.
 */
const MobileBottomNav: React.FC<Props> = ({ items }) => {
  const isActiveRoute = useActiveRoute();

  return (
    <>
      {/* reserves the bar's footprint in normal flow */}
      <div
        aria-hidden
        className="lg:hidden!"
        style={{
          height: `calc(${ROW_HEIGHT}px + env(safe-area-inset-bottom))`,
        }}
      />

      <Box
        component="nav"
        aria-label="Primary"
        className="lg:hidden! fixed! bottom-0! left-0! right-0! z-50! border-t! border-gray-200! bg-surface/95! backdrop-blur-md! shadow-[0_-4px_20px_-6px_rgba(0,0,0,0.12)]!"
      >
        <div
          className="flex! items-stretch!"
          style={{
            // box-sizing is border-box, so the inset is added to the height
            // to keep the row itself a true ROW_HEIGHT tall
            height: `calc(${ROW_HEIGHT}px + env(safe-area-inset-bottom))`,
            paddingBottom: "env(safe-area-inset-bottom)",
          }}
        >
          {items.map((item) => {
            const active = isActiveRoute(item.match ?? item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className="flex-1! no-underline! min-w-0!"
              >
                {/* icon sits inside its own pill so the highlight reads as a
                    selection indicator rather than a pressed button */}
                <div className="flex! h-full! flex-col! items-center! justify-center! gap-1! transition-colors! duration-200! ease-out! active:bg-gray-50!">
                  <div
                    className={`flex! items-center! justify-center! w-14! h-8! rounded-full! transition-colors! duration-200! ease-out! ${
                      active
                        ? "bg-hongbao-red-50! text-hongbao-red-600! dark:text-night-red!"
                        : "text-gray-500!"
                    }`}
                  >
                    {item.icon}
                  </div>
                  <Text
                    size="10px"
                    fw={active ? 700 : 500}
                    c={active ? "hongbao-red.6" : "gray.6"}
                    className="leading-none! text-center!"
                    lineClamp={1}
                  >
                    {item.label}
                  </Text>
                </div>
              </Link>
            );
          })}
        </div>
      </Box>
    </>
  );
};

export default MobileBottomNav;
