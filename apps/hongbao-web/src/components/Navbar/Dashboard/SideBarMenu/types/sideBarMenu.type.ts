import type { IconProps } from "@tabler/icons-react";
import type { ComponentType } from "react";

export type NavLink = {
  label: string;
  href: string;
  /** path segment that keeps the link active on nested routes */
  segment?: string;
};

/** a labeled cluster of links, written once instead of per-link */
export type NavLinkGroup = {
  group: string;
  links: NavLink[];
};

export type NavItem = NavLink | NavLinkGroup;

export const isLinkGroup = (item: NavItem): item is NavLinkGroup =>
  "links" in item;

export type NavSection = {
  id: string;
  label: string;
  icon: ComponentType<IconProps>;
  /** path segment that maps a route to this section */
  segment?: string;
  links: NavItem[];
};
