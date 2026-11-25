import {
  CourseTypeIcon,
  MockTestTypeIcon,
} from "@/components/icons/productTypeIcons";
import LessonIcon from "@/components/icons/LessonIcon";
import QuizIcon from "@/components/icons/QuizIcon";
import SpaceRepeatIcon from "@/components/icons/SpaceRepeatIcon";
import VideoPlayIcon from "@/components/icons/VideoPlayIcon";
import { Box, Container, Space } from "@mantine/core";
import SectionTitle from "../../../../components/SectionTitle/SectionTitle";
import StatusCard from "./components/StatusCard/StatusCard";

const WeOffer = () => {
  return (
    <Box>
      <Container size={"xl"} px={{ base: 16, sm: 24 }}>
        <Box py={{ base: 40, md: 60 }}>
          <SectionTitle
            eyebrow="Why Learn With Us"
            title="We Generously Offer"
            subtitle="Lorem ipsum dolor, sit amet consectetur adipisicing elit. Mollitia,
          aperiam?"
            align="center"
          />
          <Space h={48} />
          <div className="grid! grid-cols-2! lg:grid-cols-3! gap-3! sm:gap-6! lg:gap-8! max-w-[980px]! mx-auto!">
            <StatusCard
              title="Free Courses"
              icon={CourseTypeIcon}
              color="red"
            />
            <StatusCard
              title="Free Lessons"
              count={10}
              icon={LessonIcon}
              color="gold"
            />
            <StatusCard
              title="Free Videos"
              count={20}
              icon={VideoPlayIcon}
              color="orange"
            />
            <StatusCard
              title="Free Quizzes"
              count={20}
              icon={QuizIcon}
              color="maroon"
            />
            <StatusCard
              title="Mock Test"
              icon={MockTestTypeIcon}
              color="brown"
            />
            <StatusCard
              title="Space Repeatation System"
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
