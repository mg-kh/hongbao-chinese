"use client";

import calculateDiscountPrice from "@/utils/calculateDiscountPrice";
import { currencyFormatter } from "@/utils/currencyFormatter";
import {
  Box,
  Button,
  Group,
  Stack,
  Text,
  TextInput,
  UnstyledButton,
} from "@mantine/core";
import { ImageIcon } from "@phosphor-icons/react";
import { IconTag, IconTrash, IconX } from "@tabler/icons-react";
import {
  SHOP_TYPE_META,
  ShopProductType,
  TShopProduct,
} from "../../../types/shop.type";
import MonthStepper from "../MonthStepper/MonthStepper";
import useContainer from "./useContainer";

const gradientByType: Record<ShopProductType, string> = {
  course: "from-hongbao-red-500! to-hongbao-maroon-600!",
  "mock-test": "from-hongbao-gold-500! to-hongbao-orange-600!",
};

const money = (value: number) =>
  currencyFormatter({ value, currencySample: "MMK" });

interface Props {
  product: TShopProduct;
  months: number;
  onRemove: (id: string) => void;
  onMonthsChange: (id: string, months: number) => void;
}

const CartLine: React.FC<Props> = ({
  product,
  months,
  onRemove,
  onMonthsChange,
}) => {
  const {
    itemPromo,
    promoOpen,
    togglePromo,
    code,
    setCode,
    error,
    apply,
    remove,
    isApplyingPromo,
    isRemovingPromo,
  } = useContainer(product.id);

  const span = Math.max(1, months);
  const perMonth = product.isFree
    ? 0
    : calculateDiscountPrice(product.price, product.discount);
  const lineTotal = perMonth * span - (itemPromo?.discount ?? 0);
  const hasDiscount = !product.isFree && product.discount > 0;

  return (
    <div className="flex! gap-3! py-4! sm:gap-4!">
      <Box
        className={`relative! h-20! w-20! shrink-0! overflow-hidden! rounded-xl! bg-gradient-to-br! sm:h-24! sm:w-24! ${gradientByType[product.type]}`}
      >
        <Box className="absolute! inset-0! flex! items-center! justify-center!">
          <ImageIcon size={24} weight="light" className="text-white/60!" />
        </Box>
      </Box>

      <div className="flex! min-w-0! flex-1! flex-col!">
        <div className="flex! items-start! justify-between! gap-2!">
          <Text fw={600} size="sm" lineClamp={2} className="text-gray-900!">
            {product.title}
          </Text>
          <UnstyledButton
            onClick={() => onRemove(product.id)}
            aria-label={`Remove ${product.title}`}
            className="flex! h-8! w-8! shrink-0! items-center! justify-center! rounded-full! text-gray-400! transition-colors! duration-200! hover:bg-red-50! hover:text-red-600!"
          >
            <IconTrash size={16} />
          </UnstyledButton>
        </div>

        <div className="mt-1! flex! flex-wrap! items-center! gap-1.5!">
          <span className="rounded! bg-gray-100! px-1.5! py-0.5! text-[10px]! font-bold! text-gray-600!">
            {SHOP_TYPE_META[product.type].label}
          </span>
          {product.level && (
            <span className="rounded! bg-hongbao-red-50! px-1.5! py-0.5! text-[10px]! font-bold! text-hongbao-red-700!">
              {product.level}
            </span>
          )}
        </div>

        {!product.isFree && (
          <Text size="11px" c="gray.5" className="mt-1.5!">
            {money(perMonth)} <span className="text-gray-400!">/ month</span>
          </Text>
        )}

        <div className="mt-auto! flex! items-end! justify-between! gap-3! pt-3!">
          {product.isFree ? (
            <span className="rounded-md! bg-gray-900! px-2! py-1! text-[11px]! font-extrabold! text-white!">
              FREE
            </span>
          ) : (
            <MonthStepper
              value={span}
              onChange={(m) => onMonthsChange(product.id, m)}
            />
          )}

          <Stack gap={0} align="end">
            {hasDiscount && (
              <Text size="11px" c="gray.5" td="line-through" fw={500}>
                {money(product.price * span)}
              </Text>
            )}
            <Text fw={800} c="hongbao-red" className="text-[15px]!">
              {product.isFree ? "Free" : money(Math.max(lineTotal, 0))}
            </Text>
          </Stack>
        </div>

        {!product.isFree && (
          <Box className="mt-3! border-t! border-gray-100! pt-3!">
            {itemPromo ? (
              <Group
                justify="space-between"
                wrap="nowrap"
                gap={8}
                p={8}
                className="rounded-lg! bg-hongbao-red-50! ring-1! ring-hongbao-red-100!"
              >
                <Group gap={6} wrap="nowrap" className="min-w-0!">
                  <IconTag
                    size={13}
                    className="text-hongbao-red-600! shrink-0!"
                  />
                  <Text size="xs" fw={700} c="hongbao-red.7" lineClamp={1}>
                    {itemPromo.promo.code}
                  </Text>
                  <Text size="11px" c="gray.6" lineClamp={1}>
                    -{money(itemPromo.discount)}
                  </Text>
                </Group>
                <UnstyledButton
                  onClick={remove}
                  disabled={isRemovingPromo}
                  aria-label="Remove promo code"
                  className="flex! items-center! justify-center! shrink-0! w-7! h-7! rounded-full! text-gray-500! hover:bg-white! hover:text-hongbao-red-600! transition-colors! duration-200! disabled:opacity-50! disabled:cursor-not-allowed!"
                >
                  <IconX size={13} />
                </UnstyledButton>
              </Group>
            ) : promoOpen ? (
              <Stack gap={6}>
                <Group gap={8} wrap="nowrap" align="start">
                  <TextInput
                    value={code}
                    onChange={(e) => setCode(e.currentTarget.value)}
                    onKeyDown={(e) => e.key === "Enter" && apply()}
                    placeholder="Promo code"
                    size="xs"
                    radius="md"
                    aria-label="Promo code"
                    error={!!error}
                    disabled={isApplyingPromo}
                    autoFocus
                    className="flex-1!"
                    classNames={{
                      input: "uppercase! placeholder:normal-case!",
                    }}
                  />
                  <Button
                    onClick={apply}
                    disabled={!code.trim() || isApplyingPromo}
                    loading={isApplyingPromo}
                    size="xs"
                    radius="md"
                    variant="light"
                    color="hongbao-red"
                  >
                    Apply
                  </Button>
                </Group>
                {error && (
                  <Text size="xs" c="red.6">
                    {error}
                  </Text>
                )}
              </Stack>
            ) : (
              <UnstyledButton
                onClick={togglePromo}
                className="flex! items-center! gap-1.5! text-xs! font-semibold! text-hongbao-red-600! transition-colors! duration-200! hover:underline!"
              >
                <IconTag size={13} />
                Use promo code
              </UnstyledButton>
            )}
          </Box>
        )}
      </div>
    </div>
  );
};

export default CartLine;
