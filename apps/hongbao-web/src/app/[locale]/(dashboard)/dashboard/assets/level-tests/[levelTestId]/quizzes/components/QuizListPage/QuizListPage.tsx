import CustomBreadCrumb from "@/components/CustomBreadCrumb/CustomBreadCrumb";
import LoaderComponent from "@/components/LoaderComponent/LoaderComponent";
import { DASHBOARD, LEVEL_TEST_LIST } from "@/constants/DashboardRoutes";
import { pluralize } from "@/utils/pluralize";
import {
  Accordion,
  ActionIcon,
  Badge,
  Box,
  Button,
  Flex,
  Group,
  Paper,
  Stack,
  Text,
} from "@mantine/core";
import { CaretRightIcon } from "@phosphor-icons/react";
import { IconPencil, IconPlus } from "@tabler/icons-react";
import { isEmpty } from "lodash";
import Link from "next/link";
import EditDrawer from "../EditDrawer/EditDrawer";
import useContainer from "./useContainer";

const QuizListPage = () => {
  const { open, opened, quizzes, isLoading } = useContainer();
  return (
    <>
      <Stack p={10}>
        <Group justify="space-between">
          <CustomBreadCrumb
            title="Quizzes"
            links={[
              { label: "Dashboard", href: DASHBOARD, isActive: true },
              { label: "Level Test", href: LEVEL_TEST_LIST, isActive: true },
              { label: "Quizzes", href: "", isActive: false },
            ]}
          />
          <Button
            leftSection={<IconPlus />}
            onClick={() => {
              open();
            }}
          >
            Create New Quiz
          </Button>
        </Group>

        <Box>
          {isLoading ? (
            <LoaderComponent />
          ) : (
            <Accordion
              order={3}
              variant="separated"
              chevronPosition="left"
              styles={{
                item: {
                  marginTop: "8px",
                  border: "none",
                },
              }}
              radius={15}
            >
              {quizzes?.map((q) => {
                return (
                  <Accordion.Item key={q.id} value={q.id}>
                    <Accordion.Control component={Box} bg={"white"} bdrs={15}>
                      <Flex justify="space-between" align="center">
                        <Text fw="bold">{q.title}</Text>
                        <ActionIcon
                          onClick={(e) => {
                            e.stopPropagation();
                            open(q.id);
                          }}
                          variant="transparent"
                        >
                          <IconPencil size={20} />
                        </ActionIcon>
                      </Flex>
                    </Accordion.Control>
                    <Accordion.Panel>
                      <Stack>
                        <Text c="gray">{q.description || "-"}</Text>
                        {isEmpty(q?.sections) ? (
                          <Text size="sm" c="dimmed">
                            No sections yet
                          </Text>
                        ) : (
                          <Stack gap={8}>
                            {q?.sections?.map((s) => {
                              return (
                                <Paper
                                  key={s?.id}
                                  component={Link}
                                  href={`quizzes/${q.id}/${s.id}`}
                                  withBorder
                                  radius={10}
                                  p={12}
                                  className="hover:bg-gray-50"
                                >
                                  <Flex justify="space-between" align="center">
                                    <Stack gap={2}>
                                      <Text fw={500}>{s?.title}</Text>
                                      {s?.description && (
                                        <Text
                                          size="sm"
                                          c="dimmed"
                                          lineClamp={1}
                                        >
                                          {s.description}
                                        </Text>
                                      )}
                                    </Stack>
                                    <Group gap={8}>
                                      <Badge variant="light">
                                        {pluralize(
                                          s?.questionCount ?? 0,
                                          "Question",
                                        )}
                                      </Badge>
                                      <CaretRightIcon />
                                    </Group>
                                  </Flex>
                                </Paper>
                              );
                            })}
                          </Stack>
                        )}
                      </Stack>
                    </Accordion.Panel>
                  </Accordion.Item>
                );
              })}
            </Accordion>
          )}
        </Box>
      </Stack>
      {opened && <EditDrawer />}
    </>
  );
};

export default QuizListPage;
