import CustomTextInput from "@/components/Inputs/CustomTextInput/CustomTextInput";
import OperationDialog from "@/components/Modals/OperationDialog/OperationDialog";
import { Stack } from "@mantine/core";
import useContainer from "./useContainer";

const SectionDialog = () => {
  const { opened, close, form, isPending, disabled, handleFormSubmit } =
    useContainer();
  return (
    <OperationDialog
      opened={opened}
      onClose={close}
      title={"Add new section"}
      isLoading={isPending}
      handleConfirm={handleFormSubmit}
      disabled={disabled}
      zIndex={1000}
    >
      <form>
        <Stack>
          <CustomTextInput name="title" control={form.control} label="Title" />
          <CustomTextInput
            name="description"
            control={form.control}
            label="Description"
          />
        </Stack>
      </form>
    </OperationDialog>
  );
};

export default SectionDialog;
