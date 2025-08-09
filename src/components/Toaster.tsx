import { useTheme } from "@emotion/react";
import { ToastBar, Toaster } from "react-hot-toast";
import { useResponsiveDisplay } from "../hooks/useResponsiveDisplay";
import { ColorPalette } from "../theme/themeConfig";
import { getFontColor } from "../utils";
import styled from "@emotion/styled";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";
import { useContext } from "react";
import { UserContext } from "../contexts/UserContext";

export const CustomToaster = () => {
  const isMobile = useResponsiveDisplay();
  const theme = useTheme();
  const { user } = useContext(UserContext);

  const prefersReducedMotion = usePrefersReducedMotion(user.settings.reduceMotion);
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
          removeDelay: prefersReducedMotion ? 0 : 1500,
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
      >
        {(t) =>
          prefersReducedMotion ? (
            <ToastBar
              toast={t}
              style={{
                ...t.style,
                animation: t.visible ? "custom-enter 1s ease" : "custom-exit 1s ease forwards",
              }}
            />
          ) : (
            <ToastBar toast={t} style={t.style} />
          )
        }
      </Toaster>
    </ToasterContainer>
  );
};

const ToasterContainer = styled.div`
  @media print {
    display: none;
  }
`;
