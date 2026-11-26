"use client";

import ColorSchemeToggle from "@/components/ColorSchemeToggle/ColorSchemeToggle";
import { CourseTypeIcon } from "@/components/icons/productTypeIcons";
import { TUser } from "@/types/user";
import { Avatar, Badge, Container, Group, Menu } from "@mantine/core";
import { IconCaretDownFilled, IconLogout, IconUser } from "@tabler/icons-react";
import Cookies from "js-cookie";

interface Props {
  burgerComponent: React.ReactNode;
}

const DashboardNavbar: React.FC<Props> = ({ burgerComponent }) => {
  const user = JSON.parse(Cookies.get("user") || "{}") as TUser;
  return (
    <Container h="100%" size={"xl"}>
      <Group align="center" justify="space-between" h="100%">
        <Group align="center">
          {burgerComponent}
          {/* <Link href="/dashboard">
            <Image src={"/assets/logo.svg"} width={40} height={40} alt="logo" />
          </Link> */}
        </Group>
        <Group gap={10} wrap="nowrap">
          <ColorSchemeToggle />
          <Group className="hidden! md:flex!">
          {/* <Menu shadow="md" width={200} offset={5}>
            <Menu.Target>
              <Group gap={5}>
                <Avatar
                  name={user.name || ""}
                  alt={user.name || ""}
                  color="blue"
                />
                <IconCaretDownFilled size={15} />
              </Group>
            </Menu.Target>

            <Menu.Dropdown>
              <Menu.Label>Account</Menu.Label>
              <Menu.Item
                leftSection={<IconUser size={14} />}
                rightSection={<Badge color="blue">{user.role}</Badge>}
              >
                Profile
              </Menu.Item>
              <Menu.Item leftSection={<CourseTypeIcon size={14} />}>
                My courses
              </Menu.Item>

              <Menu.Divider />

              <Menu.Label>Danger zone</Menu.Label>
              <Menu.Item color="red" leftSection={<IconLogout size={14} />}>
                Logout
              </Menu.Item>
            </Menu.Dropdown>
          </Menu> */}
          </Group>
        </Group>
      </Group>
    </Container>
  );
};

export default DashboardNavbar;
