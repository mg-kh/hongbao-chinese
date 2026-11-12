"use client";

import RubyButtonComponent from "@/components/Buttons/RubyButtonComponent/RubyButtonComponent";
import ClientLayout from "@/layouts/ClientLayout/ClientLayout";
import { Button, Center, Stack, Text } from "@mantine/core";
import { HouseIcon } from "@phosphor-icons/react";
import { IconShieldLock } from "@tabler/icons-react";
import Link from "next/link";

const Unauthorized = () => {
  return (
    <ClientLayout>
      <Center h={300}>
        <Stack justify="center" align="center">
          <IconShieldLock size={48} color="gray" />
          <Text size="xl" className="uppercase tracking-wider" c="gray.6">
            Unauthorized Access
          </Text>
          <RubyButtonComponent
            component={Link}
            href={"/"}
            leftSection={<HouseIcon />}
          >
            Go to home
          </RubyButtonComponent>
        </Stack>
      </Center>
    </ClientLayout>
  );
};

export default Unauthorized;
