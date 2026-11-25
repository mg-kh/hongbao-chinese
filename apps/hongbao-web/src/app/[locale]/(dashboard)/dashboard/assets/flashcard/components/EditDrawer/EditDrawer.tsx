"use client";

import EditDrawerFrame from "@/components/EditDrawerFrame/EditDrawerFrame";
import CustomNumberInput from "@/components/Inputs/CustomNumberInput/CustomNumberInput";
import CustomSwitch from "@/components/Inputs/CustomSwitch/CustomSwitch";
import CustomTextInput from "@/components/Inputs/CustomTextInput/CustomTextInput";
import DropDownInput from "@/components/Inputs/DropDownInput/DropDownInput";
import FormSectionWrapper from "@/components/Inputs/FormSectionWrapper/FormSectionWrapper";
import { Stack } from "@mantine/core";
import useContainer from "./useContainer";

const EditDrawer = () => {
  const {
    form,
    categoryDropdownData,
    categoryDropdownDataLoading,
    isFetching,
    isPending,
    isDeletePending,
    isValid,
    handleFormSubmit,
    handleDelete,
  } = useContainer();
  return (
    <EditDrawerFrame
      title="Flashcard Editor"
      handleUpdate={handleFormSubmit}
      handleDelete={handleDelete}
      isLoading={isFetching}
      isDeletePending={isDeletePending}
      isPending={isPending}
      isValid={isValid}
    >
      <form id="form-area" onSubmit={handleFormSubmit}>
        <Stack>
          <FormSectionWrapper sectionTitle="Basic Info">
            <CustomTextInput name="name" control={form.control} label="Name" />
            <DropDownInput
              control={form.control}
              name="categoryId"
              data={categoryDropdownData}
              isLoading={categoryDropdownDataLoading}
              label="Category"
            />
          </FormSectionWrapper>
          <FormSectionWrapper sectionTitle="Pricing">
            <CustomNumberInput
              control={form.control}
              name="price"
              label="Price"
              min={0}
              allowDecimal={false}
            />
            <CustomSwitch
              control={form.control}
              name="published"
              label="Published"
            />
          </FormSectionWrapper>
        </Stack>
      </form>
    </EditDrawerFrame>
  );
};

export default EditDrawer;
