"use client";

import { pluralize } from "@/utils/pluralize";
import calculateDiscountPrice from "@/utils/calculateDiscountPrice";
import { currencyFormatter } from "@/utils/currencyFormatter";
import {
  Box,
  Button,
  Checkbox,
  Divider,
  Group,
  Stack,
  Text,
} from "@mantine/core";
import { IconArrowRight, IconShieldCheck } from "@tabler/icons-react";
import { TCartItem } from "../../../types/shop.type";

interface Props {
  items: TCartItem[];
  count: number;
  subtotal: number;
  discountTotal: number;
  promoTotal: number;
  total: number;
  agreedToTerms: boolean;
  onAgreedToTermsChange: (agreed: boolean) => void;
  onCheckout: () => void;
}

const money = (value: number) =>
  value > 0 ? currencyFormatter({ value, currencySample: "MMK" }) : "0 MMK";

const CartSummary: React.FC<Props> = ({
  items,
  count,
  subtotal,
  discountTotal,
  promoTotal,
  total,
  agreedToTerms,
  onAgreedToTermsChange,
  onCheckout,
}) => {
  return (
    <Stack
      gap={16}
      p={{ base: 20, md: 24 }}
      className="rounded-2xl! bg-white! ring-1! ring-gray-200! shadow-sm!"
    >
      <Text fw={800} size="lg">
        Order summary
      </Text>

      {/* per-course price breakdown: pure per-month price, then the total for the chosen duration */}
      <Stack gap={12}>
        {items.map(({ product, months }) => {
          const m = Math.max(1, months ?? 1);
          const discountedPerMonth = product.isFree
            ? 0
            : calculateDiscountPrice(product.price, product.discount);
          const lineTotal = discountedPerMonth * m;

          return (
            <Stack key={product.id} gap={2}>
              <Group justify="space-between" gap={8} wrap="nowrap">
                <Text
                  size="sm"
                  fw={600}
                  lineClamp={1}
                  className="min-w-0! text-gray-900!"
                >
                  {product.title}
                </Text>
                <Text size="sm" fw={700} className="shrink-0!">
                  {product.isFree ? "Free" : money(lineTotal)}
                </Text>
              </Group>
              <Group justify="space-between" gap={8} wrap="nowrap">
                <Text size="xs" c="gray.5">
                  {product.isFree
                    ? "Free access"
                    : product.lifetime
                      ? "Lifetime access"
                      : `${money(product.price)} / mo`}
                </Text>
                {!product.isFree && !product.lifetime && (
                  <Text size="xs" c="gray.5">
                    × {pluralize(m, "month")}
                  </Text>
                )}
              </Group>
            </Stack>
          );
        })}
      </Stack>

      <Divider color="gray.2" />

      <Stack gap={10}>
        <Group justify="space-between">
          <Text size="sm" c="gray.6">
            Items ({count})
          </Text>
          <Text size="sm" fw={600}>
            {money(subtotal + discountTotal)}
          </Text>
        </Group>
        {discountTotal > 0 && (
          <Group justify="space-between">
            <Text size="sm" c="gray.6">
              Discounts
            </Text>
            <Text size="sm" fw={600} c="hongbao-red">
              -{money(discountTotal)}
            </Text>
          </Group>
        )}
        {promoTotal > 0 && (
          <Group justify="space-between">
            <Text size="sm" c="gray.6">
              Promo codes
            </Text>
            <Text size="sm" fw={600} c="hongbao-red">
              -{money(promoTotal)}
            </Text>
          </Group>
        )}
      </Stack>

      <Divider color="gray.2" />

      <Group justify="space-between" align="end">
        <Text fw={700}>Total</Text>
        <Text fw={800} className="text-xl!" c="hongbao-red">
          {money(total)}
        </Text>
      </Group>

      {discountTotal + promoTotal > 0 && (
        <Box className="rounded-lg! bg-green-50! px-3! py-2! text-center!">
          <Text size="xs" fw={700} c="green.7">
            You&apos;re saving {money(discountTotal + promoTotal)}
          </Text>
        </Box>
      )}

      <Checkbox
        checked={agreedToTerms}
        onChange={(e) => onAgreedToTermsChange(e.currentTarget.checked)}
        color="hongbao-red"
        label={
          <Text size="xs" c="gray.6">
            I agree to the Terms and Conditions and Privacy Policy
          </Text>
        }
      />

      <Button
        onClick={onCheckout}
        disabled={!agreedToTerms}
        size="md"
        radius="xl"
        color="hongbao-red"
        fullWidth
        rightSection={<IconArrowRight size={16} />}
      >
        Proceed to checkout
      </Button>

      <Group gap={8} wrap="nowrap" align="start">
        <IconShieldCheck
          size={15}
          className="text-gray-400! shrink-0! mt-0.5!"
        />
        <Text size="xs" c="gray.5" className="leading-relaxed!">
          Payment is by bank transfer and reviewed by our team before your
          purchase is activated.
        </Text>
      </Group>
    </Stack>
  );
};

export default CartSummary;
