"use client";

import { Box, Button, Group, Modal, Stack, Text } from "@mantine/core";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  PaperPlaneTiltIcon,
  WarningCircleIcon,
} from "@phosphor-icons/react";
import { useTranslations } from "next-intl";
import CheckoutSummary from "../CheckoutSummary/CheckoutSummary";
import CheckoutProgress from "./components/CheckoutProgress/CheckoutProgress";
import ContactDetails from "./components/ContactDetails/ContactDetails";
import PaymentMethod from "./components/PaymentMethod/PaymentMethod";
import UploadProof from "./components/UploadProof/UploadProof";
import useContainer from "./useContainer";

const STEP_KEYS = ["details", "payment", "confirm"] as const;

interface Props {
  onSubmitted: () => void;
}

const CheckoutSteps: React.FC<Props> = ({ onSubmitted }) => {
  const t = useTranslations("Checkout.CheckoutSteps");
  const {
    step,
    isStepValid,
    nextStep,
    prevStep,
    setValue,
    opened,
    open,
    close,
    handleConfirm,
    isPending,
  } = useContainer(onSubmitted);

  return (
    <>
      <Modal
        opened={opened}
        onClose={close}
        withCloseButton={false}
        radius={20}
        centered
      >
        <Stack justify="center" align="center" gap={20} py={10}>
          <Box className="flex! items-center! justify-center! w-16! h-16! rounded-2xl! bg-hongbao-red-50! text-hongbao-red-600! dark:text-night-red!">
            <WarningCircleIcon size={34} weight="fill" />
          </Box>
          <Stack gap={8}>
            <Text fw="bold" ta="center" size="lg">
              {t("confirm_title")}
            </Text>
            <Text c="gray.6" size="sm" ta="center" className="leading-relaxed!">
              {t("confirm_body")}
            </Text>
          </Stack>
          <Group
            justify="end"
            gap={10}
            wrap="nowrap"
            className="w-full! flex-col-reverse! sm:flex-row!"
          >
            <Button
              variant="default"
              size="md"
              radius="xl"
              onClick={close}
              className="w-full! sm:w-auto!"
            >
              {t("cancel")}
            </Button>
            <Button
              onClick={handleConfirm}
              size="md"
              radius="xl"
              color="hongbao-red"
              loading={isPending}
              className="w-full! sm:w-auto!"
            >
              {t("confirm_order")}
            </Button>
          </Group>
        </Stack>
      </Modal>

      <Stack gap={20}>
        <Box className="rounded-2xl! bg-surface! p-4! ring-1! ring-gray-200! sm:p-5!">
          <CheckoutProgress
            steps={STEP_KEYS.map((k) => t(`steps.${k}`))}
            current={step}
            onStepClick={(i) => setValue("step", i)}
          />
        </Box>

        <CheckoutSummary />

        <Box className="rounded-2xl! bg-surface! p-4! ring-1! ring-gray-200! sm:p-6!">
          {step === 0 && <ContactDetails />}
          {step === 1 && <PaymentMethod />}
          {step === 2 && <UploadProof />}
        </Box>
      </Stack>

      <Group
        mt="xl"
        p={{ base: 12, sm: 15 }}
        bdrs={15}
        bg="var(--hb-surface)"
        gap={12}
        wrap="nowrap"
        justify="space-between"
        className="sticky! bottom-16! border! border-gray-200! shadow-[0_-4px_16px_-8px_rgba(0,0,0,0.15)]! lg:bottom-0!"
      >
        <Button
          variant="default"
          onClick={prevStep}
          disabled={step === 0}
          size="md"
          radius="xl"
          leftSection={<ArrowLeftIcon size={16} />}
          className="flex-1! sm:flex-none!"
        >
          {t("back")}
        </Button>

        {step === 2 ? (
          <Button
            onClick={open}
            disabled={!isStepValid}
            size="md"
            radius="xl"
            color="hongbao-red"
            rightSection={<PaperPlaneTiltIcon size={16} weight="fill" />}
            className="flex-1! sm:flex-none!"
          >
            {t("submit_order")}
          </Button>
        ) : (
          <Button
            onClick={nextStep}
            size="md"
            radius="xl"
            rightSection={<ArrowRightIcon size={16} />}
            color="hongbao-red"
            disabled={!isStepValid}
            className="flex-1! sm:flex-none!"
          >
            {t("continue")}
          </Button>
        )}
      </Group>
    </>
  );
};

export default CheckoutSteps;
