"use client";

import CustomBreadCrumb from "@/components/CustomBreadCrumb/CustomBreadCrumb";
import PurchaseOrderList from "@/app/[locale]/(dashboard)/dashboard/users/purchases/components/PurchaseOrderList/PurchaseOrderList";
import PurchaseTabs from "@/app/[locale]/(dashboard)/dashboard/users/purchases/components/PurchaseTabs/PurchaseTabs";
import CustomSearchInput from "@/components/Inputs/CustomSearchInput/CustomSearchInput";
import DateRangeInput from "@/components/Inputs/DateRangeInput/DateRangeInput";
import { DASHBOARD } from "@/constants/DashboardRoutes";
import { Flex, Group, Pagination, Select, Stack } from "@mantine/core";
import { first, last } from "lodash";
import useContainer from "./useContainer";

const PageComponent = () => {
  const {
    rejectedList,
    isLoading,
    params,
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
        noOffset={(Number(params.page) - 1) * Number(params.limit)}
        header={
          <div className="flex items-center justify-between gap-2.5">
            <div className="min-w-0 flex-1 sm:max-w-100">
              <CustomSearchInput
                placeholder="Search by username, user ID, order no, txn no or product ID"
                searchFn={handleSearch}
                clearFn={handleSearchClear}
              />
            </div>
            <div className="w-40 shrink-0 sm:w-62.5">
              <DateRangeInput
                onChange={(v) => {
                  handleDateChange(
                    (first(v) as string) || "",
                    (last(v) as string) || "",
                  );
                }}
              />
            </div>
          </div>
        }
        footer={
          <Flex justify="end" align="center" gap={10}>
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
        }
      />
    </Stack>
  );
};

export default PageComponent;
