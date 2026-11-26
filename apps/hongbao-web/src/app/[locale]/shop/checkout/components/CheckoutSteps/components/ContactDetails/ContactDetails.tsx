"use client";

import { Stack, Text, TextInput } from "@mantine/core";
import { useTranslations } from "next-intl";
import { Controller, useFormContext } from "react-hook-form";
import { TCheckoutErrorKey } from "../../schema/checkout.schema";

const ContactDetails = () => {
  const t = useTranslations("Checkout.ContactDetails");
  const tv = useTranslations("Checkout.Validation");
  const { control } = useFormContext();
  const errorText = (message?: string) =>
    message ? tv(message as TCheckoutErrorKey) : undefined;

  return (
    <Stack gap={18}>
      <Stack gap={2}>
        <Text fw={700} size="md">
          {t("title")}
        </Text>
        <Text size="sm" c="gray.6">
          {t("subtitle")}
        </Text>
      </Stack>

      <Stack gap={14}>
        <Controller
          control={control}
          name="full_name"
          render={({ field, fieldState }) => (
            <TextInput
              {...field}
              label={t("full_name")}
              placeholder={t("full_name_placeholder")}
              size="md"
              radius={10}
              withAsterisk
              error={errorText(fieldState.error?.message)}
            />
          )}
        />
        <Controller
          control={control}
          name="email"
          render={({ field, fieldState }) => (
            <TextInput
              {...field}
              label={t("email")}
              placeholder="you@example.com"
              type="email"
              size="md"
              radius={10}
              withAsterisk
              error={errorText(fieldState.error?.message)}
            />
          )}
        />
        <Controller
          control={control}
          name="phone"
          render={({ field, fieldState }) => (
            <TextInput
              {...field}
              label={t("phone")}
              placeholder="09..."
              size="md"
              radius={10}
              withAsterisk
              error={errorText(fieldState.error?.message)}
            />
          )}
        />
      </Stack>
    </Stack>
  );
};

export default ContactDetails;
