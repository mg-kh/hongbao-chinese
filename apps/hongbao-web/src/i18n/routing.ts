import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "mm"],
  defaultLocale: "mm",
  localePrefix: {
    mode: "always",
  },
});
