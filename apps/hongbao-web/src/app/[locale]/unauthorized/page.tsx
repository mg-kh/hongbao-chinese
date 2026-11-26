"use client";

import RubyButtonComponent from "@/components/Buttons/RubyButtonComponent/RubyButtonComponent";
import ClientLayout from "@/layouts/ClientLayout/ClientLayout";
import { Button, Center, Stack, Text } from "@mantine/core";
import { HouseIcon } from "@phosphor-icons/react";
import { IconShieldLock } from "@tabler/icons-react";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

const Unauthorized = () => {
  const t = useTranslations("Unauthorized");
  return (
    <ClientLayout>
      <Center h={300}>
        <Stack justify="center" align="center">
          <IconShieldLock size={48} color="gray" />
          <Text size="xl" className="uppercase tracking-wider" c="gray.6">
            {t("title")}
          </Text>
          <RubyButtonComponent
            component={Link}
            href={"/"}
            leftSection={<HouseIcon />}
          >
            {t("go_home")}
          </RubyButtonComponent>
        </Stack>
      </Center>
    </ClientLayout>
  );
};

export default Unauthorized;
