"use client";

import EditDrawerFrame from "@/components/EditDrawerFrame/EditDrawerFrame";
import CustomTextArea from "@/components/Inputs/CustomTextArea/CustomTextArea";
import CustomTextInput from "@/components/Inputs/CustomTextInput/CustomTextInput";
import FormSectionWrapper from "@/components/Inputs/FormSectionWrapper/FormSectionWrapper";
import { Stack } from "@mantine/core";
import useContainer from "./useContianer";

const EditDrawer = () => {
  const {
    handleFormSubmit,
    handleDelete,
    form,
    isFetching,
    isPending,
    isDeletePending,
    isValid,
  } = useContainer();
  return (
    <EditDrawerFrame
      title="Category Builder"
      handleUpdate={handleFormSubmit}
      handleDelete={handleDelete}
      isLoading={isFetching}
      isDeletePending={isDeletePending}
      isPending={isPending}
      isValid={isValid}
    >
      <form id="form-area" onSubmit={handleFormSubmit}>
        <Stack>
          <FormSectionWrapper sectionTitle="Basic info">
            <CustomTextInput control={form.control} name="name" label="Name" />
            <CustomTextArea
              control={form.control}
              name="description"
              label="Description"
            />
          </FormSectionWrapper>
        </Stack>
      </form>
    </EditDrawerFrame>
  );
};

export default EditDrawer;
