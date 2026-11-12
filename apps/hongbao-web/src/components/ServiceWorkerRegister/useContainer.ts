import useMutationQuery from "@/hooks/fetching/useMutationQuery";
import {
  getFCMToken,
  listenForForegroundMessages,
} from "@/lib/firebase/messaging";
import { playNotificationSound } from "@/utils/play-notification-sound";
import { useAuth } from "@clerk/nextjs";
import { notifications } from "@mantine/notifications";
import { useEffect } from "react";

interface SaveNotiTokenVariables {
  token: string;
}

const useContainer = () => {
  const { isSignedIn } = useAuth();

  const { mutate: saveNotiToken } = useMutationQuery<
    unknown,
    SaveNotiTokenVariables
  >({
    url: "dashboard/notifications/save-noti-token",
  });

  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

    let unsubscribe: (() => void) | undefined;
    let isCurrent = true;

    // The service worker can't reliably play audio itself, so it asks the
    // page to play the notification sound for background messages.
    function handleServiceWorkerMessage(event: MessageEvent) {
      if (event.data?.type === "PLAY_NOTIFICATION_SOUND") {
        playNotificationSound();
      }
    }

    navigator.serviceWorker.addEventListener(
      "message",
      handleServiceWorkerMessage,
    );

    async function setup() {
      try {
        // 1. Register service worker unconditionally (signed in or not) so
        // the app is installable as a PWA; it also handles push
        // notifications while the tab is backgrounded, minimized, or closed.
        const registration = await navigator.serviceWorker.register(
          "/firebase-messaging-sw.js",
        );

        if (!isSignedIn || !isCurrent) return;

        // 2. Get FCM token, bound to the registered service worker
        const fcmToken = await getFCMToken(registration);

        if (!fcmToken) return;

        // 3. Send token to backend
        saveNotiToken({ token: fcmToken });

        // 4. Listen for messages while the app is in the foreground
        // (the service worker only handles background messages)
        unsubscribe = listenForForegroundMessages(({ title, body }) => {
          notifications.show({
            title: title ?? "Hongbao Chinese",
            message: body ?? "",
          });
          playNotificationSound();
        });
      } catch (error) {
        console.error("FCM setup failed:", error);
      }
    }

    setup();

    return () => {
      isCurrent = false;
      unsubscribe?.();
      navigator.serviceWorker.removeEventListener(
        "message",
        handleServiceWorkerMessage,
      );
    };
  }, [isSignedIn, saveNotiToken]);

  return null;
};

export default useContainer;
