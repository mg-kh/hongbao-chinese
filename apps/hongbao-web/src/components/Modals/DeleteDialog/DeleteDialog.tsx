import { Button, Flex, ModalProps, Stack, Text } from "@mantine/core";
import React from "react";
import BaseModal from "../BaseModal/BaseModal";

interface Props extends ModalProps {
  title?: string | React.ReactNode;
  description?: string | React.ReactNode;
  isLoading?: boolean;
  disabled?: boolean;
  handleConfirm: () => void;
}

const DeleteDialog: React.FC<Props> = ({
  title = "Delete",
  description = "Are you sure you want to delete this item? This action cannot be undone.",
  isLoading = false,
  handleConfirm,
  ...props
}) => {
  return (
    <BaseModal {...props} zIndex={1000}>
      <Stack>
        <Text fw={"bold"}>{title}</Text>

        <Text>{description}</Text>

        <Flex gap={10} justify="end">
          <Button
            onClick={() => {
              props.onClose();
            }}
            variant="default"
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              handleConfirm();
            }}
            loading={isLoading}
            color="red"
          >
            Delete
          </Button>
        </Flex>
      </Stack>
    </BaseModal>
  );
};

export default DeleteDialog;
