"use client";

import useCart from "@/hooks/useCart";
import { Link } from "@/i18n/navigation";
import { Indicator } from "@mantine/core";
import { useMounted } from "@mantine/hooks";
import { IconShoppingBag } from "@tabler/icons-react";
import { useTranslations } from "next-intl";

interface Props {
  /** Drawer row style for the mobile menu; icon-only pill otherwise. */
  variant?: "icon" | "row";
  onNavigate?: () => void;
}

/**
 * Header entry point to the cart. The count comes from `localStorage` via
 * `useCart`, so it's rendered only after mount to avoid a hydration mismatch.
 */
const CartButton: React.FC<Props> = ({ variant = "icon", onNavigate }) => {
  const t = useTranslations("Navbar.CartButton");
  const { count, bump } = useCart();
  const mounted = useMounted();
  const badge = mounted && count > 0 ? count : 0;
  // Keying off `bump` remounts this span on every add, restarting the animation.
  const bumpKey = mounted ? bump : 0;

  if (variant === "row") {
    return (
      <Link
        href="/shop/cart"
        onClick={onNavigate}
        className="no-underline! flex! items-center! gap-3! rounded-xl! py-2.5! px-3! hover:bg-gray-50! active:bg-gray-100! transition-colors! duration-200!"
      >
        <span
          key={bumpKey}
          className="flex! items-center! justify-center! w-9! h-9! rounded-lg! bg-hongbao-red-50! text-hongbao-red-600! dark:text-night-red! shrink-0! motion-safe:[animation:cart-bump_0.5s_ease-in-out]"
        >
          <IconShoppingBag size={18} />
        </span>
        <span className="flex-1! text-sm! font-semibold! text-gray-800!">
          {t("cart")}
        </span>
        {badge > 0 && (
          <span className="min-w-5! h-5! px-1.5! rounded-full! bg-hongbao-red-600! text-white! text-[11px]! font-bold! flex! items-center! justify-center!">
            {badge}
          </span>
        )}
      </Link>
    );
  }

  return (
    <Link
      href="/shop/cart"
      onClick={onNavigate}
      aria-label={
        badge > 0 ? t("aria_with_count", { count: badge }) : t("cart")
      }
      className="no-underline! flex! items-center! justify-center! w-10! h-10! rounded-full! border! border-gray-200! bg-surface! text-gray-700! transition-colors! duration-200! ease-out! hover:border-hongbao-red-200! hover:bg-hongbao-cream-50! hover:text-hongbao-red-600! dark:hover:text-night-red!"
    >
      <Indicator
        disabled={badge === 0}
        label={badge}
        size={16}
        offset={2}
        color="hongbao-red"
        withBorder
      >
        <span
          key={bumpKey}
          className="flex! motion-safe:[animation:cart-bump_0.5s_ease-in-out]"
        >
          <IconShoppingBag size={19} />
        </span>
      </Indicator>
    </Link>
  );
};

export default CartButton;
