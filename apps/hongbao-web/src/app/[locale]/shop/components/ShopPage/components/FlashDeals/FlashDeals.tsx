"use client";

import { Text } from "@mantine/core";
import { LightningIcon } from "@phosphor-icons/react";
import { TShopProduct } from "../../../../types/shop.type";
import FlashDealCard from "./components/FlashDealCard/FlashDealCard";
import useContainer from "./useContainer";

interface Props {
  deals: TShopProduct[];
}

const TimeBox: React.FC<{ value: string }> = ({ value }) => (
  <span className="inline-flex! min-w-[26px]! items-center! justify-center! rounded-md! bg-hongbao-maroon-900! px-1! py-0.5! text-xs! font-extrabold! text-white! tabular-nums!">
    {value}
  </span>
);

const FlashDeals: React.FC<Props> = ({ deals }) => {
  const { parts } = useContainer();

  if (deals.length === 0) return null;

  return (
    <section className="overflow-hidden! rounded-2xl! bg-gradient-to-br! from-hongbao-red-50! to-hongbao-gold-50! ring-1! ring-hongbao-red-100!">
      <div className="flex! items-center! justify-between! gap-3! px-4! pt-4! sm:px-5!">
        <div className="flex! items-center! gap-2!">
          <span className="flex! items-center! justify-center! w-8! h-8! rounded-lg! bg-hongbao-red-500! text-white!">
            <LightningIcon size={18} weight="fill" />
          </span>
          <Text fw={800} className="text-[17px]!" c="var(--hb-accent-strong)">
            Flash Deals
          </Text>
        </div>

        <div className="flex! items-center! gap-1.5!">
          <Text size="11px" fw={700} c="gray.6" className="hidden! sm:block!">
            Ends in
          </Text>
          {parts ? (
            <div className="flex! items-center! gap-1!">
              <TimeBox value={parts.hours} />
              <span className="text-xs! font-extrabold! text-hongbao-maroon-900! dark:text-night-maroon!">:</span>
              <TimeBox value={parts.minutes} />
              <span className="text-xs! font-extrabold! text-hongbao-maroon-900! dark:text-night-maroon!">:</span>
              <TimeBox value={parts.seconds} />
            </div>
          ) : (
            <div className="h-[22px]! w-[104px]! rounded-md! bg-hongbao-maroon-900/10! dark:bg-white/8!" />
          )}
        </div>
      </div>

      <div className="mt-3! flex! gap-3! overflow-x-auto! px-4! pb-4! sm:px-5! [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {deals.map((product) => (
          <FlashDealCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
};

export default FlashDeals;
