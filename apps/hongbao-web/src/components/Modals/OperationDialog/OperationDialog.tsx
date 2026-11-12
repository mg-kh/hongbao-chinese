import React from "react";
import BaseModal from "../BaseModal/BaseModal";
import { Button, Flex, ModalProps, Stack, Text } from "@mantine/core";

interface Props extends ModalProps {
  title: string | React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  isLoading?: boolean;
  disabled?: boolean;
  handleConfirm: () => void;
}

const OperationDialog: React.FC<Props> = ({
  title,
  children,
  footer,
  isLoading = false,
  disabled = false,
  handleConfirm,
  ...props
}) => {
  return (
    <BaseModal {...props}>
      <Stack>
        <Text fw={"bold"}>{title}</Text>

        <>{children}</>

        <Flex gap={10} justify="end">
          <Button
            onClick={() => {
              props.onClose();
            }}
            variant="default"
          >
            Close
          </Button>
          <Button
            onClick={() => {
              handleConfirm();
            }}
            loading={isLoading}
            disabled={disabled}
          >
            Confirm
          </Button>
        </Flex>
      </Stack>
    </BaseModal>
  );
};

export default OperationDialog;
