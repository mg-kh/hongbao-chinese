"use client";

import CustomBreadCrumb from "@/components/CustomBreadCrumb/CustomBreadCrumb";
import { pluralize } from "@/utils/pluralize";
import MobileBottomNav from "@/components/Navbar/MobileBottomNav/MobileBottomNav";
import { publicBottomNavItems } from "@/components/Navbar/MobileBottomNav/publicNavItems";
import { Link } from "@/i18n/navigation";
import ClientLayout from "@/layouts/ClientLayout/ClientLayout";
import { currencyFormatter } from "@/utils/currencyFormatter";
import {
  Box,
  Button,
  Checkbox,
  Container,
  Group,
  Stack,
  Text,
} from "@mantine/core";
import { ShoppingBagIcon, StorefrontIcon } from "@phosphor-icons/react";
import { IconArrowRight, IconTrash } from "@tabler/icons-react";
import CartLine from "../CartLine/CartLine";
import CartSummary from "../CartSummary/CartSummary";
import useContainer from "./useContainer";

const CartPage = () => {
  const {
    items,
    count,
    subtotal,
    discountTotal,
    promoTotal,
    total,
    removeItem,
    clearCart,
    setItemMonths,
    isReady,
    goToCheckout,
    agreedToTerms,
    setAgreedToTerms,
  } = useContainer();

  const isEmpty = isReady && count === 0;

  return (
    <ClientLayout size={"100%"} p={0} hideFooterOnMobile>
      <Container size={"xl"} px={{ base: 16, sm: 24 }}>
        <Stack gap={16} py={{ base: 16, md: 28 }}>
          <Group justify="space-between" align="flex-end" wrap="nowrap">
            <Group gap={10} align="flex-end" wrap="nowrap" miw={0}>
              <CustomBreadCrumb
                title="Shopping Cart"
                links={[
                  { label: "Shop", href: "/shop", isActive: true },
                  { label: "Cart", href: "", isActive: false },
                ]}
              />
              {isReady && count > 0 && (
                <span className="mb-1! shrink-0! rounded-full! bg-hongbao-red-50! px-2.5! py-0.5! text-xs! font-bold! text-hongbao-red-700!">
                  {pluralize(count, "item")}
                </span>
              )}
            </Group>
            {isReady && count > 0 && (
              <button
                type="button"
                onClick={clearCart}
                className="flex! items-center! gap-1! text-xs! font-semibold! text-gray-500! transition-colors! duration-200! hover:text-hongbao-red-600! cursor-pointer!"
              >
                <IconTrash size={13} />
                Clear cart
              </button>
            )}
          </Group>

          {!isReady ? null : isEmpty ? (
            <Box className="rounded-2xl! bg-white! ring-1! ring-gray-200! py-16! px-6! text-center!">
              <Box className="mx-auto! mb-4! flex! items-center! justify-center! w-16! h-16! rounded-2xl! bg-hongbao-red-50! text-hongbao-red-600!">
                <ShoppingBagIcon size={28} weight="fill" />
              </Box>
              <Text fw={700} className="text-gray-900!">
                Your cart is empty
              </Text>
              <Text size="sm" c="gray.6" className="mt-1!">
                Browse courses, flashcards, and mock tests to get started.
              </Text>
              <Button
                component={Link}
                href="/shop"
                variant="filled"
                color="hongbao-red"
                radius="xl"
                className="mt-4!"
              >
                Browse the shop
              </Button>
            </Box>
          ) : (
            <div className="grid! grid-cols-1! lg:grid-cols-[1fr_360px]! gap-6! lg:gap-8! items-start!">
              <Box className="overflow-hidden! rounded-2xl! bg-white! ring-1! ring-gray-200!">
                {/* seller row */}
                <Group
                  gap={8}
                  wrap="nowrap"
                  className="border-b! border-gray-100! px-4! py-3!"
                >
                  <span className="flex! h-6! w-6! items-center! justify-center! rounded-md! bg-hongbao-red-500! text-white!">
                    <StorefrontIcon size={14} weight="fill" />
                  </span>
                  <Text fw={700} size="sm" className="text-gray-900!">
                    Hong Bao Chinese
                  </Text>
                </Group>

                <div className="px-4!">
                  {items.map(({ product, months }) => (
                    <div
                      key={product.id}
                      className="border-b! border-gray-100! last:border-b-0!"
                    >
                      <CartLine
                        product={product}
                        months={months ?? 1}
                        onRemove={removeItem}
                        onMonthsChange={setItemMonths}
                      />
                    </div>
                  ))}
                </div>
              </Box>

              {/* desktop summary */}
              <Box className="hidden! lg:block! lg:sticky! lg:top-24!">
                <CartSummary
                  items={items}
                  count={count}
                  subtotal={subtotal}
                  discountTotal={discountTotal}
                  promoTotal={promoTotal}
                  total={total}
                  agreedToTerms={agreedToTerms}
                  onAgreedToTermsChange={setAgreedToTerms}
                  onCheckout={goToCheckout}
                />
              </Box>
            </div>
          )}
        </Stack>
      </Container>

      {/* mobile sticky checkout bar - thumb zone */}
      {isReady && !isEmpty && (
        <Box className="lg:hidden! fixed! bottom-16! left-0! right-0! z-40! border-t! border-gray-200! bg-white/95! backdrop-blur-md! px-4! py-2.5! shadow-[0_-4px_16px_-8px_rgba(0,0,0,0.2)]!">
          <Stack gap={8}>
            <Checkbox
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.currentTarget.checked)}
              size="xs"
              color="hongbao-red"
              label={
                <Text size="11px" c="gray.6">
                  I agree to the Terms and Conditions and Privacy Policy
                </Text>
              }
            />
            <Group justify="space-between" wrap="nowrap" gap={12}>
              <Stack gap={0}>
                <Text
                  size="10px"
                  fw={700}
                  c="gray.5"
                  className="uppercase! tracking-[0.1em]!"
                >
                  Total ({count})
                </Text>
                <Text fw={800} c="hongbao-red">
                  {currencyFormatter({ value: total, currencySample: "MMK" })}
                </Text>
              </Stack>
              <Button
                onClick={goToCheckout}
                disabled={!agreedToTerms}
                size="md"
                radius="xl"
                color="hongbao-red"
                rightSection={<IconArrowRight size={16} />}
                className="flex-1! max-w-[220px]!"
              >
                Checkout
              </Button>
            </Group>
          </Stack>
        </Box>
      )}

      <MobileBottomNav items={publicBottomNavItems} />
    </ClientLayout>
  );
};

export default CartPage;
