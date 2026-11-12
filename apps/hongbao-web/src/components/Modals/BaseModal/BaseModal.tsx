import { Modal, ModalProps } from "@mantine/core";
import React from "react";

interface Props extends ModalProps {
  children?: React.ReactNode;
}

const BaseModal: React.FC<Props> = ({ children, ...props }) => {
  return (
    <Modal {...props} withCloseButton={false}>
      {children}
    </Modal>
  );
};

export default BaseModal;
