import styled from "@emotion/styled";
import { fadeIn, fadeInLeft } from "./globalStyles";
import { Box } from "@mui/material";
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
  font-size: 16px;
  margin-top: 2px;
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
  border: 3px solid ${ColorPalette.purple};
  box-shadow: ${(props) => (props.glow ? "0 0 32px -2px #b624ff9d" : "none")};
  transition: 0.3s all;
  display: inline-flex;
  position: relative;
  align-items: center;
  justify-content: left;
  gap: 8px 16px;
  padding: 16px 24px;
  margin: 24px 0 12px 0;
  border-radius: 24px;
`;

export const TaskCountTextContainer = styled.div`
  line-height: 1.75em;
`;

export const TaskCountHeader = styled.h4`
  margin: 0;
`;

export const TaskCompletionText = styled.p`
  margin: 0;
`;

export const DeleteDoneBtn = styled.button`
  position: fixed;
  display: flex;
  cursor: pointer;
  border: none;
  font-weight: bold;
  bottom: 24px;
  width: auto;

  font-size: 17px;
  padding: 18px;
  background-color: #ff453f;
  color: white;
  border-radius: 18px;
  box-shadow: 0 0 6px 0 #ff453fd6;
`;

export const ProgressPercentageContainer = styled(Box)`
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const Offline = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 6px;
  margin: 10px;
  animation: ${fadeIn} 0.5s ease;
`;
