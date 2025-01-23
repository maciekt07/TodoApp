export const ColorPalette = {
  fontDark: "#101727",
  fontLight: "#f0f0f0",
  darkMode: "#383838",
  lightMode: "#ffffff",
  purple: "#b624ff",
  red: "#ff3131",
  orange: "#ff9318",
  orangeDark: "#ff9500",
} as const;

// TODO: update themes
export const themeConfig: { [key: string]: { primaryColor: string; secondaryColor?: string } } = {
  Purple: {
    // Default dark theme
    primaryColor: ColorPalette.purple,
  },
  "Light Purple": {
    // Default light theme
    primaryColor: ColorPalette.purple,
    secondaryColor: "#edeef6",
  },
  Blue: {
    primaryColor: "#2a93d5",
  },
  Pink: {
    primaryColor: "#e5369a",
  },
  "Blush Blossom": {
    primaryColor: "#EC407A",
    secondaryColor: "#FCE4EC",
  },
  Cheesecake: {
    primaryColor: "#E14C94",
    secondaryColor: "#FDF0D5",
  },
  "Mystic Coral": {
    primaryColor: "#ff7b9c",
    secondaryColor: "#4a2333",
  },
  "Dark Orange": {
    primaryColor: "#FF5631",
    secondaryColor: "#0D0D0D",
  },
  "Light Orange": {
    primaryColor: "#F26E56",
    secondaryColor: "#F6F6F6",
  },
  Aurora: {
    primaryColor: "#00e952",
    secondaryColor: "#011926",
  },
};
