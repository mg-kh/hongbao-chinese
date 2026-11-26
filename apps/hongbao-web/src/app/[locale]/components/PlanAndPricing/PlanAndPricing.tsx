"use client";

import RubyButtonComponent from "@/components/Buttons/RubyButtonComponent/RubyButtonComponent";
import { Link } from "@/i18n/navigation";
import { Box, Container, Group, Space } from "@mantine/core";
import { IconArrowRight } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import PricingCard, { PricingAccent } from "./component/PricingCard";
import useContainer from "./useContainer";
import React from "react";
import SectionTitle from "../../../../components/SectionTitle/SectionTitle";

const accentOrder: PricingAccent[] = [
  "red",
  "gold",
  "orange",
  "maroon",
  "brown",
];

const PlanAndPricing = () => {
  const t = useTranslations("Home.PlanAndPricing");
  const { courses } = useContainer();
  return (
    <Container size={"xl"} px={{ base: 16, sm: 24 }}>
      <Box py={20} id="pricing" className="scroll-mt-24!">
        <SectionTitle
          title={t("title")}
          subtitle={t("subtitle")}
        />

        <Space h={30} />
        <div className="grid grid-cols-1! sm:grid-cols-2! lg:grid-cols-3! gap-6! lg:gap-8!">
          {courses?.map((c, index) => {
            return (
              <React.Fragment key={c?.id}>
                <PricingCard
                  data={c}
                  accent={accentOrder[index % accentOrder.length]}
                />
              </React.Fragment>
            );
          })}
        </div>

        <Group justify="center" mt={40}>
          <RubyButtonComponent
            component={Link}
            href="/shop?type=course"
            size="lg"
            radius="xl"
            rightSection={<IconArrowRight size={18} />}
          >
            {t("see_all_courses")}
          </RubyButtonComponent>
        </Group>
      </Box>
    </Container>
  );
};

export default PlanAndPricing;
