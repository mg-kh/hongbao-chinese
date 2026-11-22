"use client";

import { pluralize } from "@/utils/pluralize";
import useCart from "@/hooks/useCart";
import { Link } from "@/i18n/navigation";
import calculateDiscountPrice from "@/utils/calculateDiscountPrice";
import { currencyFormatter } from "@/utils/currencyFormatter";
import {
  Box,
  Collapse,
  Divider,
  Group,
  Stack,
  Text,
  UnstyledButton,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { CaretDownIcon, PencilSimpleIcon } from "@phosphor-icons/react";
import { SHOP_TYPE_META } from "../../../types/shop.type";

const money = (value: number) =>
  currencyFormatter({ value, currencySample: "MMK" });

/** Keeps the cart contents and total visible through every checkout step. */
const CheckoutSummary = () => {
  const { items, count, total, discountTotal, promoTotal, getItemPromo } =
    useCart();
  const [open, { toggle }] = useDisclosure(false);

  return (
    <Box className="rounded-2xl! bg-white! ring-1! ring-gray-200! overflow-hidden!">
      <UnstyledButton
        onClick={toggle}
        className="w-full! flex! items-center! justify-between! gap-3! bg-hongbao-red-50/60! p-4!"
      >
        <Group gap={10} wrap="nowrap" className="min-w-0!">
          <Text
            size="10px"
            fw={700}
            c="hongbao-red-600"
            className="uppercase! tracking-[0.08em]!"
          >
            Order
          </Text>
          <Text fw={700} size="sm" lineClamp={1}>
            {pluralize(count, "item")}
          </Text>
        </Group>
        <Group gap={10} wrap="nowrap" className="shrink-0!">
          <Text fw={800} size="sm" c="hongbao-red-600">
            {money(total)}
          </Text>
          <CaretDownIcon
            size={14}
            weight="bold"
            className={`text-hongbao-red-600! transition-transform! duration-200! ${open ? "rotate-180!" : ""}`}
          />
        </Group>
      </UnstyledButton>

      <Collapse expanded={open}>
        <Box className="px-4! pb-4!">
          <Divider color="gray.2" mb={12} />
          <Stack gap={10}>
            {items.map(({ product, months }) => {
              const m = months ?? 1;
              const price = product.isFree
                ? 0
                : calculateDiscountPrice(product.price, product.discount) * m;
              const itemPromo = getItemPromo(product.id);
              return (
                <Group
                  key={product.id}
                  justify="space-between"
                  gap={10}
                  wrap="nowrap"
                >
                  <Stack gap={0} className="min-w-0!">
                    <Text size="sm" fw={600} lineClamp={1}>
                      {product.title}
                    </Text>
                    <Text size="xs" c="gray.5">
                      {SHOP_TYPE_META[product.type].label}
                      {product.level ? ` · ${product.level}` : ""}
                      {!product.isFree && ` · ${pluralize(m, "month")}`}
                    </Text>
                    {itemPromo && (
                      <Text size="xs" c="hongbao-red-600" fw={600}>
                        Promo {itemPromo.promo.code} · -
                        {money(itemPromo.discount)}
                      </Text>
                    )}
                  </Stack>
                  <Text size="sm" fw={600} className="shrink-0!">
                    {product.isFree ? "Free" : money(price)}
                  </Text>
                </Group>
              );
            })}

            {discountTotal > 0 && (
              <Group justify="space-between">
                <Text size="xs" c="gray.6">
                  Discounts
                </Text>
                <Text size="xs" fw={600} c="hongbao-red">
                  -{money(discountTotal)}
                </Text>
              </Group>
            )}

            {promoTotal > 0 && (
              <Group justify="space-between">
                <Text size="xs" c="gray.6">
                  Promo codes
                </Text>
                <Text size="xs" fw={600} c="hongbao-red">
                  -{money(promoTotal)}
                </Text>
              </Group>
            )}

            <Divider color="gray.2" />
            <Group justify="space-between">
              <Text size="sm" fw={700}>
                Total
              </Text>
              <Text size="sm" fw={800} c="hongbao-red-600">
                {money(total)}
              </Text>
            </Group>

            <Link
              href="/shop/cart"
              className="flex! items-center! gap-1.5! w-fit! no-underline! text-hongbao-red-600! hover:underline!"
            >
              <PencilSimpleIcon size={13} weight="bold" />
              <Text size="xs" fw={700}>
                Edit cart
              </Text>
            </Link>
          </Stack>
        </Box>
      </Collapse>
    </Box>
  );
};

export default CheckoutSummary;
