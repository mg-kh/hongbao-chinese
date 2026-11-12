import { TShopProduct } from "@/app/[locale]/shop/types/shop.type";
import RubyButtonComponent from "@/components/Buttons/RubyButtonComponent/RubyButtonComponent";
import PriceText from "@/components/MiscellaneousComponents/PriceText/PriceText";
import { TCourseRes } from "@/hooks/global-data-fetching/useAllCourseList";
import useCart from "@/hooks/useCart";
import { Link } from "@/i18n/navigation";
import {
  Badge,
  Box,
  Button,
  Divider,
  Group,
  Paper,
  Stack,
  Text,
} from "@mantine/core";
import { useMounted } from "@mantine/hooks";
import { ImageIcon } from "@phosphor-icons/react";
import { IconCheck, IconShoppingBagPlus } from "@tabler/icons-react";
import { useMemo } from "react";

export type PricingAccent = "red" | "gold" | "orange" | "maroon" | "brown";

const accentStyles: Record<
  PricingAccent,
  {
    gradient: string;
    checkBg: string;
    checkColor: string;
    levelBadge: string;
  }
> = {
  red: {
    gradient: "from-hongbao-red-500! to-hongbao-maroon-600!",
    checkBg: "bg-hongbao-red-50!",
    checkColor: "text-hongbao-red-600!",
    levelBadge: "text-hongbao-red-700!",
  },
  gold: {
    gradient: "from-hongbao-gold-500! to-hongbao-orange-600!",
    checkBg: "bg-hongbao-gold-50!",
    checkColor: "text-hongbao-gold-700!",
    levelBadge: "text-hongbao-gold-800!",
  },
  orange: {
    gradient: "from-hongbao-orange-500! to-hongbao-red-600!",
    checkBg: "bg-hongbao-orange-50!",
    checkColor: "text-hongbao-orange-600!",
    levelBadge: "text-hongbao-orange-700!",
  },
  maroon: {
    gradient: "from-hongbao-maroon-500! to-hongbao-brown-700!",
    checkBg: "bg-hongbao-maroon-50!",
    checkColor: "text-hongbao-maroon-600!",
    levelBadge: "text-hongbao-maroon-700!",
  },
  brown: {
    gradient: "from-hongbao-brown-500! to-hongbao-maroon-700!",
    checkBg: "bg-hongbao-brown-50!",
    checkColor: "text-hongbao-brown-600!",
    levelBadge: "text-hongbao-brown-700!",
  },
};

interface Props {
  data: TCourseRes;
  accent?: PricingAccent;
}

const PricingCard: React.FC<Props> = ({ data, accent = "red" }) => {
  const styles = accentStyles[accent];
  const { isInCart, toggleItem } = useCart();
  // Cart state lives in localStorage, so it's only trustworthy after mount.
  const mounted = useMounted();
  const inCart = mounted && isInCart(data?.id);

  const shopProduct: TShopProduct = useMemo(
    () => ({
      id: data?.id,
      type: "course",
      title: data?.title,
      description: data?.description,
      level: data?.category?.name ?? "",
      // The API price covers `perTime` months; the cart sells by the month.
      price:
        data?.perTime && data.perTime > 1
          ? Math.round(data.price / data.perTime)
          : data?.price,
      discount: data?.discount ?? 0,
      isFree: data?.isFree,
      includedAssets: data?.includedAssets ?? [],
      detailHref: `/course-detail/${data?.id}`,
    }),
    [data],
  );

  return (
    <Paper
      shadow="sm"
      bdrs={28}
      withBorder
      className="h-full! overflow-hidden! border-gray-100! transition-all! duration-200! ease-out! hover:-translate-y-1! hover:shadow-xl!"
    >
      <Stack h={"100%"} gap={0}>
        {/* image placeholder */}
        <Box
          className={`relative! h-40! w-full! bg-gradient-to-br! ${styles.gradient}`}
        >
          <Box className="absolute! inset-0! bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.3)_1px,transparent_0)]! bg-[length:18px_18px]!" />

          <Box className="absolute! inset-0! flex! items-center! justify-center!">
            <ImageIcon size={44} weight="light" className="text-white/50!" />
          </Box>

          {data?.category?.name && (
            <Badge
              size="lg"
              radius="md"
              className={`absolute! top-3! left-3! bg-white/95! ${styles.levelBadge}`}
            >
              {data.category.name}
            </Badge>
          )}

          {data?.isFree ? (
            <Badge
              size="lg"
              radius="md"
              color="dark.9"
              className="absolute! top-3! right-3! text-white!"
            >
              Free
            </Badge>
          ) : (
            data?.discount > 0 && (
              <Badge
                size="lg"
                radius="md"
                color="hongbao-gold.6"
                className="absolute! top-3! right-3! text-white!"
              >
                {data.discount}% off
              </Badge>
            )
          )}
        </Box>

        <Stack p={{ base: 28, md: 34 }} gap={22} className="flex-1!">
          <Stack gap={30} className="flex-1!">
            <Stack gap={8}>
              <Text size="24px" fw={800}>
                {data?.title}
              </Text>
              <Text c={"gray.7"} size="sm" className="line-clamp-2!">
                {data?.description}
              </Text>
            </Stack>

            <PriceText data={data} />

            <Divider color="gray.2" />

            <Stack gap={10}>
              <Text fw="bold" size="sm">
                We provided:
              </Text>
              <Stack gap={8}>
                {data?.includedAssets?.map((asset) => (
                  <div key={asset} className="flex! items-center! gap-2.5!">
                    <div
                      className={`flex! items-center! justify-center! w-5! h-5! rounded-full! shrink-0! ${styles.checkBg} ${styles.checkColor}`}
                    >
                      <IconCheck size={12} stroke={3} />
                    </div>
                    <Text size="sm" c={"gray.7"}>
                      {asset}
                    </Text>
                  </div>
                ))}
              </Stack>
            </Stack>
          </Stack>

          <Group gap={10} wrap="nowrap">
            <Button
              variant="outline"
              color="hongbao-red"
              component={Link}
              href={`/course-detail/${data?.id}`}
              size="xl"
              className="flex-1!"
            >
              View Detail
            </Button>
            <RubyButtonComponent
              size="xl"
              radius="md"
              onClick={() => toggleItem(shopProduct)}
              aria-label={inCart ? "Remove from cart" : "Add to cart"}
            >
              {inCart ? (
                <IconCheck size={18} stroke={3} />
              ) : (
                <IconShoppingBagPlus size={18} />
              )}
            </RubyButtonComponent>
          </Group>
        </Stack>
      </Stack>
    </Paper>
  );
};

export default PricingCard;
