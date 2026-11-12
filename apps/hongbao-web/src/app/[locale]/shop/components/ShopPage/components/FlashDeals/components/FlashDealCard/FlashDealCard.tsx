"use client";

import useCart from "@/hooks/useCart";
import { Link } from "@/i18n/navigation";
import calculateDiscountPrice from "@/utils/calculateDiscountPrice";
import { currencyFormatter } from "@/utils/currencyFormatter";
import { Progress, Text } from "@mantine/core";
import { useMounted } from "@mantine/hooks";
import { ImageIcon } from "@phosphor-icons/react";
import { IconCheck, IconShoppingBagPlus } from "@tabler/icons-react";
import {
  ShopProductType,
  TShopProduct,
} from "../../../../../../types/shop.type";
import { productClaimedPct } from "../../../../../../utils/productSignals";

const gradientByType: Record<ShopProductType, string> = {
  course: "from-hongbao-red-500! to-hongbao-maroon-600!",
  "level-test": "from-hongbao-gold-500! to-hongbao-orange-600!",
};

const money = (value: number) =>
  currencyFormatter({ value, currencySample: "MMK" });

interface Props {
  product: TShopProduct;
}

const FlashDealCard: React.FC<Props> = ({ product }) => {
  const { isInCart, toggleItem } = useCart();
  const mounted = useMounted();
  const inCart = mounted && isInCart(product.id);
  const claimed = productClaimedPct(product.id);
  const price = calculateDiscountPrice(product.price, product.discount);

  const media = (
    <div
      className={`relative! h-[112px]! w-full! bg-gradient-to-br! ${gradientByType[product.type]}`}
    >
      <div className="absolute! inset-0! flex! items-center! justify-center!">
        <ImageIcon size={30} weight="light" className="text-white/50!" />
      </div>
      <span className="absolute! top-0! left-0! rounded-br-lg! bg-hongbao-gold-500! px-2! py-1! text-[11px]! font-extrabold! text-white!">
        -{product.discount}%
      </span>
    </div>
  );

  return (
    <div className="flex! w-[158px]! shrink-0! flex-col! overflow-hidden! rounded-xl! bg-white! ring-1! ring-gray-200! transition-shadow! duration-200! hover:shadow-lg!">
      {product.detailHref ? (
        <Link href={product.detailHref} className="block! no-underline!">
          {media}
        </Link>
      ) : (
        media
      )}

      <div className="flex! flex-1! flex-col! gap-1.5! p-2.5!">
        <Text
          size="xs"
          fw={600}
          lineClamp={2}
          className="leading-snug! text-gray-800!"
        >
          {product.title}
        </Text>

        <Text fw={800} c="hongbao-red" className="text-[15px]!">
          {money(price)}
        </Text>

        <div className="mt-0.5!">
          <Progress
            value={claimed}
            color="hongbao-red"
            size="lg"
            radius="xl"
            className="bg-hongbao-red-50!"
          />
          <Text size="10px" fw={600} c="gray.6" className="mt-1!">
            {claimed}% claimed
          </Text>
        </div>

        <button
          type="button"
          onClick={() => toggleItem(product)}
          aria-label={
            inCart
              ? `Remove ${product.title} from cart`
              : `Add ${product.title} to cart`
          }
          className={`mt-auto! flex! items-center! justify-center! gap-1! rounded-lg! py-1.5! text-[11px]! font-bold! cursor-pointer! transition-colors! duration-200! ${
            inCart
              ? "bg-hongbao-red-50! text-hongbao-red-700!"
              : "bg-hongbao-red-500! text-white! hover:bg-hongbao-red-600!"
          }`}
        >
          {inCart ? (
            <>
              <IconCheck size={13} stroke={3} /> In cart
            </>
          ) : (
            <>
              <IconShoppingBagPlus size={13} /> Add
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default FlashDealCard;
