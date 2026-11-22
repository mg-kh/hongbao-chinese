import { TPurchase } from "@/app/[locale]/(dashboard)/dashboard/users/purchases/types/purchases.type";
import { PURCHASE_DETAIL } from "@/constants/DashboardRoutes";
import { useRouter } from "@/i18n/navigation";
import { money } from "@/utils/purchaseOrder";
import { format, formatDistanceToNow } from "date-fns";

const useContainer = () => {
  const router = useRouter();

  return {
    openDetail: (purchase: TPurchase) =>
      router.push(PURCHASE_DETAIL(purchase.id)),
    formatTotal: (purchase: TPurchase) =>
      money(purchase.totalAmount, purchase.currency),
    formatOrderedAt: (purchase: TPurchase) =>
      format(purchase.createdAt, "d MMM yyyy, hh:mm a"),
    formatOrderedAgo: (purchase: TPurchase) =>
      formatDistanceToNow(new Date(purchase.createdAt), { addSuffix: true }),
  };
};

export default useContainer;
