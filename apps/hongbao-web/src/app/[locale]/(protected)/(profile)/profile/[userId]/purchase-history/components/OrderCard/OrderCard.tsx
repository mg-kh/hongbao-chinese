"use client";

import { Link } from "@/i18n/navigation";
import {
  Box,
  Button,
  Collapse,
  Divider,
  Group,
  Paper,
  Stack,
  Text,
  UnstyledButton,
} from "@mantine/core";
import {
  BookOpenIcon,
  CaretDownIcon,
  CreditCardIcon,
  ExamIcon,
} from "@phosphor-icons/react";
import { format } from "date-fns";
import {
  TOrderItem,
  TOrderItemType,
  TPurchaseOrder,
} from "../../../types/purchase-history.type";
import OrderStatusBadge from "../OrderStatusBadge/OrderStatusBadge";
import OrderStatusTimeline from "../OrderStatusTimeline/OrderStatusTimeline";
import useContainer, { money } from "./useContainer";

const typeMeta: Record<
  TOrderItemType,
  { label: string; tile: string; icon: React.ReactNode }
> = {
  course: {
    label: "Course",
    tile: "bg-hongbao-red-50! text-hongbao-red-600!",
    icon: <BookOpenIcon size={16} weight="fill" />,
  },
  "mock-test": {
    label: "Mock Test",
    tile: "bg-hongbao-orange-50! text-hongbao-orange-600!",
    icon: <ExamIcon size={16} weight="fill" />,
  },
};

/** "3 months" when the access length is whole months, otherwise "45 days". */
const durationLabel = (days: number) => {
  if (days > 0 && days % 30 === 0) {
    const months = days / 30;
    return `${months} ${months === 1 ? "month" : "months"}`;
  }
  return `${days} ${days === 1 ? "day" : "days"}`;
};

const lineMeta = (item: TOrderItem) =>
  [
    typeMeta[item.type].label,
    durationLabel(item.durationDays),
    item.quantity > 1 ? `×${item.quantity}` : null,
  ]
    .filter(Boolean)
    .join(" · ");

interface Props {
  order: TPurchaseOrder;
}

const OrderCard: React.FC<Props> = ({ order }) => {
  const { expanded, toggle, primaryAction } = useContainer(order);

  return (
    <Paper
      withBorder
      bdrs={16}
      p={0}
      className="overflow-hidden! border-gray-200! bg-white!"
    >
      {/* ---------- always-visible summary ---------- */}
      <Box className="p-4! sm:p-5!">
        <Group justify="space-between" align="flex-start" wrap="nowrap" gap={12}>
          <Box className="min-w-0!">
            <Text
              size="sm"
              fw={700}
              className="font-mono! tracking-tight! text-gray-900!"
              lineClamp={1}
            >
              {order.reference}
            </Text>
            <Text size="xs" c="gray.5" className="mt-0.5!">
              {format(new Date(order.createdAt), "d MMM yyyy")}
            </Text>
          </Box>
          <OrderStatusBadge status={order.status} className="shrink-0!" />
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
                <Box
                  className={`flex! items-center! justify-center! w-9! h-9! rounded-xl! shrink-0! ${typeMeta[item.type].tile}`}
                >
                  {typeMeta[item.type].icon}
                </Box>
                <Box className="min-w-0!">
                  <Text
                    size="sm"
                    fw={600}
                    lineClamp={1}
                    className="text-gray-900!"
                  >
                    {item.title}
                  </Text>
                  <Text size="xs" c="gray.5" className="mt-0.5!">
                    {lineMeta(item)}
                  </Text>
                </Box>
              </Group>
              <Text size="sm" fw={600} className="shrink-0! text-gray-700!">
                {money(item.lineTotal, order.currency)}
              </Text>
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
        <Group gap={8} wrap="nowrap" align="baseline">
          <Text size="xs" c="gray.5" fw={500}>
            {order.status === "REJECTED" ? "Order total" : "Total"}
          </Text>
          <Text size="sm" fw={800} c="hongbao-red.7">
            {money(order.total, order.currency)}
          </Text>
        </Group>
        <Group gap={4} wrap="nowrap" className="text-gray-500!">
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
          <Stack gap={18}>
            {/* breakdown - only worth showing when a discount changed the total */}
            {order.subtotal > order.total && (
              <Stack gap={6}>
                <Group justify="space-between">
                  <Text size="xs" c="gray.6">
                    Subtotal
                  </Text>
                  <Text size="xs" fw={600} c="gray.7">
                    {money(order.subtotal, order.currency)}
                  </Text>
                </Group>
                <Group justify="space-between">
                  <Text size="xs" c="gray.6">
                    Discount
                  </Text>
                  <Text size="xs" fw={600} c="hongbao-red.6">
                    -{money(order.subtotal - order.total, order.currency)}
                  </Text>
                </Group>
                <Group justify="space-between">
                  <Text size="xs" fw={700} c="gray.8">
                    Total paid
                  </Text>
                  <Text size="xs" fw={800} c="hongbao-red.7">
                    {money(order.total, order.currency)}
                  </Text>
                </Group>
              </Stack>
            )}

            {/* payment */}
            <Group gap={8} wrap="nowrap" align="center">
              <CreditCardIcon
                size={15}
                className="text-gray-400! shrink-0!"
              />
              <Text size="xs" c="gray.6">
                Paid with{" "}
                <Text component="span" fw={600} c="gray.8" tt="uppercase">
                  {order.paymentType}
                </Text>{" "}
                · ref ····{order.transactionNo}
              </Text>
            </Group>

            <Divider color="gray.2" />

            {/* lifecycle */}
            <OrderStatusTimeline order={order} />

            {/* actions */}
            <Group gap={10} wrap="wrap">
              <Button
                component={Link}
                href={primaryAction.href}
                variant={primaryAction.variant}
                color="hongbao-red"
                radius="xl"
                size="sm"
                className="flex-1! sm:flex-none!"
              >
                {primaryAction.label}
              </Button>
              {primaryAction.href !== "/shop" && (
                <Button
                  component={Link}
                  href="/shop"
                  variant="subtle"
                  color="gray"
                  radius="xl"
                  size="sm"
                  className="flex-1! sm:flex-none!"
                >
                  Buy again
                </Button>
              )}
            </Group>
          </Stack>
        </Box>
      </Collapse>
    </Paper>
  );
};

export default OrderCard;
