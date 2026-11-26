"use client";

import { Box, Collapse, Paper, Text, UnstyledButton } from "@mantine/core";
import {
  CourseTypeIcon,
  FlashcardTypeIcon,
  MockTestTypeIcon,
} from "@/components/icons/productTypeIcons";
import { CaretDownIcon, CreditCardIcon, InfoIcon } from "@phosphor-icons/react";
import { format } from "date-fns";
import {
  TPurchaseCardItem,
  TPurchaseCardItemType,
  TPurchaseCardOrder,
} from "@/types/purchase-order.type";
import useContainer from "@/components/PurchaseOrderCard/useContainer";
import { currencyFormatter } from "@/utils/currencyFormatter";
import { useTranslations } from "next-intl";

const typeMeta: Record<
  TPurchaseCardItemType,
  {
    labelKey: "type_course" | "type_mock_test" | "type_flashcard";
    tile: string;
    icon: React.ReactNode;
  }
> = {
  course: {
    labelKey: "type_course",
    tile: "bg-hongbao-red-50! text-hongbao-red-600! dark:text-night-red!",
    icon: <CourseTypeIcon size={14} weight="fill" />,
  },
  "mock-test": {
    labelKey: "type_mock_test",
    tile: "bg-hongbao-orange-50! text-hongbao-orange-600! dark:text-night-orange!",
    icon: <MockTestTypeIcon size={14} weight="fill" />,
  },
  flashcard: {
    labelKey: "type_flashcard",
    tile: "bg-hongbao-gold-50! text-hongbao-gold-700! dark:text-night-gold!",
    icon: <FlashcardTypeIcon size={14} weight="fill" />,
  },
};

type TCardT = ReturnType<typeof useTranslations<"Shared.PurchaseOrderCard">>;

/** "3 months" for whole months, otherwise "45 days"; `null` is lifetime. */
const durationLabel = (t: TCardT, days: number | null) => {
  if (days === null) return t("lifetime");
  if (days > 0 && days % 30 === 0) return t("months", { count: days / 30 });
  return t("days", { count: days });
};

const lineMeta = (t: TCardT, item: TPurchaseCardItem) =>
  [
    durationLabel(t, item.durationDays),
    item.quantity > 1 ? `×${item.quantity}` : null,
  ]
    .filter(Boolean)
    .join(" · ");

interface Props {
  order: TPurchaseCardOrder;
  /** Status badge - wording differs between customer and admin views. */
  badge: React.ReactNode;
  /** Line under the order number; defaults to the order date. */
  subtitle?: React.ReactNode;
  /** Order-level actions next to the total (e.g. Approve / Reject). */
  action?: React.ReactNode;
  /** View-specific content inside the expandable details panel. */
  children?: React.ReactNode;
  /** Background + border classes for the card surface (e.g. a status tint). */
  surfaceClassName?: string;
}

/**
 * One purchase order: summary (items, total, reject reason) always visible,
 * details expandable. Shared by the customer purchase history and the
 * dashboard purchases lists.
 */
