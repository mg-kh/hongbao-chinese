import PwaInstallPrompt from "@/components/PwaInstallPrompt/PwaInstallPrompt";
import ServiceWorkerRegister from "@/components/ServiceWorkerRegister/ServiceWorkerRegister";
import React from "react";
import CustomClerkProvider from "./CustomClerkProvider";
import CustomMantineProvider from "./CustomMantineProvider";
import PwaInstallProvider from "./PwaInstallProvider";
import ReactQueryProvider from "./ReactQueryProvider";

interface Props {
  children: React.ReactNode;
}

const GlobalProvider: React.FC<Props> = ({ children }) => {
  return (
    <>
      <ReactQueryProvider>
        <CustomClerkProvider>
          <ServiceWorkerRegister />
          <CustomMantineProvider>
            <PwaInstallProvider>
              <PwaInstallPrompt />
              {children}
            </PwaInstallProvider>
          </CustomMantineProvider>
        </CustomClerkProvider>
      </ReactQueryProvider>
    </>
  );
};

export default GlobalProvider;
