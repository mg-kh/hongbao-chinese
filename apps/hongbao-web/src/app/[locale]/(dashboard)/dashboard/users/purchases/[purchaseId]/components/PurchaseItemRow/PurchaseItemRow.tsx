import {
  PURCHASE_ITEM_TYPE_LABEL,
  TPurchaseCardItem,
} from "@/types/purchase-order.type";
import { durationLabel } from "@/utils/purchaseOrder";
import { Text } from "@mantine/core";
import {
  CourseTypeIcon,
  FlashcardTypeIcon,
  MockTestTypeIcon,
} from "@/components/icons/productTypeIcons";

interface Props {
  item: TPurchaseCardItem;
  /** Name captured at checkout, shown when it differs from the live title. */
  checkoutName?: string;
  lineTotal: string;
  /** "5,000 MMK × 2" - only for quantity > 1. */
  unitBreakdown?: string;
}

/** One order line on the purchase detail page. */
const PurchaseItemRow: React.FC<Props> = ({
  item,
  checkoutName,
  lineTotal,
  unitBreakdown,
}) => {
  const isMock = item.type === "mock-test";
  const isFlashcard = item.type === "flashcard";

  return (
    <div className="flex items-start justify-between gap-3 py-3 first:pt-0 last:pb-0">
      <div className="flex min-w-0 items-start gap-2.5">
        <div
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
            isMock
              ? "bg-hongbao-orange-50 text-hongbao-orange-600 dark:text-night-orange"
              : isFlashcard
                ? "bg-hongbao-gold-50 text-hongbao-gold-700 dark:text-night-gold"
                : "bg-hongbao-red-50 text-hongbao-red-600 dark:text-night-red"
          }`}
        >
          {isMock ? (
            <MockTestTypeIcon size={16} weight="fill" />
          ) : isFlashcard ? (
            <FlashcardTypeIcon size={16} weight="fill" />
          ) : (
            <CourseTypeIcon size={16} weight="fill" />
          )}
        </div>
        <div className="flex min-w-0 flex-col gap-1">
          <Text size="sm" fw={600} c="gray.9" lh={1.3}>
            {item.title}
          </Text>
          {checkoutName && (
            <Text size="xs" c="gray.5">
              At checkout: {checkoutName}
            </Text>
          )}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="rounded bg-gray-100 px-1.5 py-0.5 text-[10px] font-bold text-gray-600">
              {PURCHASE_ITEM_TYPE_LABEL[item.type]}
            </span>
            <span className="rounded bg-gray-100 px-1.5 py-0.5 text-[10px] font-bold text-gray-600">
              {durationLabel(item.durationDays)}
            </span>
            {item.productId ? (
              <Text size="11px" c="gray.5" className="font-mono! select-all!">
                {item.productId}
              </Text>
            ) : (
              <Text size="11px" c="gray.5" fs="italic">
                Product deleted
              </Text>
            )}
          </div>
        </div>
      </div>
      <div className="flex shrink-0 flex-col items-end">
        <Text size="sm" fw={700} c="gray.8">
          {lineTotal}
        </Text>
        {unitBreakdown && (
          <Text size="xs" c="gray.5">
            {unitBreakdown}
          </Text>
        )}
      </div>
    </div>
  );
};

export default PurchaseItemRow;
