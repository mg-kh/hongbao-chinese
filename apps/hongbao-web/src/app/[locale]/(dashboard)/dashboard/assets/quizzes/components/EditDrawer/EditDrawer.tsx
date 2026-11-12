import EditDrawerFrame from "@/components/EditDrawerFrame/EditDrawerFrame";
import CustomTextArea from "@/components/Inputs/CustomTextArea/CustomTextArea";
import CustomTextInput from "@/components/Inputs/CustomTextInput/CustomTextInput";
import FormSectionWrapper from "@/components/Inputs/FormSectionWrapper/FormSectionWrapper";
import { Stack } from "@mantine/core";
import useContainer from "./useContainer";

const EditDrawer = () => {
  const {
    form,
    isPending,
    isValid,
    isFetching,
    isDeletePending,
    handleFormSubmit,
    handleDelete,
  } = useContainer();
  return (
    <>
      <EditDrawerFrame
        title="Quizz Editor"
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
            <FormSectionWrapper sectionTitle="Basic Info">
              <CustomTextInput
                name="title"
                control={form.control}
                label="Title"
              />
              <CustomTextArea
                name="description"
                control={form.control}
                label="Description"
              />
            </FormSectionWrapper>
          </Stack>
        </form>
      </EditDrawerFrame>
    </>
  );
};

export default EditDrawer;
