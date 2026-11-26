"use client";

import { Accordion, ActionIcon, Box, Button, Group, Text } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconDeviceFloppy, IconPlus, IconTrash } from "@tabler/icons-react";
import { useFieldArray, useFormContext } from "react-hook-form";
import useDb from "../../../../hooks/useDb";
import { FormField } from "../../../../schemas/CreateHanziGridSchema";
import RowsFields from "./components/RowsFields/RowsFields";

const GridsSection = () => {
  const { setData } = useDb();
  const { control, getValues } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    name: "pages",
    control: control,
  });
  const handleAddPage = () => {
    append([
      {
        rows: [
          {
            text: "",
            phinyin: "",
          },
        ],
      },
    ]);
  };
  const handleSave = async () => {
    try {
      await setData(getValues() as FormField);
      notifications.show({
        title: "Saving in storage",
        message: "Successfully saved",
      });
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Box>
      <Group justify="space-between" align="center">
        <Text>Grid settings</Text>
        <Group gap={5}>
          <Button onClick={handleAddPage} leftSection={<IconPlus size={18} />}>
            Add Page
          </Button>
          <Button
            color="green"
            onClick={handleSave}
            leftSection={<IconDeviceFloppy size={18} />}
          >
            Save
          </Button>
        </Group>
      </Group>

      <Accordion
        defaultValue="0"
        p={0}
        variant="unstyled"
        chevronPosition="left"
      >
        {fields.map((p: any, i: number) => {
          return (
            <Accordion.Item key={p.id} value={`${i}`} p={0}>
              <Accordion.Control p={0} component={Box}>
                <Group justify="space-between">
                  <Text>Page No: {i + 1}</Text>
                  <ActionIcon
                    onClick={(e) => {
                      e.stopPropagation();
                      remove(i);
                    }}
                    size="sm"
                    color="red"
                    variant="subtle"
                  >
                    <IconTrash />
                  </ActionIcon>
                </Group>
              </Accordion.Control>
              <Accordion.Panel bg="var(--hb-surface)">
                <RowsFields i={i} />
              </Accordion.Panel>
            </Accordion.Item>
          );
        })}
      </Accordion>
    </Box>
  );
};

export default GridsSection;
