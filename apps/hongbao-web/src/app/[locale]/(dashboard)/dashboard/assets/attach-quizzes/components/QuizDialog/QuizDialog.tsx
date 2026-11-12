import LoaderComponent from "@/components/LoaderComponent/LoaderComponent";
import {
  Badge,
  Button,
  Divider,
  Group,
  Modal,
  Radio,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";
import { isEmpty } from "lodash";
import useContainer from "./useContainer";

const QuizDialog = () => {
  const {
    target,
    levelLabel,
    close,
    quizzes,
    isLoading,
    isAttaching,
    search,
    setSearch,
    handleConfirm,
    selectedQuizId,
    setSelectedQuizId,
  } = useContainer();

  return (
    <Modal.Root opened onClose={close} size="lg">
      <Modal.Overlay />
      <Modal.Content>
        <Modal.Header bg="gray.0">
          <Modal.Title fw={700}>Attach quiz</Modal.Title>
          <Modal.CloseButton />
        </Modal.Header>
        <Divider />

        <Modal.Body p={0}>
          <Group gap={8} px={12} pt={12} wrap="nowrap">
            <Badge variant="light" color="blue">
              {levelLabel}
            </Badge>
            <Text c="gray.6" size="sm" lineClamp={1}>
              {target?.title}
            </Text>
          </Group>
          <div className="p-3">
            <TextInput
              value={search}
              onChange={(e) => setSearch(e.currentTarget.value)}
              placeholder="Search quiz by name"
              leftSection={<IconSearch size={16} />}
            />
          </div>
          <Divider />

          {isLoading ? (
            <LoaderComponent />
          ) : (
            <div className="max-h-[420px] min-h-[220px] overflow-y-auto p-3">
              {isEmpty(quizzes) ? (
                <Text ta="center" c="gray.5" py={30}>
                  No quiz available.
                </Text>
              ) : (
                <Radio.Group
                  value={selectedQuizId ?? ""}
                  onChange={setSelectedQuizId}
                >
                  <Stack gap={8}>
                    {quizzes?.map((q) => (
                      <Radio.Card
                        key={q.id}
                        value={q.id}
                        bdrs={12}
                        bg={q.id === selectedQuizId ? "blue.0" : ""}
                      >
                        <Group wrap="nowrap" align="flex-start" p={10}>
                          <Radio.Indicator mt={3} />
                          <div>
                            <Text fw={600}>{q.title}</Text>
                            <Text c="gray.6" size="sm">
                              {q.description || "-"}
                            </Text>
                          </div>
                        </Group>
                      </Radio.Card>
                    ))}
                  </Stack>
                </Radio.Group>
              )}
            </div>
          )}
        </Modal.Body>

        <Divider />
        <Group justify="flex-end" p={10} bg="gray.0">
          <Button onClick={close} variant="default" disabled={isAttaching}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            loading={isAttaching}
            disabled={!selectedQuizId}
          >
            Attach quiz
          </Button>
        </Group>
      </Modal.Content>
    </Modal.Root>
  );
};

export default QuizDialog;
