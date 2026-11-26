"use client";

import MobileBottomNav from "@/components/Navbar/MobileBottomNav/MobileBottomNav";
import ClientLayout from "@/layouts/ClientLayout/ClientLayout";
import { Flex, Stack } from "@mantine/core";
import {
  CourseTypeIcon,
  FlashcardTypeIcon,
} from "@/components/icons/productTypeIcons";
import { BrainIcon, GearIcon, HouseSimpleIcon } from "@phosphor-icons/react";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import React from "react";
import SideBarNavigation from "./components/SideBarNavigation/SideBarNavigation";

interface Props {
  children: React.ReactNode;
}

const ProfileLayout: React.FC<Props> = ({ children }) => {
  const { userId } = useParams();
  const t = useTranslations("Profile.Nav");

  return (
    <ClientLayout hideFooterOnMobile>
      <Flex
        gap={{ base: 14, lg: 20 }}
        py={10}
        align="start"
        direction={{ base: "column", lg: "row" }}
      >
        {/* sidebar - desktop only, the bottom nav covers mobile */}
        <Stack className="hidden! lg:flex! w-[250px]! shrink-0! sticky! top-21!">
          <SideBarNavigation />
        </Stack>
        {/* Left */}
        <Stack className="flex-1! w-full! min-w-0!">{children}</Stack>
      </Flex>

      <MobileBottomNav
        items={[
          {
            label: t("home"),
            href: `/profile/${userId}`,
            icon: <HouseSimpleIcon size={20} weight="fill" />,
          },
          {
            label: t("my_courses_short"),
            href: `/profile/${userId}/my-courses`,
            match: "my-courses",
            icon: <CourseTypeIcon size={20} weight="fill" />,
          },
          {
            label: t("flashcards"),
            href: `/profile/${userId}/flashcards`,
            match: "flashcards",
            icon: <FlashcardTypeIcon size={20} weight="fill" />,
          },
          {
            label: t("memo_space"),
            href: `/profile/${userId}/memo-space`,
            match: "memo-space",
            icon: <BrainIcon size={20} weight="fill" />,
          },
          {
            label: t("settings"),
            href: `/profile/${userId}/settings`,
            match: "settings",
            icon: <GearIcon size={20} weight="fill" />,
          },
        ]}
      />
    </ClientLayout>
  );
};

export default ProfileLayout;
