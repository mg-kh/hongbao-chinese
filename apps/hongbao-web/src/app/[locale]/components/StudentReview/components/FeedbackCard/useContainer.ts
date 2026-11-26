import { TPublicFeedback } from "@/app/[locale]/components/StudentReview/types/feedback.type";

import { useTranslations } from "next-intl";

const useContainer = (data: TPublicFeedback) => {
  const t = useTranslations("Home.StudentReview");
  return {
    position: data.position || t("default_position"),
  };
};

export default useContainer;
