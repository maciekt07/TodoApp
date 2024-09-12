import { useTheme } from "@emotion/react";
import { useContext } from "react";
import { UserContext } from "../contexts/UserContext";
import { getFontColor } from "../utils";

interface TaskIconProps {
  scale?: number;
  color?: string;
  variant?: "error" | "add" | "success";
}
/**
 * Component for displaying a svg task icon in theme color.
 */
export const TaskIcon = ({ scale = 1, color, variant = "error" }: TaskIconProps) => {
  const theme = useTheme();
  const { user } = useContext(UserContext);
  const { settings } = user;

  const taskIconClr = color || theme.primary;
  const secondIconClr = getFontColor(color || theme.primary);

  const renderIcon = () => {
    if (variant === "add") {
      return AddIcon;
    } else if (variant === "error") {
      return ErrorIcon;
    } else if (variant === "success") {
      return SuccessIcon;
    } else {
      return null;
    }
  };
  const AddIcon = (
    <>
      <rect
        x="124.093"
        y="286.465"
        width="87.6744"
        height="13.4884"
        rx="6.74419"
        transform="rotate(-90 124.093 286.465)"
        fill={secondIconClr}
      />
      <rect x="87" y="235.884" width="87.6744" height="13.4884" rx="6.74419" fill={secondIconClr} />
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
        fill={secondIconClr}
      />

      <rect
        x="104.608"
        y="206.861"
        width="87.6744"
        height="13.4884"
        rx="6.74419"
        transform="rotate(45 104.608 206.861)"
        fill={secondIconClr}
      />
    </>
  );

  const SuccessIcon = (
    <path
      d="M96 242.159L119.159 265.318L165.476 219"
      stroke={secondIconClr}
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
        filter: settings.enableGlow
          ? `drop-shadow(0px 0px ${64 * scale}px ${taskIconClr}c8)`
          : "none",
      }}
    >
      <circle cx="130.837" cy="34.2327" r="26.7209" stroke={taskIconClr} stroke-width="14" />
      <rect
        y="51.7676"
        width="261"
        height="381.721"
        rx="45"
        fill={taskIconClr}
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
        fill={taskIconClr}
      />
      {renderIcon()}
      <rect x="77.5581" y="36.9307" width="106.558" height="56.6512" rx="18" fill={taskIconClr} />
    </svg>
  );
};
