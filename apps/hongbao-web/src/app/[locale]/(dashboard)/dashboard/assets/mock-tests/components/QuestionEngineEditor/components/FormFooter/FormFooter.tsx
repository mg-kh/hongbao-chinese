import { useRouter } from "@/i18n/navigation";
import { Button, Flex } from "@mantine/core";
import { useParams } from "next/navigation";

const FormFooter = () => {
  const { mockTestId, quizzId, sectionId } = useParams();
  const router = useRouter();
  return (
    <Flex
      bg={"white"}
      align="center"
      justify="flex-end"
      className="sticky! bottom-0! z-10"
      p={15}
      gap={20}
      bdrs={15}
    >
      <Button
        onClick={() => {
          router.push(
            sectionId
              ? `/dashboard/assets/mock-tests/${mockTestId}/quizzes/${quizzId}/${sectionId}`
              : `/dashboard/assets/mock-tests/${mockTestId}/quizzes/${quizzId}/questions`,
          );
        }}
        size="lg"
        variant="outline"
      >
        Cancel
      </Button>
      <Button size="lg" type="submit" form="question-form">
        Submit
      </Button>
    </Flex>
  );
};

export default FormFooter;
