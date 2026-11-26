"use client";

import useCart from "@/hooks/useCart";
import { currencyFormatter } from "@/utils/currencyFormatter";
import { Box, CopyButton, Group, Image, Stack, Text } from "@mantine/core";
import { CheckIcon, CopyIcon } from "@phosphor-icons/react";
import { useTranslations } from "next-intl";
import { Controller, useFormContext } from "react-hook-form";

interface PayAccount {
  /** Must match a value in `PaymentSchema.payment_type`. */
  id: string;
  label: string;
  holder: string;
  account: string;
  /** Translation key under `Checkout.PaymentMethod`. */
  accountLabelKey: "phone";
  qr?: string;
}

// Add or edit accounts here - remember to update the enum in
// `../../schema/checkout.schema.ts` to match the ids.
const ACCOUNTS: PayAccount[] = [
  {
    id: "kpay",
    label: "KBZ Pay",
    holder: "Kaung Htet Lynn",
    account: "0937605832",
    accountLabelKey: "phone",
    qr: "/assets/images/kbz_pay_qr.png",
  },
  {
    id: "wavepay",
    label: "Wave Pay",
    holder: "Kaung Htet Lynn",
    account: "0764401234",
    accountLabelKey: "phone",
  },
];

const Row: React.FC<{ label: string; children: React.ReactNode }> = ({
  label,
  children,
}) => (
  <Group justify="space-between" gap={12} wrap="nowrap">
    <Text size="sm" c="gray.6" className="shrink-0!">
      {label}
    </Text>
    {children}
  </Group>
);

const PaymentMethod = () => {
  const t = useTranslations("Checkout.PaymentMethod");
  const { control } = useFormContext();
  const { total } = useCart();

  return (
    <Stack gap={16}>
      <Stack gap={2}>
        <Text fw={700} size="md">
          {t("title")}
        </Text>
        <Text size="sm" c="gray.6">
          {t("subtitle")}
        </Text>
      </Stack>

      <Group
        justify="space-between"
        wrap="nowrap"
        className="rounded-xl! bg-hongbao-red-50! px-4! py-3!"
      >
        <Text size="sm" fw={600} c="gray.7">
          {t("amount_to_pay")}
        </Text>
        <Text fw={800} c="hongbao-red" className="text-xl!">
          {currencyFormatter({ value: total, currencySample: "MMK" })}
        </Text>
      </Group>

      <Controller
        control={control}
        name="payment_type"
        render={({ field: { value, onChange } }) => {
          const selected = ACCOUNTS.find((a) => a.id === value) ?? ACCOUNTS[0];

          return (
            <Stack gap={12}>
              {/* account picker */}
              <div className="flex! gap-2! overflow-x-auto! [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {ACCOUNTS.map((a) => {
                  const active = selected.id === a.id;
                  return (
                    <button
                      key={a.id}
                      type="button"
                      onClick={() => onChange(a.id)}
                      aria-pressed={active}
                      className={`shrink-0! rounded-full! border! px-4! py-1.5! text-xs! font-bold! cursor-pointer! transition-colors! duration-200! ${
                        active
                          ? "border-hongbao-red-500! bg-hongbao-red-500! text-white!"
                          : "border-gray-200! bg-surface! text-gray-600! hover:border-hongbao-red-200! hover:text-hongbao-red-600! dark:hover:text-night-red!"
                      }`}
                    >
                      {a.label}
                    </button>
                  );
                })}
              </div>

              {/* selected account */}
              <Box className="rounded-xl! p-4! ring-1! ring-gray-200!">
                <Text
                  size="11px"
                  fw={700}
                  c="gray.5"
                  className="uppercase! tracking-[0.1em]!"
                >
                  {t("transfer_to")}
                </Text>

                <div className="mt-3! flex! flex-col! items-center! gap-4! sm:flex-row! sm:items-start!">
                  {selected.qr && (
                    <Image
                      src={selected.qr}
                      alt={t("qr_alt", { wallet: selected.label })}
                      className="w-full! max-w-[172px]! shrink-0! rounded-lg! ring-1! ring-gray-200!"
                    />
                  )}

                  <Stack gap={12} className="w-full! min-w-0!">
                    <Row label={t("wallet")}>
                      <Text fw={700} size="sm">
                        {selected.label}
                      </Text>
                    </Row>
                    <Row label={t("account_name")}>
                      <Text fw={700} size="sm" lineClamp={1}>
                        {selected.holder}
                      </Text>
                    </Row>
                    <Row label={t(selected.accountLabelKey)}>
                      <Group gap={6} wrap="nowrap" className="min-w-0!">
                        <Text fw={700} size="sm" lineClamp={1}>
                          {selected.account}
                        </Text>
                        <CopyButton value={selected.account}>
                          {({ copied, copy }) => (
                            <button
                              type="button"
                              onClick={copy}
                              aria-label={t("copy_aria", {
                                label: t(selected.accountLabelKey),
                              })}
                              className={`flex! h-7! w-7! shrink-0! items-center! justify-center! rounded-md! transition-colors! duration-150! cursor-pointer! ${
                                copied
                                  ? "text-green-600! dark:text-night-green!"
                                  : "text-gray-400! hover:bg-gray-100! hover:text-hongbao-red-600! dark:hover:text-night-red!"
                              }`}
                            >
                              {copied ? (
                                <CheckIcon size={14} weight="bold" />
                              ) : (
                                <CopyIcon size={14} />
                              )}
                            </button>
                          )}
                        </CopyButton>
                      </Group>
                    </Row>
                  </Stack>
                </div>
              </Box>
            </Stack>
          );
        }}
      />
    </Stack>
  );
};

export default PaymentMethod;
