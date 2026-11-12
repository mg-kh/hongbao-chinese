"use client";

import { Box, Image, Stack, Text, TextInput, UnstyledButton } from "@mantine/core";
import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import { CaretDownIcon, UploadSimpleIcon, XIcon } from "@phosphor-icons/react";
import { Controller } from "react-hook-form";
import useContainer from "./useContainer";

const UploadProof = () => {
  const { form, preview, handleDrop, clearPreview } = useContainer();

  return (
    <Stack gap={18}>
      <Stack gap={2}>
        <Text fw={700} size="md">
          Confirm payment
        </Text>
        <Text size="sm" c="gray.6">
          Add your transfer reference and a screenshot so we can verify it.
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
              label="Transaction number"
              description="The last 6 digits of your transfer reference"
              placeholder="6-digit number"
              type="number"
              size="md"
              radius={10}
              error={fieldState.error?.message}
            />
          )}
        />
        <details className="group! rounded-lg! bg-gray-50! px-3! py-2!">
          <summary className="flex! cursor-pointer! list-none! items-center! justify-between! text-xs! font-semibold! text-gray-600! [&::-webkit-details-marker]:hidden!">
            Where do I find this?
            <CaretDownIcon
              size={12}
              weight="bold"
              className="transition-transform! duration-200! group-open:rotate-180!"
            />
          </summary>
          <Image
            src="/assets/images/kpay_last_6_ditit.png"
            alt="The last 6 digits are shown on your payment receipt"
            radius={8}
            className="mt-2! max-w-[240px]!"
          />
        </details>
      </Stack>

      {/* screenshot */}
      <Stack gap={8}>
        <Text fw={500} size="sm">
          Payment screenshot
        </Text>

        {preview ? (
          <div className="flex! items-center! gap-3! rounded-xl! p-3! ring-1! ring-gray-200!">
            <Image
              src={preview.url}
              alt="Payment screenshot preview"
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
              aria-label="Remove screenshot"
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
                  Tap to upload a screenshot
                </Text>
                <Text size="xs" c="dimmed">
                  PNG or JPG, up to 5 MB
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
