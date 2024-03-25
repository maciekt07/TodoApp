import styled from "@emotion/styled";
import { fadeIn, fadeInLeft, progressPulse, pulseAnimation } from "./keyframes.styled";
import { Box, Button, CircularProgress, css } from "@mui/material";
import { getFontColor } from "../utils";

export const GreetingHeader = styled.div`
  display: flex;
  margin-top: 12px;
  font-size: 26px;
  font-weight: bold;
  margin-top: 16px;
  margin-left: 8px;

  @media (max-width: 550px) {
    font-size: 22px;
  }
`;

export const GreetingText = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 16px;
  margin-top: 4px;
  margin-left: 8px;
  font-style: italic;
  animation: ${fadeInLeft} 0.5s ease-in-out;
`;

export const TasksCountContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const TasksCount = styled.div<{ glow: boolean }>`
  color: white;
  background: #090b2258;
  transition: 0.3s all;
  display: flex;
  align-items: center;
  justify-content: left;
  gap: 8px 16px;
  padding: 20px 24px;
  margin: 24px 0 12px 0;
  border-radius: 24px;
  width: 650px;
  border: 1px solid #44479cb7;
  @media (min-width: 1024px) {
    padding: 24px;
  }
`;

export const TaskCountTextContainer = styled.div`
  line-height: 1.7;
  margin-left: 6px;
`;

export const TaskCountHeader = styled.h4`
  margin: 0;
  font-size: 16px;
  @media (min-width: 1024px) {
    font-size: 17px;
  }
`;

export const TaskCompletionText = styled.p`
  margin: 0;
  font-size: 16px;
`;

export const ProgressPercentageContainer = styled(Box)<{ glow: boolean }>`
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #090b2287;
  border-radius: 100px;
  margin: -5px;
  border: 1px solid #44479cb7;
  box-shadow: 0 0 18px -2px #090b2287;
  animation: ${({ theme, glow }) =>
    glow
      ? css`
          ${progressPulse(theme.primary)} 4s infinite ease-in
        `
      : "none"};
`;

export const StyledProgress = styled(CircularProgress)<{ glow: boolean }>`
  z-index: 1;
  margin: 2px;
  filter: ${({ glow, theme }) => (glow ? `drop-shadow(0 0 6px ${theme.primary}c8)` : "none")};
`;

export const AddButton = styled(Button)<{ animate?: boolean; glow: boolean }>`
  cursor: pointer;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  bottom: 24px;
  width: 72px;
  height: 72px;
  border-radius: 100%;
  background-color: ${({ theme }) => theme.primary};
  color: ${({ theme }) => getFontColor(theme.primary)};
  right: 16vw;
  box-shadow: ${({ glow, theme }) => (glow ? `0px 0px 32px -8px ${theme}` : "none")};
  transition: background-color 0.3s, backdrop-filter 0.3s, box-shadow 0.3s;

  &:hover {
    box-shadow: none;
    background-color: ${({ theme }) => theme.primary};
    backdrop-filter: blur(6px);
  }

  ${({ animate, theme }) =>
    animate &&
    css`
      animation: ${pulseAnimation(theme.primary, 14)} 1.2s infinite;
    `}

  @media (max-width: 1024px) {
    right: 24px;
  }
`;

export const Offline = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 6px;
  text-shadow: 0 0 8px #ffffff56;
  margin-top: 20px;
  opacity: 0.8;
  animation: ${fadeIn} 0.5s ease;
`;
