"use client";

import useContainer from "@/app/[locale]/(dashboard)/dashboard/users/purchases/components/ApproveModal/useContainer";
import { TPurchaseActionTarget } from "@/app/[locale]/(dashboard)/dashboard/users/purchases/hooks/usePurchaseActions";
import { Button, Text } from "@mantine/core";
import {
  CourseTypeIcon,
  FlashcardTypeIcon,
  MockTestTypeIcon,
} from "@/components/icons/productTypeIcons";
import {
  CheckCircleIcon,
  CreditCardIcon,
  InfoIcon,
  WarningIcon,
} from "@phosphor-icons/react";

interface Props {
  purchase: TPurchaseActionTarget;
  onConfirm: () => void;
  onCancel: () => void;
}

/** Order summary the admin checks against the payment before approving. */
const ApproveModal: React.FC<Props> = ({ purchase, onConfirm, onCancel }) => {
  const { customer, items, total, payment, hasPayment } =
    useContainer(purchase);

  return (
    <div className="flex flex-col gap-4">
      {/* who / which order */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-50 text-green-600 dark:text-night-green">
          <CheckCircleIcon size={22} weight="fill" />
        </div>
        <div className="min-w-0">
          <Text size="sm" fw={600} c="gray.9" lineClamp={1}>
            {customer}
          </Text>
          <Text
            size="xs"
            c="gray.5"
            className="font-mono! tracking-tight! break-all!"
          >
            {purchase.orderNo}
          </Text>
        </div>
      </div>

      {/* items + total */}
      <div className="overflow-hidden rounded-xl border border-gray-200">
        <div className="flex max-h-60 flex-col divide-y divide-gray-100 overflow-y-auto">
          {items.length === 0 && (
            <Text size="sm" c="dimmed" className="px-3! py-3!">
              No items
            </Text>
          )}
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between gap-3 px-3 py-2.5"
            >
              <div className="flex min-w-0 items-center gap-2.5">
                <div
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${
                    item.type === "mock-test"
                      ? "bg-hongbao-orange-50 text-hongbao-orange-600 dark:text-night-orange"
                      : item.type === "flashcard"
                        ? "bg-hongbao-gold-50 text-hongbao-gold-700 dark:text-night-gold"
                        : "bg-hongbao-red-50 text-hongbao-red-600 dark:text-night-red"
                  }`}
                >
                  {item.type === "mock-test" ? (
                    <MockTestTypeIcon size={14} weight="fill" />
                  ) : item.type === "flashcard" ? (
                    <FlashcardTypeIcon size={14} weight="fill" />
                  ) : (
                    <CourseTypeIcon size={14} weight="fill" />
                  )}
                </div>
                <div className="min-w-0">
                  <Text size="sm" fw={600} c="gray.9" lh={1.3} lineClamp={1}>
                    {item.title}
                  </Text>
                  <Text size="11px" c="gray.5" lineClamp={1}>
                    {item.meta}
                  </Text>
                </div>
              </div>
              <Text size="sm" fw={600} c="gray.7" className="shrink-0!">
                {item.lineTotal}
              </Text>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between border-t border-gray-200 bg-gray-50 px-3 py-2.5">
          <Text size="xs" fw={700} c="gray.6" tt="uppercase">
            Total
          </Text>
          <Text size="md" fw={800} c="var(--hb-accent-strong)">
            {total}
          </Text>
        </div>
      </div>

      {/* payment to verify */}
      <div
        className={`flex items-start gap-2 rounded-lg px-3 py-2.5 ${
          hasPayment ? "bg-gray-50" : "bg-amber-50"
        }`}
      >
        {hasPayment ? (
          <CreditCardIcon
            size={16}
            className="mt-0.5! shrink-0! text-gray-500!"
          />
        ) : (
          <WarningIcon
            size={16}
            weight="fill"
            className="mt-0.5! shrink-0! text-amber-500!"
          />
        )}
        <div className="min-w-0">
          <Text size="xs" fw={700} c="gray.7">
            {hasPayment
              ? "Check this payment was received"
              : "No payment info recorded"}
          </Text>
          <Text
            size="xs"
            c="gray.6"
            className="font-mono! break-all! select-all!"
          >
            {payment}
          </Text>
        </div>
      </div>

      <div className="flex items-start gap-1.5">
        <InfoIcon size={14} className="mt-0.5! shrink-0! text-gray-400!" />
        <Text size="xs" c="gray.5">
          {customer} gets access right away and will be notified.
        </Text>
      </div>

      <div className="flex justify-end gap-2">
        <Button variant="default" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          color="green"
          data-autofocus
          leftSection={<CheckCircleIcon size={16} weight="fill" />}
          onClick={onConfirm}
        >
          Approve
        </Button>
      </div>
    </div>
  );
};

export default ApproveModal;
