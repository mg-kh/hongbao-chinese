"use client";

import { HOME } from "@/constants/ClientRoutes";
import { ActionIcon, AppShell, Container, Flex, Group } from "@mantine/core";
import { IconArrowLeft } from "@tabler/icons-react";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const t = useTranslations("Auth.AuthLayout");
  return (
    <>
      <AppShell padding="md" header={{ height: 60 }}>
        <AppShell.Header>
          <Container size={"sm"}>
            <Flex align="center" h={60}>
              <Group className="w-md">
                <ActionIcon
                  variant="transparent"
                  component={Link}
                  href={HOME}
                  color="dark"
                  c="var(--hb-text)"
                  aria-label={t("back_to_home_aria")}
                >
                  <IconArrowLeft />
                </ActionIcon>
              </Group>
            </Flex>
          </Container>
        </AppShell.Header>

        <AppShell.Main className="h-[calc(100vh-60px)]" bg={"gray.0"} px={0}>
          {children}
        </AppShell.Main>
      </AppShell>
    </>
  );
}
