import { TAtomValue } from "@/types/general.type";
import { PrimitiveAtom, useAtom } from "jotai";
import { isUndefined } from "lodash";

const useDisclosureAtom = (atom: PrimitiveAtom<TAtomValue>) => {
  const [opened, setOpened] = useAtom(atom);

  const open = (v?: TAtomValue) => setOpened(v || true);
  const close = () => setOpened(undefined);

  return {
    opened: !isUndefined(opened),
    open,
    close,
    currentValue: opened,
  };
};
export default useDisclosureAtom;
