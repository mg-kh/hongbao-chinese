import { TShopProduct } from "@/app/[locale]/shop/types/shop.type";
import calculateDiscountPrice from "@/utils/calculateDiscountPrice";
import { currencyFormatter } from "@/utils/currencyFormatter";
import { Badge, Group, Text } from "@mantine/core";
import { IconRosetteDiscount } from "@tabler/icons-react";

interface Props {
  product: Pick<TShopProduct, "price" | "discount" | "isFree">;
  /**
   * Access duration in months. `1` (the default) shows the per-month price;
   * anything higher shows the total for that many months.
   */
  months?: number;
  size?: "md" | "lg";
}

const money = (value: number) =>
  currencyFormatter({ value, currencySample: "MMK" });

/** Price display for any storefront product - one month by default. */
const ProductPrice: React.FC<Props> = ({
  product,
  months = 1,
  size = "lg",
}) => {
  const bigClass = size === "lg" ? "text-2xl!" : "text-lg!";

  if (product.isFree) {
    return (
      <Text c="hongbao-red" fw={800} className={bigClass}>
        Free
      </Text>
    );
  }

  const span = Math.max(1, months);
  const hasDiscount = product.discount > 0;
  const perMonth = calculateDiscountPrice(product.price, product.discount);
  const lineTotal = perMonth * span;
  const originalTotal = product.price * span;

  return (
    <Group gap={8} align="center" wrap="wrap">
      {hasDiscount && (
        <Badge
          color="hongbao-red"
          radius="sm"
          leftSection={<IconRosetteDiscount size={13} />}
        >
          {product.discount}% off
        </Badge>
      )}

      {hasDiscount && (
        <Text
          fw={700}
          c="gray.5"
          td="line-through"
          className={size === "lg" ? "text-base!" : "text-sm!"}
        >
          {money(originalTotal)}
        </Text>
      )}

      <Group gap={4} align="baseline" wrap="nowrap">
        <Text fw={800} c="hongbao-red" className={bigClass}>
          {money(lineTotal)}
        </Text>
        <Text size="xs" fw={600} c="gray.5">
          {span === 1 ? "/ month" : `for ${span} months`}
        </Text>
      </Group>
    </Group>
  );
};

export default ProductPrice;
