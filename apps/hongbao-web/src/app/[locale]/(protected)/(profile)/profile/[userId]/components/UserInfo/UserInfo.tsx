"use client";

import {
  ActionIcon,
  Avatar,
  Badge,
  Box,
  CopyButton,
  Group,
  Stack,
  Text,
  Tooltip,
} from "@mantine/core";
import {
  CalendarIcon,
  CheckIcon,
  CopyIcon,
  EnvelopeIcon,
  SparkleIcon,
} from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import useContainer from "./useContainer";

type Role = "ADMIN" | "TEACHER" | "STAFF" | "STUDENT";

const roleColor: Record<Role, string> = {
  ADMIN: "hongbao-maroon",
  TEACHER: "hongbao-gold",
  STAFF: "hongbao-brown",
  STUDENT: "hongbao-red",
};

/** A small pill for a single piece of profile metadata (email, join date, ...). */
const InfoPill: React.FC<{
  icon: React.ReactNode;
  children: React.ReactNode;
}> = ({ icon, children }) => (
  <Group
    gap={8}
    wrap="nowrap"
    px={12}
    py={6}
    className="min-w-0! max-w-full! rounded-full! border! border-hongbao-red-100! bg-white/70!"
  >
    <Box className="flex! items-center! justify-center! shrink-0! text-hongbao-red-500!">
      {icon}
    </Box>
    <Text size="sm" c="gray.7" lineClamp={2} className="min-w-0!">
      {children}
    </Text>
  </Group>
);

const UserInfo = () => {
  const { user } = useContainer();
  const role = (user?.role as Role) || "STUDENT";

  const joinedAt = user?.createdAt ? new Date(user.createdAt) : null;
  const joinedLabel = joinedAt
    ? joinedAt.toLocaleDateString("en-US", { month: "short", year: "numeric" })
    : null;

  // Date.now() is impure, so the "days learning" count is computed after
  // mount rather than during render.
  const [daysLearning, setDaysLearning] = useState<number | null>(null);
  useEffect(() => {
    if (!user?.createdAt) return;
    const joined = new Date(user.createdAt).getTime();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDaysLearning(
      Math.max(0, Math.floor((Date.now() - joined) / (1000 * 60 * 60 * 24))),
    );
  }, [user?.createdAt]);

  return (
    <Box className="relative! overflow-hidden! rounded-3xl! border! border-hongbao-red-100! bg-gradient-to-br! from-white! via-hongbao-cream-50! to-hongbao-red-50! shadow-sm!">
      {/* decorative glow */}
      <Box className="pointer-events-none absolute -top-16 -right-16 w-56 h-56 rounded-full bg-hongbao-gold-200/35 blur-3xl" />
      <Box className="pointer-events-none absolute -bottom-20 -left-10 w-48 h-48 rounded-full bg-hongbao-red-100/50 blur-3xl" />

      <Stack
        p={{ base: 20, sm: 28 }}
        gap={18}
        className="relative! sm:flex-row!"
      >
        <Box className="relative! shrink-0! w-fit!">
          <Avatar
            src="/assets/logo-head.svg"
            alt={user?.name || ""}
            name={user?.name || ""}
            size={84}
            p={17}
            variant="outline"
            className="ring-4! ring-white! shadow-md!"
            bg={"hongbao-gold.3"}
          />
          {daysLearning !== null && daysLearning >= 30 && (
            <Tooltip label={`Learning for ${daysLearning} days`} withArrow>
              <Box className="absolute! -bottom-1! -right-1! flex! items-center! justify-center! w-7! h-7! rounded-full! bg-hongbao-gold-500! text-white! ring-2! ring-white! shadow-sm!">
                <SparkleIcon size={14} weight="fill" />
              </Box>
            </Tooltip>
          )}
        </Box>

        <Stack gap={12} className="min-w-0! flex-1!">
          <Text size="sm" c="gray.6">
            မင်္ဂလာပါ။ HongBao Chinese မှကြိုဆိုပါတယ်။
          </Text>

          <Group gap={10} wrap="wrap" align="center">
            <Text
              fw={800}
              className="text-xl! sm:text-2xl! leading-tight!"
              lineClamp={1}
            >
              {user?.name || ""}
            </Text>
            <Badge color={roleColor[role]} radius="sm">
              {role}
            </Badge>
          </Group>

          <Group gap={8} wrap="wrap">
            {user?.email && (
              <InfoPill icon={<EnvelopeIcon size={14} />}>
                {user.email}
              </InfoPill>
            )}
            {joinedLabel && (
              <InfoPill icon={<CalendarIcon size={14} />}>
                Joined {joinedLabel}
                {daysLearning !== null ? ` · ${daysLearning}d` : ""}
              </InfoPill>
            )}
          </Group>

          {user?.id && (
            <Group
              gap={6}
              wrap="nowrap"
              px={10}
              py={4}
              className="w-fit! max-w-full! rounded-lg! border! border-hongbao-red-100/70! bg-white/50!"
            >
              <Text
                size="xs"
                ff="monospace"
                c="gray.5"
                lineClamp={1}
                className="min-w-0!"
              >
                {user.id}
              </Text>
              <CopyButton value={user.id}>
                {({ copied, copy }) => (
                  <Tooltip label={copied ? "Copied" : "Copy ID"} withArrow>
                    <ActionIcon
                      onClick={copy}
                      color={copied ? "green" : "hongbao-red"}
                      variant="subtle"
                      size="sm"
                      aria-label="Copy user ID"
                      className="shrink-0!"
                    >
                      {copied ? (
                        <CheckIcon size={14} />
                      ) : (
                        <CopyIcon size={14} />
                      )}
                    </ActionIcon>
                  </Tooltip>
                )}
              </CopyButton>
            </Group>
          )}
        </Stack>
      </Stack>
    </Box>
  );
};

export default UserInfo;
