import {
  TEnrollmentStatus,
  TMyCourse,
} from "@/app/[locale]/(protected)/(profile)/profile/[userId]/types/my-courses.type";
import { format } from "date-fns";
import { useParams } from "next/navigation";

export type TMetaKind = "calendar" | "hourglass" | "rejected";

/** Visuals per product type - drives the icon tile and the type chip. */
const typeConfig: Record<
  TMyCourse["type"],
  { label: string; color: string; tile: string }
> = {
  course: {
    label: "Course",
    color: "hongbao-red",
    tile: "bg-hongbao-red-50! text-hongbao-red-600!",
  },
  "mock-test": {
    label: "Mock Test",
    color: "hongbao-gold",
    tile: "bg-hongbao-gold-50! text-hongbao-gold-700!",
  },
};

const statusConfig: Record<
  TEnrollmentStatus,
  { label: string; color: string }
> = {
  APPROVED: { label: "In progress", color: "green" },
  PENDING: { label: "Pending approval", color: "hongbao-orange" },
  EXPIRED: { label: "သက်တမ်းကုန်", color: "gray" },
  REJECTED: { label: "Rejected", color: "red" },
};

const fmt = (d: string) => format(new Date(d), "dd MMM yyyy");

/**
 * One-line status detail shown under the title. Expired cards have none -
 * the status badge already says it.
 */
const getMeta = (
  data: TMyCourse,
): { kind: TMetaKind; text: string } | null => {
  switch (data.status) {
    case "APPROVED":
      return {
        kind: "calendar",
        text: data.expiredAt
          ? `Access until ${fmt(data.expiredAt)}`
          : `${data.perTime} month access`,
      };
    case "PENDING":
      return {
        kind: "hourglass",
        text: `Requested ${fmt(data.createdAt)} · waiting for admin approval`,
      };
    case "EXPIRED":
      return null;
    case "REJECTED":
      return { kind: "rejected", text: "This purchase was not approved" };
  }
};

const useContainer = (data: TMyCourse) => {
  const { userId } = useParams();

  const isActive = data.status === "APPROVED";
  const isExpired = data.status === "EXPIRED";
  const isMuted = isExpired || data.status === "REJECTED";

  const href =
    data.type === "course"
      ? `/profile/${userId}/learn/${data.productId}`
      : "/mock-test";

  return {
    type: typeConfig[data.type],
    status: statusConfig[data.status],
    meta: getMeta(data),
    isActive,
    isExpired,
    isMuted,
    href,
    renewHref: `/shop?type=${data.type}`,
  };
};

export default useContainer;
