"use client";

import { Link } from "@/i18n/navigation";
import { Box, Paper, Text } from "@mantine/core";
import {
  CaretRightIcon,
  GearIcon,
  ReceiptIcon,
} from "@phosphor-icons/react";
import { useParams } from "next/navigation";

type Row = {
  label: string;
  caption: string;
  href: string;
  icon: React.ReactNode;
};

/**
 * Account-level destinations that don't belong in the mobile bottom bar
 * (which is reserved for the learning tools). Gives every screen size a
 * clear path to order history and settings from the profile overview.
 */
const AccountLinks = () => {
  const { userId } = useParams();

  const rows: Row[] = [
    {
      label: "Purchase history",
      caption: "Orders, review status & receipts",
      href: `/profile/${userId}/purchase-history`,
      icon: <ReceiptIcon size={17} weight="fill" />,
    },
    {
      label: "Settings",
      caption: "Profile and account preferences",
      href: `/profile/${userId}/settings`,
      icon: <GearIcon size={17} weight="fill" />,
    },
  ];

  return (
    <Paper withBorder bdrs={16} p={6} className="border-gray-200! shadow-sm!">
      <Box component="nav" aria-label="Account" className="flex! flex-col!">
        {rows.map((row, i) => (
          <Link
            key={row.href}
            href={row.href}
            className={`group! flex! items-center! gap-3! rounded-xl! px-3! py-3! no-underline! transition-colors! duration-200! hover:bg-gray-50! ${
              i > 0 ? "border-t! border-gray-100!" : ""
            }`}
          >
            <Box className="flex! items-center! justify-center! shrink-0! w-9! h-9! rounded-lg! bg-gray-100! text-gray-500! transition-colors! duration-200! group-hover:bg-hongbao-red-50! group-hover:text-hongbao-red-600!">
              {row.icon}
            </Box>
            <Box className="flex-1! min-w-0!">
              <Text size="sm" fw={600} c="gray.8" lineClamp={1}>
                {row.label}
              </Text>
              <Text size="11px" c="gray.5" lineClamp={1}>
                {row.caption}
              </Text>
            </Box>
            <CaretRightIcon
              size={13}
              weight="bold"
              className="shrink-0! text-gray-300! transition-colors! duration-200! group-hover:text-hongbao-red-400!"
            />
          </Link>
        ))}
      </Box>
    </Paper>
  );
};

export default AccountLinks;
