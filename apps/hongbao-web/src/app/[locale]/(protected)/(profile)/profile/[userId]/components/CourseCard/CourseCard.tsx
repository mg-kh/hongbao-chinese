"use client";

import { TMyCourse } from "@/app/[locale]/(protected)/(profile)/profile/[userId]/types/my-courses.type";
import { Link } from "@/i18n/navigation";
import { cn } from "@/utils/cn";
import { Badge, Box, Button, Image, Paper, Text } from "@mantine/core";
import {
  ArrowRightIcon,
  BookOpenTextIcon,
  CalendarDotIcon,
  CaretRightIcon,
  ExamIcon,
  HourglassIcon,
  XCircleIcon,
} from "@phosphor-icons/react";
import useContainer, { TMetaKind } from "./useContainer";

interface Props {
  data: TMyCourse;
}

const metaIcons: Record<TMetaKind, React.ReactNode> = {
  calendar: <CalendarDotIcon size={13} />,
  hourglass: <HourglassIcon size={13} />,
  rejected: <XCircleIcon size={13} />,
};

const CourseCard: React.FC<Props> = ({ data }) => {
  const { type, status, meta, isActive, isExpired, isMuted, href, renewHref } =
    useContainer(data);
  const TypeIcon = data.type === "course" ? BookOpenTextIcon : ExamIcon;

  const body = (
    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
      <div className="flex items-center gap-3 min-w-0 flex-1">
        {/* media - cover image when available, otherwise a type icon tile
            of the same size so cards line up either way */}
        {data.thumbnail ? (
          <Image
            src={data.thumbnail}
            alt={data.title}
            fit="cover"
            radius="md"
            className={cn(
              "shrink-0! w-16! h-12! sm:w-20! sm:h-14!",
              isMuted && "grayscale! opacity-70!",
            )}
          />
        ) : (
          <Box
            className={cn(
              "flex! items-center! justify-center! shrink-0! w-16! h-12! sm:w-20! sm:h-14! rounded-xl!",
              type.tile,
              isMuted && "grayscale! opacity-70!",
            )}
          >
            <TypeIcon size={22} weight="duotone" />
          </Box>
        )}

        <div className="min-w-0 flex-1 space-y-1">
          {/* type + status chips */}
          <div className="flex flex-wrap items-center gap-1">
            <Badge
              size="xs"
              radius="sm"
              variant="light"
              color={type.color}
              leftSection={<TypeIcon size={10} weight="bold" />}
            >
              {type.label}
            </Badge>
            <Badge size="xs" radius="sm" variant="dot" color={status.color}>
              {status.label}
            </Badge>
          </div>

          <Text
            size="sm"
            fw={700}
            lineClamp={1}
            c={isMuted ? "gray.6" : "dark.7"}
            className="leading-snug!"
          >
            {data.title}
          </Text>

          {meta && (
            <div className="flex items-center gap-1 text-gray-500">
              {metaIcons[meta.kind]}
              <Text size="xs" c="gray.6" lineClamp={1}>
                {meta.text}
              </Text>
            </div>
          )}
        </div>
      </div>

      {/* trailing action */}
      {isActive && (
        <Box className="hidden! sm:flex! items-center! justify-center! w-7! h-7! shrink-0! rounded-full! bg-gray-50! text-gray-500! transition-colors! duration-200! group-hover:bg-hongbao-red-500! group-hover:text-white!">
          <CaretRightIcon size={13} weight="bold" />
        </Box>
      )}
      {isExpired && (
        <Button
          component={Link}
          href={renewHref}
          rightSection={<ArrowRightIcon size={12} />}
          color="hongbao-red"
          radius="md"
          size="xs"
          className="w-full! sm:w-auto! shrink-0!"
        >
          သက်တမ်းတိုးရန်
        </Button>
      )}
    </div>
  );

  const cardClass = cn(
    "block! no-underline! border! border-gray-100! transition-all! duration-200!",
    isActive && "group! hover:border-hongbao-red-200! hover:shadow-sm!",
    isMuted && "bg-gray-50/70!",
    // expired keeps the muted body with a dashed gray frame
    isExpired && "border-dashed! border-gray-300!",
  );

  return isActive ? (
    <Paper component={Link} href={href} p={10} bdrs={12} className={cardClass}>
      {body}
    </Paper>
  ) : (
    <Paper p={10} bdrs={12} className={cardClass}>
      {body}
    </Paper>
  );
};

export default CourseCard;
