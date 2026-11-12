importScripts(
  "https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js",
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js",
);

firebase.initializeApp({
  apiKey: "AIzaSyAcF3FSNMISW5QlwRSVRCLbl-SNVee9GuA",
  authDomain: "hongbao-production.firebaseapp.com",
  projectId: "hongbao-chinese",
  storageBucket: "hongbao-chinese.firebasestorage.app",
  messagingSenderId: "61863236529",
  appId: "1:61863236529:web:0ede65c7b37a39c62be390",
  measurementId: "G-1N6V7S779T",
});

const messaging = firebase.messaging();

// Activate this service worker (and pick up config/logic updates) as soon as
// it installs, instead of waiting for all existing tabs to close.
self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(clients.claim());
});

messaging.onBackgroundMessage((payload) => {
  const { title, body } = payload.notification ?? {};

  self.registration.showNotification(title ?? "Hongbao Chinese", {
    body,
    icon: "/assets/logo.png",
    data: payload.data,
    silent: false,
  });

  // Service workers can't reliably use AudioContext, so ask any open tab
  // (even an unfocused/background one) to play the notification sound.
  // If no tab is open, `silent: false` above is the fallback.
  clients
    .matchAll({ type: "window", includeUncontrolled: true })
    .then((windowClients) => {
      windowClients.forEach((client) =>
        client.postMessage({ type: "PLAY_NOTIFICATION_SOUND" }),
      );
    });
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const url = event.notification.data?.url ?? "/";
  const targetUrl = new URL(url, self.location.origin).href;

  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((windowClients) => {
        const existingClient = windowClients.find(
          (client) => client.url === targetUrl,
        );

        if (existingClient) {
          return existingClient.focus();
        }

        return clients.openWindow(targetUrl);
      }),
  );
});
