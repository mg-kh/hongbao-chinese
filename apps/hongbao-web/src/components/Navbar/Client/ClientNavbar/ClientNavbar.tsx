"use client";

import useProfile from "@/hooks/global-data-fetching/useProfile";
import { useActiveRoute } from "@/hooks/useActiveRoute";
import { Link } from "@/i18n/navigation";
import { Show, SignInButton, SignOutButton } from "@clerk/nextjs";
import {
  Avatar,
  Badge,
  Box,
  Burger,
  Button,
  Container,
  Divider,
  Drawer,
  Group,
  Menu,
  Stack,
  Text,
  UnstyledButton,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  IconArticle,
  IconBook,
  IconBuildingStore,
  IconCaretDownFilled,
  IconChevronRight,
  IconDashboard,
  IconLogin2,
  IconLogout,
  IconShieldCheck,
  IconSparkles,
  IconUser,
  IconWriting,
} from "@tabler/icons-react";
import Image from "next/image";
import CartButton from "./components/CartButton/CartButton";

/** A single row in the mobile drawer menu. */
const DrawerRow: React.FC<{
  icon: React.ReactNode;
  label: string;
  href?: string;
  onClick?: () => void;
  danger?: boolean;
}> = ({ icon, label, href, onClick, danger }) => {
  const inner = (
    <Group
      gap={12}
      wrap="nowrap"
      py={10}
      px={12}
      className={`rounded-xl! transition-colors! duration-200! ease-out! ${
        danger
          ? "hover:bg-red-50! active:bg-red-100!"
          : "hover:bg-gray-50! active:bg-gray-100!"
      }`}
    >
      <Box
        className={`flex! items-center! justify-center! w-9! h-9! rounded-lg! shrink-0! ${
          danger
            ? "bg-red-50! text-red-600!"
            : "bg-hongbao-red-50! text-hongbao-red-600!"
        }`}
      >
        {icon}
      </Box>
      <Text
        fw={600}
        size="sm"
        c={danger ? "red.7" : "gray.8"}
        className="flex-1!"
      >
        {label}
      </Text>
      {!danger && (
        <IconChevronRight size={16} className="text-gray-400! shrink-0!" />
      )}
    </Group>
  );

  if (href) {
    return (
      <Link href={href} onClick={onClick} className="no-underline!">
        {inner}
      </Link>
    );
  }

  return (
    <UnstyledButton onClick={onClick} className="w-full!">
      {inner}
    </UnstyledButton>
  );
};

/** Primary nav - kept short deliberately; scannability drops past ~5-7 items. */
const navItems = [
  { label: "Home", href: "/", match: "/" },
  { label: "Shop", href: "/shop", match: "shop" },
  { label: "Mock Test", href: "/mock-test", match: "mock-test" },
  { label: "Reading Blogs", href: "/blogs", match: "blogs" },
  { label: "Privacy Policy", href: "/privacy-policy", match: "privacy-policy" },
];

