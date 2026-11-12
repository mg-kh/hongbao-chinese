"use client";

import Footer from "@/app/[locale]/components/Footer/Footer";
import ClientNavbar from "@/components/Navbar/Client/ClientNavbar/ClientNavbar";
import {
  AppShell,
  Container,
  ContainerProps,
  MantineSize,
} from "@mantine/core";

interface Props extends ContainerProps {
  children: React.ReactNode;
  size?: number | (string & {}) | MantineSize | undefined;
  /**
   * Hides the footer below `lg`. Pages that show a MobileBottomNav use this -
   * the bar replaces the footer there and reserves its own space.
   */
  hideFooterOnMobile?: boolean;
}

const ClientLayout: React.FC<Props> = ({
  children,
  hideFooterOnMobile,
  ...props
}) => {
  return (
    <AppShell header={{ height: 80 }}>
      <AppShell.Header className="bg-white/85! backdrop-blur-md! border-b! border-gray-200/80! shadow-[0_1px_12px_-6px_rgba(0,0,0,0.15)]!">
        <ClientNavbar />
      </AppShell.Header>
      <AppShell.Main bg="gray.0">
        <Container className="min-h-[calc(100vh-80px)]!" size={"xl"} {...props}>
          {children}
        </Container>
        <div className={hideFooterOnMobile ? "hidden! lg:block!" : undefined}>
          <Footer />
        </div>
      </AppShell.Main>
    </AppShell>
  );
};

export default ClientLayout;
