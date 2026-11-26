import {
  CourseTypeIcon,
  MockTestTypeIcon,
} from "@/components/icons/productTypeIcons";
import LessonIcon from "@/components/icons/LessonIcon";
import QuizIcon from "@/components/icons/QuizIcon";
import SpaceRepeatIcon from "@/components/icons/SpaceRepeatIcon";
import VideoPlayIcon from "@/components/icons/VideoPlayIcon";
import { Box, Container, Space } from "@mantine/core";
import { useTranslations } from "next-intl";
import SectionTitle from "../../../../components/SectionTitle/SectionTitle";
import StatusCard from "./components/StatusCard/StatusCard";

const WeOffer = () => {
  const t = useTranslations("Home.WeOffer");
  return (
    <Box>
      <Container size={"xl"} px={{ base: 16, sm: 24 }}>
        <Box py={{ base: 40, md: 60 }}>
          <SectionTitle
            eyebrow={t("eyebrow")}
            title={t("title")}
            subtitle={t("subtitle")}
            align="center"
          />
          <Space h={48} />
          <div className="grid! grid-cols-2! lg:grid-cols-3! gap-3! sm:gap-6! lg:gap-8! max-w-[980px]! mx-auto!">
            <StatusCard
              title={t("free_courses")}
              icon={CourseTypeIcon}
              color="red"
            />
            <StatusCard
              title={t("free_lessons")}
              count={10}
              icon={LessonIcon}
              color="gold"
            />
            <StatusCard
              title={t("free_videos")}
              count={20}
              icon={VideoPlayIcon}
              color="orange"
            />
            <StatusCard
              title={t("free_quizzes")}
              count={20}
              icon={QuizIcon}
              color="maroon"
            />
            <StatusCard
              title={t("mock_test")}
              icon={MockTestTypeIcon}
              color="brown"
            />
            <StatusCard
              title={t("spaced_repetition")}
              icon={SpaceRepeatIcon}
              color="cream"
            />
          </div>
        </Box>
      </Container>
    </Box>
  );
};

export default WeOffer;
