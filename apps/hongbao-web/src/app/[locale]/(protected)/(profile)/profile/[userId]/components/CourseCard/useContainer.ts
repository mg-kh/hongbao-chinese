import {
  TEnrollmentStatus,
  TMyCourse,
} from "@/app/[locale]/(protected)/(profile)/profile/[userId]/types/my-courses.type";
import { format } from "date-fns";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";

export type TMetaKind = "calendar" | "hourglass" | "rejected";

type TFn = ReturnType<typeof useTranslations<"Profile.CourseCard">>;

/** Visuals per product type - drives the icon tile and the type chip. */
const typeConfig: Record<
  TMyCourse["type"],
  { label: string; color: string; tile: string }
> = {
  course: {
    label: "types.course",
    color: "hongbao-red",
    tile: "bg-hongbao-red-50! text-hongbao-red-600!",
  },
  "mock-test": {
    label: "types.mock_test",
    color: "hongbao-gold",
    tile: "bg-hongbao-gold-50! text-hongbao-gold-700!",
  },
  flashcard: {
    label: "types.flashcard",
    color: "hongbao-orange",
    tile: "bg-hongbao-orange-50! text-hongbao-orange-600!",
  },
};

const statusConfig: Record<
  TEnrollmentStatus,
  { label: string; color: string }
> = {
  APPROVED: { label: "status.approved", color: "green" },
  PENDING: { label: "status.pending", color: "hongbao-orange" },
  EXPIRED: { label: "status.expired", color: "gray" },
  REJECTED: { label: "status.rejected", color: "red" },
};

const fmt = (d: string) => format(new Date(d), "dd MMM yyyy");

/**
 * One-line status detail shown under the title. Expired cards have none -
 * the status badge already says it.
 */
const getMeta = (
  data: TMyCourse,
  t: TFn,
): { kind: TMetaKind; text: string } | null => {
  switch (data.status) {
    case "APPROVED":
      return {
        kind: "calendar",
        text: data.expiredAt
          ? t("meta.access_until", { date: fmt(data.expiredAt) })
          : data.type === "flashcard"
            ? t("meta.lifetime")
            : t("meta.months_access", { months: data.perTime }),
      };
    case "PENDING":
      return {
        kind: "hourglass",
        text: t("meta.pending", { date: fmt(data.createdAt) }),
      };
    case "EXPIRED":
      return null;
    case "REJECTED":
      return { kind: "rejected", text: t("meta.rejected") };
  }
};

const useContainer = (data: TMyCourse) => {
  const { userId } = useParams();
  const t = useTranslations("Profile.CourseCard");
  const type = typeConfig[data.type];
  const status = statusConfig[data.status];

  const isActive = data.status === "APPROVED";
  const isExpired = data.status === "EXPIRED";
  const isMuted = isExpired || data.status === "REJECTED";

  const href = {
    course: `/profile/${userId}/learn/${data.productId}`,
    // mock tests have no player page yet, so their card isn't a link
    "mock-test": null,
    flashcard: `/profile/${userId}/flashcards/${data.productId}`,
  }[data.type];

  return {
    // config stores message keys; resolve them to text here
    type: { ...type, label: t(type.label as Parameters<TFn>[0]) },
    status: { ...status, label: t(status.label as Parameters<TFn>[0]) },
    meta: getMeta(data, t),
    // only cards with somewhere to go are clickable
    isActive: isActive && href !== null,
    isExpired,
    isMuted,
    href,
    renewHref: `/shop?type=${data.type}`,
  };
};

export default useContainer;