const PurchaseOrderCard: React.FC<Props> = ({
  order,
  badge,
  subtitle,
  action,
  children,
  surfaceClassName = "border-gray-200! bg-surface!",
}) => {
  const { expanded, toggle, payment, hasDiscount } = useContainer(order);
  const t = useTranslations("Shared.PurchaseOrderCard");
  const money = (value: number, currency = "MMK") =>
    value <= 0
      ? t("free")
      : currencyFormatter({ value, currencySample: currency });

  return (
    <Paper
      withBorder
      bdrs={12}
      p={0}
      className={`overflow-hidden! ${surfaceClassName}`}
    >
      {/* ---------- always-visible summary ---------- */}
      <Box className="px-3! pt-3! pb-2.5! sm:px-4!">
        <div className="flex items-start justify-between gap-2">
          <Box className="min-w-0!">
            <Text
              size="sm"
              fw={700}
              lh={1.3}
              className="font-mono! tracking-tight! text-gray-900! select-all!"
              lineClamp={1}
            >
              {order.reference}
            </Text>
            <Text size="11px" c="gray.5" lineClamp={1}>
              {subtitle ?? format(new Date(order.createdAt), "d MMM yyyy")}
            </Text>
          </Box>
          <Box className="shrink-0!">{badge}</Box>
        </div>

        <div className="mt-2.5 flex flex-col gap-2">
          {order.items.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between gap-2"
            >
              <div className="flex min-w-0 items-center gap-2">
                <Box
                  className={`flex! items-center! justify-center! w-7! h-7! rounded-lg! shrink-0! ${typeMeta[item.type].tile}`}
                >
                  {typeMeta[item.type].icon}
                </Box>
                <Box className="min-w-0!">
                  <Text
                    size="sm"
                    fw={600}
                    lh={1.3}
                    lineClamp={1}
                    className="text-gray-900!"
                  >
                    {item.title}
                  </Text>
                  <div className="mt-0.5 flex min-w-0 items-center gap-1.5">
                    <span className="shrink-0 rounded bg-gray-100 px-1.5 py-0.5 text-[10px] font-bold text-gray-600">
                      {t(typeMeta[item.type].labelKey)}
                    </span>
                    <Text size="11px" c="gray.5" lineClamp={1}>
                      {lineMeta(t, item)}
                    </Text>
                  </div>
                </Box>
              </div>
              <Text size="sm" fw={600} className="shrink-0! text-gray-700!">
                {money(item.lineTotal, order.currency)}
              </Text>
            </div>
          ))}
        </div>

        {/* why it was declined - shown up front so it's seen without expanding */}
        {order.rejectReason && (
          <div className="mt-2.5 flex items-start gap-1.5 rounded-lg bg-black/[0.04] dark:bg-white/[0.05] px-2.5 py-1.5">
            <InfoIcon
              size={14}
              weight="fill"
              className="mt-0.5! shrink-0! text-gray-500!"
            />
            <Text
              size="xs"
              c="gray.7"
              className="min-w-0! whitespace-pre-line! break-words!"
            >
              <Text component="span" size="xs" fw={700}>
                {t("declined")}{" "}
              </Text>
              {order.rejectReason}
            </Text>
          </div>
        )}
      </Box>

      {/* ---------- footer: total · actions · details toggle ---------- */}
      <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2 border-t border-gray-100 px-3 py-2 sm:px-4">
        <div className="flex items-baseline gap-1.5">
          <Text size="11px" fw={600} c="gray.5" tt="uppercase">
            {t("total")}
          </Text>
          <Text size="sm" fw={800} c="var(--hb-accent-strong)">
            {money(order.total, order.currency)}
          </Text>
        </div>
        <div className="flex items-center gap-2">
          {action}
          <UnstyledButton
            onClick={toggle}
            aria-expanded={expanded}
            className="flex! items-center! gap-1! rounded-md! px-1.5! py-1! text-gray-500! transition-colors! duration-150! hover:bg-gray-100! hover:text-gray-700!"
          >
            <Text size="xs" fw={600}>
              {expanded ? t("hide") : t("details")}
            </Text>
            <CaretDownIcon
              size={12}
              weight="bold"
              className={`transition-transform! duration-200! ${expanded ? "rotate-180!" : ""}`}
            />
          </UnstyledButton>
        </div>
      </div>

      {/* ---------- expanded detail ---------- */}
      <Collapse expanded={expanded}>
        <div className="flex flex-col gap-3 border-t border-gray-100 bg-gray-50/50 px-3 py-3 sm:px-4">
          <div className="flex min-w-0 items-center gap-1.5">
            <CreditCardIcon size={14} className="text-gray-400! shrink-0!" />
            <Text size="xs" c="gray.6" lineClamp={1} className="select-all!">
              {payment}
            </Text>
          </div>

          {/* breakdown - only worth showing when a discount changed the total */}
          {hasDiscount && (
            <div className="flex flex-col gap-1">
              <div className="flex justify-between">
                <Text size="xs" c="gray.6">
                  {t("subtotal")}
                </Text>
                <Text size="xs" fw={600} c="gray.7">
                  {money(order.subtotal, order.currency)}
                </Text>
              </div>
              <div className="flex justify-between">
                <Text size="xs" c="gray.6">
                  {t("discount")}
                </Text>
                <Text size="xs" fw={600} c="var(--hb-accent-text)">
                  -{money(order.subtotal - order.total, order.currency)}
                </Text>
              </div>
            </div>
          )}
          {children}
        </div>
      </Collapse>
    </Paper>
  );
};

export default PurchaseOrderCard;
