"use client";

import EditDrawerFrame from "@/components/EditDrawerFrame/EditDrawerFrame";
import CustomTextArea from "@/components/Inputs/CustomTextArea/CustomTextArea";
import CustomTextInput from "@/components/Inputs/CustomTextInput/CustomTextInput";
import FormSectionWrapper from "@/components/Inputs/FormSectionWrapper/FormSectionWrapper";
import { Input, Rating, Stack } from "@mantine/core";
import { Controller } from "react-hook-form";
import useContainer from "./useContainer";

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
      title="Feedback"
      handleUpdate={handleFormSubmit}
      handleDelete={handleDelete}
      isLoading={isFetching}
      isDeletePending={isDeletePending}
      isPending={isPending}
      isValid={isValid}
    >
      <form id="form-area" onSubmit={handleFormSubmit}>
        <Stack>
          <FormSectionWrapper sectionTitle="Student">
            <CustomTextInput
              control={form.control}
              name="name"
              label="Name"
              withAsterisk
            />
            <CustomTextInput
              control={form.control}
              name="position"
              label="Position"
              description="Shown under the name, e.g. Student, HSK 4 learner"
            />
          </FormSectionWrapper>
          <FormSectionWrapper sectionTitle="Feedback">
            <CustomTextArea
              control={form.control}
              name="content"
              label="Content"
              withAsterisk
              rows={6}
            />
            <Controller
              control={form.control}
              name="rating"
              render={({ field, fieldState }) => (
                <Input.Wrapper
                  label="Rating"
                  withAsterisk
                  error={fieldState.error?.message}
                >
                  <Rating
                    value={field.value}
                    onChange={field.onChange}
                    count={5}
                    size="lg"
                    mt={4}
                  />
                </Input.Wrapper>
              )}
            />
          </FormSectionWrapper>
        </Stack>
      </form>
    </EditDrawerFrame>
  );
};

export default EditDrawer;
