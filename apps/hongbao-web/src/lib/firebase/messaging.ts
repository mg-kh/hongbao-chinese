import {
  getMessaging,
  getToken,
  isSupported,
  onMessage,
} from "firebase/messaging";
import { app } from "./config";

export async function getFCMToken(
  serviceWorkerRegistration?: ServiceWorkerRegistration,
) {
  if (typeof window === "undefined") {
    return null;
  }

  if (!("Notification" in window)) {
    console.log("Notifications are not supported");
    return null;
  }

  if (!(await isSupported())) {
    console.log("FCM is not supported in this browser");
    return null;
  }

  const permission = await Notification.requestPermission();

  if (permission !== "granted") {
    console.log("Notification permission denied");
    return null;
  }

  const messaging = getMessaging(app);

  const token = await getToken(messaging, {
    vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
    serviceWorkerRegistration,
  });

  return token;
}

export function listenForForegroundMessages(
  onReceive: (payload: {
    title?: string;
    body?: string;
  }) => void,
) {
  if (typeof window === "undefined") {
    return () => {};
  }

  const messaging = getMessaging(app);

  return onMessage(messaging, (payload) => {
    onReceive({
      title: payload.notification?.title,
      body: payload.notification?.body,
    });
  });
}
