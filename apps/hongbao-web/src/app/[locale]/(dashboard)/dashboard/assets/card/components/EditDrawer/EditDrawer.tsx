"use client";

import EditDrawerFrame from "@/components/EditDrawerFrame/EditDrawerFrame";
import CustomTextArea from "@/components/Inputs/CustomTextArea/CustomTextArea";
import CustomTextInput from "@/components/Inputs/CustomTextInput/CustomTextInput";
import DropDownInput from "@/components/Inputs/DropDownInput/DropDownInput";
import FormSectionWrapper from "@/components/Inputs/FormSectionWrapper/FormSectionWrapper";
import { ActionIcon, Flex, Stack } from "@mantine/core";
import { IconPlus, IconTrash } from "@tabler/icons-react";
import useContainer from "./useContianer";

const EditDrawer = () => {
  const {
    handleFormSubmit,
    handleDelete,
    form,
    fields,
    append,
    remove,
    flashcardDropdownData,
    flashcardDropdownDataLoading,
    isFetching,
    isPending,
    isDeletePending,
    isValid,
  } = useContainer();
  return (
    <EditDrawerFrame
      title="Card Builder"
      handleUpdate={handleFormSubmit}
      handleDelete={handleDelete}
      isLoading={isFetching}
      isDeletePending={isDeletePending}
      isPending={isPending}
      isValid={isValid}
      size="lg"
    >
      <form id="form-area" onSubmit={handleFormSubmit}>
        <Stack>
          {/* Basic info */}
          <FormSectionWrapper sectionTitle="Basic info">
            <CustomTextInput
              control={form.control}
              name="cnWord"
              label="Chinese Word"
            />
            <CustomTextInput
              control={form.control}
              name="pinyin"
              label="Pinyin"
            />
            <CustomTextInput control={form.control} name="type" label="Type" />
            <DropDownInput
              control={form.control}
              name="flashcardId"
              data={flashcardDropdownData}
              isLoading={flashcardDropdownDataLoading}
              label="Flashcard"
              placeholder="Select a flashcard"
              clearable
            />
          </FormSectionWrapper>
          {/* Meaning */}
          <FormSectionWrapper sectionTitle="Meaning">
            <CustomTextArea
              control={form.control}
              name="meaningEn"
              label="Meaning (English)"
            />
            <CustomTextArea
              control={form.control}
              name="meaningMm"
              label="Meaning (Myanmar)"
            />
          </FormSectionWrapper>
          {/* Example usage */}
          <FormSectionWrapper sectionTitle="Example usage">
            {fields?.map((f, i) => {
              return (
                <Stack
                  key={f.id}
                  gap={8}
                  className="rounded-md border border-gray-200 p-3"
                >
                  <Flex justify="end">
                    {i === fields.length - 1 ? (
                      <ActionIcon
                        onClick={() => {
                          append({
                            pinyin: "",
                            chinese: "",
                            meaningEn: "",
                            meaningMm: "",
                          });
                        }}
                        variant="transparent"
                      >
                        <IconPlus />
                      </ActionIcon>
                    ) : (
                      <ActionIcon
                        onClick={() => {
                          remove(i);
                        }}
                        variant="transparent"
                        color="red"
                      >
                        <IconTrash />
                      </ActionIcon>
                    )}
                  </Flex>
                  <CustomTextInput
                    control={form.control}
                    name={`exampleUsage.${i}.chinese`}
                    label="Chinese"
                  />
                  <CustomTextInput
                    control={form.control}
                    name={`exampleUsage.${i}.pinyin`}
                    label="Pinyin"
                  />
                  <CustomTextArea
                    control={form.control}
                    name={`exampleUsage.${i}.meaningEn`}
                    label="Meaning (English)"
                  />
                  <CustomTextArea
                    control={form.control}
                    name={`exampleUsage.${i}.meaningMm`}
                    label="Meaning (Myanmar)"
                  />
                </Stack>
              );
            })}
          </FormSectionWrapper>
        </Stack>
      </form>
    </EditDrawerFrame>
  );
};

export default EditDrawer;
