import { Paper } from "@mantine/core";
import { TMyCourse } from "../../types/my-courses.type";
import ApprovedCourseCard from "./components/ApprovedCourseCard/ApprovedCourseCard";
import ExpiredCourseCard from "./components/ExpiredCourseCard/ExpiredCourseCard";
import PendingCourseCard from "./components/PendingCourseCard/PendingCourseCard";
import { cn } from "@/utils/cn";

interface Props {
  data: TMyCourse;
}

const CourseCard: React.FC<Props> = ({ data }) => {
  return (
    <Paper
      p={20}
      bdrs={15}
      className={cn(
        "relative",
        data?.status === "APPROVED" &&
          "hover:shadow-lg! duration-75",
      )}
    >
      {data?.status === "PENDING" && (
        <PendingCourseCard data={data} />
      )}
      {data?.status === "APPROVED" && (
        <ApprovedCourseCard data={data} />
      )}
      {data?.status === "EXPIRED" && (
        <ExpiredCourseCard data={data} />
      )}
    </Paper>
  );
};

export default CourseCard;
