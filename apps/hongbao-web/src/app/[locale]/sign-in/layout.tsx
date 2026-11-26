"use client";

import { HOME } from "@/constants/ClientRoutes";
import { ActionIcon, AppShell, Container, Flex, Group } from "@mantine/core";
import { IconArrowLeft } from "@tabler/icons-react";
import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
