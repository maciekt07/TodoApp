import { useTheme } from "@emotion/react";
import { Toaster } from "react-hot-toast";
import { useResponsiveDisplay } from "../hooks/useResponsiveDisplay";
import { ColorPalette } from "../theme/themeConfig";
import { getFontColor } from "../utils";

export const CustomToaster = () => {
  const isMobile = useResponsiveDisplay();
  const theme = useTheme();
  return (
    <Toaster
      position="top-center"
      reverseOrder={false}
      gutter={12}
      containerStyle={{
        marginBottom: isMobile ? "96px" : "12px",
      }}
      toastOptions={{
        position: "bottom-center",
        duration: 4000,
        style: {
          padding: "14px 22px",
          borderRadius: "18px",
          fontSize: "17px",
          border: `2px solid ${theme.primary}`,
          background: theme.darkmode ? "#141431e0" : "#ffffffd2",
          color: theme.darkmode ? ColorPalette.fontLight : ColorPalette.fontDark,
          WebkitBackdropFilter: `blur(${theme.darkmode ? "6" : "14"}px)`,
          backdropFilter: `blur(${theme.darkmode ? "6" : "14"}px)`,
        },
        success: {
          iconTheme: {
            primary: theme.primary,
            secondary: getFontColor(theme.primary),
          },
        },
        error: {
          iconTheme: {
            primary: ColorPalette.red,
            secondary: "white",
          },
          style: {
            borderColor: ColorPalette.red,
          },
        },
      }}
    />
  );
};
