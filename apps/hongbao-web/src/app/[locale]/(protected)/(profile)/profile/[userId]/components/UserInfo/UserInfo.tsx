"use client";

import LearningStreak from "@/app/[locale]/(protected)/(profile)/profile/[userId]/components/LearningStreak/LearningStreak";
import MetaItem from "@/app/[locale]/(protected)/(profile)/profile/[userId]/components/UserInfo/components/MetaItem/MetaItem";
import { Link } from "@/i18n/navigation";
import {
  ActionIcon,
  Avatar,
  Badge,
  Button,
  CopyButton,
  Skeleton,
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
import { memo } from "react";
import useContainer, { TRole } from "./useContainer";

const roleColor: Record<TRole, string> = {
  ADMIN: "hongbao-maroon",
  TEACHER: "hongbao-gold",
  STAFF: "hongbao-brown",
  STUDENT: "hongbao-red",
};

/** Shortens a long opaque id to "prefix…suffix" so it fits on one line;
 * the full value stays available via the tooltip and the copy button. */
const elideMiddle = (value: string, head = 6, tail = 4) =>
  value.length > head + tail + 1
    ? `${value.slice(0, head)}…${value.slice(-tail)}`
    : value;

/**
 * Profile dashboard header: one card split into two flat panels - identity
 * (who you are, recognisable at a glance) and learning streak (how you're
 * doing). Identity is a compact horizontal row rather than a tall cover so
 * the streak stays above the fold.
 */
const UserInfo = () => {
  const { user, isLoading, role, joinedLabel, daysSinceJoin, settingsHref } =
    useContainer();

  return (
    <article className="group overflow-hidden rounded-3xl border border-gray-200 bg-surface shadow-sm">
      {/* ---------- identity panel ---------- */}
      <div className="relative overflow-hidden bg-gradient-to-br from-hongbao-red-50 via-surface to-hongbao-gold-50 px-5 py-5 sm:px-7 sm:py-6">
        {/* decorative texture + watermark, hidden from screen readers */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-0 w-1/2 opacity-40 bg-[radial-gradient(circle,var(--color-hongbao-red-200)_1px,transparent_1px)] bg-size-[14px_14px] [mask-image:linear-gradient(to_left,black,transparent)]"
        />
        <GraduationCapIcon
          aria-hidden
          weight="fill"
          className="pointer-events-none absolute -right-6 -bottom-8 w-36 h-36 text-hongbao-red-100 -rotate-12 transition-transform duration-300 ease-out group-hover:-rotate-6"
        />

        <div className="relative flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-5">
          {/* avatar + milestone badge */}
          <div className="relative shrink-0 w-fit">
            <Avatar
              src={user?.imageUrl || "/assets/logo-head.svg"}
              alt={user?.name || ""}
              name={user?.name || ""}
              size={76}
              radius="xl"
              p={user?.imageUrl ? 0 : 14}
              bg="hongbao-gold.3"
              className="ring-4! ring-surface! shadow-md!"
            />
            {daysSinceJoin !== null && daysSinceJoin >= 30 && (
              <Tooltip label={`Learning for ${daysSinceJoin} days`} withArrow>
                <div className="absolute -bottom-1 -right-1 flex items-center justify-center w-7 h-7 rounded-full bg-hongbao-gold-500 text-white ring-2 ring-surface shadow-sm">
                  <SparkleIcon size={14} weight="fill" />
                </div>
              </Tooltip>
            )}
          </div>

          {/* identity */}
          <div className="min-w-0 flex-1">
            {isLoading ? (
              <>
                <Skeleton height={24} width={180} radius="md" />
                <Skeleton height={14} width={260} radius="md" mt={10} />
              </>
            ) : (
              <>
                <div className="flex flex-wrap items-center gap-2.5 pr-24 sm:pr-0">
                  <Text
                    component="h1"
                    fw={800}
                    c="gray.9"
                    lineClamp={1}
                    className="text-xl! sm:text-2xl! leading-tight!"
                  >
                    {user?.name || ""}
                  </Text>
                  <Badge color={roleColor[role]} radius="sm" variant="light">
                    {role}
                  </Badge>
                </div>
                <Text size="sm" c="gray.6" mt={4}>
                  မင်္ဂလာပါ။ HongBao Chinese မှကြိုဆိုပါတယ်။
                </Text>
              </>
            )}

            {/* meta row - wraps on narrow screens */}
            <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 mt-3">
              {user?.email && (
                <MetaItem icon={<EnvelopeIcon size={16} />} label="Email">
                  <span title={user.email}>{user.email}</span>
                </MetaItem>
              )}
              {joinedLabel && (
                <MetaItem icon={<CalendarIcon size={16} />} label="Joined">
                  Joined <time dateTime={user?.createdAt}>{joinedLabel}</time>
                </MetaItem>
              )}
              {user?.id && (
                <MetaItem
                  icon={<IdentificationCardIcon size={16} />}
                  label="User ID"
                  action={
                    <CopyButton value={user.id}>
                      {({ copied, copy }) => (
                        <Tooltip
                          label={copied ? "ID copied" : "Copy ID"}
                          withArrow
                        >
                          <ActionIcon
                            onClick={copy}
                            color={copied ? "green" : "gray"}
                            variant="subtle"
                            size="sm"
                            radius="md"
                            aria-label="Copy user ID"
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
                </MetaItem>
              )}
            </div>
          </div>

          {/* primary action - pinned top-right on mobile, inline on desktop */}
          <Button
            component={Link}
            href={settingsHref}
            variant="default"
            radius="md"
            size="xs"
            leftSection={<GearSixIcon size={14} />}
            className="absolute! top-0! right-0! sm:static! sm:self-start! shrink-0!"
          >
            Settings
          </Button>
        </div>
      </div>

      {/* ---------- streak panel ---------- */}
      <div className="border-t border-gray-100 px-5 py-5 sm:px-7 sm:py-6">
        <LearningStreak />
      </div>
    </article>
  );
};

// No props - memo keeps the profile page's own state updates and query
// resolutions (stats, flashcards, memo progress) from re-rendering the card.
export default memo(UserInfo);
