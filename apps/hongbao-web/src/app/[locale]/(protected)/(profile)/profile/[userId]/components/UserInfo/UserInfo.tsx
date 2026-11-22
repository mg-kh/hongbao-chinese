"use client";

import { Link } from "@/i18n/navigation";
import {
  ActionIcon,
  Avatar,
  Badge,
  Box,
  Button,
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
  GearSixIcon,
  GraduationCapIcon,
  IdentificationCardIcon,
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

/** Shortens a long opaque id to "prefix…suffix" so it fits on one line;
 * the full value stays available via the tooltip and the copy button. */
const elideMiddle = (value: string, head = 8, tail = 6) =>
  value.length > head + tail + 1
    ? `${value.slice(0, head)}…${value.slice(-tail)}`
    : value;

/** One label/value pair in the profile facts list (`<dt>` + `<dd>`). */
const FactItem: React.FC<{
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
  hint?: React.ReactNode;
  action?: React.ReactNode;
}> = ({ icon, label, children, hint, action }) => (
  <div className="flex items-center gap-3 min-w-0 px-4 py-3">
    <Box className="flex! items-center! justify-center! shrink-0! w-9! h-9! rounded-xl! bg-white! text-gray-500! border! border-gray-200!">
      {icon}
    </Box>
    <div className="min-w-0 flex-1">
      <Text
        component="dt"
        size="11px"
        fw={700}
        c="gray.5"
        className="uppercase! tracking-[0.08em]!"
      >
        {label}
      </Text>
      <Text
        component="dd"
        size="sm"
        fw={600}
        c="gray.8"
        truncate
        className="m-0!"
      >
        {children}
      </Text>
      {hint ? (
        <Text size="xs" c="gray.5" truncate>
          {hint}
        </Text>
      ) : null}
    </div>
    {action}
  </div>
);

const UserInfo = () => {
  const { user, settingsHref } = useContainer();
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

  /* Profile header card: a branded cover banner with the avatar overlapping
     its bottom edge, then identity (name + role), key facts, and the one
     quick action people come here for (settings). */
  return (
    <Box className="group overflow-hidden! rounded-3xl! border! border-gray-200! bg-white! shadow-sm!">
      {/* cover banner - decorative only */}
      <Box
        aria-hidden
        className="relative! h-24! sm:h-32! overflow-hidden! bg-gradient-to-br! from-hongbao-red-500! via-hongbao-red-600! to-hongbao-maroon-600!"
      >
        {/* faint dot texture */}
        <Box className="absolute! inset-0! opacity-20! bg-[radial-gradient(circle,white_1px,transparent_1px)]! bg-size-[14px_14px]!" />
        {/* warm gold glow */}
        <Box className="absolute! -top-16! -left-10! w-56! h-56! rounded-full! bg-hongbao-gold-300/30! blur-3xl!" />
        {/* watermark icon bleeding off the corner */}
        <Box className="absolute! -right-4! -bottom-10! text-white/15! -rotate-12! transition-transform! duration-300! ease-out! group-hover:-rotate-6! group-hover:scale-105!">
          <GraduationCapIcon
            weight="fill"
            className="w-36! h-36! sm:w-44! sm:h-44!"
          />
        </Box>
      </Box>

      <Stack px={{ base: 20, sm: 28 }} pb={{ base: 20, sm: 24 }} gap={14}>
        {/* avatar overlaps the cover; settings sits on the same row */}
        <Group justify="space-between" align="flex-end" wrap="nowrap">
          <Box className="relative! shrink-0! w-fit! -mt-10! sm:-mt-12!">
            <Avatar
              src="/assets/logo-head.svg"
              alt={user?.name || ""}
              name={user?.name || ""}
              size={88}
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

          <Button
            component={Link}
            href={settingsHref}
            variant="default"
            radius="md"
            size="xs"
            leftSection={<GearSixIcon size={14} />}
            className="shrink-0!"
          >
            Settings
          </Button>
        </Group>

        {/* identity */}
        <Stack gap={4} className="min-w-0!">
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
          <Text size="sm" c="gray.6">
            မင်္ဂလာပါ။ HongBao Chinese မှကြိုဆိုပါတယ်။
          </Text>
        </Stack>

        {/* key facts - a labelled description list: each value gets a
            clear label, the id is shown as a short monospace "abc…xyz"
            with a copy button, and the full value is in the tooltip */}
        <dl className="m-0 grid grid-cols-1 sm:grid-cols-3 rounded-2xl border border-gray-200 bg-gray-50 divide-y sm:divide-y-0 sm:divide-x divide-gray-200 overflow-hidden">
          {user?.email && (
            <FactItem icon={<EnvelopeIcon size={16} />} label="Email">
              <span title={user.email}>{user.email}</span>
            </FactItem>
          )}
          {joinedLabel && (
            <FactItem
              icon={<CalendarIcon size={16} />}
              label="Joined"
              hint={
                daysLearning !== null
                  ? `${daysLearning} ${daysLearning === 1 ? "day" : "days"} learning`
                  : undefined
              }
            >
              <time dateTime={user?.createdAt}>{joinedLabel}</time>
            </FactItem>
          )}
          {user?.id && (
            <FactItem
              icon={<IdentificationCardIcon size={16} />}
              label="User ID"
              action={
                <CopyButton value={user.id}>
                  {({ copied, copy }) => (
                    <Tooltip label={copied ? "ID copied" : "Copy ID"} withArrow>
                      <ActionIcon
                        onClick={copy}
                        color={copied ? "green" : "gray"}
                        variant={copied ? "light" : "default"}
                        size="md"
                        radius="md"
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
              }
            >
              <Tooltip label={user.id} withArrow openDelay={300}>
                <span className="font-mono">{elideMiddle(user.id)}</span>
              </Tooltip>
            </FactItem>
          )}
        </dl>
      </Stack>
    </Box>
  );
};

export default UserInfo;
