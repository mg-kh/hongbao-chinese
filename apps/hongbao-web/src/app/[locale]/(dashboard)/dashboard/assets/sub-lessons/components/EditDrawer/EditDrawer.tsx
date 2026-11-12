import EditDrawerFrame from "@/components/EditDrawerFrame/EditDrawerFrame";
import CustomTextInput from "@/components/Inputs/CustomTextInput/CustomTextInput";
import DropDownInput from "@/components/Inputs/DropDownInput/DropDownInput";
import FormSectionWrapper from "@/components/Inputs/FormSectionWrapper/FormSectionWrapper";
import { Stack } from "@mantine/core";
import useContainer from "./useContainer";
import CustomTextArea from "@/components/Inputs/CustomTextArea/CustomTextArea";

const EditDrawer = () => {
  const {
    handleFormSubmit,
    handleDelete,
    form,
    isPending,
    isDeletePending,
    isValid,
    lessonDropdownData,
    isFetching,
    lessonDropdownDataLoading,
    courseDropdownData,
    courseDropdownDataLoading,
  } = useContainer();
  return (
    <EditDrawerFrame
      title="Sub Lesson Builder"
      handleUpdate={handleFormSubmit}
      handleDelete={handleDelete}
      isLoading={isFetching}
      isDeletePending={isDeletePending}
      isPending={isPending}
      isValid={isValid}
    >
      <form id="form-area" onSubmit={handleFormSubmit}>
        <Stack>
          {/* Link with Lesson  */}
          <FormSectionWrapper sectionTitle="Link">
            <DropDownInput
              control={form.control}
              name="courseId"
              label="Select Course"
              data={courseDropdownData}
              isLoading={courseDropdownDataLoading}
            />
            <DropDownInput
              control={form.control}
              name="lessonId"
              label="Select Lesson"
              data={lessonDropdownData}
              isLoading={lessonDropdownDataLoading}
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
  );
};

export default EditDrawer;
