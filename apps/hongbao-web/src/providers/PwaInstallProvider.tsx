"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

interface PwaInstallContextValue {
  canInstall: boolean;
  opened: boolean;
  isInstalling: boolean;
  open: () => void;
  close: () => void;
  handleInstall: () => Promise<void>;
}

const PwaInstallContext = createContext<PwaInstallContextValue | null>(null);

export const usePwaInstall = () => {
  const context = useContext(PwaInstallContext);

  if (!context) {
    throw new Error("usePwaInstall must be used within PwaInstallProvider");
  }

  return context;
};

const PwaInstallProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [opened, setOpened] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);

  useEffect(() => {
    function handleBeforeInstallPrompt(event: Event) {
      // Suppress the browser's mini-infobar and keep the event so the header's
      // install button can trigger the native prompt on demand.
      event.preventDefault();
      setDeferredPrompt(event as BeforeInstallPromptEvent);
    }

    function handleAppInstalled() {
      setDeferredPrompt(null);
      setOpened(false);
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt,
      );
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const open = () => setOpened(true);
  const close = () => setOpened(false);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    setIsInstalling(true);

    await deferredPrompt.prompt();
    await deferredPrompt.userChoice;

    setIsInstalling(false);
    setDeferredPrompt(null);
    setOpened(false);
  };

  return (
    <PwaInstallContext.Provider
      value={{
        canInstall: !!deferredPrompt,
        opened,
        isInstalling,
        open,
        close,
        handleInstall,
      }}
    >
      {children}
    </PwaInstallContext.Provider>
  );
};

export default PwaInstallProvider;
