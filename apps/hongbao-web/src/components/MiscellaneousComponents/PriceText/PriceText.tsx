import { pluralize } from "@/utils/pluralize";
import { Text } from "@mantine/core";
import React from "react";

interface Props {
  /** `lifetime`: one-off price, no per-month caption. */
  data: { price: number; perTime: number; isFree: boolean; lifetime?: boolean };
  size?: "lg" | "sm";
}

const PriceText: React.FC<Props> = ({ data, size = "lg" }) => {
  const months = data?.perTime || 1;
  const monthLabel = pluralize(months, "month");
  const priceClassName =
    size === "lg"
      ? "text-[40px]! text-hongbao-red-600!"
      : "text-[17px]! text-hongbao-red-600!";
  const captionSize = size === "lg" ? "sm" : "10px";

  if (data?.isFree) {
    return (
      <div className="flex! flex-col! gap-1!">
        <Text component="span" fw={800} lh={1} className={priceClassName}>
          Free
        </Text>
        <Text size={captionSize} c="gray.6">
          No payment required
        </Text>
      </div>
    );
  }

  return (
    <div className="flex! flex-wrap! items-baseline! gap-x-2! gap-y-1!">
      <Text component="span" fw={800} lh={1} className={priceClassName}>
        {(data?.price || 0).toLocaleString("en-US")}
      </Text>
      <Text
        component="span"
        fw={700}
        className={
          size === "lg"
            ? "text-sm! uppercase! tracking-wider! text-hongbao-red-400!"
            : "text-[10px]! uppercase! tracking-wider! text-hongbao-red-400!"
        }
      >
        MMK
      </Text>
      <Text component="span" size={captionSize} c="gray.6">
        {data?.lifetime ? "lifetime" : `/ ${monthLabel}`}
      </Text>
    </div>
  );
};

export default PriceText;
