import CustomTextInput from "@/components/Inputs/CustomTextInput/CustomTextInput";
import {
  Accordion,
  ActionIcon,
  Box,
  Button,
  Flex,
  Group,
  Stack,
  Text,
} from "@mantine/core";
import { IconPlus, IconTrash } from "@tabler/icons-react";
import { useFieldArray, useFormContext } from "react-hook-form";

const RowsFields = ({ i }: { i: number }) => {
  const { control, watch } = useFormContext();
  const { fields, remove, append } = useFieldArray({
    name: `pages.${i}.rows`,
    control,
  });

  const handleAddRow = () => {
    append({
      text: "",
      phinyin: "",
    });
  };

  return (
    <Accordion variant="unstyled" chevronPosition="left">
      {fields.map((r: any, j: number) => {
        return (
          <Accordion.Item key={r.id} value={`${j}`}>
            <Accordion.Control p={0} component={Box}>
              <Group justify="space-between">
                <Text>{watch(`pages.${i}.rows.${j}.text`) || "---"}</Text>
                {fields.length === j + 1 ? (
                  <ActionIcon
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddRow();
                    }}
                    size="sm"
                    variant="subtle"
                  >
                    <IconPlus />
                  </ActionIcon>
                ) : (
                  <ActionIcon
                    onClick={(e) => {
                      e.stopPropagation();
                      remove(j);
                    }}
                    size="sm"
                    color="red"
                    variant="subtle"
                  >
                    <IconTrash />
                  </ActionIcon>
                )}
              </Group>
            </Accordion.Control>
            <Accordion.Panel bg="gray.0">
              <Stack key={j} gap={1}>
                <Flex gap={5}>
                  <CustomTextInput
                    control={control}
                    name={`pages.${i}.rows.${j}.text`}
                    label="Chinese word"
                    className="w-full!"
                  />
                  <CustomTextInput
                    control={control}
                    name={`pages.${i}.rows.${j}.phinyin`}
                    label="Pinyin"
                    className="w-full!"
                  />
                </Flex>
                {fields.length === j + 1 && (
                  <Button
                    mt={10}
                    onClick={handleAddRow}
                    variant="outline"
                    className="w-full!"
                    leftSection={<IconPlus size={18} />}
                  >
                    Add new row
                  </Button>
                )}
              </Stack>
            </Accordion.Panel>
          </Accordion.Item>
        );
      })}
    </Accordion>
  );
};

export default RowsFields;
