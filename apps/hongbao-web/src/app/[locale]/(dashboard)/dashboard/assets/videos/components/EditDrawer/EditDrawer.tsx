import EditDrawerFrame from "@/components/EditDrawerFrame/EditDrawerFrame";
import DropDownInput from "@/components/Inputs/DropDownInput/DropDownInput";
import FormSectionWrapper from "@/components/Inputs/FormSectionWrapper/FormSectionWrapper";
import { Stack } from "@mantine/core";
import useContainer from "./useContainer";
import CustomTextInput from "@/components/Inputs/CustomTextInput/CustomTextInput";
import CustomTextArea from "@/components/Inputs/CustomTextArea/CustomTextArea";
import CustomSwitch from "@/components/Inputs/CustomSwitch/CustomSwitch";

const EditDrawer = () => {
  const {
    form,
    courseDropdownData,
    courseDropdownDataLoading,
    lessonDropdownData,
    lessonDropdownDataLoading,
    subLessonDropdownData,
    subLessonDropdownDataLoading,
    isPending,
    isValid,
    isFetching,
    isDeletePending,
    handleFormSubmit,
    handleDelete,
  } = useContainer();
  return (
    <EditDrawerFrame
      title="Video Editor"
      handleUpdate={handleFormSubmit}
      handleDelete={handleDelete}
      isLoading={isFetching}
      isDeletePending={isDeletePending}
      isPending={isPending}
      isValid={isValid}
    >
      <form id="form-area" onSubmit={handleFormSubmit}>
        <Stack>
          {/*Search And Link */}
          <FormSectionWrapper sectionTitle="Search And Link">
            <DropDownInput
              control={form.control}
              name="courseId"
              data={courseDropdownData}
              isLoading={courseDropdownDataLoading}
              label="Choose Course"
            />
            <DropDownInput
              control={form.control}
              name="lessonId"
              data={lessonDropdownData}
              isLoading={lessonDropdownDataLoading}
              label="Choose Lesson"
            />
            <DropDownInput
              control={form.control}
              name="subLessonId"
              data={subLessonDropdownData}
              isLoading={subLessonDropdownDataLoading}
              label="Choose Sub Lesson"
            />
          </FormSectionWrapper>
          {/* Info */}
          <FormSectionWrapper sectionTitle="Info">
            <CustomSwitch
              control={form.control}
              name="isIntroVideo"
              label="Make as Introduction Video"
            />
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
            <CustomTextInput
              control={form.control}
              name="url"
              label="Video link"
            />
          </FormSectionWrapper>
        </Stack>
      </form>
    </EditDrawerFrame>
  );
};

export default EditDrawer;
