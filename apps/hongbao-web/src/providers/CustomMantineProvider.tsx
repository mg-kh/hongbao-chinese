"use client";

import {
  createTheme,
  CSSVariablesResolver,
  MantineProvider,
  Text,
  Title,
} from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import { Notifications } from "@mantine/notifications";
import React from "react";

interface Props {
  children: React.ReactNode;
}

/**
 * Dark mode palette ("lantern night") - warm charcoal with a faint red
 * undertone instead of pure black, off-white text instead of #fff.
 * Only emitted under [data-mantine-color-scheme="dark"], so light mode keeps
 * Mantine's defaults.
 * Mirrors the Tailwind overrides in globals.css.
 */
const DARK_SHADES = [
  "#ECE6E4", // 0 text
  "#CBC3C2", // 1 secondary text
  "#9C9293", // 2 dimmed
  "#7D7374", // 3 placeholder / faint
  "#3D3536", // 4 borders
  "#302A2B", // 5 hover
  "#262122", // 6 inputs / raised
  "#1D191A", // 7 body / paper / cards
  "#141112", // 8 page background
  "#0E0B0C", // 9 deepest (footer)
];

/** Gray ramp inverted for dark: low shades are backgrounds, high are text. */
const DARK_GRAYS = [
  "#141112",
  "#262122",
  "#352E2F",
  "#463D3E",
  "#7D7374",
  "#9C9293",
  "#B5ACAC",
  "#CBC3C2",
  "#DDD6D5",
  "#ECE6E4",
];

const cssVariablesResolver: CSSVariablesResolver = () => ({
  variables: {},
  light: {},
  dark: {
    ...Object.fromEntries(
      DARK_SHADES.map((c, i) => [`--mantine-color-dark-${i}`, c]),
    ),
    ...Object.fromEntries(
      DARK_GRAYS.map((c, i) => [`--mantine-color-gray-${i}`, c]),
    ),
    // gray component variants would otherwise resolve to inverted shades
    "--mantine-color-gray-filled": "#3D3536",
    "--mantine-color-gray-filled-hover": "#463D3E",
    "--mantine-color-gray-light": "rgba(236, 230, 228, 0.07)",
    "--mantine-color-gray-light-hover": "rgba(236, 230, 228, 0.11)",
    "--mantine-color-gray-light-color": "#CBC3C2",
    "--mantine-color-gray-outline": "#5A5051",
    "--mantine-color-gray-outline-hover": "rgba(236, 230, 228, 0.05)",
    "--mantine-color-gray-text": "#B5ACAC",
    "--mantine-color-default-color": "var(--mantine-color-dark-0)",
    "--mantine-color-bright": "#F6F1EF",
    // pastel brand tints for "light" variants - deep, low-chroma
    "--mantine-color-hongbao-red-light": "rgba(242, 145, 138, 0.12)",
    "--mantine-color-hongbao-red-light-hover": "rgba(242, 145, 138, 0.18)",
    "--mantine-color-hongbao-red-light-color": "#F2918A",
    "--mantine-color-hongbao-red-text": "#F2918A",
    "--mantine-color-hongbao-gold-light": "rgba(232, 198, 106, 0.12)",
    "--mantine-color-hongbao-gold-light-hover": "rgba(232, 198, 106, 0.18)",
    "--mantine-color-hongbao-gold-light-color": "#E8C66A",
    "--mantine-color-hongbao-orange-light": "rgba(245, 168, 110, 0.12)",
    "--mantine-color-hongbao-orange-light-hover": "rgba(245, 168, 110, 0.18)",
    "--mantine-color-hongbao-orange-light-color": "#F5A86E",
  },
});

const theme = createTheme({
  // defaultRadius: 15,
  // dark: shade 7 (#B71C1C) for filled brand buttons - still vivid, but
  // without the glare of #F5222D on a near-black page
  primaryShade: { light: 6, dark: 7 },
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
        // dark.9 in light mode, off-white in dark mode (see globals.css)
        c: "var(--hb-text)",
        // ff: "JetBrains Mono",
      },
    }),
    Title: Title.extend({
      defaultProps: {
        c: "var(--hb-text)",
        // ff: "Playfair Display",
      },
    }),
  },
});

const CustomMantineProvider: React.FC<Props> = ({ children }) => {
  return (
    <MantineProvider
      theme={theme}
      cssVariablesResolver={cssVariablesResolver}
    >
      <ModalsProvider>
        <Notifications position="top-right" />
        {children}
      </ModalsProvider>
    </MantineProvider>
  );
};

export default CustomMantineProvider;
