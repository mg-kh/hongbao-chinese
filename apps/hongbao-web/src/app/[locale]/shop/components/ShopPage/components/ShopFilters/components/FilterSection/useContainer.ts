import { useDisclosure } from "@mantine/hooks";

/** Open/closed state of a collapsible filter group - open by default. */
const useContainer = () => {
  const [opened, { toggle }] = useDisclosure(true);

  return { opened, toggle };
};

export default useContainer;
