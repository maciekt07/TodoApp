import styled from "@emotion/styled";
import { fadeIn, fadeInLeft, progressPulse } from "./keyframes.styled";
import { Box, CircularProgress, css } from "@mui/material";
import { ColorPalette } from ".";

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
  /* border: 3px solid ${ColorPalette.purple}; */
  /* box-shadow: ${(props) => (props.glow ? "0 0 48px -8px #b624ff9d" : "none")}; */
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
