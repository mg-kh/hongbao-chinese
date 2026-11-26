import { Box, Text } from "@mantine/core";
import { CheckIcon, XIcon } from "@phosphor-icons/react";
import { format } from "date-fns";
import { TPurchaseOrder } from "../../../types/purchase-history.type";

type StepState = "done" | "current" | "failed" | "upcoming";

type Step = { title: string; detail: string; state: StepState };

const fmt = (iso: string | null) =>
  iso ? format(new Date(iso), "d MMM yyyy") : "";

const dot: Record<StepState, string> = {
  done: "bg-gray-900! text-gray-50!",
  current: "bg-surface! ring-2! ring-hongbao-red-500!",
  failed: "bg-gray-200! text-gray-500!",
  upcoming: "bg-surface! ring-1! ring-gray-300!",
};

const DotMark: React.FC<{ state: StepState }> = ({ state }) => {
  if (state === "done") return <CheckIcon size={10} weight="bold" />;
  if (state === "failed") return <XIcon size={10} weight="bold" />;
  if (state === "current")
    return <Box className="w-1.5! h-1.5! rounded-full! bg-hongbao-red-500!" />;
  return null;
};

/** The three lifecycle steps for an order, from its status + timestamps. */
const buildSteps = (order: TPurchaseOrder): Step[] => {
  const placed: Step = {
    title: "Order placed",
    detail: fmt(order.createdAt),
    state: "done",
  };

  if (order.status === "PENDING") {
    return [
      placed,
      {
        title: "Verifying your transfer",
        detail: "Usually confirmed within a few hours",
        state: "current",
      },
      {
        title: "Access activated",
        detail: "After your payment is confirmed",
        state: "upcoming",
      },
    ];
  }

  if (order.status === "CANCELLED") {
    return [
      placed,
      {
        title: "Payment reviewed",
        detail: fmt(order.updatedAt),
        state: "done",
      },
      {
        title: "Order declined",
        // The admin's reason is shown on the card; the generic copy only
        // covers older orders rejected before reasons were recorded.
        detail: order.rejectReason
          ? "See the reason above"
          : "The transfer couldn't be verified",
        state: "failed",
      },
    ];
  }

  // APPROVED or EXPIRED
  return [
    placed,
    {
      title: "Payment confirmed",
      detail: fmt(order.paidAt),
      state: "done",
    },
    order.status === "EXPIRED"
      ? {
          title: "Access ended",
          detail: "",
          state: "failed",
        }
      : {
          title: "Access active",
          detail: "",
          state: "done",
        },
  ];
};

interface Props {
  order: TPurchaseOrder;
}

const OrderStatusTimeline: React.FC<Props> = ({ order }) => {
  const steps = buildSteps(order);

  return (
    <Box className="flex! flex-col!">
      {steps.map((step, i) => {
        const last = i === steps.length - 1;
        return (
          <Box key={step.title} className="flex! gap-3!">
            <Box className="flex! flex-col! items-center!">
              <Box
                className={`flex! items-center! justify-center! w-[18px]! h-[18px]! rounded-full! shrink-0! ${dot[step.state]}`}
              >
                <DotMark state={step.state} />
              </Box>
              {!last && (
                <Box
                  className={`w-px! flex-1! min-h-5! ${
                    step.state === "done" ? "bg-gray-900/25!" : "bg-gray-200!"
                  }`}
                />
              )}
            </Box>

            <Box className={last ? "pb-0.5!" : "pb-3.5!"}>
              <Text
                size="xs"
                fw={step.state === "current" ? 700 : 600}
                c={step.state === "upcoming" ? "gray.4" : "gray.8"}
                className="leading-tight!"
              >
                {step.title}
              </Text>
              {step.detail && (
                <Text size="11px" c="gray.5" className="mt-0.5!">
                  {step.detail}
                </Text>
              )}
            </Box>
          </Box>
        );
      })}
    </Box>
  );
};

export default OrderStatusTimeline;
