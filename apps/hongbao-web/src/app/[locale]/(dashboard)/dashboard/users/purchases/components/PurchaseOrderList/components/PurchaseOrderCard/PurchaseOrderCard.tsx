"use client";

import { TPurchaseOrderGroup } from "@/app/[locale]/(dashboard)/dashboard/users/purchases/components/PurchaseOrderList/useContainer";
import { TPurchaseCourse } from "@/app/[locale]/(dashboard)/dashboard/users/purchases/types/purchases.type";
import {
  Badge,
  Box,
  Collapse,
  Group,
  Image,
  Paper,
  Stack,
  Text,
  UnstyledButton,
} from "@mantine/core";
import { modals } from "@mantine/modals";
import {
  BookOpenIcon,
  CaretDownIcon,
  CheckCircleIcon,
  ClockCountdownIcon,
  CreditCardIcon,
  HourglassMediumIcon,
  XCircleIcon,
} from "@phosphor-icons/react";
import { format, formatDistanceToNow } from "date-fns";
import useContainer from "./useContainer";

const TRANSACTION_IMAGE = "https://placehold.co/400x800/png";

const statusMeta: Record<
  TPurchaseCourse["status"],
  { label: string; color: string; icon: React.ReactNode }
> = {
  PENDING: {
    label: "Pending",
    color: "hongbao-gold",
    icon: <HourglassMediumIcon size={12} weight="fill" />,
  },
  APPROVED: {
    label: "Approved",
    color: "green",
    icon: <CheckCircleIcon size={12} weight="fill" />,
  },
  REJECTED: {
    label: "Rejected",
    color: "gray",
    icon: <XCircleIcon size={12} weight="fill" />,
  },
  EXPIRED: {
    label: "Expired",
    color: "hongbao-red",
    icon: <ClockCountdownIcon size={12} weight="fill" />,
  },
};

interface Props {
  order: TPurchaseOrderGroup;
  renderItemAction?: (item: TPurchaseCourse) => React.ReactNode;
}

