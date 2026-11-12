import {
  ArticleIcon,
  ExamIcon,
  HouseSimpleIcon,
  ShieldCheckIcon,
  StorefrontIcon,
} from "@phosphor-icons/react/dist/ssr";
import { TBottomNavItem } from "./MobileBottomNav";

/**
 * Bottom-bar destinations for the public (signed-out) site. Mirrors the
 * header's primary nav, which collapses behind the burger on mobile.
 *
 * Defined once and shared by every public page so the bar can't drift out of
 * sync between them. Icons come from the `/ssr` build so this module is safe
 * to import from server and client components alike.
 */
export const publicBottomNavItems: TBottomNavItem[] = [
  {
    label: "Home",
    href: "/",
    icon: <HouseSimpleIcon size={20} weight="fill" />,
  },
  {
    label: "Shop",
    href: "/shop",
    match: "shop",
    icon: <StorefrontIcon size={20} weight="fill" />,
  },
  {
    label: "Level Test",
    href: "/level-test",
    match: "level-test",
    icon: <ExamIcon size={20} weight="fill" />,
  },
  {
    label: "Blogs",
    href: "/blogs",
    match: "blogs",
    icon: <ArticleIcon size={20} weight="fill" />,
  },
  {
    label: "Privacy",
    href: "/privacy-policy",
    match: "privacy-policy",
    icon: <ShieldCheckIcon size={20} weight="fill" />,
  },
];
