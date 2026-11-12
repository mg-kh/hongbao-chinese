import { Badge, Image, Progress, Text } from "@mantine/core";
import { TMyCourse } from "../../../../types/my-courses.type";
import { CalendarDotIcon } from "@phosphor-icons/react";

interface Props {
  data: TMyCourse;
}

const PendingCourseCard: React.FC<Props> = ({ data }) => {
  return (
    <>
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
            <Badge color="hongbao-cream" className="shrink-0!">
              Pending Approval
            </Badge>
          </div>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <Text size="sm" c="gray.7">
              0 of 40 lessons
            </Text>
            <div className="flex items-center gap-2">
              <CalendarDotIcon size={16} />
              <Text size="sm" c="gray.7">
                Waiting for admin approval
              </Text>
            </div>
          </div>
          <Progress value={0} color="hongbao-red" />
        </div>
      </div>
    </>
  );
};

export default PendingCourseCard;
