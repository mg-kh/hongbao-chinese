import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { useLocale } from "next-intl";
import { useParams } from "next/navigation";
import { useTransition } from "react";

const labels: Record<(typeof routing.locales)[number], string> = {
  mm: "MM",
  en: "EN",
};

const options = routing.locales.map((l) => ({ value: l, label: labels[l] }));

const useContainer = () => {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const [isPending, startTransition] = useTransition();

  // keeps the current path (and dynamic params), only swaps the locale prefix
  const handleChange = (next: string) => {
    if (next === locale) return;
    startTransition(() => {
      router.replace(
        // @ts-expect-error -- pathname + params always match the current route
        { pathname, params },
        { locale: next, scroll: false },
      );
    });
  };

  return { locale, options, isPending, handleChange };
};

export default useContainer;
