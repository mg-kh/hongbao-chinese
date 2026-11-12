"use client";

import { createTheme, MantineProvider, Text, Title } from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import { Notifications } from "@mantine/notifications";
import React from "react";

interface Props {
  children: React.ReactNode;
}

// const dark: MantineColorsTuple = [
//   "#C9D1D9", // 0 text
//   "#B1BAC4",
//   "#8B949E",
//   "#6E7681",
//   "#484F58",
//   "#30363D", // borders
//   "#21262D", // card / paper
//   "#161B22", // elevated bg
//   "#0D1117", // app bg ⭐
//   "#010409",
// ];

const theme = createTheme({
  // defaultRadius: 15,
  colors: {
    "hongbao-red": [
      "#FFE5E5",
      "#FFB8B8",
      "#FF8A8A",
      "#FF5C5C",
      "#FF3D3D",
      "#F5222D",
      "#D91E26",
      "#B71C1C",
      "#8C1515",
      "#660F0F",
    ],
    "hongbao-maroon": [
      "#F5E6E6",
      "#E0B3B3",
      "#CC8080",
      "#B84D4D",
      "#A31F1F",
      "#7A1F1F",
      "#661A1A",
      "#521414",
      "#3D0F0F",
      "#2A0A0A",
    ],
    "hongbao-gold": [
      "#FFF4D6",
      "#FFE8A3",
      "#FFDC70",
      "#FFD04D",
      "#F5C542",
      "#E6B93C",
      "#CC9F33",
      "#B3862B",
      "#996D22",
      "#80541A",
    ],
    "hongbao-orange": [
      "#FFF0E6",
      "#FFD1B3",
      "#FFB380",
      "#FF944D",
      "#FF7A26",
      "#F26A1B",
      "#D95F18",
      "#B84F14",
      "#993F10",
      "#7A300C",
    ],
    "hongbao-cream": [
      "#FFF8F2",
      "#FFF0E5",
      "#FFE6D4",
      "#FFDCC2",
      "#FFD1B0",
      "#FFC69E",
      "#F2B488",
      "#D99D73",
      "#BF855E",
      "#A66D49",
    ],

    "hongbao-brown": [
      "#F2E6E0",
      "#D9BFB3",
      "#BF9985",
      "#A67357",
      "#8C4D2A",
      "#733D22",
      "#5C311B",
      "#452514",
      "#2E180D",
      "#1A0D07",
    ],
  },
  components: {
    Button: {
      styles: {
        root: {
          borderRadius: "15px",
        },
      },
    },
    ActionIcon: {
      styles: {
        root: {
          borderRadius: "6px",
        },
      },
    },
    Badge: {
      styles: {
        root: {
          textTransform: "capitalize",
        },
      },
    },
    // Button: Button.extend({
    //   defaultProps: {
    //     color: "dark.1",
    //     c: "dark.9",
    //     variant: "filled",
    //   },
    // }),
    Text: Text.extend({
      defaultProps: {
        c: "dark.9",
        // ff: "JetBrains Mono",
      },
    }),
    Title: Title.extend({
      defaultProps: {
        c: "dark.9",
        // ff: "Playfair Display",
      },
    }),
  },
});

const CustomMantineProvider: React.FC<Props> = ({ children }) => {
  return (
    <MantineProvider theme={theme}>
      <ModalsProvider>
        <Notifications position="top-right" />
        {children}
      </ModalsProvider>
    </MantineProvider>
  );
};

export default CustomMantineProvider;
