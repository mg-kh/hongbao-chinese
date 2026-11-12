import { Badge, Image, Paper, Progress, Text } from "@mantine/core";
import { CalendarDotIcon } from "@phosphor-icons/react";
import { TMyCourse } from "../../../../types/my-courses.type";
import Link from "next/link";
import { useParams } from "next/navigation";
import { addDays, format } from "date-fns";

interface Props {
  data: TMyCourse;
}

const ApprovedCourseCard: React.FC<Props> = ({ data }) => {
  const { userId } = useParams();
  return (
    <Paper
      component={Link}
      href={
        data?.type === "course"
          ? `/profile/${userId}/learn/${data?.productId}`
          : "/level-test"
      }
      className="block! no-underline!"
    >
      <div className="flex flex-col sm:flex-row gap-4 items-start">
        <Image
          radius="md"
          fit="cover"
          alt=""
          src="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-9.png"
          className="w-full! h-40! sm:w-[140px]! sm:h-[100px]! shrink-0!"
        />
        <div className="w-full min-w-0 space-y-3">
          <div className="flex flex-wrap items-center gap-2 justify-between">
            <Text size="lg" fw="bold" lineClamp={2} className="min-w-0!">
              {data?.title}
            </Text>
            <Badge color="hongbao-red" className="shrink-0!">
              In Progress
            </Badge>
          </div>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <Text size="sm" c="gray.7">
              0 of 40 lessons
            </Text>
            <div className="flex items-center gap-2">
              <CalendarDotIcon size={16} />
              <Text size="sm" c="gray.7">
                Due on{" "}
                {format(
                  data?.expiredAt
                    ? new Date(data.expiredAt)
                    : addDays(new Date(), data?.perTime * 30),
                  "dd MMM yyyy",
                )}
              </Text>
            </div>
          </div>
          <Progress value={10} color="hongbao-red" />
        </div>
      </div>
    </Paper>
  );
};

export default ApprovedCourseCard;
