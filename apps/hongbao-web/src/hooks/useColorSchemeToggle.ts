import {
  MantineColorScheme,
  useComputedColorScheme,
  useMantineColorScheme,
} from "@mantine/core";
import { useMounted } from "@mantine/hooks";

/** Read / change the site's color scheme (persisted by Mantine in localStorage). */
const useColorSchemeToggle = () => {
  const { colorScheme: storedScheme, setColorScheme } = useMantineColorScheme();
  // the stored value comes from localStorage - only expose it after mount
  const mounted = useMounted();
  const colorScheme: MantineColorScheme = mounted ? storedScheme : "light";
  // resolved in an effect so server and first client render agree
  const computed = useComputedColorScheme("light", {
    getInitialValueInEffect: true,
  });

  const isDark = computed === "dark";

  const toggle = () => setColorScheme(isDark ? "light" : "dark");

  const setScheme = (value: string) =>
    setColorScheme(value as MantineColorScheme);

  return { colorScheme, isDark, toggle, setScheme };
};
export default useColorSchemeToggle;