const PurchaseOrderCard: React.FC<Props> = ({ order, renderItemAction }) => {
  const { expanded, toggle, summary } = useContainer(order);
  if (!summary) return null;

  const status = statusMeta[summary.status] ?? statusMeta.PENDING;

  return (
    <Paper
      withBorder
      bdrs={16}
      p={0}
      className="overflow-hidden! border-gray-200! bg-white!"
    >
      {/* ---------- always-visible summary ---------- */}
      <Box className="p-4! sm:p-5!">
        <Group
          justify="space-between"
          align="flex-start"
          wrap="nowrap"
          gap={12}
        >
          <Box className="min-w-0!">
            <Text
              size="sm"
              fw={700}
              className="font-mono! tracking-tight! text-gray-900! select-all!"
              lineClamp={1}
            >
              {order.orderNo}
            </Text>
            <Text size="xs" c="gray.5" className="mt-0.5!">
              {summary.user?.name || "-"} ·{" "}
              {format(summary.createdAt, "d MMM yyyy, hh:mm a")}
            </Text>
          </Box>
          <Badge
            color={status.color}
            variant="light"
            radius="sm"
            leftSection={status.icon}
            className="shrink-0!"
          >
            {status.label}
          </Badge>
        </Group>

        <Stack gap={12} className="mt-4!">
          {order.items.map((item) => (
            <Group
              key={item.id}
              justify="space-between"
              align="center"
              wrap="nowrap"
              gap={12}
            >
              <Group gap={10} wrap="nowrap" className="min-w-0!">
                <Box className="flex! items-center! justify-center! w-9! h-9! rounded-xl! shrink-0! bg-hongbao-red-50! text-hongbao-red-600!">
                  <BookOpenIcon size={16} weight="fill" />
                </Box>
                <Box className="min-w-0!">
                  <Text
                    size="sm"
                    fw={600}
                    lineClamp={1}
                    className="text-gray-900!"
                  >
                    {item.course?.title || "-"}
                  </Text>
                  <Text size="xs" c="gray.5" className="mt-0.5!" lineClamp={1}>
                    {item.expiredAt
                      ? `Access until ${format(item.expiredAt, "d MMM yyyy")}`
                      : item.courseId}
                  </Text>
                </Box>
              </Group>
              {renderItemAction && (
                <Box className="shrink-0!">{renderItemAction(item)}</Box>
              )}
            </Group>
          ))}
        </Stack>
      </Box>

      {/* ---------- footer / expand toggle ---------- */}
      <UnstyledButton
        onClick={toggle}
        aria-expanded={expanded}
        className="w-full! flex! items-center! justify-between! gap-3! border-t! border-gray-100! px-4! sm:px-5! py-3! transition-colors! duration-150! hover:bg-gray-50!"
      >
        <Group gap={8} wrap="nowrap" align="center" className="min-w-0!">
          <CreditCardIcon size={15} className="text-gray-400! shrink-0!" />
          <Text size="xs" c="gray.6" lineClamp={1}>
            <Text component="span" fw={600} c="gray.8" tt="uppercase">
              {summary.paymentType}
            </Text>{" "}
            · Txn {summary.transactionNo}
          </Text>
        </Group>
        <Group gap={4} wrap="nowrap" className="text-gray-500! shrink-0!">
          <Text size="xs" fw={600}>
            {expanded ? "Hide details" : "Details"}
          </Text>
          <CaretDownIcon
            size={13}
            weight="bold"
            className={`transition-transform! duration-200! ${expanded ? "rotate-180!" : ""}`}
          />
        </Group>
      </UnstyledButton>

      {/* ---------- expanded detail ---------- */}
      <Collapse expanded={expanded}>
        <Box className="border-t! border-gray-100! bg-gray-50/50! px-4! sm:px-5! py-4!">
          <div className="flex flex-col-reverse gap-4 sm:flex-row sm:items-start sm:justify-between">
            <Stack gap={12} className="min-w-0!">
              <Box>
                <Text size="10px" fw={700} c="gray.5" tt="uppercase">
                  Customer
                </Text>
                <Text size="sm" fw={600} c="gray.8">
                  {summary.user?.name || "-"}
                </Text>
                <Text size="xs" c="gray.5" className="select-all! break-all!">
                  {summary.userId}
                </Text>
              </Box>
              <Box>
                <Text size="10px" fw={700} c="gray.5" tt="uppercase">
                  Purchased
                </Text>
                <Text size="sm" c="gray.8">
                  {format(summary.createdAt, "dd-MM-yyyy hh:mm:ss a")}
                </Text>
                <Text size="xs" c="gray.5">
                  {formatDistanceToNow(new Date(summary.createdAt), {
                    addSuffix: true,
                  })}
                </Text>
              </Box>
              <Box>
                <Text size="10px" fw={700} c="gray.5" tt="uppercase">
                  Payment
                </Text>
                <Text size="sm" c="gray.8">
                  <Text component="span" fw={600} tt="uppercase">
                    {summary.paymentType}
                  </Text>{" "}
                  · Txn{" "}
                  <span className="select-all font-mono">
                    {summary.transactionNo}
                  </span>
                </Text>
              </Box>
            </Stack>

            <Box className="shrink-0!">
              <Text size="10px" fw={700} c="gray.5" tt="uppercase" mb={4}>
                Transaction image
              </Text>
              <Image
                radius="md"
                src={TRANSACTION_IMAGE}
                h={120}
                w={80}
                fit="cover"
                alt="Transaction image"
                className="cursor-pointer! border! border-gray-200! transition-shadow! hover:shadow-md!"
                onClick={() =>
                  modals.open({
                    title: "Check the transaction image",
                    children: (
                      <Image
                        radius="md"
                        src={TRANSACTION_IMAGE}
                        h={600}
                        mx="auto"
                        alt="Transaction image"
                      />
                    ),
                  })
                }
              />
            </Box>
          </div>
        </Box>
      </Collapse>
    </Paper>
  );
};

export default PurchaseOrderCard;
