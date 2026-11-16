"use client";

import { Link } from "@/i18n/navigation";
import PriceText from "@/components/MiscellaneousComponents/PriceText/PriceText";
import useCart from "@/hooks/useCart";
import { Text } from "@mantine/core";
import { useMounted } from "@mantine/hooks";
import {
  BookOpenIcon,
  ClipboardTextIcon,
  ImageIcon,
} from "@phosphor-icons/react";
import {
  IconCheck,
  IconShoppingBagPlus,
  IconStarFilled,
} from "@tabler/icons-react";
import {
  SHOP_TYPE_META,
  ShopProductType,
  TShopProduct,
} from "../../../../types/shop.type";
import {
  formatCompact,
  productRating,
  productSold,
} from "../../../../utils/productSignals";

const typeAccent: Record<
  ShopProductType,
  { gradient: string; icon: React.ReactNode }
> = {
  course: {
    gradient: "from-hongbao-red-500! to-hongbao-maroon-600!",
    icon: <BookOpenIcon size={12} weight="fill" />,
  },
  "mock-test": {
    gradient: "from-hongbao-gold-500! to-hongbao-orange-600!",
    icon: <ClipboardTextIcon size={12} weight="fill" />,
  },
};

interface Props {
  product: TShopProduct;
}

const ProductCard: React.FC<Props> = ({ product }) => {
  const { isInCart, toggleItem } = useCart();
  const accent = typeAccent[product.type];
  // Cart state lives in localStorage, so it's only trustworthy after mount.
  const mounted = useMounted();
  const inCart = mounted && isInCart(product.id);

  const hasDiscount = !product.isFree && product.discount > 0;
  const rating = productRating(product.id);
  const sold = productSold(product.id);

  const media = (
    <div
      className={`relative! aspect-[4/3]! w-full! bg-gradient-to-br! ${accent.gradient}`}
    >
      <div className="absolute! inset-0! bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.28)_1px,transparent_0)]! bg-[length:16px_16px]!" />
      <div className="absolute! inset-0! flex! items-center! justify-center!">
        <ImageIcon size={34} weight="light" className="text-white/50!" />
      </div>

      <span className="absolute! left-2! top-2! inline-flex! items-center! gap-1! rounded-md! bg-white/95! px-1.5! py-0.5! text-[10px]! font-bold! text-gray-700!">
        {accent.icon}
        {SHOP_TYPE_META[product.type].label}
      </span>

      {product.isFree ? (
        <span className="absolute! right-0! top-2! rounded-l-md! bg-gray-900! px-2! py-0.5! text-[11px]! font-extrabold! text-white!">
          FREE
        </span>
      ) : (
        hasDiscount && (
          <span className="absolute! right-0! top-2! rounded-l-md! bg-hongbao-gold-500! px-2! py-0.5! text-[11px]! font-extrabold! text-white!">
            -{product.discount}%
          </span>
        )
      )}
    </div>
  );

  const body = (
    <div className="flex! flex-col! gap-1.5! p-3!">
      <Text
        size="sm"
        fw={500}
        lineClamp={2}
        className="min-h-[2.5em]! leading-snug! text-gray-800!"
      >
        {product.title}
      </Text>

      {product.level && (
        <span className="w-fit! rounded! bg-hongbao-red-50! px-1.5! py-0.5! text-[10px]! font-bold! text-hongbao-red-700!">
          {product.level}
        </span>
      )}

      <PriceText
        size="sm"
        data={{
          price: product.price,
          perTime: 1,
          isFree: !!product.isFree,
        }}
      />

      <div className="mt-0.5! flex! items-center! gap-1! text-[11px]! text-gray-500!">
        <IconStarFilled size={11} className="text-hongbao-gold-500!" />
        <span className="font-semibold!">{rating.toFixed(1)}</span>
        <span className="text-gray-300!">|</span>
        <span>{formatCompact(sold)} sold</span>
      </div>
    </div>
  );

  return (
    <div className="group! flex! h-full! flex-col! overflow-hidden! rounded-xl! bg-white! ring-1! ring-gray-200! transition-all! duration-200! ease-out! hover:-translate-y-0.5! hover:shadow-lg! hover:ring-hongbao-red-200!">
      {product.detailHref ? (
        <Link
          href={product.detailHref}
          className="block! flex-1! no-underline!"
          aria-label={product.title}
        >
          {media}
          {body}
        </Link>
      ) : (
        <div className="flex-1!">
          {media}
          {body}
        </div>
      )}

      <div className="p-3! pt-0!">
        <button
          type="button"
          onClick={() => toggleItem(product)}
          aria-label={
            inCart
              ? `Remove ${product.title} from cart`
              : `Add ${product.title} to cart`
          }
          className={`flex! w-full! items-center! justify-center! gap-1.5! rounded-lg! py-2! text-xs! font-bold! cursor-pointer! transition-colors! duration-200! ${
            inCart
              ? "bg-hongbao-red-50! text-hongbao-red-700! hover:bg-hongbao-red-100!"
              : "bg-hongbao-red-500! text-white! hover:bg-hongbao-red-600!"
          }`}
        >
          {inCart ? (
            <>
              <IconCheck size={14} stroke={3} /> In cart
            </>
          ) : (
            <>
              <IconShoppingBagPlus size={14} /> Add to cart
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
