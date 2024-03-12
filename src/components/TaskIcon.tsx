import { useTheme } from "@emotion/react";
import { useContext } from "react";
import { UserContext } from "../contexts/UserContext";

interface NotFoundIconProps {
  scale?: number;
  variant?: "error" | "add" | "success";
}
/**
 * Component for displaying a svg task icon in theme color.
 */
export const TaskIcon = ({ scale = 1, variant = "error" }: NotFoundIconProps) => {
  const theme = useTheme();
  const { user } = useContext(UserContext);
  const { settings } = user;

  const AddIcon = (
    <>
      <rect
        x="124.093"
        y="286.465"
        width="87.6744"
        height="13.4884"
        rx="6.74419"
        transform="rotate(-90 124.093 286.465)"
        fill="white"
      />
      <rect x="87" y="235.884" width="87.6744" height="13.4884" rx="6.74419" fill="white" />
    </>
  );

  const ErrorIcon = (
    <>
      <rect
        x="95.0707"
        y="268.856"
        width="87.6744"
        height="13.4884"
        rx="6.74419"
        transform="rotate(-45 95.0707 268.856)"
        fill="white"
      />

      <rect
        x="104.608"
        y="206.861"
        width="87.6744"
        height="13.4884"
        rx="6.74419"
        transform="rotate(45 104.608 206.861)"
        fill="white"
      />
    </>
  );

  const SuccessIcon = (
    <path
      d="M96 242.159L119.159 265.318L165.476 219"
      stroke="white"
      stroke-width="15"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  );

  return (
    <svg
      width={216 * scale}
      height={434 * scale}
      viewBox="0 0 261 434"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        filter: settings[0].enableGlow ? `drop-shadow(0px 0px 64px ${theme.primary}c8)` : "none",
      }}
    >
      <circle cx="130.837" cy="34.2327" r="26.7209" stroke={theme.primary} stroke-width="14" />
      <rect
        y="51.7676"
        width="261"
        height="381.721"
        rx="45"
        fill={theme.primary}
        fill-opacity="0.6"
      />
      <rect
        x="26.9767"
        y="80.0928"
        width="207.047"
        height="325.07"
        rx="35"
        fill="white"
        fill-opacity="0.9"
      />
      <rect
        x="64.7442"
        y="176.535"
        width="132.186"
        height="132.186"
        rx="66.093"
        fill={theme.primary}
      />
      {variant === "add"
        ? AddIcon
        : variant === "error"
        ? ErrorIcon
        : variant === "success"
        ? SuccessIcon
        : null}

      <rect x="77.5581" y="36.9307" width="106.558" height="56.6512" rx="18" fill={theme.primary} />
    </svg>
  );
};
