import styled from "@emotion/styled";
import { Avatar, AvatarProps, Button, css } from "@mui/material";
import { getFontColor } from "../utils";
import { CSSProperties } from "react";
import { pulseAnimation } from "./keyframes.styled";

export const DialogBtn = styled(Button)`
  padding: 10px 16px;
  border-radius: 16px;
  font-size: 16px;
  margin: 8px;
`;
export const StyledLink = styled.a<{ clr?: string }>`
  cursor: pointer;
  color: ${({ clr, theme }) => clr || theme.primary};
  display: inline-block;
  position: relative;
  text-decoration: none;
  font-weight: 500;
  transition: 0.3s all;
  &::after {
    content: "";
    position: absolute;
    width: 100%;
    transform: scaleX(0);
    height: 2px;
    bottom: 0;
    left: 0;
    background-color: ${({ clr, theme }) => clr || theme.primary};
    transform-origin: bottom right;
    transition: transform 0.25s ease-out;
    border-radius: 100px;
  }
  &:hover::after,
  &:focus-visible::after {
    transform: scaleX(1);
    transform-origin: bottom left;
  }
  &:hover {
    text-shadow: 0px 0px 20px ${({ clr, theme }) => clr || theme.primary};
  }
  &:focus,
  &:focus-visible {
    outline: none;
    box-shadow: none;
  }
`;
// linear-gradient(#A4AAB7, #868B95)

interface UserAvatarProps {
  hasimage: boolean;
  size: CSSProperties["height"];
  pulse?: boolean;
}

const UnstyledAvatar = ({ ...props }: AvatarProps) => (
  <Avatar translate={"no"} slotProps={{ img: { loading: "lazy" } }} {...props} />
);

export const UserAvatar = styled(UnstyledAvatar)<UserAvatarProps>`
  color: #ffffff;
  background: ${({ hasimage, theme }) =>
    hasimage ? "#ffffff1c" : theme.darkmode ? "#5e5e65" : "#8c919c"} !important;
  transition: 0.3s background;
  font-weight: 500;
  width: ${({ size }) => size};
  height: ${({ size }) => size};
  font-size: ${({ size }) => `calc(${size} / 2)`};
  ${({ pulse, theme }) =>
    pulse &&
    css`
      animation: ${pulseAnimation(theme.darkmode ? "#5e5e65" : "#8c919c", 10)} 1.2s infinite;
    `}
`;

interface ColorElementProps {
  clr?: string;
  secondClr?: string;
  size?: string;
  disableHover?: boolean;
}

// Styled button for color selection
export const ColorElement = styled.button<ColorElementProps>`
  background: ${({ clr, secondClr }) =>
    !clr
      ? "transparent"
      : secondClr
        ? `linear-gradient(135deg, ${clr} 50%, ${secondClr} 50%)`
        : clr};

  color: ${({ clr }) => (clr ? getFontColor(clr) : "transparent")};
  border: none;
  cursor: pointer;
  width: ${({ size }) => size || "48px"};
  height: ${({ size }) => size || "48px"};
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 100%;
  transition:
    0.2s all,
    0s border;
  transform: scale(1);

  &:focus-visible {
    outline: 4px solid ${({ theme }) => theme.primary};
  }

  &:hover {
    /* transform: scale(1.05); */
    box-shadow: ${({ clr, disableHover }) => (!disableHover ? `0 0 12px ${clr}` : "none")};
    /* outline: none; */
  }
`;

export const PathName = styled.code`
  background: #000000c8;
  color: white;
  font-family: consolas !important;
  padding: 4px 6px;
  border-radius: 8px;
`;

export const PulseLabel = styled.div`
  animation: ${({ theme }) => pulseAnimation(theme.primary, 8)} 1.2s infinite;
  position: absolute;
  top: 2px;
  right: 2px;
  width: 16px;
  height: 16px;
  background: ${({ theme }) => theme.primary};
  border-radius: 32px;
  z-index: 1;
`;

export const VisuallyHiddenInput = styled.input`
  clip: rect(0 0 0 0);
  clip-path: inset(50%);
  height: 1;
  overflow: hidden;
  position: absolute;
  bottom: 0;
  left: 0;
  white-space: nowrap;
  width: 1;
`;
