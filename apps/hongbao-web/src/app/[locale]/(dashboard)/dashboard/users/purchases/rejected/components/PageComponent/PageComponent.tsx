"use client";

import CustomBreadCrumb from "@/components/CustomBreadCrumb/CustomBreadCrumb";
import PurchaseOrderList from "@/app/[locale]/(dashboard)/dashboard/users/purchases/components/PurchaseOrderList/PurchaseOrderList";
import PurchaseTabs from "@/app/[locale]/(dashboard)/dashboard/users/purchases/components/PurchaseTabs/PurchaseTabs";
import CustomSearchInput from "@/components/Inputs/CustomSearchInput/CustomSearchInput";
import DateRangeInput from "@/components/Inputs/DateRangeInput/DateRangeInput";
import { DASHBOARD } from "@/constants/DashboardRoutes";
import { Flex, Group, Pagination, Select, Stack, Text } from "@mantine/core";
import { first, last } from "lodash";
import useContainer from "./useContainer";

const PageComponent = () => {
  const {
    rejectedList,
    isLoading,
    params,
    total,
    totalPages,
    handleSearch,
    handleSearchClear,
    handleDateChange,
    handleLimitChange,
    handlePageChange,
  } = useContainer();

  return (
    <Stack p={10}>
      <Group justify="space-between">
        <CustomBreadCrumb
          title="Purchases - Rejected"
          links={[
            { label: "Dashboard", href: DASHBOARD, isActive: true },
            { label: "Rejected", href: "", isActive: false },
          ]}
        />
      </Group>

      <PurchaseTabs />

      <PurchaseOrderList
        isLoading={isLoading}
        rows={rejectedList}
        header={
          <Flex justify="end" gap={10} wrap="wrap">
            <DateRangeInput
              onChange={(v) => {
                handleDateChange(
                  (first(v) as string) || "",
                  (last(v) as string) || "",
                );
              }}
            />
            <CustomSearchInput
              placeholder="Search by username, user ID, order no, txn no or product ID"
              w={{ base: "100%", sm: 400 }}
              searchFn={handleSearch}
              clearFn={handleSearchClear}
            />
          </Flex>
        }
        footer={
          <Flex justify="space-between" align="center" gap={10} wrap="wrap">
            <Text size="sm" c="dimmed">
              {total} rejected {total === 1 ? "order" : "orders"}
            </Text>
            <Flex align="center" gap={10}>
              <Select
                placeholder="Per page"
                data={["10", "20", "30", "40"]}
                w={120}
                value={params.limit}
                allowDeselect={false}
                onChange={(v) => v && handleLimitChange(v)}
              />
              <Pagination
                size="lg"
                total={totalPages}
                value={params.page}
                onChange={handlePageChange}
                siblings={1}
                boundaries={1}
              />
            </Flex>
          </Flex>
        }
      />
    </Stack>
  );
};

export default PageComponent;
