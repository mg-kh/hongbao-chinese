"use client";

import MobileBottomNav from "@/components/Navbar/MobileBottomNav/MobileBottomNav";
import { publicBottomNavItems } from "@/components/Navbar/MobileBottomNav/publicNavItems";
import { Link } from "@/i18n/navigation";
import ClientLayout from "@/layouts/ClientLayout/ClientLayout";
import { Box, Button, Container, Stack, Text } from "@mantine/core";
import { ArrowLeftIcon, CheckCircleIcon } from "@phosphor-icons/react";
import { useTranslations } from "next-intl";
import CheckoutStepsContainer from "../CheckoutSteps/CheckoutStepsContainer/CheckoutStepsContainer";
import useContainer from "./useContainer";

const CheckoutPage = () => {
  const t = useTranslations("Checkout.CheckoutPage");
  const { isReady, isEmpty, submitted, onSubmitted } = useContainer();

  return (
    <ClientLayout size={"100%"} p={0} hideFooterOnMobile>
      <Container size={"md"} px={{ base: 16, sm: 24 }}>
        <Stack gap={20} py={{ base: 20, md: 32 }} className="flex-1!">
          {submitted ? (
            <Box className="rounded-2xl! bg-surface! ring-1! ring-gray-200! py-16! px-6! text-center!">
              <Box className="mx-auto! mb-4! flex! items-center! justify-center! w-16! h-16! rounded-2xl! bg-green-50! text-green-600! dark:text-night-green!">
                <CheckCircleIcon size={30} weight="fill" />
              </Box>
              <Text fw={800} className="text-xl!" c="var(--hb-accent-strong)">
                {t("order_received")}
              </Text>
              <Text size="sm" c="gray.6" className="mt-2! max-w-[420px]! mx-auto! leading-relaxed!">
                {t("order_received_body")}
              </Text>
              <Stack gap={10} className="mt-6! max-w-[280px]! mx-auto!">
                <Button
                  component={Link}
                  href="/shop"
                  variant="filled"
                  color="hongbao-red"
                  radius="xl"
                >
                  {t("keep_shopping")}
                </Button>
                <Button
                  component={Link}
                  href="/"
                  variant="subtle"
                  color="gray"
                  radius="xl"
                >
                  {t("back_home")}
                </Button>
              </Stack>
            </Box>
          ) : !isReady || isEmpty ? null : (
            <>
              <Link
                href="/shop/cart"
                className="flex! items-center! gap-1.5! w-fit! no-underline! text-gray-500! hover:text-hongbao-red-600! dark:hover:text-night-red! transition-colors! duration-200!"
              >
                <ArrowLeftIcon size={14} weight="bold" />
                <Text size="xs" fw={600}>
                  {t("back_to_cart")}
                </Text>
              </Link>

              <Stack gap={4}>
                <Text fw={800} className="text-[1.4rem]! sm:text-[1.7rem]!">
                  {t("title")}
                </Text>
                <Text size="sm" c="gray.6">
                  {t("subtitle")}
                </Text>
              </Stack>

              <CheckoutStepsContainer onSubmitted={onSubmitted} />
            </>
          )}
        </Stack>
      </Container>

      <MobileBottomNav items={publicBottomNavItems} />
    </ClientLayout>
  );
};

export default CheckoutPage;
