import GlobalProvider from "@/providers/GlobalProvider";
import { ColorSchemeScript, mantineHtmlProps } from "@mantine/core";
import "@vidstack/react/player/styles/base.css";
import "@vidstack/react/player/styles/default/layouts/video.css";
import "@vidstack/react/player/styles/default/theme.css";
import type { Metadata, Viewport } from "next";
import { NextIntlClientProvider } from "next-intl";
import { Noto_Sans_Myanmar } from "next/font/google";
import "./globals.css";

const myanmarFont = Noto_Sans_Myanmar({
  subsets: ["myanmar"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "Hong Bao",
  description: "Chinese online class",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Hong Bao",
  },
  icons: {
    icon: [
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180" }],
  },
};

export const viewport: Viewport = {
  themeColor: "#F5222D",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${myanmarFont.className} h-full antialiased scroll-smooth`}
      {...mantineHtmlProps}
    >
      <head>
        <title>Hong Bao - Chinese Online Class</title>
        <ColorSchemeScript />
      </head>
      <body className="min-h-full flex flex-col">
        <NextIntlClientProvider>
          <GlobalProvider>{children}</GlobalProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
