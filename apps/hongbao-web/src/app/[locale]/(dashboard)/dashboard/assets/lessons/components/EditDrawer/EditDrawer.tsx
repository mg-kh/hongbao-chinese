import EditDrawerFrame from "@/components/EditDrawerFrame/EditDrawerFrame";
import CustomTextArea from "@/components/Inputs/CustomTextArea/CustomTextArea";
import CustomTextInput from "@/components/Inputs/CustomTextInput/CustomTextInput";
import DropDownInput from "@/components/Inputs/DropDownInput/DropDownInput";
import FormSectionWrapper from "@/components/Inputs/FormSectionWrapper/FormSectionWrapper";
import { Stack } from "@mantine/core";
import useContainer from "./useContainer";

const EditDrawer = () => {
  const {
    handleFormSubmit,
    handleDelete,
    form,
    isPending,
    isDeletePending,
    isValid,
    courseDropdownData,
    isFetching,
    courseDropdownDataLoading,
  } = useContainer();
  return (
    <>
      <EditDrawerFrame
        title="Lesson Builder"
        handleUpdate={handleFormSubmit}
        handleDelete={handleDelete}
        isLoading={isFetching}
        isDeletePending={isDeletePending}
        isPending={isPending}
        isValid={isValid}
      >
        <form id="form-area" onSubmit={handleFormSubmit}>
          <Stack>
            {/* Link with Course */}
            <FormSectionWrapper sectionTitle="Link with Course">
              <DropDownInput
                control={form.control}
                name="courseId"
                label="Select Course"
                data={courseDropdownData}
                isLoading={courseDropdownDataLoading}
              />
            </FormSectionWrapper>
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
            </FormSectionWrapper>
          </Stack>
        </form>
      </EditDrawerFrame>
    </>
  );
};

export default EditDrawer;
