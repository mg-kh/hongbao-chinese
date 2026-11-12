import { useDisclosure } from "@mantine/hooks";
import React, { createContext, useContext, useState } from "react";

type TId = number | string | undefined;

type DrawerContextType = {
  opened: boolean;
  open: (id?: TId) => void;
  close: () => void;
  toggle: () => void;
  currentId: TId;
};

const DrawerContext = createContext<DrawerContextType | null>(null);

interface Props {
  children: React.ReactNode;
}

export const useEditDrawer = () => {
  const ctx = useContext(DrawerContext);
  if (!ctx) throw new Error("useDrawer must be used inside provider");
  return ctx;
};

const EditDrawerProvider: React.FC<Props> = ({ children }) => {
  const [opened, { open: openDrawer, close: closeDrawer, toggle }] =
    useDisclosure(false);
  const [currentId, setCurrentId] = useState<TId>(undefined);

  const open = (courseId?: TId) => {
    setCurrentId(courseId);
    openDrawer();
  };

  const close = () => {
    setCurrentId(undefined);
    closeDrawer();
  };

  return (
    <DrawerContext.Provider value={{ opened, open, close, toggle, currentId }}>
      {children}
    </DrawerContext.Provider>
  );
};

export default EditDrawerProvider;
