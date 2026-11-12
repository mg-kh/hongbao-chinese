import { useRouter } from "@/i18n/navigation";
import { Button, Flex } from "@mantine/core";
import { useParams } from "next/navigation";

const FormFooter = () => {
  const { quizzId, questionId } = useParams();
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
          router.push(`/dashboard/assets/quizzes/${quizzId}/questions`);
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
