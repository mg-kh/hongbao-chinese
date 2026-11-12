"use client";

import { usePwaInstall } from "@/providers/PwaInstallProvider";
import { Box, Button, CloseButton, Group, Modal, Stack, Text } from "@mantine/core";
import {
  BellRingingIcon,
  LightningIcon,
  WifiSlashIcon,
} from "@phosphor-icons/react";
import { IconDownload } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import Image from "next/image";

/** Mirrors the homepage install section so the modal reinforces the same value. */
const perks = [
  { icon: <LightningIcon size={15} weight="fill" />, label: "Opens in one tap" },
  {
    icon: <BellRingingIcon size={15} weight="fill" />,
    label: "Never miss a review",
  },
  {
    icon: <WifiSlashIcon size={15} weight="fill" />,
    label: "Nothing to download",
  },
];

const PwaInstallPrompt: React.FC = () => {
  const t = useTranslations();
  const { opened, isInstalling, close, handleInstall } = usePwaInstall();

  return (
    <Modal
      opened={opened}
      onClose={close}
      centered
      size={400}
      radius={24}
      withCloseButton={false}
      padding={0}
      overlayProps={{ backgroundOpacity: 0.55, blur: 4 }}
      transitionProps={{ transition: "pop", duration: 220 }}
      classNames={{ content: "overflow-hidden!" }}
    >
      {/* branded header - ties the dialog to the homepage install section */}
      <Box className="relative! overflow-hidden! bg-gradient-to-br! from-hongbao-maroon-800! via-hongbao-red-700! to-hongbao-brown-800! px-6! pt-7! pb-8!">
        <Box className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.14)_1px,transparent_0)] bg-[length:20px_20px]" />
        <Box className="pointer-events-none absolute -top-16 -right-10 w-44 h-44 rounded-full bg-hongbao-gold-400/25 blur-3xl" />

        <CloseButton
          onClick={close}
          aria-label="Close"
          size="md"
          radius="xl"
          className="absolute! top-3! right-3! text-white! bg-white/15! hover:bg-white/25! z-10!"
        />

        <Stack align="center" gap={12} className="relative!">
          <Box className="flex! items-center! justify-center! w-16! h-16! rounded-2xl! bg-white! shadow-lg!">
            <Image src={"/assets/logo.svg"} width={44} height={44} alt="" />
          </Box>
          <Text
            fw={800}
            c="white"
            ta="center"
            className="text-lg! leading-snug! text-balance!"
          >
            {t("PwaInstall.title")}
          </Text>
        </Stack>
      </Box>

      <Stack gap={16} px={24} py={22}>
        <Text size="sm" c="gray.6" ta="center" className="leading-relaxed!">
          {t("PwaInstall.description")}
        </Text>

        {/* benefit reinforcement, kept to short scannable lines */}
        <Stack gap={9}>
          {perks.map((p) => (
            <Group key={p.label} gap={10} wrap="nowrap">
              <Box className="flex! items-center! justify-center! shrink-0! w-7! h-7! rounded-lg! bg-hongbao-red-50! text-hongbao-red-600!">
                {p.icon}
              </Box>
              <Text size="sm" fw={600} c="gray.7">
                {p.label}
              </Text>
            </Group>
          ))}
        </Stack>

        {/* one primary action, one quiet escape */}
        <Stack gap={8} mt={4}>
          <Button
            onClick={handleInstall}
            loading={isInstalling}
            size="md"
            radius="xl"
            fullWidth
            color="hongbao-red"
            leftSection={<IconDownload size={18} />}
            className="shadow-[0_10px_24px_-10px_rgba(245,34,45,0.7)]! transition-transform! duration-200! ease-out! hover:-translate-y-0.5!"
            styles={{ label: { fontWeight: 700 } }}
          >
            {t("PwaInstall.install")}
          </Button>

          <Button
            variant="subtle"
            color="gray"
            size="sm"
            radius="xl"
            fullWidth
            onClick={close}
            disabled={isInstalling}
          >
            {t("PwaInstall.not_now")}
          </Button>
        </Stack>
      </Stack>
    </Modal>
  );
};

export default PwaInstallPrompt;
