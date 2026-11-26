"use client";

import DashboardNavbar from "@/components/Navbar/Dashboard/DashboardNavbar/DashboardNavbar";
import SideBarMenu from "@/components/Navbar/Dashboard/SideBarMenu/SideBarMenu";
import { DashboardMobileNavAtom } from "@/store/general.store";
import {
  AppShell,
  Burger,
  Container,
  Group,
  MantineSize,
  Overlay,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useAtom } from "jotai";

interface Props {
  children: React.ReactNode;
  size?: number | (string & {}) | MantineSize | undefined;
}

const DashboardLayout: React.FC<Props> = ({ children, size = "xl" }) => {
  const [mobileOpened, setMobileOpened] = useAtom(DashboardMobileNavAtom);
  const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(true);

  const toggleMobile = () => setMobileOpened((v) => !v);
  const closeMobile = () => setMobileOpened(false);

  return (
    <AppShell
      layout="alt"
      header={{ height: 60 }}
      navbar={{
        width: { base: 260, sm: 300 },
        breakpoint: "sm",
        collapsed: { mobile: !mobileOpened, desktop: !desktopOpened },
      }}
    >
      <AppShell.Header bg="var(--hb-surface)">
        <DashboardNavbar
          burgerComponent={
            <Group>
              <Burger
                opened={mobileOpened}
                onClick={toggleMobile}
                hiddenFrom="sm"
                size="sm"
              />
              <Burger
                opened={desktopOpened}
                onClick={toggleDesktop}
                visibleFrom="sm"
                size="sm"
              />
            </Group>
          }
        />
      </AppShell.Header>
      {/*
        Layout layers stay below Mantine's dialog layer (modal / drawer = 200,
        popover = 300) so every dialog backdrop covers the whole page.
        Header = 100 (AppShell default) < mobile overlay < navbar.
      */}
      <AppShell.Navbar zIndex={102}>
        <SideBarMenu onNavigate={closeMobile} />
      </AppShell.Navbar>
      {mobileOpened && (
        <Overlay
          onClick={closeMobile}
          zIndex={101}
          backgroundOpacity={0.45}
          hiddenFrom="sm"
          fixed
        />
      )}
      <AppShell.Main bg="gray.0">
        <Container size={size} p={0} className="min-h-[calc(100vh-60px)]">
          {children}
        </Container>
      </AppShell.Main>
    </AppShell>
  );
};

export default DashboardLayout;
