"use client";

import { usePathname } from "@/i18n/navigation";
import { includes, split } from "lodash";

export const useActiveRoute = () => {
  const pathname = usePathname();

  return (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }

    return pathname === href || includes(split(pathname, "/"), href);
  };
};
