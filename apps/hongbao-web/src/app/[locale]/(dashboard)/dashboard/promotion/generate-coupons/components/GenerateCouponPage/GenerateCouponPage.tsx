"use client";

import CustomBreadCrumb from "@/components/CustomBreadCrumb/CustomBreadCrumb";
import CustomTable from "@/components/CustomTable/CustomTable";
import { DASHBOARD } from "@/constants/DashboardRoutes";
import { currencyFormatter } from "@/utils/currencyFormatter";
import {
  ActionIcon,
  Badge,
  Box,
  Button,
  Code,
  CopyButton,
  Group,
  Stack,
  Tooltip,
} from "@mantine/core";
import { IconCheck, IconCopy, IconPencil, IconPlus } from "@tabler/icons-react";
import { TCouponRes } from "../../types/coupon.type";
import EditDrawer from "../EditDrawer/EditDrawer";
import useContainer from "./useContainer";

const GenerateCouponPage = () => {
  const { open, opened, coupons, isLoading } = useContainer();
  return (
    <>
      <Stack p={10}>
        <Group justify="space-between">
          <CustomBreadCrumb
            title="Coupons"
            links={[
              { label: "Dashboard", href: DASHBOARD, isActive: true },
              { label: "Generate Coupons", href: "", isActive: false },
            ]}
          />
          <Button
            leftSection={<IconPlus />}
            onClick={() => {
              open();
            }}
          >
            Create New Coupon
          </Button>
        </Group>

        <Box>
          <CustomTable<TCouponRes>
            isLoading={isLoading}
            onTableRowClick={(d) => {
              open(d.id);
            }}
            rows={coupons || []}
            columns={[
              {
                id: "coupon_code",
                header: "Coupon Code",
                element: (v) => {
                  return (
                    <Group
                      gap={4}
                      wrap="nowrap"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Code>{v?.code}</Code>
                      <CopyButton value={v?.code ?? ""}>
                        {({ copied, copy }) => (
                          <Tooltip
                            label={copied ? "Copied" : "Copy"}
                            withArrow
                          >
                            <ActionIcon
                              variant="subtle"
                              color={copied ? "teal" : "gray"}
                              onClick={(e) => {
                                e.stopPropagation();
                                copy();
                              }}
                            >
                              {copied ? (
                                <IconCheck size={16} />
                              ) : (
                                <IconCopy size={16} />
                              )}
                            </ActionIcon>
                          </Tooltip>
                        )}
                      </CopyButton>
                    </Group>
                  );
                },
                columnClass: "min-w-[80px]! max-w-[120px]!",
              },
              {
                id: "usage_limit",
                header: "Usage Limit",
                element: (v) => {
                  return <>{v?.usageLimit}</>;
                },
              },
              {
                id: "discount_type",
                header: "Discount Type",
                element: (v) => {
                  return <>{v?.discountType ?? "-"}</>;
                },
              },
              {
                id: "discount_value",
                header: "Discount Value",
                element: (v) => {
                  return (
                    <>
                      {currencyFormatter({
                        value: v?.discountValue,
                        currencySample: "MMK",
                      })}
                    </>
                  );
                },
              },
              {
                id: "is_active",
                header: "Is Active",
                element: (v) => {
                  return (
                    <>
                      {v?.isActive ? (
                        <Badge color="green">Yes</Badge>
                      ) : (
                        <Badge color="gray">No</Badge>
                      )}
                    </>
                  );
                },
              },
              {
                id: "action",
                header: "Actions",
                headerClass: "text-right!",
                element: (v) => {
                  return (
                    <Group justify="end">
                      <ActionIcon
                        onClick={(e) => {
                          e.stopPropagation();
                          open(v.id);
                        }}
                        variant="transparent"
                      >
                        <IconPencil />
                      </ActionIcon>
                    </Group>
                  );
                },
              },
            ]}
          />
        </Box>
      </Stack>
      {opened && <EditDrawer />}
    </>
  );
};

export default GenerateCouponPage;
