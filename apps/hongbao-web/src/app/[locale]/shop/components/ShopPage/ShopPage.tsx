"use client";

import CustomBreadCrumb from "@/components/CustomBreadCrumb/CustomBreadCrumb";
import LoaderComponent from "@/components/LoaderComponent/LoaderComponent";
import MobileBottomNav from "@/components/Navbar/MobileBottomNav/MobileBottomNav";
import { publicBottomNavItems } from "@/components/Navbar/MobileBottomNav/publicNavItems";
import ClientLayout from "@/layouts/ClientLayout/ClientLayout";
import { Box, Button, Container, Drawer, Stack, Text } from "@mantine/core";
import { StorefrontIcon } from "@phosphor-icons/react";
import { useTranslations } from "next-intl";
import FlashDeals from "@/app/[locale]/shop/components/ShopPage/components/FlashDeals/FlashDeals";
import ProductCard from "@/app/[locale]/shop/components/ShopPage/components/ProductCard/ProductCard";
import ResultsToolbar from "@/app/[locale]/shop/components/ShopPage/components/ResultsToolbar/ResultsToolbar";
import ShopFilters from "@/app/[locale]/shop/components/ShopPage/components/ShopFilters/ShopFilters";
import useContainer, {
  ShopTypeFilter,
} from "@/app/[locale]/shop/components/ShopPage/useContainer";

interface Props {
  initialType: ShopTypeFilter;
}

const ShopPage: React.FC<Props> = ({ initialType }) => {
  const t = useTranslations("Shop.ShopPage");
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
    categoryOptions,
    appliedFilters,
    flashDeals,
    results,
    total,
    activeFilterCount,
    drawerOpened,
    openDrawer,
    closeDrawer,
  } = useContainer(initialType);

  const filterProps = {
    search,
    setSearch,
    type,
    setType,
    categoryId,
    toggleCategory,
    onSaleOnly,
    setOnSaleOnly,
    activeFilterCount,
    clearFilters,
    categoryOptions,
  };

  return (
    <ClientLayout size={"100%"} p={0} hideFooterOnMobile>
      <Container size={"xl"} px={{ base: 12, sm: 24 }}>
        <Stack gap={16} pt={{ base: 14, md: 20 }} pb={{ base: 32, md: 44 }}>
          <CustomBreadCrumb
            title={t("title")}
            links={[
              { label: t("home"), href: "/", isActive: true },
              { label: t("title"), href: "", isActive: false },
            ]}
          />

          <FlashDeals deals={flashDeals} />

          <div className="grid! grid-cols-1! items-start! gap-6! lg:grid-cols-[260px_1fr]! lg:gap-8!">
            {/* desktop filter sidebar */}
            <Box className="hidden! self-start! rounded-2xl! bg-surface! px-4! pt-4! pb-1! ring-1! ring-gray-200! lg:sticky! lg:top-36! lg:block! lg:max-h-[calc(100vh-10rem)]! lg:overflow-y-auto!">
              <ShopFilters {...filterProps} />
            </Box>

            <div>
              <ResultsToolbar
                total={total}
                sort={sort}
                setSort={setSort}
                appliedFilters={appliedFilters}
                clearFilters={clearFilters}
                openDrawer={openDrawer}
              />

              {isFetching && results.length === 0 ? (
                <LoaderComponent />
              ) : results.length === 0 ? (
                <Box className="rounded-2xl! bg-surface! px-6! py-16! text-center! ring-1! ring-gray-200!">
                  <Box className="mx-auto! mb-4! flex! h-14! w-14! items-center! justify-center! rounded-2xl! bg-hongbao-red-50! text-hongbao-red-600! dark:text-night-red!">
                    <StorefrontIcon size={26} weight="fill" />
                  </Box>
                  <Text fw={700} className="text-gray-900!">
                    {t("empty_title")}
                  </Text>
                  <Text size="sm" c="gray.6" className="mt-1!">
                    {t("empty_body")}
                  </Text>
                  <Button
                    onClick={clearFilters}
                    variant="light"
                    color="hongbao-red"
                    radius="xl"
                    className="mt-4!"
                  >
                    {t("clear_all_filters")}
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
            {t("filters")}
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
            {t("show_results", { count: total })}
          </Button>
        </Stack>
      </Drawer>

      <MobileBottomNav items={publicBottomNavItems} />
    </ClientLayout>
  );
};

export default ShopPage;
