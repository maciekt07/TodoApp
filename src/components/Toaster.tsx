import { useTheme } from "@emotion/react";
import { Toaster } from "react-hot-toast";
import { useResponsiveDisplay } from "../hooks/useResponsiveDisplay";
import { ColorPalette } from "../theme/themeConfig";
import { getFontColor } from "../utils";
import styled from "@emotion/styled";

export const CustomToaster = () => {
  const isMobile = useResponsiveDisplay();
  const theme = useTheme();
  return (
    <ToasterContainer>
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
            background: theme.darkmode ? "#141431e0" : "#ffffffe0",
            color: theme.darkmode ? ColorPalette.fontLight : ColorPalette.fontDark,
            WebkitBackdropFilter: "blur(6px)",
            backdropFilter: "blur(6px)",
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
    </ToasterContainer>
  );
};

const ToasterContainer = styled.div`
  @media print {
    display: none;
  }
`;
