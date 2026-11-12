import EditDrawerFrame from "@/components/EditDrawerFrame/EditDrawerFrame";
import CustomSwitch from "@/components/Inputs/CustomSwitch/CustomSwitch";
import CustomTextArea from "@/components/Inputs/CustomTextArea/CustomTextArea";
import CustomTextInput from "@/components/Inputs/CustomTextInput/CustomTextInput";
import FormSectionWrapper from "@/components/Inputs/FormSectionWrapper/FormSectionWrapper";
import DeleteDialog from "@/components/Modals/DeleteDialog/DeleteDialog";
import useDisclosureAtom from "@/hooks/useDisclosureAtom";
import { ActionIcon, Button, Flex, Stack, Text } from "@mantine/core";
import { PlusIcon, TrashIcon } from "@phosphor-icons/react";
import { isEmpty, isUndefined } from "lodash";
import { SectionDialogAtom } from "../../store/quizzes.store";
import SectionDialog from "../SectionDialog/SectionDialog";
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
    quizDetail,
    deleteDialogOpened,
    deleteDialogClose,
    deleteDialogOpen,
    handleDeleteSection,
    deleteSectionItemPending,
  } = useContainer();
  const { open, opened } = useDisclosureAtom(SectionDialogAtom);
  return (
    <>
      {!isUndefined(opened) && <SectionDialog />}
      <EditDrawerFrame
        title="Quiz Editor"
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
              <CustomSwitch
                name="isLevelTest"
                control={form.control}
                label="Is level test?"
              />
            </FormSectionWrapper>
            {/* Sections */}
            <FormSectionWrapper
              sectionTitle="Sections"
              actions={
                <Button
                  onClick={() => {
                    open(true);
                  }}
                  leftSection={<PlusIcon />}
                  variant="subtle"
                >
                  Create Section
                </Button>
              }
            >
              {!isEmpty(quizDetail?.sections) && (
                <Stack bg="gray.0" p={15} bdrs={10}>
                  {quizDetail?.sections?.map((s) => {
                    return (
                      <Flex key={s.id} justify="space-between">
                        <Text>{s?.title}</Text>
                        <ActionIcon
                          onClick={() => {
                            deleteDialogOpen(s?.id);
                          }}
                          color="red"
                          variant="subtle"
                        >
                          <TrashIcon />
                        </ActionIcon>
                      </Flex>
                    );
                  })}
                </Stack>
              )}
            </FormSectionWrapper>
          </Stack>
        </form>
      </EditDrawerFrame>
      {!isUndefined(deleteDialogOpened) && (
        <DeleteDialog
          handleConfirm={handleDeleteSection}
          opened={deleteDialogOpened}
          onClose={deleteDialogClose}
          disabled={deleteSectionItemPending}
        />
      )}
    </>
  );
};

export default EditDrawer;
