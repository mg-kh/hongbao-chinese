import { ClerkProvider } from "@clerk/nextjs";
import React from "react";

interface Props {
  children: React.ReactNode;
}

const CustomClerkProvider: React.FC<Props> = ({ children }) => {
  return <ClerkProvider>{children}</ClerkProvider>;
};

export default CustomClerkProvider;
