import CustomBreadCrumb from "@/components/CustomBreadCrumb/CustomBreadCrumb";
import PurchaseOrderList from "@/app/[locale]/(dashboard)/dashboard/users/purchases/components/PurchaseOrderList/PurchaseOrderList";
import CustomSearchInput from "@/components/Inputs/CustomSearchInput/CustomSearchInput";
import DateRangeInput from "@/components/Inputs/DateRangeInput/DateRangeInput";
import {
  DASHBOARD,
  PURCHASES_APPROVED,
  PURCHASES_PENDING,
} from "@/constants/DashboardRoutes";
import { Link } from "@/i18n/navigation";
import {
  Badge,
  Flex,
  Group,
  Pagination,
  Select,
  Stack,
  Tabs,
  Text,
} from "@mantine/core";
import { first, last, split } from "lodash";
import useContainer from "./useContainer";

const PageComponent = () => {
  const {
    pathname,
    pendingCount,
    approvedList,
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
            title="Purchases - Approved"
            links={[
              { label: "Dashboard", href: DASHBOARD, isActive: true },
              { label: "Approved", href: "", isActive: false },
            ]}
          />
        </Group>

        <Tabs value={last(split(pathname, "/"))}>
          <Tabs.List>
            <Link href={PURCHASES_APPROVED}>
              <Tabs.Tab value="approved">
                <Group>
                  <Text size="sm">Approved</Text>{" "}
                </Group>
              </Tabs.Tab>
            </Link>
            <Link href={PURCHASES_PENDING}>
              <Tabs.Tab value="pending-approved">
                <Group>
                  <Text size="sm">Pending List</Text>{" "}
                  <Badge color="green" size="xs">
                    {pendingCount}
                  </Badge>
                </Group>
              </Tabs.Tab>
            </Link>
          </Tabs.List>
        </Tabs>

        <PurchaseOrderList
          isLoading={isLoading}
          rows={approvedList || []}
          header={
            <Flex justify="end" gap={10} wrap="wrap">
              <DateRangeInput
                onChange={(v) => {
                  setParams((prev) => ({
                    ...prev,
                    start_date: (first(v) as string) || "",
                    end_date: (last(v) as string) || "",
                  }));
                }}
              />
              <CustomSearchInput
                placeholder="Search by Username or User Id or Course Id"
                w={{ base: "100%", sm: 400 }}
                searchFn={(value) => {
                  handleSearch(value);
                }}
                clearFn={() => {
                  handleSearchClear();
                }}
              />
            </Flex>
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
