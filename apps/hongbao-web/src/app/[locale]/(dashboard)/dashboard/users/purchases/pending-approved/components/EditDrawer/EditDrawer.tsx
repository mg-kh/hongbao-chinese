import EditDrawerFrame from "@/components/EditDrawerFrame/EditDrawerFrame";
import FormSectionWrapper from "@/components/Inputs/FormSectionWrapper/FormSectionWrapper";
import { Stack } from "@mantine/core";

const EditDrawer = () => {
  return (
    <EditDrawerFrame
      title="Approve course"
      // handleUpdate={handleFormSubmit}
      // handleDelete={handleDelete}
      // isLoading={isFetching}
      // isDeletePending={isDeletePending}
      // isPending={isPending}
      // isValid={isValid}
      handleUpdate={() => {}}
      handleDelete={() => {}}
      isLoading={false}
      isDeletePending={false}
      isPending={false}
      isValid={true}
    >
      <form
        id="form-area"
        // onSubmit={handleFormSubmit}
      >
        <Stack>
          {/* Basic info */}
          <FormSectionWrapper sectionTitle="Basic info">
            <></>
            {/* <CustomTextInput
              control={form.control}
              name="title"
              label="Title"
            /> */}
          </FormSectionWrapper>
        </Stack>
      </form>
    </EditDrawerFrame>
  );
};

export default EditDrawer;
