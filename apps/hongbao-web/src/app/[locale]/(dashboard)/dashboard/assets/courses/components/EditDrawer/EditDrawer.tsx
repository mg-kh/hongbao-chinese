"use client";

import EditDrawerFrame from "@/components/EditDrawerFrame/EditDrawerFrame";
import CustomSwitch from "@/components/Inputs/CustomSwitch/CustomSwitch";
import CustomTextArea from "@/components/Inputs/CustomTextArea/CustomTextArea";
import CustomTextInput from "@/components/Inputs/CustomTextInput/CustomTextInput";
import DropDownInput from "@/components/Inputs/DropDownInput/DropDownInput";
import FormSectionWrapper from "@/components/Inputs/FormSectionWrapper/FormSectionWrapper";
import { ActionIcon, Flex, Stack } from "@mantine/core";
import { IconPlus, IconTrash } from "@tabler/icons-react";
import useContainer from "./useContianer";
import CustomNumberInput from "@/components/Inputs/CustomNumberInput/CustomNumberInput";

const EditDrawer = () => {
  const {
    handleFormSubmit,
    handleDelete,
    form,
    fields,
    append,
    remove,
    categoryDropdownData,
    categoryDropdownDataLoading,
    isFetching,
    isPending,
    isDeletePending,
    isValid,
  } = useContainer();
  return (
    <EditDrawerFrame
      title="Course Builder"
      handleUpdate={handleFormSubmit}
      handleDelete={handleDelete}
      isLoading={isFetching}
      isDeletePending={isDeletePending}
      isPending={isPending}
      isValid={isValid}
    >
      <form id="form-area" onSubmit={handleFormSubmit}>
        <Stack>
          {/* Basic info */}
          <FormSectionWrapper sectionTitle="Basic info">
            <CustomTextInput
              control={form.control}
              name="title"
              label="Title"
            />
            <CustomTextArea
              control={form.control}
              name="description"
              label="Description"
            />
            <DropDownInput
              control={form.control}
              name="categoryId"
              data={categoryDropdownData}
              isLoading={categoryDropdownDataLoading}
              label="Category"
            />
          </FormSectionWrapper>
          {/* Pricing */}
          <FormSectionWrapper sectionTitle="Pricing">
            <CustomNumberInput
              control={form.control}
              name="price"
              label="Price"
            />
            <CustomNumberInput
              control={form.control}
              name="perTime"
              label="Per time"
            />
          </FormSectionWrapper>
          {/* Assets */}
          <FormSectionWrapper sectionTitle="Assets">
            {fields?.map((f, i) => {
              return (
                <Flex key={f.id} gap={10}>
                  <CustomTextInput
                    control={form.control}
                    name={`includedAssets.${i}.text`}
                    placeholder="Assets"
                    className="flex-1!"
                  />
                  {i === fields.length - 1 ? (
                    <ActionIcon
                      onClick={() => {
                        append({
                          text: "",
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
              );
            })}
          </FormSectionWrapper>
          {/* Others */}
          <FormSectionWrapper sectionTitle="Others">
            <CustomSwitch
              control={form.control}
              name="isFree"
              label="Is free course?"
            />
            <CustomSwitch
              control={form.control}
              name="published"
              label="Is published?"
            />
          </FormSectionWrapper>
        </Stack>
      </form>
    </EditDrawerFrame>
  );
};

export default EditDrawer;
