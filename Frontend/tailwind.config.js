/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#6200EE",
          hover: "#5B00E5",
        },
        textPrimary: {
          DEFAULT: "#000000",
          hover: "#333333",
        },
        secondary: {
          DEFAULT: "#03DAC6",
          hover: "#00D0C0",
        },
        textSecondary: {
          DEFAULT: "#121212",
          hover: "#101010",
        },
        background: {
          DEFAULT: "#FFFFFF",
          hover: "#F5F5F5",
        },
        textBackground: {
          DEFAULT: "#000000",
          hover: "#0A0A0A",
        },
        surface: {
          DEFAULT: "#3F3F3F",
          hover: "#575757",
        },
        textSurface: {
          DEFAULT: "#E0E0E0",
          hover: "#E0E0E0",
        },
        accent: {
          DEFAULT: "#9551FF",
          hover: "#A066E0",
        },
        error: {
          DEFAULT: "#B00020",
          hover: "#A0001E",
        },
        textError: {
          DEFAULT: "#FAF0F0",
          hover: "#EAF0EE",
        },
        warning: {
          DEFAULT: "#F9A825",
          hover: "#F7901E",
        },
        textWarning: {
          DEFAULT: "#FFF8E1",
          hover: "#EFF8E0",
        },
        success: {
          DEFAULT: "#28FF28",
          hover: "#20F020",
        },
        textSuccess: {
          DEFAULT: "#F0FFF0",
          hover: "#E0FFEE",
        },
        info: {
          DEFAULT: "#2196F3",
          hover: "#1E85D6",
        },
        textInfo: {
          DEFAULT: "#F0F8FF",
          hover: "#E0F8F0",
        },
        disabled: "#303030",
        textDisabled: "#757575",
        dark: {
          primary: {
            DEFAULT: "#AA55FF",
            hover: "#A050F0",
          },
          textPrimary: {
            DEFAULT: "#FFFFFF",
            hover: "#E0E0E0",
          },
          secondary: {
            DEFAULT: "#03DAC6",
            hover: "#00D0C0",
          },
          textSecondary: {
            DEFAULT: "#1E1E1E",
            hover: "#1B1B1B",
          },
          background: {
            DEFAULT: "#121212",
            hover: "#1C1C1C",
          },
          textBackground: {
            DEFAULT: "#EDEDED",
            hover: "#E3E3E3",
          },
          surface: {
            DEFAULT: "#1E1E1E",
            hover: "#2A2A2A",
          },
          textSurface: {
            DEFAULT: "#E1E1E1",
            hover: "#D5D5D5",
          },
          accent: {
            DEFAULT: "#6200EE",
            hover: "#5B00E5",
          },
          error: {
            DEFAULT: "#B00020",
            hover: "#A0001E",
          },
          textError: {
            DEFAULT: "#FAF0F0",
            hover: "#EAF0EE",
          },
          warning: {
            DEFAULT: "#FBC02D",
            hover: "#E0A726",
          },
          textWarning: {
            DEFAULT: "#FFF9E5",
            hover: "#EFF9E0",
          },
          success: {
            DEFAULT: "#20F020",
            hover: "#30E730",
          },
          textSuccess: {
            DEFAULT: "#F0FFF0",
            hover: "#E0FFE5",
          },
          info: {
            DEFAULT: "#2196F3",
            hover: "#1E85D6",
          },
          textInfo: {
            DEFAULT: "#F0F8FF",
            hover: "#E0F8F0",
          },
          disabled: "#303030",
          textDisabled: "#B0B0B0",
        },
      },
    },
  },
  plugins: [],
  darkMode: ["selector", '[data-mode="dark"]'],
};
