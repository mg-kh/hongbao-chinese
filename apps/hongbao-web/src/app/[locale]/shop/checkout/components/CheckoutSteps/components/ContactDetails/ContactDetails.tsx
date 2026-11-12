"use client";

import { Stack, Text, TextInput } from "@mantine/core";
import { Controller, useFormContext } from "react-hook-form";

const ContactDetails = () => {
  const { control } = useFormContext();

  return (
    <Stack gap={18}>
      <Stack gap={2}>
        <Text fw={700} size="md">
          Your details
        </Text>
        <Text size="sm" c="gray.6">
          We&apos;ll use these to confirm your purchase and send access details.
        </Text>
      </Stack>

      <Stack gap={14}>
        <Controller
          control={control}
          name="full_name"
          render={({ field, fieldState }) => (
            <TextInput
              {...field}
              label="Full name"
              placeholder="Your name"
              size="md"
              radius={10}
              withAsterisk
              error={fieldState.error?.message}
            />
          )}
        />
        <Controller
          control={control}
          name="email"
          render={({ field, fieldState }) => (
            <TextInput
              {...field}
              label="Email"
              placeholder="you@example.com"
              type="email"
              size="md"
              radius={10}
              withAsterisk
              error={fieldState.error?.message}
            />
          )}
        />
        <Controller
          control={control}
          name="phone"
          render={({ field, fieldState }) => (
            <TextInput
              {...field}
              label="Phone number"
              placeholder="09..."
              size="md"
              radius={10}
              withAsterisk
              error={fieldState.error?.message}
            />
          )}
        />
      </Stack>
    </Stack>
  );
};

export default ContactDetails;
