"use client";

import { pluralize } from "@/utils/pluralize";
import LoaderComponent from "@/components/LoaderComponent/LoaderComponent";
import MobileBottomNav from "@/components/Navbar/MobileBottomNav/MobileBottomNav";
import { publicBottomNavItems } from "@/components/Navbar/MobileBottomNav/publicNavItems";
import ClientLayout from "@/layouts/ClientLayout/ClientLayout";
import { Box, Button, Container, Drawer, Stack, Text } from "@mantine/core";
import { StorefrontIcon } from "@phosphor-icons/react";
import FlashDeals from "./components/FlashDeals/FlashDeals";
import ProductCard from "./components/ProductCard/ProductCard";
import ShopFilters from "./components/ShopFilters/ShopFilters";
import SortTabs from "./components/SortTabs/SortTabs";
import useContainer, { ShopTypeFilter } from "./useContainer";

interface Props {
  initialType: ShopTypeFilter;
}

const ShopPage: React.FC<Props> = ({ initialType }) => {
  const {
    isFetching,
    search,
    setSearch,
    type,
    setType,
    categoryId,
    toggleCategory,
    onSaleOnly,
    setOnSaleOnly,
    sort,
    setSort,
    clearFilters,
    typeCounts,
    categoryOptions,
    flashDeals,
    results,
    total,
    activeFilterCount,
    drawerOpened,
    openDrawer,
    closeDrawer,
  } = useContainer(initialType);

  const filterProps = {
    type,
    setType,
    categoryId,
    toggleCategory,
    onSaleOnly,
    setOnSaleOnly,
    activeFilterCount,
    clearFilters,
    typeCounts,
    categoryOptions,
  };

  return (
    <ClientLayout size={"100%"} p={0} hideFooterOnMobile>
      <Container size={"xl"} px={{ base: 12, sm: 24 }}>
        <Stack gap={16} pt={{ base: 14, md: 20 }} pb={{ base: 32, md: 44 }}>
          <FlashDeals deals={flashDeals} />

          <div className="grid! grid-cols-1! items-start! gap-6! lg:grid-cols-[236px_1fr]! lg:gap-8!">
            {/* desktop filter sidebar */}
            <Box className="hidden! self-start! rounded-2xl! bg-white! p-4! ring-1! ring-gray-200! lg:sticky! lg:top-36! lg:block!">
              <ShopFilters {...filterProps} />
            </Box>

            <div>
              <SortTabs
                sort={sort}
                setSort={setSort}
                total={total}
                activeFilterCount={activeFilterCount}
                onOpenFilters={openDrawer}
              />

              {isFetching && results.length === 0 ? (
                <LoaderComponent />
              ) : results.length === 0 ? (
                <Box className="rounded-2xl! bg-white! px-6! py-16! text-center! ring-1! ring-gray-200!">
                  <Box className="mx-auto! mb-4! flex! h-14! w-14! items-center! justify-center! rounded-2xl! bg-hongbao-red-50! text-hongbao-red-600!">
                    <StorefrontIcon size={26} weight="fill" />
                  </Box>
                  <Text fw={700} className="text-gray-900!">
                    No products match your filters
                  </Text>
                  <Text size="sm" c="gray.6" className="mt-1!">
                    Try removing a filter or clearing your search.
                  </Text>
                  <Button
                    onClick={clearFilters}
                    variant="light"
                    color="hongbao-red"
                    radius="xl"
                    className="mt-4!"
                  >
                    Clear all filters
                  </Button>
                </Box>
              ) : (
                <div className="grid! grid-cols-2! gap-3! sm:gap-4! md:grid-cols-3! xl:grid-cols-4!">
                  {results.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </Stack>
      </Container>

      {/* mobile filter bottom sheet */}
      <Drawer
        opened={drawerOpened}
        onClose={closeDrawer}
        position="bottom"
        size="auto"
        radius="20px 20px 0 0"
        title={
          <Text fw={700} c="hongbao-red">
            Filters
          </Text>
        }
        classNames={{ body: "pb-6!" }}
      >
        <Stack gap={20}>
          <ShopFilters {...filterProps} />
          <Button
            onClick={closeDrawer}
            size="md"
            radius="xl"
            color="hongbao-red"
            fullWidth
          >
            Show {pluralize(total, "result")}
          </Button>
        </Stack>
      </Drawer>

      <MobileBottomNav items={publicBottomNavItems} />
    </ClientLayout>
  );
};

export default ShopPage;
