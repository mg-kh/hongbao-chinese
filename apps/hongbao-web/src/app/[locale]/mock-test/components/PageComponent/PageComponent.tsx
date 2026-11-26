"use client";

import MobileBottomNav from "@/components/Navbar/MobileBottomNav/MobileBottomNav";
import { publicBottomNavItems } from "@/components/Navbar/MobileBottomNav/publicNavItems";
import { Link } from "@/i18n/navigation";
import ClientLayout from "@/layouts/ClientLayout/ClientLayout";
import { Box, Button, Container, Stack, Text } from "@mantine/core";
import { MockTestTypeIcon } from "@/components/icons/productTypeIcons";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ChartLineUpIcon,
  ClockIcon,
  SealQuestionIcon,
} from "@phosphor-icons/react";

/** What the finished test will do - kept short so the placeholder still
 * tells visitors what they're waiting for. */
const planned = [
  {
    icon: <SealQuestionIcon size={18} weight="fill" />,
    title: "Adaptive questions",
    body: "Questions get harder or easier as you answer, so the test stays short.",
  },
  {
    icon: <ChartLineUpIcon size={18} weight="fill" />,
    title: "Your HSK level",
    body: "See where you land from HSK 1 to 6, with a breakdown by skill.",
  },
  {
    icon: <MockTestTypeIcon size={18} weight="fill" />,
    title: "A course to match",
    body: "Get pointed at the course that starts exactly where you are.",
  },
];

const PageComponent = () => {
  return (
    <ClientLayout size={"100%"} p={0} hideFooterOnMobile>
      <Container size={"sm"} px={{ base: 16, sm: 24 }}>
        <Stack gap={0} className="py-10! sm:py-16! md:py-20!">
          <Link
            href="/"
            className="flex! w-fit! items-center! gap-1.5! no-underline! text-gray-500! transition-colors! duration-200! hover:text-hongbao-red-600!"
          >
            <ArrowLeftIcon size={14} weight="bold" />
            <Text size="xs" fw={600}>
              Back to home
            </Text>
          </Link>

          <Box className="mt-8!">
            <span className="inline-flex! items-center! gap-1.5! rounded-full! bg-hongbao-gold-50! px-3! py-1! text-[11px]! font-bold! uppercase! tracking-[0.12em]! text-hongbao-gold-800!">
              <ClockIcon size={12} weight="fill" />
              Coming soon
            </span>
          </Box>

          <Text
            component="h1"
            fw={800}
            className="mt-5! text-[1.9rem]! leading-[1.12]! tracking-tight! text-gray-900! sm:text-[2.4rem]!"
          >
            Find your HSK level
          </Text>

          <Text c="gray.6" className="mt-4! text-[1.05rem]! leading-relaxed!">
            We&apos;re still building this one. Soon you&apos;ll answer a few
            adaptive questions, get your HSK level in minutes, and jump straight
            into the course that fits.
          </Text>

          {/* what it will do */}
          <Text
            size="11px"
            fw={700}
            c="gray.5"
            className="mt-12! uppercase! tracking-[0.14em]!"
          >
            What it will do
          </Text>

          <Box className="mt-3! rounded-2xl! bg-white! px-4! ring-1! ring-gray-200! sm:px-5!">
            {planned.map((p) => (
              <div
                key={p.title}
                className="flex! gap-3.5! border-b! border-gray-100! py-4! last:border-b-0! sm:gap-4!"
              >
                <span className="flex! h-9! w-9! shrink-0! items-center! justify-center! rounded-xl! bg-hongbao-red-50! text-hongbao-red-600!">
                  {p.icon}
                </span>
                <div>
                  <Text fw={700} size="sm" className="text-gray-900!">
                    {p.title}
                  </Text>
                  <Text
                    size="sm"
                    c="gray.6"
                    className="mt-0.5! leading-relaxed!"
                  >
                    {p.body}
                  </Text>
                </div>
              </div>
            ))}
          </Box>

          {/* while you wait */}
          <Box className="mt-10! rounded-2xl! bg-hongbao-red-50/60! p-5! sm:p-6!">
            <Text fw={700} size="sm" className="text-gray-900!">
              Already know roughly where you are?
            </Text>
            <Text size="sm" c="gray.6" className="mt-1! leading-relaxed!">
              Browse the courses by HSK level and start today - you can switch
              levels any time.
            </Text>
            <div className="mt-4! flex! flex-col! gap-2.5! sm:flex-row!">
              <Button
                component={Link}
                href="/shop?type=course"
                color="hongbao-red"
                radius="xl"
                size="md"
                rightSection={<ArrowRightIcon size={15} weight="bold" />}
                className="w-full! sm:w-auto!"
              >
                Browse courses
              </Button>
              <Button
                component={Link}
                href="/"
                variant="default"
                radius="xl"
                size="md"
                className="w-full! sm:w-auto!"
              >
                Back to home
              </Button>
            </div>
          </Box>
        </Stack>
      </Container>

      <MobileBottomNav items={publicBottomNavItems} />
    </ClientLayout>
  );
};

export default PageComponent;
