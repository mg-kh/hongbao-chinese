"use client";

import ClientLayout from "@/layouts/ClientLayout/ClientLayout";
import MobileBottomNav from "@/components/Navbar/MobileBottomNav/MobileBottomNav";
import { publicBottomNavItems } from "@/components/Navbar/MobileBottomNav/publicNavItems";
import { Box, Divider, Stack, Text } from "@mantine/core";
import { lastUpdated, policySections } from "./policy.data";
import PolicySection from "./components/PolicySection/PolicySection";

const PageComponent = () => {
  return (
    <ClientLayout size={640} px={{ base: 16, sm: 24 }} hideFooterOnMobile>
      <Stack gap={0} className="py-10! sm:py-14!">
        {/* header */}
        <Stack gap={6}>
          <Text
            component="h1"
            fw={800}
            className="text-2xl! sm:text-3xl! text-gray-900! tracking-tight!"
          >
            Privacy Policy
          </Text>
          <Text size="sm" c="gray.6" className="leading-relaxed!">
            Plain-language details on what we collect, why, and the choices you
            have — for the Hong Bao website and app.
          </Text>
          <Text size="xs" c="gray.5">
            Last updated: {lastUpdated}
          </Text>
        </Stack>

        <Divider my={{ base: 28, sm: 36 }} color="gray.2" />

        {/* sections */}
        <Stack gap={32}>
          {policySections.map((section, i) => (
            <Box key={section.id}>
              <PolicySection section={section} />
              {i < policySections.length - 1 && (
                <Divider mt={32} color="gray.1" />
              )}
            </Box>
          ))}
        </Stack>
      </Stack>

      {/* mobile: replaces the footer with the shared public bottom bar */}
      <MobileBottomNav items={publicBottomNavItems} />
    </ClientLayout>
  );
};

export default PageComponent;