const ClientNavbar = () => {
  const [menuOpened, { open: openMenu, close: closeMenu }] =
    useDisclosure(false);
  const { data: user } = useProfile();
  const isActiveRoute = useActiveRoute();
  return (
    <>
      <Container h="100%" size="xl">
        <Group align="center" justify="space-between" h="100%" wrap="nowrap">
          {/* ---------- brand + nav, kept together on the left so the bar
                         reads as one balanced block instead of a lone
                         floating link in the middle ---------- */}
          <Group wrap="nowrap" className="min-w-0! gap-0! lg:gap-7!">
            <Link href="/" className="min-w-0! group! shrink-0!">
              <Group gap={10} align="center" wrap="nowrap">
                <Image
                  src={"/assets/logo.svg"}
                  width={60}
                  height={60}
                  alt="logo"
                  className="w-11! h-11! sm:w-[54px]! sm:h-[54px]! transition-transform! duration-200! ease-out! group-hover:scale-105!"
                />
                <Stack gap={0} className="min-w-0!">
                  <Text
                    fw={800}
                    c={"hongbao-red"}
                    className="text-base! sm:text-xl! leading-tight! tracking-tight!"
                    lineClamp={1}
                  >
                    Hong Bao
                  </Text>
                  <Text
                    fw={600}
                    c={"gray.6"}
                    className="text-[10px]! sm:text-xs! uppercase! tracking-[0.12em]!"
                    lineClamp={1}
                  >
                    Chinese Online Class
                  </Text>
                </Stack>
              </Group>
            </Link>

            {/* ---------- desktop nav ---------- */}
            <Group
              component="nav"
              aria-label="Primary"
              className="hidden! md:flex!"
              gap={2}
              wrap="nowrap"
            >
              {navItems.map((item) => {
                const active = isActiveRoute(item.match);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className="no-underline!"
                  >
                    <Text
                      size="sm"
                      fw={active ? 700 : 600}
                      px={14}
                      py={8}
                      className={`rounded-full! whitespace-nowrap! transition-colors! duration-200! ease-out! ${
                        active
                          ? "bg-hongbao-red-50! text-hongbao-red-700!"
                          : "text-gray-600! hover:bg-gray-50! hover:text-hongbao-red-600!"
                      }`}
                    >
                      {item.label}
                    </Text>
                  </Link>
                );
              })}
            </Group>
          </Group>

          {/* ---------- desktop actions ---------- */}
          <Group className="hidden! md:flex!" wrap="nowrap">
            <CartButton />
            <Show when="signed-in">
              <Menu
                shadow="lg"
                width={272}
                offset={10}
                radius={20}
                classNames={{
                  dropdown: "p-2! border-gray-200!",
                  item: "rounded-xl! py-2.5! px-2.5! transition-colors! duration-150! ease-out! hover:bg-hongbao-cream-50!",
                  label:
                    "px-2.5! pt-3! pb-1.5! text-[10px]! font-bold! uppercase! tracking-[0.14em]! text-gray-400!",
                  divider: "my-1.5! border-gray-100!",
                }}
              >
                <Menu.Target>
                  <Group
                    gap={8}
                    wrap="nowrap"
                    pl={4}
                    pr={10}
                    py={4}
                    className="cursor-pointer! rounded-full! border! border-gray-200! bg-white! transition-colors! duration-200! ease-out! hover:border-hongbao-red-200! hover:bg-hongbao-cream-50!"
                  >
                    <Avatar
                      src={user?.imageUrl || "/assets/logo-head.svg"}
                      name={user?.name || ""}
                      alt={user?.name || ""}
                      size={32}
                      p={user?.imageUrl ? 0 : 5}
                      bg="hongbao-gold.3"
                    />
                    <Text
                      size="sm"
                      fw={600}
                      c="gray.8"
                      lineClamp={1}
                      className="max-w-[140px]!"
                    >
                      {user?.name}
                    </Text>
                    <IconCaretDownFilled
                      size={12}
                      className="text-gray-400! shrink-0!"
                    />
                  </Group>
                </Menu.Target>

                <Menu.Dropdown>
                  {/* identity header */}
                  <Box
                    p={12}
                    className="rounded-2xl! bg-gradient-to-br! from-hongbao-cream-50! to-hongbao-red-50/60!"
                  >
                    <Group gap={10} wrap="nowrap">
                      <Avatar
                        src={user?.imageUrl || "/assets/logo-head.svg"}
                        name={user?.name || ""}
                        alt={user?.name || ""}
                        size={42}
                        p={user?.imageUrl ? 0 : 7}
                        bg="hongbao-gold.3"
                        className="ring-2! ring-white!"
                      />
                      <Stack gap={2} className="min-w-0!">
                        <Text fw={700} size="sm" lineClamp={1}>
                          {user?.name}
                        </Text>
                        <Text size="xs" c="gray.5" lineClamp={1}>
                          {user?.email}
                        </Text>
                        {user?.role && (
                          <Badge
                            size="xs"
                            radius="sm"
                            variant="light"
                            color="hongbao-gold"
                            className="w-fit! mt-0.5!"
                          >
                            {user?.role}
                          </Badge>
                        )}
                      </Stack>
                    </Group>
                  </Box>

                  <Menu.Label>Account</Menu.Label>
                  <Menu.Item
                    href={`/profile/${user?.id}`}
                    component={Link}
                    leftSection={
                      <Box className="flex! items-center! justify-center! w-8! h-8! rounded-lg! bg-hongbao-red-50! text-hongbao-red-600!">
                        <IconUser size={15} />
                      </Box>
                    }
                  >
                    <Text size="sm" fw={600} c="gray.8">
                      Profile
                    </Text>
                  </Menu.Item>
                  <Menu.Item
                    href={`/profile/${user?.id}/my-courses`}
                    component={Link}
                    leftSection={
                      <Box className="flex! items-center! justify-center! w-8! h-8! rounded-lg! bg-hongbao-red-50! text-hongbao-red-600!">
                        <IconBook size={15} />
                      </Box>
                    }
                  >
                    <Text size="sm" fw={600} c="gray.8">
                      My courses
                    </Text>
                  </Menu.Item>
                  {user?.role !== "STUDENT" && (
                    <Menu.Item
                      component={Link}
                      href="/dashboard"
                      leftSection={
                        <Box className="flex! items-center! justify-center! w-8! h-8! rounded-lg! bg-hongbao-red-50! text-hongbao-red-600!">
                          <IconDashboard size={15} />
                        </Box>
                      }
                    >
                      <Text size="sm" fw={600} c="gray.8">
                        Dashboard
                      </Text>
                    </Menu.Item>
                  )}

                  <Menu.Divider />

                  <Menu.Label>Danger zone</Menu.Label>
                  <SignOutButton component="div">
                    <Menu.Item
                      className="hover:bg-red-50!"
                      leftSection={
                        <Box className="flex! items-center! justify-center! w-8! h-8! rounded-lg! bg-red-50! text-red-600!">
                          <IconLogout size={15} />
                        </Box>
                      }
                    >
                      <Text size="sm" fw={600} c="red.7">
                        Sign out
                      </Text>
                    </Menu.Item>
                  </SignOutButton>
                </Menu.Dropdown>
              </Menu>
            </Show>
            <Show when="signed-out">
              <SignInButton>
                {/* primary action, kept visually dominant in the upper right */}
                <Button
                  radius="xl"
                  color="hongbao-red"
                  leftSection={<IconLogin2 size={18} />}
                  className="px-6! shadow-[0_8px_20px_-8px_rgba(245,34,45,0.65)]! transition-transform! duration-200! ease-out! hover:-translate-y-0.5!"
                  styles={{ label: { fontWeight: 700 } }}
                >
                  Signin
                </Button>
              </SignInButton>
            </Show>
          </Group>

          {/* ---------- mobile burger ---------- */}
          <Burger
            opened={menuOpened}
            onClick={openMenu}
            size="md"
            aria-label="Open menu"
            className="md:hidden! shrink-0!"
          />
        </Group>
      </Container>

      {/* ---------- mobile drawer ---------- */}
      <Drawer
        opened={menuOpened}
        onClose={closeMenu}
        position="right"
        size="80%"
        title={
          <Text fw={700} c="hongbao-red">
            Menu
          </Text>
        }
        className="md:hidden!"
        classNames={{ body: "h-[calc(100%-3.75rem)]! flex! flex-col!" }}
      >
        <Stack gap={18} className="flex-1!">
          <Show when="signed-in">
            {/* profile card */}
            <Box
              p={16}
              className="rounded-2xl! bg-gradient-to-br! from-hongbao-red-600! to-hongbao-maroon-700! shadow-sm!"
            >
              <Group gap={12} wrap="nowrap">
                <Avatar
                  src={user?.imageUrl || "/assets/logo-head.svg"}
                  name={user?.name || ""}
                  alt={user?.name || ""}
                  size={48}
                  p={user?.imageUrl ? 0 : 8}
                  bg="hongbao-gold.3"
                  className="ring-2! ring-white/40!"
                  styles={{
                    placeholder: {
                      backgroundColor: "white",
                      color: "var(--mantine-color-hongbao-red-7)",
                      fontWeight: 700,
                    },
                  }}
                />
                <Stack gap={3} className="min-w-0!">
                  <Text fw={700} c="white" lineClamp={1}>
                    {user?.name}
                  </Text>
                  <Text
                    size="xs"
                    c="white"
                    className="opacity-75!"
                    lineClamp={1}
                  >
                    {user?.email}
                  </Text>
                  {user?.role && (
                    <Badge
                      size="xs"
                      radius="sm"
                      variant="light"
                      color="hongbao-gold"
                      className="w-fit!"
                    >
                      {user?.role}
                    </Badge>
                  )}
                </Stack>
              </Group>

              <Divider my={12} className="border-white/20!" />

              <SignOutButton component="div">
                <UnstyledButton className="w-full!">
                  <Group
                    gap={8}
                    justify="center"
                    py={8}
                    className="rounded-xl! bg-white/15! transition-colors! duration-200! ease-out! hover:bg-white/25! active:bg-white/30!"
                  >
                    <IconLogout size={16} className="text-white!" />
                    <Text size="sm" fw={600} c="white">
                      Sign out
                    </Text>
                  </Group>
                </UnstyledButton>
              </SignOutButton>
            </Box>

            {/* account links */}
            <Stack gap={2}>
              <Text
                size="10px"
                fw={700}
                c="gray.5"
                className="uppercase! tracking-[0.16em]! px-3! pb-1!"
              >
                Account
              </Text>
              <DrawerRow
                icon={<IconUser size={18} />}
                label="Profile"
                href={`/profile/${user?.id}`}
                onClick={closeMenu}
              />
              <DrawerRow
                icon={<IconBook size={18} />}
                label="My courses"
                href={`/profile/${user?.id}/my-courses`}
                onClick={closeMenu}
              />
              {user?.role !== "STUDENT" && (
                <DrawerRow
                  icon={<IconDashboard size={18} />}
                  label="Dashboard"
                  href="/dashboard"
                  onClick={closeMenu}
                />
              )}
            </Stack>
          </Show>

          <Show when="signed-out">
            {/* welcome card */}
            <Box
              p={20}
              className="rounded-2xl! bg-gradient-to-br! from-hongbao-red-600! to-hongbao-maroon-700! shadow-sm!"
            >
              <Stack gap={14} align="center">
                <Box className="flex! items-center! justify-center! w-16! h-16! rounded-2xl! bg-white/15! ring-1! ring-white/25!">
                  <Image
                    src={"/assets/logo.svg"}
                    width={44}
                    height={44}
                    alt=""
                  />
                </Box>

                <Stack gap={4} align="center">
                  <Text fw={700} c="white" ta="center">
                    Welcome to Hong Bao
                  </Text>
                  <Text
                    size="xs"
                    c="white"
                    ta="center"
                    className="opacity-75! leading-relaxed!"
                  >
                    Sign in to track your progress and pick up where you left
                    off.
                  </Text>
                </Stack>

                <SignInButton>
                  <Button
                    size="md"
                    fullWidth
                    variant="white"
                    color="hongbao-red"
                    leftSection={<IconLogin2 size={18} />}
                  >
                    Signin
                  </Button>
                </SignInButton>
              </Stack>
            </Box>

            <Group gap={8} justify="center">
              <IconSparkles size={14} className="text-hongbao-red-500!" />
              <Text size="xs" fw={600} c="gray.6">
                Trusted by 248,000+ learners worldwide
              </Text>
            </Group>
          </Show>

          {/* always available, signed in or not */}
          <Stack gap={2}>
            <Text
              size="10px"
              fw={700}
              c="gray.5"
              className="uppercase! tracking-[0.16em]! px-3! pb-1!"
            >
              Browse
            </Text>
            <DrawerRow
              icon={<IconBuildingStore size={18} />}
              label="Shop"
              href="/shop"
              onClick={closeMenu}
            />
            <CartButton variant="row" onNavigate={closeMenu} />
            <DrawerRow
              icon={<IconWriting size={18} />}
              label="Mock Test"
              href="/mock-test"
              onClick={closeMenu}
            />
            <DrawerRow
              icon={<IconArticle size={18} />}
              label="Reading Blogs"
              href="/blogs"
              onClick={closeMenu}
            />
            <DrawerRow
              icon={<IconShieldCheck size={18} />}
              label="Privacy Policy"
              href="/privacy-policy"
              onClick={closeMenu}
            />
          </Stack>
        </Stack>
      </Drawer>
    </>
  );
};

export default ClientNavbar;
