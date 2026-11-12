"use client";

import EditDrawerFrame from "@/components/EditDrawerFrame/EditDrawerFrame";
import CustomNumberInput from "@/components/Inputs/CustomNumberInput/CustomNumberInput";
import CustomSwitch from "@/components/Inputs/CustomSwitch/CustomSwitch";
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
          {/* Price */}
          <FormSectionWrapper sectionTitle="Price">
            <CustomNumberInput
              control={form.control}
              name="price"
              label="Price"
              min={0}
            />
            <CustomSwitch
              control={form.control}
              name="isFree"
              label="Free"
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
