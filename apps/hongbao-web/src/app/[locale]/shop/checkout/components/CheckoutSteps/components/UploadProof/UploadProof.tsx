"use client";

import { Box, Image, Stack, Text, TextInput, UnstyledButton } from "@mantine/core";
import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import { CaretDownIcon, UploadSimpleIcon, XIcon } from "@phosphor-icons/react";
import { useTranslations } from "next-intl";
import { Controller } from "react-hook-form";
import { TCheckoutErrorKey } from "../../schema/checkout.schema";
import useContainer from "./useContainer";

const UploadProof = () => {
  const t = useTranslations("Checkout.UploadProof");
  const tv = useTranslations("Checkout.Validation");
  const { form, preview, handleDrop, clearPreview } = useContainer();
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

      {/* transaction number */}
      <Stack gap={8}>
        <Controller
          control={form.control}
          name="transaction_no"
          render={({ field, fieldState }) => (
            <TextInput
              {...field}
              label={t("transaction_no")}
              description={t("transaction_no_desc")}
              placeholder={t("transaction_no_placeholder")}
              type="number"
              size="md"
              radius={10}
              error={errorText(fieldState.error?.message)}
            />
          )}
        />
        <details className="group! rounded-lg! bg-gray-50! px-3! py-2!">
          <summary className="flex! cursor-pointer! list-none! items-center! justify-between! text-xs! font-semibold! text-gray-600! [&::-webkit-details-marker]:hidden!">
            {t("where_find")}
            <CaretDownIcon
              size={12}
              weight="bold"
              className="transition-transform! duration-200! group-open:rotate-180!"
            />
          </summary>
          <Image
            src="/assets/images/kpay_last_6_ditit.png"
            alt={t("where_find_alt")}
            radius={8}
            className="mt-2! max-w-[240px]!"
          />
        </details>
      </Stack>

      {/* screenshot */}
      <Stack gap={8}>
        <Text fw={500} size="sm">
          {t("screenshot")}
        </Text>

        {preview ? (
          <div className="flex! items-center! gap-3! rounded-xl! p-3! ring-1! ring-gray-200!">
            <Image
              src={preview.url}
              alt={t("screenshot_preview_alt")}
              w={48}
              h={48}
              radius="md"
              className="shrink-0! object-cover!"
            />
            <Stack gap={0} className="min-w-0! flex-1!">
              <Text size="sm" fw={600} lineClamp={1}>
                {preview.file.name}
              </Text>
              <Text size="xs" c="dimmed">
                {(preview.file.size / 1024).toFixed(0)} KB
              </Text>
            </Stack>
            <UnstyledButton
              onClick={clearPreview}
              aria-label={t("remove_screenshot")}
              className="flex! h-8! w-8! shrink-0! items-center! justify-center! rounded-full! text-gray-400! transition-colors! duration-200! hover:bg-gray-100! hover:text-gray-600!"
            >
              <XIcon size={16} />
            </UnstyledButton>
          </div>
        ) : (
          <Dropzone
            onDrop={handleDrop}
            onReject={() => {}}
            maxSize={5 * 1024 ** 2}
            accept={IMAGE_MIME_TYPE}
            radius={10}
            className="border! border-dashed! border-gray-300! bg-gray-50! transition-colors! duration-200! hover:bg-gray-100!"
          >
            <Stack
              align="center"
              justify="center"
              gap={8}
              mih={140}
              p={20}
              style={{ pointerEvents: "none" }}
              className="text-center!"
            >
              <UploadSimpleIcon size={26} className="text-gray-400!" />
              <Box>
                <Text size="sm" fw={600}>
                  {t("tap_upload")}
                </Text>
                <Text size="xs" c="dimmed">
                  {t("file_hint")}
                </Text>
              </Box>
            </Stack>
          </Dropzone>
        )}
      </Stack>
    </Stack>
  );
};

export default UploadProof;
