import { Link } from "@/i18n/navigation";
import { Badge, Button, Image, Progress, Text } from "@mantine/core";
import { ArrowRightIcon } from "@phosphor-icons/react";
import { TMyCourse } from "../../../../types/my-courses.type";

interface Props {
  data: TMyCourse;
}

const ExpiredCourseCard: React.FC<Props> = ({ data }) => {
  return (
    <>
      <div className="flex flex-col sm:flex-row gap-4 items-start">
        <Image
          radius="md"
          fit="cover"
          alt=""
          src="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-9.png"
          className="w-full! h-40! sm:w-[140px]! sm:h-[100px]! shrink-0! grayscale!"
        />
        <div className="w-full min-w-0 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <Text size="lg" fw="bold" lineClamp={2} className="min-w-0!">
              {data?.title}
            </Text>
            <Badge color="gray" className="shrink-0!">
              သက်တမ်းကုန်
            </Badge>
          </div>
          <Text size="sm" c="gray.7">
            0 of 40 lessons
          </Text>
          <Progress value={10} color="hongbao-red" />
          <Button
            component={Link}
            href="/shop?type=course"
            rightSection={<ArrowRightIcon />}
            color="hongbao-red"
            className="w-full! sm:w-auto!"
          >
            သက်တမ်းတိုးရန်
          </Button>
        </div>
      </div>
    </>
  );
};

export default ExpiredCourseCard;
