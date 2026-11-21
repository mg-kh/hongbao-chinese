import { TRANSACTION_IMAGE } from "@/app/[locale]/(dashboard)/dashboard/users/purchases/constants/purchase.constants";
import { useDisclosure } from "@mantine/hooks";

const useContainer = () => {
  const [opened, { open, close }] = useDisclosure(false);

  return { src: TRANSACTION_IMAGE, opened, open, close };
};

export default useContainer;
