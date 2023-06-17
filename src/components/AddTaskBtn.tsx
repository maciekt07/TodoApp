import { css, keyframes } from "@emotion/react";
import styled from "@emotion/styled";
import { Add } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { ColorPalette } from "../styles";
import { Tooltip } from "@mui/material";

export const AddTaskBtn = ({ animate }: { animate: boolean }) => {
  const n = useNavigate();
  return (
    <Tooltip title="Add New Task" placement="left">
      <Btn animate={animate} onClick={() => n("add")} aria-label="Add Task">
        <Add fontSize="large" />
      </Btn>
    </Tooltip>
  );
};

const pulseAnimation = keyframes`
  0% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(182, 36, 255, 0.7);
  }
  70% {
    transform: scale(1);
    box-shadow: 0 0 0 12px rgba(182, 36, 255, 0);
  }
  100% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(182, 36, 255, 0);
  }
`;

const Btn = styled.button<{ animate: boolean }>`
  cursor: pointer;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  bottom: 24px;
  width: 68px;
  height: 68px;
  border-radius: 100%;
  background-color: ${ColorPalette.purple};
  color: white;
  right: 16vw;
  box-shadow: 0px 0px 20px 0px ${ColorPalette.purple};
  transition: 0.3s all;
  &:hover {
    box-shadow: none;
    background-color: #b624ffd0;
  }

  ${({ animate }) =>
    animate &&
    css`
      animation: ${pulseAnimation} 1.2s infinite;
    `}

  @media (max-width: 1024px) {
    right: 24px;
  }
`;
