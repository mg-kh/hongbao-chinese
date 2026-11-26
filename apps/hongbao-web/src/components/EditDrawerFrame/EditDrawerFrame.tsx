import useDisclosureAtom from "@/hooks/useDisclosureAtom";
import { useEditDrawer } from "@/providers/EditDrawerProvider";
import {
  ActionIcon,
  Box,
  Button,
  Drawer,
  Group,
  Stack,
  Title,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { IconX } from "@tabler/icons-react";
import LoaderComponent from "../LoaderComponent/LoaderComponent";
import DeleteDialog from "../Modals/DeleteDialog/DeleteDialog";
import { DeleteDialogFromDrawerAtom } from "./store/edit-drawer-frame.store";

interface Props {
  children: React.ReactNode;
  title?: string;
  showDelete?: boolean;
  cancelLabel?: string;
  deleteLabel?: string;
  updateLabel?: string;
  isLoading?: boolean;
  isPending?: boolean;
  isValid?: boolean;
  isDeletePending?: boolean;
  handleUpdate?: () => void;
  handleDelete?: (cb: () => void) => void;
  size?: "md" | "lg" | "xl";
}

const EditDrawerFrame: React.FC<Props> = ({
  children,
  title,
  showDelete = true,
  cancelLabel = "Cancel",
  deleteLabel = "Delete",
  updateLabel = "",
  handleDelete,
  handleUpdate,
  isLoading = false,
  isPending = false,
  isDeletePending = false,
  isValid = false,
  size = "md",
}) => {
  const { opened, close, currentId } = useEditDrawer();
  const isMobile = useMediaQuery("(max-width: 48em)");
  const {
    opened: openedDeleteConfirmDialog,
    close: closeDeleteConfirmDialog,
    open: openDeleteConfirmDialog,
  } = useDisclosureAtom(DeleteDialogFromDrawerAtom);
  return (
    <>
      <DeleteDialog
        opened={openedDeleteConfirmDialog}
        onClose={closeDeleteConfirmDialog}
        handleConfirm={() => {
          handleDelete?.(() => {
            closeDeleteConfirmDialog();
          });
        }}
      />
      <Drawer
        withCloseButton={false}
        radius="none"
        opened={opened}
        onClose={close}
        position="right"
        classNames={{
          body: "bg-gray-100! h-full p-0! overflow-auto",
        }}
        size={isMobile ? "100%" : size}
      >
        {isLoading ? (
          <LoaderComponent h={"100%"} />
        ) : (
          <Stack className="h-full">
            <Group
              className="sticky! top-0 z-50! border-b border-gray-200"
              justify="space-between"
              bg="var(--hb-surface)"
              px={10}
              py={20}
            >
              <Title order={3}>{title}</Title>
              <ActionIcon
                variant="transparent"
                c="gray"
                className="outline-none!"
                onClick={close}
              >
                <IconX />
              </ActionIcon>
            </Group>
            <Box className="flex-1!" px={10}>
              {children}
            </Box>
            <Group
              className="sticky! bottom-0! border-t border-gray-200 z-50!"
              justify="flex-end"
              bg="var(--hb-surface)"
              px={10}
              py={20}
            >
              <Button onClick={close} variant="subtle">
                {cancelLabel}
              </Button>
              {showDelete && (
                <>
                  {currentId && (
                    <Button
                      color="red"
                      onClick={() => {
                        openDeleteConfirmDialog(true);
                      }}
                    >
                      {deleteLabel}
                    </Button>
                  )}
                </>
              )}
              <Button
                onClick={handleUpdate}
                loading={isPending}
                disabled={!isValid}
                type="submit"
                form="form-area"
              >
                {updateLabel ? updateLabel : currentId ? "Update" : "Create"}
              </Button>
            </Group>
          </Stack>
        )}
      </Drawer>
    </>
  );
};

export default EditDrawerFrame;
