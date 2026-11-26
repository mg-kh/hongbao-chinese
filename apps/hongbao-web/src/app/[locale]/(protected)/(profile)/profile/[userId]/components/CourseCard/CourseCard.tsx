"use client";

import { TMyCourse } from "@/app/[locale]/(protected)/(profile)/profile/[userId]/types/my-courses.type";
import { Link } from "@/i18n/navigation";
import { cn } from "@/utils/cn";
import { Badge, Box, Button, Image, Paper, Text } from "@mantine/core";
import {
  ArrowRightIcon,
  CalendarDotIcon,
  HourglassIcon,
  XCircleIcon,
} from "@phosphor-icons/react";
import { PRODUCT_TYPE_ICONS } from "@/components/icons/productTypeIcons";
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
  const TypeIcon = PRODUCT_TYPE_ICONS[data.type];

  const body = (
    <div className="flex flex-col h-full gap-3">
      {/* media - cover image when available, otherwise a type icon tile
          of the same size so cards line up either way */}
      {data.thumbnail ? (
        <Image
          src={data.thumbnail}
          alt={data.title}
          fit="cover"
          radius="md"
          className={cn(
            "w-full! aspect-video! shrink-0!",
            isMuted && "grayscale! opacity-70!",
          )}
        />
      ) : (
        <Box
          className={cn(
            "flex! items-center! justify-center! w-full! aspect-video! shrink-0! rounded-xl!",
            type.tile,
            isMuted && "grayscale! opacity-70!",
          )}
        >
          <TypeIcon size={40} weight="duotone" />
        </Box>
      )}

      <div className="min-w-0 flex-1 space-y-1.5">
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
          lineClamp={2}
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

      {/* trailing action - pinned to the bottom so cards in a row align */}
      {isExpired && (
        <Button
          component={Link}
          href={renewHref}
          rightSection={<ArrowRightIcon size={12} />}
          color="hongbao-red"
          radius="md"
          size="xs"
          fullWidth
        >
          သက်တမ်းတိုးရန်
        </Button>
      )}
    </div>
  );

  const cardClass = cn(
    "block! h-full! no-underline! border! border-gray-100! transition-all! duration-200!",
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
