"use client";

import {
  PURCHASES_APPROVED,
  PURCHASES_PENDING,
  PURCHASES_REJECTED,
} from "@/constants/DashboardRoutes";
import { Link, usePathname } from "@/i18n/navigation";
import { Badge, Group, Tabs, Text } from "@mantine/core";
import { last, split } from "lodash";
import usePurchaseList from "../../hooks/usePurchaseList";

/** Approved / Pending / Rejected tabs shared by every purchases page. */
const PurchaseTabs = () => {
  const pathname = usePathname();
  const { approvedCount, pendingCount, rejectedCount } = usePurchaseList();

  const tabs = [
    {
      value: "approved",
      href: PURCHASES_APPROVED,
      label: "Approved",
      count: approvedCount,
      color: "gray",
    },
    {
      value: "pending-approved",
      href: PURCHASES_PENDING,
      label: "Pending List",
      count: pendingCount,
      color: "green",
    },
    {
      value: "rejected",
      href: PURCHASES_REJECTED,
      label: "Rejected",
      count: rejectedCount,
      color: "gray",
    },
  ];

  return (
    <Tabs value={last(split(pathname, "/"))}>
      <Tabs.List>
        {tabs.map((tab) => (
          <Link key={tab.value} href={tab.href}>
            <Tabs.Tab value={tab.value}>
              <Group gap={8}>
                <Text size="sm">{tab.label}</Text>
                {!!tab.count && (
                  <Badge color={tab.color} size="xs">
                    {tab.count}
                  </Badge>
                )}
              </Group>
            </Tabs.Tab>
          </Link>
        ))}
      </Tabs.List>
    </Tabs>
  );
};

export default PurchaseTabs;
