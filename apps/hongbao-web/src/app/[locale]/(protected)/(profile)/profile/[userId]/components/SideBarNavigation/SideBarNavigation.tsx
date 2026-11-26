"use client";

import { useActiveRoute } from "@/hooks/useActiveRoute";
import { Link } from "@/i18n/navigation";
import { Box, Paper, Text } from "@mantine/core";
import { useTranslations } from "next-intl";
import {
  CourseTypeIcon,
  FlashcardTypeIcon,
} from "@/components/icons/productTypeIcons";
import {
  BrainIcon,
  CaretRightIcon,
  GearIcon,
  HouseSimpleIcon,
  ReceiptIcon,
} from "@phosphor-icons/react";
import useContainer from "./useContainer";

type NavItem = {
  label: string;
  href: string;
  /** Route fragment used for the active check when it differs from `href`. */
  match: string;
  icon: React.ReactNode;
};

const SideBarNavigation = () => {
  const { userId } = useContainer();
  const isActiveRoute = useActiveRoute();
  const t = useTranslations("Profile.Nav");

  const items: NavItem[] = [
    {
      label: t("home_page"),
      href: `/profile/${userId}`,
      match: `/profile/${userId}`,
      icon: <HouseSimpleIcon size={17} weight="fill" />,
    },
    {
      label: t("my_courses"),
      href: `/profile/${userId}/my-courses`,
      match: "my-courses",
      icon: <CourseTypeIcon size={17} weight="fill" />,
    },
    {
      label: t("purchase_history"),
      href: `/profile/${userId}/purchase-history`,
      match: "purchase-history",
      icon: <ReceiptIcon size={17} weight="fill" />,
    },
    {
      label: t("flashcards"),
      href: `/profile/${userId}/flashcards`,
      match: "flashcards",
      icon: <FlashcardTypeIcon size={17} weight="fill" />,
    },
    {
      label: t("memo_space"),
      href: `/profile/${userId}/memo-space`,
      match: "memo-space",
      icon: <BrainIcon size={17} weight="fill" />,
    },
    {
      label: t("settings"),
      href: `/profile/${userId}/settings`,
      match: "settings",
      icon: <GearIcon size={17} weight="fill" />,
    },
  ];

  return (
    <Paper
      withBorder
      bdrs={20}
      p={10}
      className="w-full! border-gray-200! shadow-sm!"
    >
      <Text
        size="10px"
        fw={700}
        c="gray.4"
        className="uppercase! tracking-[0.14em]! px-3! pt-1.5! pb-2.5!"
      >
        {t("menu")}
      </Text>

      <Box
        component="nav"
        aria-label={t("aria_profile")}
        className="flex! flex-col! gap-1!"
      >
        {items.map((item) => {
          const active = isActiveRoute(item.match);

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className="no-underline!"
            >
              <Box
                className={`group! relative! flex! items-center! gap-3! rounded-xl! pl-3! pr-2! py-2.5! transition-colors! duration-200! ease-out! ${
                  active
                    ? "bg-gradient-to-r! from-hongbao-red-50! to-hongbao-cream-50/60!"
                    : "hover:bg-gray-50!"
                }`}
              >
                {/* active marker */}
                {active && (
                  <Box className="absolute! left-0! top-1/2! -translate-y-1/2! w-[3px]! h-6! rounded-r-full! bg-hongbao-red-500!" />
                )}

                <Box
                  className={`flex! items-center! justify-center! shrink-0! w-8! h-8! rounded-lg! transition-colors! duration-200! ease-out! ${
                    active
                      ? "bg-gradient-to-br! from-hongbao-red-500! to-hongbao-maroon-600! text-white! shadow-sm!"
                      : "bg-gray-100! text-gray-500! group-hover:bg-hongbao-red-50! group-hover:text-hongbao-red-600! dark:group-hover:text-night-red!"
                  }`}
                >
                  {item.icon}
                </Box>

                <Text
                  size="sm"
                  fw={active ? 700 : 500}
                  c={active ? "hongbao-red.7" : "gray.7"}
                  lineClamp={2}
                  className="flex-1! min-w-0! leading-snug!"
                >
                  {item.label}
                </Text>

                <CaretRightIcon
                  size={13}
                  weight="bold"
                  className={`shrink-0! transition-all! duration-200! ease-out! ${
                    active
                      ? "text-hongbao-red-400!"
                      : "text-gray-300! opacity-0! -translate-x-1! group-hover:opacity-100! group-hover:translate-x-0!"
                  }`}
                />
              </Box>
            </Link>
          );
        })}
      </Box>
    </Paper>
  );
};

export default SideBarNavigation;
