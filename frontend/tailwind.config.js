/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        light: {
          primary: "#904B40",
          surfaceTint: "#904B40",
          onPrimary: "#FFFFFF",
          primaryContainer: "#FFDAD4",
          onPrimaryContainer: "#3A0905",
          secondary: "#775651",
          onSecondary: "#FFFFFF",
          secondaryContainer: "#FFDAD4",
          onSecondaryContainer: "#2C1512",
          tertiary: "#705C2E",
          onTertiary: "#FFFFFF",
          tertiaryContainer: "#FBDFA6",
          onTertiaryContainer: "#251A00",
          error: "#BA1A1A",
          onError: "#FFFFFF",
          errorContainer: "#FFDAD6",
          onErrorContainer: "#410002",
          background: "#FFF8F6",
          onBackground: "#231918",
          surface: "#FFF8F6",
          onSurface: "#231918",
          surfaceVariant: "#F5DDDA",
          onSurfaceVariant: "#534341",
          outline: "#857370",
          outlineVariant: "#D8C2BE",
          shadow: "#000000",
          scrim: "#000000",
          inverseSurface: "#392E2C",
          inverseOnSurface: "#FFEDEA",
          inversePrimary: "#FFB4A8",
          primaryFixed: "#FFDAD4",
          onPrimaryFixed: "#3A0905",
          primaryFixedDim: "#FFB4A8",
          onPrimaryFixedVariant: "#73342B",
          secondaryFixed: "#FFDAD4",
          onSecondaryFixed: "#2C1512",
          secondaryFixedDim: "#E7BDB6",
          onSecondaryFixedVariant: "#5D3F3B",
          tertiaryFixed: "#FBDFA6",
          onTertiaryFixed: "#251A00",
          tertiaryFixedDim: "#DEC48C",
          onTertiaryFixedVariant: "#564419",
          surfaceDim: "#E8D6D3",
          surfaceBright: "#FFF8F6",
          surfaceContainerLowest: "#FFFFFF",
          surfaceContainerLow: "#FFF0EE",
          surfaceContainer: "#FCEAE7",
          surfaceContainerHigh: "#F7E4E1",
          surfaceContainerHighest: "#F1DFDC",
          // Custom colors
          disabled: "#D4D4D4"
        },
      },
      fontSize: {
        "display-large": [
          "57px",
          {
            lineHeight: "64px",
            letterSpacing: "-0.25px",
            fontWeight: "400",
          },
        ],
        "display-medium": [
          "45px",
          {
            lineHeight: "52px",
            letterSpacing: "0px",
            fontWeight: "400",
          },
        ],
        "display-small": [
          "36px",
          {
            lineHeight: "44px",
            letterSpacing: "0px",
            fontWeight: "400",
          },
        ],
        "headline-large": [
          "32px",
          {
            lineHeight: "40px",
            letterSpacing: "0px",
            fontWeight: "400",
          },
        ],
        "headline-medium": [
          "28px",
          {
            lineHeight: "36px",
            letterSpacing: "0px",
            fontWeight: "400",
          },
        ],
        "headline-small": [
          "24px",
          {
            lineHeight: "32px",
            letterSpacing: "0px",
            fontWeight: "400",
          },
        ],
        "title-large": [
          "22px",
          {
            lineHeight: "28px",
            letterSpacing: "0px",
            fontWeight: "400",
          },
        ],
        "title-medium": [
          "16px",
          {
            lineHeight: "24px",
            letterSpacing: "0.15px",
            fontWeight: "500",
          },
        ],
        "title-small": [
          "14px",
          {
            lineHeight: "20px",
            letterSpacing: "0.1px",
            fontWeight: "500",
          },
        ],
        "body-large": [
          "16px",
          {
            lineHeight: "24px",
            letterSpacing: "0.5px",
            fontWeight: "400",
          },
        ],
        "body-medium": [
          "14px",
          {
            lineHeight: "20px",
            letterSpacing: "0.25px",
            fontWeight: "400",
          },
        ],
        "body-small": [
          "12px",
          {
            lineHeight: "16px",
            letterSpacing: "0.4px",
            fontWeight: "400",
          },
        ],
        "label-large": [
          "14px",
          {
            lineHeight: "20px",
            letterSpacing: "0.1px",
            fontWeight: "500",
          },
        ],
        "label-medium": [
          "12px",
          {
            lineHeight: "16px",
            letterSpacing: "0.5px",
            fontWeight: "500",
          },
        ],
        "label-small": [
          "11px",
          {
            lineHeight: "16px",
            letterSpacing: "0.5px",
            fontWeight: "500",
          },
        ],
      },
      // Shadcn
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
