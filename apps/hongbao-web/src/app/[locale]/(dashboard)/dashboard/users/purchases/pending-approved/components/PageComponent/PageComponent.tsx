"use client";

import CustomBreadCrumb from "@/components/CustomBreadCrumb/CustomBreadCrumb";
import PurchaseOrderList from "@/app/[locale]/(dashboard)/dashboard/users/purchases/components/PurchaseOrderList/PurchaseOrderList";
import CustomSearchInput from "@/components/Inputs/CustomSearchInput/CustomSearchInput";
import DateRangeInput from "@/components/Inputs/DateRangeInput/DateRangeInput";
import PurchaseTabs from "@/app/[locale]/(dashboard)/dashboard/users/purchases/components/PurchaseTabs/PurchaseTabs";
import { DASHBOARD } from "@/constants/DashboardRoutes";
import { Flex, Group, Pagination, Select, Stack } from "@mantine/core";
import { first, last } from "lodash";
import useContainer from "./useContainer";

const PageComponent = () => {
  const {
    pendingList,
    isLoading,
    params,
    setParams,
    totalPages,
    handleSearch,
    handleSearchClear,
  } = useContainer();
  return (
    <>
      <Stack p={10}>
        <Group justify="space-between">
          <CustomBreadCrumb
            title="Purchases - Pending List"
            links={[
              { label: "Dashboard", href: DASHBOARD, isActive: true },
              { label: "Pending List", href: "", isActive: false },
            ]}
          />
        </Group>

        <PurchaseTabs />

        <PurchaseOrderList
          isLoading={isLoading}
          rows={pendingList || []}
          noOffset={(Number(params.page) - 1) * Number(params.limit)}
          header={
            <div className="flex items-center justify-between gap-2.5">
              <div className="min-w-0 flex-1 sm:max-w-100">
                <CustomSearchInput
                  placeholder="Search by username, user ID, order no, txn no or product ID"
                  searchFn={(value) => {
                    handleSearch(value);
                  }}
                  clearFn={() => {
                    handleSearchClear();
                  }}
                />
              </div>
              <div className="w-40 shrink-0 sm:w-62.5">
                <DateRangeInput
                  onChange={(v) => {
                    setParams((prev) => ({
                      ...prev,
                      start_date: (first(v) as string) || "",
                      end_date: (last(v) as string) || "",
                    }));
                  }}
                />
              </div>
            </div>
          }
          footer={
            <>
              <Flex justify="end" align={"center"} gap={10}>
                <Select
                  placeholder="Per page"
                  data={["10", "20", "30", "40"]}
                  w={120}
                  value={params?.limit}
                  onChange={(v) => {
                    setParams((prev) => ({ ...prev, limit: `${v}` }));
                  }}
                />
                <Pagination
                  size="lg"
                  total={totalPages}
                  onChange={(value: number) => {
                    setParams((prev) => ({ ...prev, page: value }));
                  }}
                  siblings={1}
                  boundaries={1}
                />
              </Flex>
            </>
          }
        />
      </Stack>
    </>
  );
};

export default PageComponent;
