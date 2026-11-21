"use client";

import useContainer from "@/app/[locale]/(dashboard)/dashboard/users/purchases/[purchaseId]/components/TransactionImage/useContainer";
import { Image, Modal, UnstyledButton } from "@mantine/core";

/** Payment slip thumbnail; click to view it full size. */
const TransactionImage: React.FC = () => {
  const { src, opened, open, close } = useContainer();

  return (
    <>
      <UnstyledButton
        onClick={open}
        aria-label="View transaction image"
        className="mt-1! w-fit! rounded-md! border! border-gray-200! transition-shadow! hover:shadow-md!"
      >
        <Image radius="md" src={src} h={200} w={120} fit="cover" alt="" />
      </UnstyledButton>
      <Modal
        opened={opened}
        onClose={close}
        title="Check the transaction image"
        size="lg"
        centered
      >
        <Image
          radius="md"
          src={src}
          h={600}
          fit="contain"
          mx="auto"
          alt="Transaction image"
        />
      </Modal>
    </>
  );
};

export default TransactionImage;
