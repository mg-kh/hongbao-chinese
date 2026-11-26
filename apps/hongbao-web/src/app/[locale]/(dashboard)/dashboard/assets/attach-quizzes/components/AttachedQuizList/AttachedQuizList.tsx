import { ActionIcon, Paper, Text, Tooltip } from "@mantine/core";
import { IconFileText, IconTrash } from "@tabler/icons-react";
import { isEmpty } from "lodash";
import React from "react";

interface Props {
  quizzes?: { id: string; title: string; description?: string }[];
  emptyLabel: string;
  disabled?: boolean;
  onRemove: (quizId: string) => void;
}

const AttachedQuizList: React.FC<Props> = ({
  quizzes,
  emptyLabel,
  disabled = false,
  onRemove,
}) => {
  const count = quizzes?.length ?? 0;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <Text
          size="xs"
          fw={700}
          c="gray.6"
          tt="uppercase"
          className="tracking-wide"
        >
          Attached quizzes
        </Text>
        {count > 0 && (
          <span className="inline-flex min-w-5 items-center justify-center rounded-full bg-blue-100 px-1.5 text-[11px] font-bold text-blue-700 dark:text-night-blue">
            {count}
          </span>
        )}
      </div>

      {isEmpty(quizzes) ? (
        <div className="flex flex-col items-center gap-1 rounded-xl border border-dashed border-gray-300 bg-gray-50/60 px-4 py-5">
          <IconFileText size={20} className="text-gray-400" />
          <Text size="xs" c="gray.5" ta="center">
            {emptyLabel}
          </Text>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {quizzes?.map((q) => (
            <Paper
              key={q.id}
              withBorder
              radius="lg"
              className="group bg-surface! p-3 transition-all duration-150 hover:border-blue-200 hover:shadow-sm"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <Text
                    size="sm"
                    fw={600}
                    lineClamp={1}
                    className="leading-snug"
                  >
                    {q.title}
                  </Text>

                  <Tooltip label="Remove quiz" withArrow position="left">
                    <ActionIcon
                      color="red"
                      variant="subtle"
                      size="sm"
                      radius="md"
                      disabled={disabled}
                      className="shrink-0 opacity-60 transition-opacity group-hover:opacity-100"
                      onClick={() => onRemove(q.id)}
                    >
                      <IconTrash size={15} />
                    </ActionIcon>
                  </Tooltip>
                </div>

                <Text size="xs" c="gray.6" lineClamp={2} mt={2}>
                  {q.description || "No description provided."}
                </Text>
              </div>
            </Paper>
          ))}
        </div>
      )}
    </div>
  );
};

export default AttachedQuizList;
